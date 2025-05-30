import { IDomainId } from "../IDomainId"

export interface IGpsLocationType extends IDomainId {
  name: string
  description: string
}

export interface IGpsLocation extends IDomainId {
	recordedAt: string;
	latitude: number;
	longitude: number;
	accuracy: number;
	altitude: number;
	verticalAccuracy: number;
	appUserId: string;
	gpsSessionId: string;
	gpsLocationTypeId: string;
}
