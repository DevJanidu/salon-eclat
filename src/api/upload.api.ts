import { delay } from "./mockData";

export interface UploadResponse {
  url: string;
  publicId: string;
}

export const uploadApi = {
  uploadImage: async (file: File, folder?: string): Promise<UploadResponse> => {
    await delay(1000);
    // Create a local blob URL so the user can see the image they "uploaded"
    const localUrl = URL.createObjectURL(file);
    return { url: localUrl, publicId: `mock_public_id_${Date.now()}` };
  },

  deleteImage: async (publicId: string): Promise<void> => {
    await delay(500);
  },
};
