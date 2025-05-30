"use client"
import { AccountContext } from "@/context/AccountContext";
import { GpsLocationService } from "@/services/GpsLocationService";
import { GpsLocationTypeService } from "@/services/GpsLocationTypeService";
import { IGpsLocation, IGpsLocationType } from "@/types/domain/locations";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function LocationCreate() {
	const [ errorMsg, setErrorMsg] = useState("");
	const [ locationTypes, setLocationTypes] = useState<IGpsLocationType[]>([]);
	const { register, handleSubmit, formState: {errors},} = useForm<IGpsLocation>();
	const locationService = new GpsLocationService();
	const locationTypeService = new GpsLocationTypeService();
	const router = useRouter();
	const { accountInfo } = useContext(AccountContext);
	const searchParams = useSearchParams();
	const sessionId = searchParams.get("sessionId");

	useEffect(() => {
		if (!accountInfo?.token) {
			router.push('/login');
		}
	}, []);

	useEffect(() => {
		if (!sessionId) {
			console.log("no sessionId - can't create the location")
			router.push('/locations');
		}
		const fetchLocationTypes = async () => {
			try {
				const result = await locationTypeService.getAllAsync();
				if (result.errors) {
					console.error(result.errors);
					return;
				}
				setLocationTypes(result.data || []);
			} catch (error) {
				console.log("Error fetching session types: ", error);
			}
		};
		fetchLocationTypes();
	}, [sessionId]);

	const onSubmit: SubmitHandler<IGpsLocation> = async (data: IGpsLocation) => {
		setErrorMsg("Loading....");
		try {
			const result = await locationService.addAsync(data, sessionId!);
			if (result.errors && result.errors.length > 0) {
				setErrorMsg(result.statusCode + " - " + result.errors.join(", "));
				return;
			} else {
				console.log("New location added")
				setErrorMsg("");
				router.push(`/locations?sessionId=${sessionId}`);
			}
		} catch (error) {
			console.log('error: ' + (error as Error).message);
			setErrorMsg((error as Error).message);
		}
	}

	return (
		<div className="container mt-5" style={{ maxWidth: "500px" }}>
			<div className="card bg-dark text-white border-secondary">
				<h2 className="text-center text-white mb-4">Create GPS Location</h2>
				<div className="card-body">
					{errorMsg && (
						<div className="alert alert-warning text-center" role="alert">
							{errorMsg}
						</div>
					)}

					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="mb-3">
							<label className="form-label">Latitude </label>
							<input
								type="number"
								step="any"
								className={`form-control ${errors.latitude ? "is-invalid" : ""}`}
								{...register("latitude", {
									required: "Latitude is required" ,
									min: {value: -90, message: "Latitude must be creater than -90 and smaller than 90"},
									max: { value: 90, message: "Latitude must be creater than -90 and smaller than 90"}
								})}
							/>
							{errors.latitude && <div className="invalid-feedback">{errors.latitude.message}</div>}
						</div>

						<div className="mb-3">
							<label className="form-label">Longitude </label>
							<input
								type="number"
								step="any"
								className={`form-control ${errors.longitude ? "is-invalid" : ""}`}
								{...register("longitude", {
									required: "Longitude is required",
									min: {value: -180, message: "Longitude must be creater than -180 and smaller than 180"},
									max: { value: 180, message: "Longitude must be creater than -180 and smaller than 180"}
								})}
							/>
							{errors.longitude && <div className="invalid-feedback">{errors.longitude.message}</div>}
						</div>

						<div className="mb-3">
							<label className="form-label">Altitude (m)</label>
							<input
								type="number"
								step="any"
								className="form-control"
								{...register("altitude")}
							/>
						</div>

						<div className="mb-3">
							<label className="form-label">Location Type</label>
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
							{errors.gpsLocationTypeId && (
								<div className="invalid-feedback">{errors.gpsLocationTypeId.message}</div>
							)}
						</div>
						<input type="hidden" value={sessionId!} {...register("gpsSessionId", { required: true })} />
						<div className="d-flex flex-column">
							<button type="submit" className="btn btn-warning w-100 mb-2">
								Create Location
							</button>
							<Link href={`/locations?sessionId=${sessionId}`} className="btn btn-outline-light w-100">
								Back to Locations
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	)

}
