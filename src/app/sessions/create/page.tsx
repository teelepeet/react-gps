"use client"
import { AccountContext } from "@/context/AccountContext";
import { GpsSessionService } from "@/services/GpsSessionService";
import { GpsSessionTypeService } from "@/services/GpsSessionTypeService";
import { IGpsSessionAdd, IGpsSessionType } from "@/types/domain/sessions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function SessionCreate() {
	const [ errorMsg, setErrorMsg] = useState("");
	const [ sessionTypes, setSessionTypes] = useState<IGpsSessionType[]>([]);
	const { register, handleSubmit, formState: {errors},} = useForm<IGpsSessionAdd>();
	const sessionService = new GpsSessionService();
	const sessionTypeService = new GpsSessionTypeService();
	const router = useRouter();
	const { accountInfo } = useContext(AccountContext);

	useEffect(() => {
		if (!accountInfo?.token) {
			router.push('/login');
		}
	}, []);

	useEffect(() => {
		const fetchSessionTypes = async () => {
			try {
				const result = await sessionTypeService.getAllAsync();
				if (result.errors) {
					console.error(result.errors);
					return;
				}
				setSessionTypes(result.data || []);
			} catch (error) {
				console.log("Error fetching session types: ", error);
			}
		};
		fetchSessionTypes();
	}, []);

	const onSubmit: SubmitHandler<IGpsSessionAdd> = async (data: IGpsSessionAdd) => {
		setErrorMsg("Loading....");
		try {
			const result = await sessionService.addAsync(data);
			if (result.errors && result.errors.length > 0) {
				setErrorMsg(result.statusCode + " - " + result.errors.join(", "));
				return;
			} else {
				console.log("New session added")
				setErrorMsg("");
				router.push(`/sessions`);
			}
		} catch (error) {
			console.log('error: ' + (error as Error).message);
			setErrorMsg((error as Error).message);
		}
	}

	return (
		<div className="container mt-5" style={{ maxWidth: "500px" }}>
			<div className="card bg-dark text-white border-secondary">
				<h2 className="text-center text-white mb-4">Create GPS Session</h2>
				<div className="card-body">
					{errorMsg && (
						<div className="alert alert-warning text-center" role="alert">
							{errorMsg}
						</div>
					)}

					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="mb-3">
							<label htmlFor="name" className="form-label">Session Name *</label>
							<input
								type="text"
								className={`form-control ${errors.name ? 'is-invalid' : ''}`}
								id="name"
								placeholder="Enter session name"
								maxLength={128}
								{...register("name", { required: true })}
							/>
							{errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
						</div>

						<div className="mb-3">
							<label htmlFor="description" className="form-label">Description *</label>
							<textarea
								className={`form-control ${errors.description ? 'is-invalid' : ''}`}
								id="description"
								placeholder="Enter description"
								rows={3}
								{...register("description", { required: true })}
							/>
							{errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
						</div>

						<div className="mb-3">
							<label htmlFor="gpsSessionTypeId" className="form-label">Session Type *</label>
							<select
								className={`form-select ${errors.gpsSessionTypeId ? 'is-invalid' : ''}`}
								id="gpsSessionTypeId"
								{...register("gpsSessionTypeId", { required: true })}
							>
							<option value="">Select Session Type</option>
							{sessionTypes.map((type) =>  (
							<option key={type.id} value={type.id}>{type.name}</option>
							))}
							</select>
							{errors.gpsSessionTypeId && <div className="invalid-feedback">{errors.gpsSessionTypeId.message}</div>}
						</div>
						<div className="d-flex flex-column">
							<button type="submit" className="btn btn-warning w-100 mb-2">Create Session</button>
							<Link href="/sessions" className="btn btn-outline-light w-100">Back to Sessions</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	)

}
