import { IGpsLocation } from "@/types/domain/locations";
import { BaseEntityService } from "./BaseEntityService";
import { IResultObject } from "@/types/IResultObject";
import { AxiosError } from "axios";

export class GpsLocationService extends BaseEntityService<IGpsLocation> {

  constructor() {
	super('gpsLocations')
  }

  async getSessionLocations(sessionId: string): Promise<IResultObject<IGpsLocation>> {
	try {
		const response = await this.axiosInstance.get<IGpsLocation>(
						`${this.basePath}/Session/${sessionId}`
		);

		if (response.status <= 300) {
			return {
				statusCode: response.status,
				data: response.data
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
