import axios, { AxiosInstance } from "axios";
import PaginationDto from "../../model/PaginationDto";

class DifyApi {
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

    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (typeof error.response === "undefined") {
          console.log("network error");
          window.location.href = "/error-page";
        }
        if (error.response.status === 401) {
          // Authorization error
          window.location.href = "/signin";
        } else if (error.response.status === 500) {
          // Server error
          window.location.href = "/500-error";
        } else {
          return Promise.reject(error);
        }
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

  // Thiết lập đường dẫn dịch vụ
  service(path: string): this {
    this.path = path;

    return this;
  }

  async send<T>(rawData: any): Promise<T> {
    try {
      const key = "app-l5kgMeENgBaG5TThfN3ovsOp";
      const response = await this.axiosInstance.post<T>(
        `/${this.path}`,
        rawData,
        {
          withCredentials: false,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating data", error);
      throw error;
    }
  }

  async get<T>(query: any): Promise<T> {
    try {
      const key = "app-l5kgMeENgBaG5TThfN3ovsOp";

      const url = query ? `/${this.path}?${query}` : `/${this.path}`;
      const response = await this.axiosInstance.get<T>(url, {
        withCredentials: false,
        headers: {
          Authorization: `Bearer ${key}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching data", error);
      throw error;
    }
  }
}

const difyAPI = new DifyApi().config("https://api.dify.ai/v1");
export default difyAPI;
