import { IGpsSessionType } from "@/types/domain/sessions";
import { BaseEntityService } from "./BaseEntityService";

export class GpsSessionTypeService extends BaseEntityService<IGpsSessionType> {

  constructor() {
    super('gpsSessionTypes')
  }
}
