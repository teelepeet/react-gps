import { IResultObject } from "@/types/IResultObject";
import { BaseService } from "./BaseService";
import { IDomainId } from "@/types/IDomainId";
import { AxiosError } from "axios";

export abstract class BaseEntityService<TEntity extends IDomainId, TAddEntity = TEntity, TUpdateEntity = TEntity> extends BaseService {

	constructor(protected basePath: string) {
		super();
	}

	async getAsync(id: string): Promise<IResultObject<TEntity>> {
		try {

			const response = await this.axiosInstance.get<TEntity>(this.basePath + "/" + id)

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: response.data
				}
			}

			return {
				statusCode: response.status,
				errors: [(response.status.toString() + ' ' + response.statusText).trim()],
			}
		} catch (error) {
			console.log('error: ', (error as AxiosError).message)
			return {
				statusCode: (error as AxiosError).status ?? 0,
				errors: [(error as AxiosError).code ?? "???"],
			}
		}
	}

	async getAllAsync(): Promise<IResultObject<TEntity[]>> {
		try {
			const response = await this.axiosInstance.get<TEntity[]>(this.basePath)

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: response.data
				}
			}

			return {
				statusCode: response.status,
				errors: [(response.status.toString() + ' ' + response.statusText).trim()],
			}
		} catch (error) {
			console.log('error: ', (error as AxiosError).message)
			return {
				statusCode: (error as AxiosError).status ?? 0,
				errors: [(error as AxiosError).code ?? "???"],
			}
		}
	}

	async addAsync(entity: TAddEntity, id?: string): Promise<IResultObject<TEntity>> {
		try {
			if (id) {
				this.basePath = `${this.basePath}/${id}`;
			}
			const response = await this.axiosInstance.post<TEntity>(this.basePath, entity)

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: response.data
				}
			}

			return {
				statusCode: response.status,
				errors: [(response.status.toString() + ' ' + response.statusText).trim()],
			}
		} catch (error) {
			console.log('error: ', (error as AxiosError).message)
			return {
				statusCode: (error as AxiosError).status ?? 0,
				errors: [(error as AxiosError).code ?? "???"],
			}
		}
	}

	async updateAsync(entity: TUpdateEntity & IDomainId): Promise<IResultObject<TEntity>> {
		try {
			const response = await this.axiosInstance.put<TEntity>(this.basePath + "/" + entity.id, entity)

			if (response.status <= 300) {
				console.log("Session updated!")
				return {
					statusCode: response.status,
					data: response.data
				}
			}

			return {
				statusCode: response.status,
				errors: [(response.status.toString() + ' ' + response.statusText).trim()],
			}

		} catch (error) {
			console.log('error: ', (error as AxiosError).message)
			return {
				statusCode: (error as AxiosError).status ?? 0,
				errors: [(error as AxiosError).code ?? "???"],
			}
		}
	}

	async deleteAsync(id: string): Promise<IResultObject<null>> {
		try {
			const response = await this.axiosInstance.delete<null>(this.basePath + "/" + id)

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: null
				}
			}

			return {
				statusCode: response.status,
				errors: [(response.status.toString() + ' ' + response.statusText).trim()],
			}

		} catch (error) {
			console.log('error: ', (error as AxiosError).message)
			return {
				statusCode: (error as AxiosError).status ?? 0,
				errors: [(error as AxiosError).code ?? "???"],
			}
		}
	}
}
