"use client"

import { AccountContext } from "@/context/AccountContext";
import { GpsSessionService } from "@/services/GpsSessionService";
import { IGpsSession } from "@/types/domain/sessions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function GpsSessions() {

	const sessionService = new GpsSessionService();

	const [ data, setData] = useState<IGpsSession[]>([]);
	const [filterType, setFilterType] = useState<string>("all");

	const { accountInfo } = useContext(AccountContext);
	const router = useRouter();

	const uniqueTypes = [...new Set(
		data.map(s => {
			try {
				const parsed = JSON.parse(s.gpsSessionType);
				return parsed.en || null;
			} catch {
				return null;
			}
		})
		.filter(Boolean)
		)];

	const filteredData = filterType === "all" ? data : data.filter(s => {
		try {
			const parsed = JSON.parse(s.gpsSessionType);
			return parsed.en.toLowerCase() === filterType.toLowerCase();
		} catch {
			return false;
		}
	});

	useEffect(() => {
		if (!accountInfo?.token) {
			router.push("/login");
			return;
		}

		const fetchData = async () => {
			try {
				const userFullName = accountInfo.firstName + " " + accountInfo.lastName;
				const result = await sessionService.getAllUserSessions(userFullName);
				if (result.errors) {
					console.log(result.errors);
					return;
				}
				setData(result.data || []);
			} catch (error) {
				console.error("Error fetching data: ", error);
			}
		};

		if (accountInfo?.firstName && accountInfo?.lastName) {
			fetchData();
		}
	}, [accountInfo]);

	const handleDelete = async (sessionId: string) => {
		if (!confirm("Are you sure you want to delete this session?")) return;
		console.log(sessionId);

		const result = await sessionService.deleteAsync(sessionId);
		if (result.errors) {
			alert("Failed to delete session: " + result.errors.join(", "));
		} else {
			setData(data.filter(s => s.id !== sessionId));
		}
	};

	return (
		<div className="container mt-5">
			<div className="sessions-wrapper text-white">
			<h2 className="mb-4 text-center">GPS Sessions</h2>
			{accountInfo?.token && (<Link href="/sessions/create" className="btn btn-warning btn-sm mb-3">	➕ Add New Session</Link>) }
			<div className="table-responsive">
				<div className="mb-3 d-flex align-items-center gap-2">
				<label htmlFor="typeFilter" className="form-label mb-0">Filter by Type:</label>
				<select
					className="form-select form-select-sm w-auto"
					value={filterType}
					onChange={(e) => setFilterType(e.target.value)}
				>
					<option value="all">All</option>
					{uniqueTypes.map( type => (
						<option key={type} value={type}>{type}</option>
					))}
				</select>
			</div>

			<table className="table table-hover table-bordered table-sm align-middle table-dark">
				<thead className="table-dark">
					<tr>
						<th>Name</th>
						<th >Description</th>
						<th >Recorded At</th>
						<th >Locations</th>
						<th style={{width: '120px'}}></th>
					</tr>
				</thead>
				<tbody>
					{filteredData.map((session) =>
						<tr key={session.id}>
							<td>{session.name}</td>
							<td>{session.description}</td>
							<td>{new Date(session.recordedAt).toLocaleString()}</td>
							<td>
								<span>{session.gpsLocationsCount}</span>
							</td>
							<td>
								<div className="d-flex flex-row gap-2">
									<Link href={`/locations?sessionId=${session.id}`} className="btn btn-sm btn-outline-info ms-2">Locations</Link>
									<Link href={`/sessions/details/${session.id}`} className="btn btn-sm btn-outline-light">Details</Link>
									<Link href={`/sessions/edit/${session.id}`} className="btn btn-sm btn-outline-warning">Edit</Link>
									<button onClick={() => handleDelete(session.id)} className="btn btn-sm btn-outline-danger">	Delete</button>
								</div>
							</td>
						</tr>
)}
				</tbody>
			</table>
			</div>
			</div>
		</div>
	)

}
