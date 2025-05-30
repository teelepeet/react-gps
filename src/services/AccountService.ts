import { IResultObject } from "@/types/IResultObject";
import { BaseService } from "./BaseService";
import { IAuthResponse, ILoginRequest, IRegisterRequest } from "@/types/domain/auth";
import { AxiosError } from "axios";

export class AccountService extends BaseService {

	async loginAsync(data: ILoginRequest): Promise<IResultObject<IAuthResponse>> {
		const url = 'Account/Login'
		try {
			const response = await this.axiosInstance.post<IAuthResponse>(url, data);

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: response.data
				}
			}

			return {
				statusCode: response.status,
				errors: [(response.status.toString() + ' ' + response.statusText.trim())]
			}
		} catch (error) {
			return {
				statusCode: (error as AxiosError)?.status,
				errors: [(error as AxiosError)?.code ?? ""]
			}
		}
	}

	async registerAsync(data: IRegisterRequest): Promise<IResultObject<IAuthResponse>> {
		const url = 'Account/Register';
		try {
			const response = await this.axiosInstance.post<IAuthResponse>(url, data);

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: response.data
				}
			}

			return {
				statusCode: response.status,
				errors: [(response.status.toString() + ' ' + response.statusText.trim())]
			}
		} catch (error) {
			return {
				statusCode: (error as AxiosError)?.status,
				errors: [(error as AxiosError)?.code ?? ""]
			}
		}
	}
}
