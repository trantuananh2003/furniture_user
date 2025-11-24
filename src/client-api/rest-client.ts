import axios from "axios";
import type { AxiosInstance } from 'axios'
import { toast } from "react-toastify";
import type ApiResponse from "~/model/ApiResponse";

class RestClient {
  private axiosInstance: AxiosInstance;
  private path: string = "";
  private authToken: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      timeout: 100000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
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
        if (error.response) {
          switch (error.response.status) {
            case 401:
              toast.warning(error.response?.data || "Vui lòng đăng nhập!");
              if (window.location.pathname !== "/auth") {
                setTimeout(() => {
                  window.location.href = "/auth";
                }, 2000);
              }
              break;
            case 403:
              toast.warning("Bạn không có quyền!");
              break;
            case 400:
              toast.warning(
                error.response?.data?.errorMessages?.[0] || "Hệ thống từ chối!"
              );
              break;
            case 500:
              const errorMessage =
                error.response?.data?.errorMessages?.[0] ?? "Đã xảy ra lỗi";
              toast.error(errorMessage);
              break;
            default:
              toast.error(`Lỗi xảy ra: ${error.response.status}`);
              break;
          }
        } else {
          // Khi error.response không có (network error...)
          toast.error(error.message || "Đã xảy ra lỗi không xác định!");
        }

        return Promise.reject(error);
      }
    );
  }

  // Cấu hình lại baseURL và headers
  config(baseURL: string, headers: Record<string, string> = {}): this {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 100000,
      withCredentials: true,
      headers,
    });

    this.applyInterceptors();

    return this;
  }

  // Thiết lập đường dẫn dịch vụ
  service(path: string): this {
    this.path = path;

    return this;
  }

  // Xác thực tài khoản
  async authentication(email: string, password: string): Promise<any> {
    try {
      let formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await this.axiosInstance.post(`/${this.path}`, formData);
      if (response.data.result.token) {
        this.authToken = response.data.result.token;
        if (this.authToken) {
          localStorage.setItem("userToken", this.authToken);
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error during authentication", error);
      throw error;
    }
  }

  // Tạo mới dữ liệu
  async create<T>(data: any): Promise<T> {
    try {
      const isFormData = data instanceof FormData;
      const authToken = localStorage.getItem("userToken");
      const response = await this.axiosInstance.post<T>(`/${this.path}`, data, {
        headers: {
          "Content-Type": isFormData
            ? "multipart/form-data"
            : "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating data", error);
      throw error;
    }
  }

  // Lấy dữ liệu theo ID
  async getObjectById<T>(objectId: string): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(
        `/${this.path}/${objectId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data by ID", error);
      throw error;
    }
  }

  // Tìm kiếm dữ liệu với query
  async find<T>(query: string = ""): Promise<ApiResponse> {
    try {
      const url = query ? `/${this.path}?${query}` : `/${this.path}`;

      const response = await this.axiosInstance.get<ApiResponse>(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });

      let result: ApiResponse = response.data;
      //Phan trang
      if (response.headers["x-pagination"])
        result.paginationDto = JSON.parse(response.headers["x-pagination"]);

      return result
    } catch (error: any) {
      if (!error.response) {
        console.error("Network error", error);
      }
      console.error("Error finding data", error);
      throw error;
    }
  }

  // Cập nhập
  async patchEachProperty<T>(objectId: string, data?: any): Promise<T> {
    try {
      const isFormData = data instanceof FormData;
      const response = await this.axiosInstance.patch<T>(
        `/${this.path}/${objectId}`,
        data,
        {
          headers: {
            "Content-Type": isFormData
              ? "multipart/form-data"
              : "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating data", error);
      throw error;
    }
  }

  async put<T>(objectId: string | null, data: any): Promise<T> {
    try {
      const isFormData = data instanceof FormData;
      // Tạo URL, nếu objectId null thì bỏ qua
      const url = objectId ? `/${this.path}/${objectId}` : `/${this.path}`;
      const response = await this.axiosInstance.put<T>(url, data, {
        headers: {
          "Content-Type": isFormData ? "multipart/form-data" : "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error updating data", error);
      throw error;
    }
  }

  // Tạo mới
  async post<T>(objectId: string, data: any): Promise<T> {
    try {
      const isFormData = data instanceof FormData;
      const response = await this.axiosInstance.put<T>(
        `/${this.path}/${objectId}`,
        data,
        {
          headers: {
            "Content-Type": isFormData
              ? "multipart/form-data"
              : "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating data", error);
      throw error;
    }
  }

  // Xóa dữ liệu theo ID
  async delete<T>(objectId: string): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(
        `/${this.path}/${objectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting data", error);
      throw error;
    }
  }
}

const clientAPI = new RestClient().config(import.meta.env.VITE_DOMAIN_API_BACKEND ?? "");
export default clientAPI;
