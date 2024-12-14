import { LoginFakeService } from "./fake";
import { LoginApiService } from "./api";
import { LoginService } from "./interface";

const service: LoginService =
  process.env.REACT_APP_FAKE_API_MODE === "true"
    ? new LoginFakeService(1000, 0)
    : new LoginApiService();

export default service;
