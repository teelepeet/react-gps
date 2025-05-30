import { IGpsLocationType } from "@/types/domain/locations";
import { BaseEntityService } from "./BaseEntityService";

export class GpsLocationTypeService extends BaseEntityService<IGpsLocationType> {

  constructor() {
	super('gpsLocationTypes')
  }
}
