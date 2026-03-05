import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "./types";

export interface UploadResponse {
  url: string;
  publicId: string;
}

interface SignatureResponse {
  signature: string;
  apiKey: string;
  cloudName: string;
  timestamp: number;
  folder: string;
}

export const uploadApi = {
  /**
   * Upload directly from the browser to Cloudinary.
   * Only a tiny signature request hits our backend — the file itself goes
   * straight to Cloudinary, cutting upload time roughly in half.
   */
  uploadImage: async (file: File, folder?: string): Promise<UploadResponse> => {
    // 1. Get a signed token (no file data, instant)
    const sigRes = await apiClient.get<ApiResponse<SignatureResponse>>(
      "/upload/signature",
      { params: folder ? { folder } : {} },
    );
    const sig = sigRes.data.data;

    // 2. Upload directly to Cloudinary
    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", sig.apiKey);
    fd.append("timestamp", String(sig.timestamp));
    fd.append("signature", sig.signature);
    fd.append("folder", sig.folder);

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
      { method: "POST", body: fd },
    );

    if (!cloudRes.ok) {
      const err = await cloudRes.json().catch(() => ({}));
      throw new Error(
        (err as { error?: { message?: string } }).error?.message ??
          "Upload failed",
      );
    }

    const data = (await cloudRes.json()) as {
      secure_url: string;
      public_id: string;
    };
    return { url: data.secure_url, publicId: data.public_id };
  },

  deleteImage: async (publicId: string): Promise<void> => {
    await apiClient.delete("/upload/image", { params: { publicId } });
  },
};
