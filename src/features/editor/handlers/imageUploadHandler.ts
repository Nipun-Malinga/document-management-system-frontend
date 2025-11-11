import type { FileUpload } from '@/models/FileUpload';
import APIService from '@/services/apiService';

export const imageUploadHandler = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const service = new APIService<FormData, FileUpload>('/files/images');

  try {
    const resp = await service.post(formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(resp.fileCloudUrl);
    return resp.fileCloudUrl;
  } catch (err) {
    console.error('Image upload failed:', err);
    return 'https://placehold.co/600x400';
  }
};
