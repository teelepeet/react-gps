"use client"

import { AccountContext } from "@/context/AccountContext";
import { GpsLocationService } from "@/services/GpsLocationService";
import { GpsLocationTypeService } from "@/services/GpsLocationTypeService";
import { GpsSessionService } from "@/services/GpsSessionService";
import { IGpsLocation, IGpsLocationType } from "@/types/domain/locations";
import { IGpsSession } from "@/types/domain/sessions";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";


export default function GpsLocations() {

	const locationService = new GpsLocationService();
	const sessionService = new GpsSessionService();
	const locationTypeService = new GpsLocationTypeService();

	const [ locationTypes, setLocationTypes] = useState<IGpsLocationType[]>([]);
	const [ data, setData] = useState<IGpsLocation[]>([]);
	const [ session, setSession ] = useState<IGpsSession>()
	const [showMap, setShowMap] = useState(false);
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

	const { accountInfo } = useContext(AccountContext);
	const searchParams = useSearchParams();
	const router = useRouter();

	const sessionId = searchParams.get("sessionId");
	const LocationMap = dynamic(() => import("@/components/Map"), {ssr: false,});


	useEffect(() => {
		if (!accountInfo?.token) {
			router.push("/login");
			return;
		}

		const fetchInitialData = async () => {
			try {
				if (!sessionId) return;

				const sessionResult = await sessionService.getAsync(sessionId);
				if (!sessionResult.errors) setSession(sessionResult.data);

				const typesResult = await locationTypeService.getAllAsync();
				if (!typesResult.errors) {
					setLocationTypes(typesResult.data || []);
				}

				const locationsResult = await locationService.getSessionLocations(sessionId);
				if (!locationsResult.errors) {
					setData(Array.isArray(locationsResult.data) ? locationsResult.data : []);
				}

			} catch (error) {
				console.log("Error loading data: ", error);
			}
		};
		fetchInitialData();
	},[sessionId]);

	useEffect(() => {
	if (locationTypes.length > 0) {
		setSelectedTypes(locationTypes.map(type => type.id));
	}
	}, [locationTypes]);

	const getLocationTypeName = (typeId: string): string =>
		locationTypes.find(t => t.id === typeId)?.name || "Unknown";

	const handleDelete = async (locationId: string) => {
		if (!confirm("Are you sure you want to delete this location?")) return;

		const result = await locationService.deleteAsync(locationId);
		if (result.errors) {
			alert("Failed to delete location: " + result.errors.join(", "));
		} else {
			setData(data.filter(s => s.id !== locationId));
		}
	};

	return (
		<div className="container mt-5" >
			<div className="sessions-wrapper text-white">
			<h2 className="mb-4 text-center">{session?.name ? session.name : "GPS"} Locations</h2>

			{session && (
			<div className="row text-light mb-4">
				<div className="col-md-4">
				<p className="mb-1"><b>Recorded:</b> {new Date(session.recordedAt).toLocaleString()}</p>
				</div>
				<div className="col-md-4">
				<p className="mb-1"><b>Duration:</b> {Math.round(session.duration * 100) / 100}s</p>
				</div>
				<div className="col-md-4">
				<p className="mb-1"><b>Distance:</b> {Math.round(session.distance * 100) / 100}m</p>
				</div>
			</div>
			)}

			{session && (
			<div className="d-flex flex-row gap-3 mb-3">
				{data.length > 0 && (
				<button className="btn btn-outline-info" onClick={() => setShowMap((prev) => !prev)}>
					{showMap ? "Hide Map" : "Show Map"}
				</button>
				)}
				<Link href={`/locations/create?sessionId=${sessionId}`} className="btn btn-warning btn-sm">
				➕ Add New Location
				</Link>
			</div>
			)}
			{showMap && (<LocationMap
			locations={
				selectedTypes.length === 0 ? data : data.filter(loc => selectedTypes.includes(loc.gpsLocationTypeId))
			}
    		locationTypes={locationTypes}
			/>
			)}

			<br />

			<div className="table-responsive">
			<table className="table table-hover table-bordered table-sm align-middle table-dark">
				<thead className="table-dark">
					<tr>
						<th>Latitude</th>
						<th >Longitude</th>
						<th>Altitude</th>
						<th >Recorded At</th>
						<th >Type</th>
						<th style={{width: '120px'}}></th>
					</tr>
				</thead>
				<tbody>
					{data.length === 0 ? (
						<tr><td colSpan={6} className="text-center text-secondary">No data</td></tr>
					) : (
					data.map(location => (
      				<tr key={location.id}>
        				<td>{location.latitude}</td>
        				<td>{location.longitude}</td>
        				<td>{location.altitude}</td>
       					<td>{new Date(location.recordedAt).toLocaleString()}</td>
        				<td>{getLocationTypeName(location.gpsLocationTypeId)}</td>
        				<td>
							<div className="d-flex flex-row gap-2">
								<Link href={`/locations/details/${location.id}?sessionId=${sessionId}`} className="btn btn-sm btn-outline-light">Details</Link>
								<Link href={`/locations/edit/${location.id}?sessionId=${sessionId}`} className="btn btn-sm btn-outline-warning">Edit</Link>
								<button onClick={() => handleDelete(location.id)} className="btn btn-sm btn-outline-danger">Delete</button>
							</div>
						</td>
      				</tr>
					)))
				}
				</tbody>
			</table>
			</div>
			</div>
		</div>
	)

}

