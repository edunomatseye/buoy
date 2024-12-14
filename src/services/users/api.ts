import { AuthedService } from "../base/authedService";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export class UsersApiService extends AuthedService {
  private static instance: UsersApiService;

  private constructor() {
    super();
  }

  public static getInstance(): UsersApiService {
    if (!UsersApiService.instance) {
      UsersApiService.instance = new UsersApiService();
    }
    return UsersApiService.instance;
  }

  public async getUsers(): Promise<UsersResponse> {
    return this.get("https://dummyjson.com/users", false, true);
  }
}
