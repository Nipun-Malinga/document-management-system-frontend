import axios, { type AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('jwt-access-token')}`,
  },
});

class APIService<T, K = T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public async get(config?: AxiosRequestConfig): Promise<K> {
    const response = await axiosInstance.get<K>(this.endpoint, { ...config });
    return response.data;
  }

  public async post(data?: T, config?: AxiosRequestConfig): Promise<K> {
    const response = await axiosInstance.post<K>(this.endpoint, data, {
      ...config,
    });
    return response.data;
  }
}

export default APIService;
