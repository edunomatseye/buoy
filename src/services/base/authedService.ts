import { LoginApiService } from "services/login/api";
import { ApiService } from "./apiService";

const loginService = new LoginApiService();

export class AuthedService extends ApiService {
  static apiUrl: string = `${process.env.REACT_APP_API_URL}`;
  private static refreshPromise: Promise<any> | null = null;

  public async injectJWTIntoHeader(header: Record<string, string> = {}) {
    try {
      const token = await this.getValidTokenSingleton();
      return {
        ...header,
        Authorization: `Bearer ${token?.access}`,
      };
    } catch (err) {
      throw err;
    }
  }

  private async getValidTokenSingleton() {
    // If there's already a refresh in progress, wait for it
    if (AuthedService.refreshPromise) {
      return AuthedService.refreshPromise;
    }

    try {
      // Start new token validation/refresh process
      AuthedService.refreshPromise = loginService.getValidToken();
      const result = await AuthedService.refreshPromise;
      return result;
    } finally {
      // Clear the promise so future calls know there's no refresh in progress
      AuthedService.refreshPromise = null;
    }
  }

  public async get(
    endpoint: string,
    isBlob?: boolean,
    isExternalUri?: boolean
  ): Promise<any> {
    const requestOptions: RequestInit = {
      method: "GET",
      headers: await this.injectJWTIntoHeader(),
    };
    return super.fetchGet(endpoint, requestOptions, isBlob, isExternalUri);
  }

  public async post(endpoint: string, body: any): Promise<any> {
    const requestOptions: RequestInit = {
      method: "POST",
      headers: await this.injectJWTIntoHeader(),
    };
    return super.fetchPost(endpoint, requestOptions, body);
  }

  public async put(endpoint: string, body: any): Promise<any> {
    const headers = await this.injectJWTIntoHeader();
    const requestOptions: RequestInit = {
      method: "PUT",
    };
    return this.fetch(endpoint, headers, body, requestOptions);
  }

  public async patch(endpoint: string, body: any): Promise<any> {
    const headers = await this.injectJWTIntoHeader();
    const requestOptions: RequestInit = {
      method: "PATCH",
    };
    return this.fetch(endpoint, headers, body, requestOptions);
  }

  public async delete(endpoint: string): Promise<any> {
    const headers = await this.injectJWTIntoHeader();
    const requestOptions: RequestInit = {
      method: "DELETE",
    };
    return this.fetch(endpoint, headers, {}, requestOptions);
  }
}
