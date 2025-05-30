"use client"
import { GpsLocationService } from "@/services/GpsLocationService";
import { GpsLocationTypeService } from "@/services/GpsLocationTypeService";
import { IGpsLocation, IGpsLocationType } from "@/types/domain/locations";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function LocationDetails({params}: { params: Promise<{ id: string}>}) {
	const { id } = use(params);
	const searchParams = useSearchParams();
	const sessionId = searchParams.get("sessionId");

	const [ location, setLocation] = useState<IGpsLocation | null>();
	const [ locationType, setLocationType] = useState<IGpsLocationType[]>([]);
	const [errorMsg] = useState("");

	const locationService = new GpsLocationService();
	const locationTypeService = new GpsLocationTypeService();

	useEffect(() => {
		const fetchInitialData = async () => {
			try {
				const [locationResult, typesResult] = await Promise.all([
					locationService.getAsync(id),
					locationTypeService.getAllAsync(),
				]);
				if (!locationResult.errors) setLocation(locationResult.data);
				if (!typesResult.errors) setLocationType(typesResult.data || []);
			} catch (error) {
				console.log("Error fetching initial data: ", error);
			}
		};
		fetchInitialData();
	}, [id]);

	const getLocationTypeName = (typeId: string): string =>
		locationType.find(t => t.id === typeId)?.name || "Unknown";

	return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="card bg-dark text-white border-secondary p-4">
        <h2 className="text-center mb-4">GPS Location Details</h2>

        {errorMsg && (
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {errorMsg}
          </div>
        )}

        {!location && !errorMsg && (
          <p className="text-center">Loading location details...</p>
        )}

        {location && (
          <>
		  <div className="mb-3">
              <strong>Recorded At:</strong> {new Date(location.recordedAt).toLocaleString()}
            </div>
            <div className="mb-3"><strong>Latitude:</strong> {location.latitude}</div>
            <div className="mb-3"><strong>Longitude:</strong> {location.longitude}</div>

            <div className="mb-3"><strong>Accuracy:</strong> {location.accuracy}</div>
            <div className="mb-3"><strong>Altitude:</strong> {location.altitude}</div>
            <div className="mb-3"><strong>Vertical Accuracy:</strong> {location.verticalAccuracy}</div>
            <div className="mb-3"><strong>Gps Location Type:</strong> {getLocationTypeName(location.gpsLocationTypeId)}</div>

			<div className="d-flex flex-column">
				<Link href={`/locations/edit/${location.id}?sessionId=${sessionId}`} className="btn btn-warning mb-2">Edit</Link>
				<Link href={`/locations?sessionId=${sessionId}`} className="btn btn-outline-light w-100">Back to Locations</Link>
			</div>
          </>
        )}
      </div>
    </div>
  );

}
