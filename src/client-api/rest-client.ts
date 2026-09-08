import axios from "axios";
import type { AxiosInstance } from "axios";
import { toast } from "react-toastify";
import type ApiResponse from "~/model/ApiResponse";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipGlobalErrorHandler?: boolean;
  }
}

class RestClient {
  private axiosInstance: AxiosInstance;
  private path: string = "";

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 100000,
      withCredentials: true,
    });

    this.applyInterceptors();
  }

  private applyInterceptors(): void {
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;

        switch (status) {
          case 401:
            // token hết hạn
            // refresh token hoặc logout
            break;

          case 403:
            toast.error("Bạn không có quyền thực hiện thao tác này");
            break;

          case 500:
          case 502:
          case 503:
            toast.error("Hệ thống đang gặp sự cố, vui lòng thử lại");
            break;

          default:
            break;
        }
        return Promise.reject(error);
      },
    );
  }

  // Thiết lập đường dẫn dịch vụ
  service(path: string): this {
    this.path = path;
    return this;
  }

  // Xác thực tài khoản
  async authentication(email: string, password: string): Promise<ApiResponse> {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await this.axiosInstance.post<ApiResponse>(
        `/${this.path}`,
        formData,
      );

      if (response.data?.result?.token) {
        localStorage.setItem("userToken", response.data.result.token);
      }

      return response.data;
    } catch (error) {
      console.error("Error during authentication", error);
      throw error;
    }
  }

  // Tạo mới dữ liệu
  async post<T>(data: any): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(`/${this.path}`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating data", error);
      throw error;
    }
  }

  // Tìm kiếm dữ liệu với query
  async find(query: string = ""): Promise<ApiResponse> {
    try {
      const url = query ? `/${this.path}?${query}` : `/${this.path}`;
      const response = await this.axiosInstance.get<ApiResponse>(url);

      const result: ApiResponse = response.data;
      if (response.headers["x-pagination"]) {
        result.paginationDto = JSON.parse(response.headers["x-pagination"]);
      }

      return result;
    } catch (error: any) {
      if (!error.response) {
        console.error("Network error", error);
      }
      console.error("Error finding data", error);
      throw error;
    }
  }

  // Cập nhật từng thuộc tính
  async patchEachProperty<T>(objectId: string, data?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.patch<T>(
        `/${this.path}/${objectId}`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating data", error);
      throw error;
    }
  }

  // Cập nhật toàn bộ
  async put<T>(objectId: string | null, data: any): Promise<T> {
    try {
      const url = objectId ? `/${this.path}/${objectId}` : `/${this.path}`;
      const response = await this.axiosInstance.put<T>(url, data);
      return response.data;
    } catch (error) {
      console.error("Error updating data", error);
      throw error;
    }
  }

  async delete<T>(objectId: string | null): Promise<T> {
    try {
      const url = objectId ? `/${this.path}/${objectId}` : `/${this.path}`;
      const response = await this.axiosInstance.delete<T>(url);
      return response.data;
    } catch (error) {
      console.error("Error updating data", error);
      throw error;
    }
  }
}

const clientAPI = new RestClient(import.meta.env.VITE_DOMAIN_API_BACKEND ?? "");
export default clientAPI;
