import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface KtexaConfig {
  apiKey: string;
  baseUrl?: string;
}

class KtexaClient {
  private readonly axiosInstance: AxiosInstance;

  constructor(config: KtexaConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl || 'https://api.ktexa.com/v1',
      headers: {
        'X-API-Key': config.apiKey,
      },
    });
  }

  /**
   * Indexes an image in the Ktexa service.
   * @param image - The image to be indexed, either as a File or a base64-encoded string.
   * @param metadata - Optional metadata to be associated with the image.
   * @returns A Promise that resolves to the indexed image's ID.
   */
  async indexImage(image: File | string, metadata?: Record<string, any>): Promise<string> {
    const formData = new FormData();
    formData.append('image', image instanceof File ? image : this.dataURItoBlob(image));

    if (metadata) {
      for (const [key, value] of Object.entries(metadata)) {
        formData.append(`metadata[${key}]`, value);
      }
    }

    const response = await this.axiosInstance.post('/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.id;
  }

  /**
   * Performs a reverse image search using the Ktexa service.
   * @param image - The image to be used as the search query, either as a File or a base64-encoded string.
   * @param limit - The maximum number of similar images to return.
   * @returns A Promise that resolves to an array of similar images.
   */
  async searchImages(image: File | string, limit?: number): Promise<KtexaImage[]> {
    const formData = new FormData();
    formData.append('image', image instanceof File ? image : this.dataURItoBlob(image));

    const config: AxiosRequestConfig = {
      params: {
        limit: limit || 10,
      },
    };

    const response = await this.axiosInstance.post('/search', formData, config);
    return response.data;
  }

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([uint8Array], { type: 'image/jpeg' });
  }
}

export interface KtexaImage {
  id: string;
  url: string;
  metadata?: Record<string, any>;
}

export default KtexaClient;
