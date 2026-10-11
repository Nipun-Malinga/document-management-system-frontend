import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { expect, it, vi } from 'vitest';
import Toolbar from './Toolbar';

it('disables every toolbar control for keyboard as well as pointer input', async () => {
  const editor = new Editor({ extensions: [StarterKit], editable: false });
  const undo = vi.fn();
  const redo = vi.fn();
  const { unmount } = render(<Toolbar editor={editor} disabled canUndo canRedo onUndo={undo} onRedo={redo} />);
  for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled();
  expect(screen.getByRole('combobox')).toBeDisabled();
  const user = userEvent.setup();
  await user.tab();
  expect(document.body).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(undo).not.toHaveBeenCalled();
  expect(redo).not.toHaveBeenCalled();
  unmount();
  editor.destroy();
});
