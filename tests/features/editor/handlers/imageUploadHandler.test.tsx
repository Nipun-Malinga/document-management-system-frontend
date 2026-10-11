import type { InternalAxiosRequestConfig } from 'axios';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Editor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { axiosInstance } from '@/services/apiService';
import { endSession, replaceAccessToken } from '@/states/sessionStore';
import { tokenFor } from '../../../fixtures';
import { imageUploadHandler, insertUploadedImages } from '@/features/editor/handlers/imageUploadHandler';
import UploadFeedback from '@/features/editor/components/UploadFeedback';
import { editorExtensions } from '@/features/editor/configs/EditorConfigs';

const adapter = axiosInstance.defaults.adapter;
let editor: Editor;
const file = (type = 'image/png') => new File(['image'], 'image.png', { type });
const images = () => editor.getJSON().content?.filter((node) => node.type === 'image') ?? [];
beforeEach(() => {
  replaceAccessToken(tokenFor());
  editor = new Editor({ extensions: [StarterKit, Image], content: '<p>Original</p>' });
});
afterEach(() => { editor.destroy(); axiosInstance.defaults.adapter = adapter; vi.restoreAllMocks(); });

describe('image upload safety', () => {
  it.each(['image/gif', 'image/webp', 'image/svg+xml', 'text/plain'])('rejects %s before any upload', async (type) => {
    const request = vi.fn(); axiosInstance.defaults.adapter = request;
    await expect(imageUploadHandler(file(type))).rejects.toThrow('Only PNG and JPEG');
    expect(request).not.toHaveBeenCalled();
  });
  it.each(['image/png', 'image/jpeg'])('uploads multipart %s and inserts only its successful cloud URL', async (type) => {
    const request = vi.fn(async (config: InternalAxiosRequestConfig) => ({ config, data: { fileCloudUrl: 'https://storage.example/image.png' }, status: 200, statusText: 'OK', headers: {} }));
    axiosInstance.defaults.adapter = request;
    await insertUploadedImages(editor, [file(type)], 0);
    expect(images()).toMatchObject([{ attrs: { src: 'https://storage.example/image.png' } }]);
    expect(request.mock.calls[0][0].url).toBe('/files/images');
    expect(request.mock.calls[0][0].data.get('file').type).toBe(type);
  });
  it.each([undefined, '', 'javascript:alert(1)', '/relative.png', 'data:image/png;base64,AAAA'])('rejects invalid cloud URL %s without a placeholder', async (fileCloudUrl) => {
    axiosInstance.defaults.adapter = async (config) => ({ config, data: { fileCloudUrl }, status: 200, statusText: 'OK', headers: {} });
    render(<UploadFeedback editor={editor} />);
    await act(async () => { await insertUploadedImages(editor, [file()], 0); });
    expect(images()).toHaveLength(0);
    expect(screen.getByRole('alert')).toHaveTextContent('Image upload failed');
    expect(editor.getText()).toBe('Original');
  });
  it('propagates service rejection and reports it in the originating editor', async () => {
    axiosInstance.defaults.adapter = async () => { throw new Error('Storage unavailable'); };
    await expect(imageUploadHandler(file())).rejects.toThrow('Storage unavailable');
    render(<UploadFeedback editor={editor} />);
    await act(async () => { await insertUploadedImages(editor, [file()], 0); });
    expect(screen.getByRole('alert')).toHaveTextContent('Storage unavailable');
    expect(images()).toHaveLength(0);
  });
  it.each(['readonly', 'destroyed', 'logout', 'branch change'])('never inserts a late upload after %s', async (change) => {
    let finish!: () => void;
    const gate = new Promise<void>((resolve) => { finish = resolve; });
    const request = vi.fn(async (config: InternalAxiosRequestConfig) => { await gate; return { config, data: { fileCloudUrl: 'https://storage.example/image.png' }, status: 200, statusText: 'OK', headers: {} }; });
    axiosInstance.defaults.adapter = request;
    const original = editor;
    const insert = vi.spyOn(original, 'chain');
    const pending = insertUploadedImages(original, [file()], 0);
    await vi.waitFor(() => expect(request).toHaveBeenCalledOnce());
    if (change === 'readonly') original.setEditable(false, false);
    else if (change === 'logout') endSession();
    else { original.destroy(); if (change === 'branch change') editor = new Editor({ extensions: [StarterKit, Image], content: '<p>New branch</p>' }); }
    finish(); await pending;
    expect(insert).not.toHaveBeenCalled(); expect(images()).toHaveLength(0);
  });
  it.each(['paste', 'drop'] as const)('reports unsupported files from a real %s event without a request', (kind) => {
    editor.destroy(); editor = new Editor({ extensions: editorExtensions(), content: '<p>Original</p>' });
    vi.spyOn(editor.view, 'posAtCoords').mockReturnValue({ pos: 0, inside: 0 });
    const request = vi.fn(); axiosInstance.defaults.adapter = request;
    render(<><EditorContent editor={editor} /><UploadFeedback editor={editor} /></>);
    const data = { files: [file('image/gif')], getData: () => '', types: ['Files'] };
    if (kind === 'paste') fireEvent.paste(editor.view.dom, { clipboardData: data });
    else fireEvent.drop(editor.view.dom, { dataTransfer: data });
    expect(screen.getByRole('alert')).toHaveTextContent('Only PNG and JPEG');
    expect(request).not.toHaveBeenCalled(); expect(images()).toHaveLength(0);
  });
  it('ignores read-only file events and configures only backend-supported MIME types', async () => {
    const request = vi.fn(); axiosInstance.defaults.adapter = request;
    editor.setEditable(false, false);
    await insertUploadedImages(editor, [file()], 0);
    expect(request).not.toHaveBeenCalled();
    const handler = editorExtensions().find((extension) => extension.name === 'fileHandler')!;
    expect(handler.options.allowedMimeTypes).toEqual(['image/png', 'image/jpeg']);
  });
});
