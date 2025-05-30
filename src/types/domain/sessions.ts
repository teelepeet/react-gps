import { IDomainId } from "../IDomainId";

export interface IGpsSession extends IDomainId{
  name: string;
  description: string;
  recordedAt: string;
  duration: number;
  speed: number;
  distance: number;
  climb: number;
  descent: number;
  paceMin: number;
  paceMax: number;
  gpsSessionType: string;
  gpsLocationsCount: number;
  userFirstLastName: string;
}

export interface IGpsSessionAdd {
  name: string;
  description: string;
  gpsSessionTypeId: string;
  recordedAt?: string;
  paceMin?: number;
  paceMax?: number;
}

export interface IGpsSessionUpdate extends IDomainId{
  name: string;
  description: string;
  recordedAt: string;
  paceMin: number;
  paceMax: number;
  gpsSessionTypeId: string;
}

export interface IGpsSessionType extends IDomainId {
  name: string;
  description: string;
  paceMin: number;
  paceMax: number;
}

