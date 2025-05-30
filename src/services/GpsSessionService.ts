import { IGpsSession, IGpsSessionAdd, IGpsSessionUpdate } from "@/types/domain/sessions";
import { BaseEntityService } from "./BaseEntityService";
import { IResultObject } from "@/types/IResultObject";
import { AxiosError } from "axios";

export class GpsSessionService extends BaseEntityService<IGpsSession, IGpsSessionAdd, IGpsSessionUpdate> {

	constructor() {
		super('GpsSessions')
  	}

	async getAllUserSessions(userFullName: string): Promise<IResultObject<IGpsSession[]>> {
		try {
			const response = await this.axiosInstance.get<IGpsSession[]>(
				`${this.basePath}?minLocationsCount=0&minDuration=-10000000000000&minDistance=-100000000000&fromDateTime=&toDateTime=`
			);

			if (response.status <= 300) {
				const result = response.data.filter(
					(session) => session.userFirstLastName === userFullName
				)
				return {
					statusCode: response.status,
					data: result
				}
			}

			return {
				statusCode: response.status,
				errors: [(response.status.toString() + ' ' + response.statusText).trim()],
			};
		} catch (error) {
			console.log('error: ', (error as AxiosError).message);
			return {
				statusCode: (error as AxiosError).status ?? 0,
				errors: [(error as AxiosError).code ?? "???"],
			};
		}
	}
}
