"use client";

import { useEffect, useState, useContext, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { AccountContext } from "@/context/AccountContext";
import { GpsLocationService } from "@/services/GpsLocationService";
import { GpsLocationTypeService } from "@/services/GpsLocationTypeService";
import { IGpsLocation, IGpsLocationType } from "@/types/domain/locations";
import Link from "next/link";

export default function LocationEdit({params}: { params: Promise<{ id: string}>}) {
  const router = useRouter();
  const { id } = use(params);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const locationService = new GpsLocationService();
  const locationTypeService = new GpsLocationTypeService();
  const { accountInfo } = useContext(AccountContext);

  const [locationTypes, setLocationTypes] = useState<IGpsLocationType[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<IGpsLocation>();

  useEffect(() => {
    if (!accountInfo?.token) {
      router.push("/login");
      return;
    }
    if (!id) {
      router.push("/locations");
      return;
    }

    async function fetchData() {
      try {
        const [locTypesResult, locationResult] = await Promise.all([
          locationTypeService.getAllAsync(),
          locationService.getAsync(id)
        ]);

        if (locTypesResult.errors) {
          setErrorMsg("Error fetching location types");
          return;
        }
        if (locationResult.errors) {
          setErrorMsg("Error fetching location data");
          return;
        }

        setLocationTypes(locTypesResult.data || []);

        const loc = locationResult.data!;
		setValue("id", loc.id)
		setValue("recordedAt", loc.recordedAt)
        setValue("latitude", loc.latitude);
        setValue("longitude", loc.longitude);
        setValue("accuracy", loc.accuracy);
        setValue("altitude", loc.altitude);
        setValue("verticalAccuracy", loc.verticalAccuracy);
        setValue("gpsLocationTypeId", loc.gpsLocationTypeId);
        setValue("gpsSessionId", loc.gpsSessionId);
        setValue("appUserId", loc.appUserId);

      } catch (error) {
        setErrorMsg("Loading error: " + (error as Error).message);
      }
    }
    fetchData();
  }, [id, accountInfo, router, setValue]);

  const onSubmit: SubmitHandler<IGpsLocation> = async (data) => {
    setErrorMsg("Saving...");
    try {
		console.log("sending data: ", data);
      const result = await locationService.updateAsync(data);
      if (result.errors && result.errors.length > 0) {
        setErrorMsg(result.errors.join(", "));
        return;
      }
      setErrorMsg("");
      router.push(`/locations?sessionId=${data.gpsSessionId}`);
    } catch (error) {
      setErrorMsg((error as Error).message);
    }
  };

  return (
  <div className="container mt-5" style={{ maxWidth: "500px" }}>
    <div className="card bg-dark text-white border-secondary">
      <div className="card-body">
        <h2 className="text-center text-white mb-4">Edit GPS Location</h2>

        {errorMsg && (
          <div className="alert alert-warning text-center" role="alert">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Latitude *</label>
            <input
              type="number"
              step="any"
              className={`form-control ${errors.latitude ? "is-invalid" : ""}`}
              {...register("latitude", { required: "Latitude is required", min: -90, max: 90, valueAsNumber: true })}
            />
            {errors.latitude && <div className="invalid-feedback">{errors.latitude.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Longitude *</label>
            <input
              type="number"
              step="any"
              className={`form-control ${errors.longitude ? "is-invalid" : ""}`}
              {...register("longitude", { required: "Longitude is required", min: -180, max: 180, valueAsNumber: true })}
            />
            {errors.longitude && <div className="invalid-feedback">{errors.longitude.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Accuracy</label>
            <input
              type="number"
              step="any"
              className="form-control"
              {...register("accuracy", { valueAsNumber: true })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Altitude (m)</label>
            <input
              type="number"
              step="any"
              className="form-control"
              {...register("altitude", { min: -500, max: 10000, valueAsNumber: true })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Vertical Accuracy (m)</label>
            <input
              type="number"
              step="any"
              className="form-control"
              {...register("verticalAccuracy", { min: 0, valueAsNumber: true })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Location Type *</label>
            <select
              className={`form-select ${errors.gpsLocationTypeId ? "is-invalid" : ""}`}
              {...register("gpsLocationTypeId", { required: "Location type is required" })}
            >
              <option value="">Select location type</option>
              {locationTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.gpsLocationTypeId && <div className="invalid-feedback">{errors.gpsLocationTypeId.message}</div>}
          </div>

          {/* Hidden fields */}
          <input type="hidden" {...register("gpsSessionId", { required: true })} />
          <input type="hidden" {...register("appUserId", { required: true })} />
          <input type="hidden" {...register("recordedAt", { required: true })} />
          <input type="hidden" {...register("id")} />

          <div className="d-flex flex-column">
            <button type="submit" className="btn btn-warning w-100 mb-2">Save Changes</button>
			<Link href={`/locations?sessionId=${sessionId}`} className="btn btn-outline-light w-100">Back to Locations</Link>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}
