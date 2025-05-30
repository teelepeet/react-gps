"use client"

import { GpsSessionService } from "@/services/GpsSessionService";
import { GpsSessionTypeService } from "@/services/GpsSessionTypeService";
import { IGpsSessionType, IGpsSessionUpdate } from "@/types/domain/sessions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function SessionEdit({params}: { params: Promise<{ id: string}>}) {
	const router = useRouter();
	const { id } = use(params);
	const [errorMsg, setErrorMsg] = useState("");
	const [ gpsSessionTypes, setGpsSessionTypes] = useState<IGpsSessionType[]>([]);
	const sessionService = new GpsSessionService();
	const sessionTypeService = new GpsSessionTypeService();

	const { register, handleSubmit, setValue, formState: {errors, isSubmitting}} = useForm<IGpsSessionUpdate>();

	useEffect(() => {
		const fetchData = async () => {
			const [ sessionResult, typeResult] = await Promise.all([
				sessionService.getAsync(id),
				sessionTypeService.getAllAsync(),
			]);

			if (sessionResult.errors && sessionResult.errors.length > 0) {
				setErrorMsg(sessionResult.statusCode + " - " + sessionResult.errors.join(", "));
			} else if (sessionResult.data) {
				const session = sessionResult.data;
				setValue("id", session.id);
				setValue("name", session.name);
				setValue("description", session.description);
				setValue("recordedAt", session.recordedAt.substring(0, 16));
				setValue("paceMin", session.paceMin);
				setValue("paceMax", session.paceMax);
				setValue("gpsSessionTypeId", session.gpsSessionType);
			}

			if (typeResult.data) {
				setGpsSessionTypes(typeResult.data);
			}
		};

		fetchData();
	}, [id, setValue]);

	const onSubmit: SubmitHandler<IGpsSessionUpdate> = async (data) => {
		setErrorMsg("Loding...");
		try {
			const result = await sessionService.updateAsync(data);
			if (result.errors && result.errors.length > 0) {
				setErrorMsg(result.statusCode + " - " + result.errors.join(", "));
			} else {
				setErrorMsg("");
				router.push("/sessions");
			}
		} catch (error) {
			console.log('error: ', (error as Error).message)
			setErrorMsg((error as Error).message);
		}
	}

	return (
		<div className="container mt-5" style={{ maxWidth: "500px" }}>
  			<div className="card bg-dark text-white border-secondary">
    			<h2 className="text-center text-white mb-4">Edit GPS Session</h2>
   				<div className="card-body">{errorMsg && (
					<div className="alert alert-warning text-center" role="alert">{errorMsg}</div>
      			)}

			<form onSubmit={handleSubmit(onSubmit)}>
				<input type="hidden" {...register("id")} />

				<div className="mb-3">
				<label htmlFor="name" className="form-label">Session Name *</label>
				<input
					type="text"
					id="name"
					className={`form-control ${errors.name ? 'is-invalid' : ''}`}
					{...register("name", { required: "Session Name is required", maxLength: 256 })}
				/>
				{errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
				</div>

				<div className="mb-3">
				<label htmlFor="description" className="form-label">Description *</label>
				<textarea
					id="description"
					className={`form-control ${errors.description ? 'is-invalid' : ''}`}
					rows={3}
					{...register("description", { required: "Description is required", maxLength: 4096 })}
				/>
				{errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
				</div>

				<div className="mb-3">
				<label htmlFor="gpsSessionTypeId" className="form-label">Session Type *</label>
				<select
					id="gpsSessionTypeId"
					className={`form-select ${errors.gpsSessionTypeId ? 'is-invalid' : ''}`}
					{...register("gpsSessionTypeId", { required: "Session Type is required" })}
				>
					<option value="">Select Session Type</option>
					{gpsSessionTypes.map((type) => (
					<option key={type.id} value={type.id}>
						{type.name}
					</option>
					))}
				</select>
				{errors.gpsSessionTypeId && <div className="invalid-feedback">{errors.gpsSessionTypeId.message}</div>}
				</div>

				<div className="mb-3">
				<label htmlFor="recordedAt" className="form-label">Recorded At *</label>
				<input
					type="datetime-local"
					id="recordedAt"
					className={`form-control ${errors.recordedAt ? 'is-invalid' : ''}`}
					{...register("recordedAt", { required: "Recorded At is required" })}
				/>
				{errors.recordedAt && <div className="invalid-feedback">{errors.recordedAt.message}</div>}
				</div>

				<div className="mb-3">
				<label htmlFor="paceMin" className="form-label">Pace Min</label>
				<input
					type="number"
					id="paceMin"
					className="form-control"
					{...register("paceMin", { valueAsNumber: true })}
				/>
				</div>

				<div className="mb-3">
				<label htmlFor="paceMax" className="form-label">Pace Max</label>
				<input
					type="number"
					id="paceMax"
					className="form-control"
					{...register("paceMax", { valueAsNumber: true })}
				/>
				</div>

				<div className="d-flex flex-column">
				<button disabled={isSubmitting} type="submit" className="btn btn-warning w-100 mb-2">
					{isSubmitting ? "Saving..." : "Save Changes"}
				</button>
				<Link href="/sessions" className="btn btn-outline-light w-100">Back to Sessions</Link>
				</div>
			</form>
    		</div>
  		</div>
		</div>
	);
}
