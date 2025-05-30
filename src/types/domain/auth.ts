export interface ILoginRequest {
	email: string;
	password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IAuthResponse {
  token: string;
  status: string;
  firstName: string;
  lastName: string;
}
