"use client"
import { GpsSessionService } from "@/services/GpsSessionService";
import { IGpsSession } from "@/types/domain/sessions";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function SessionDetails({params}: { params: Promise<{ id: string}>}) {
	const { id } = use(params);
	const [ session, setSession] = useState<IGpsSession | null>();
	const [errorMsg, setErrorMsg] = useState("");
	const sessionService = new GpsSessionService();

	useEffect(() => {
		const fetchData = async () => {
			const result = await sessionService.getAsync(id);
			if (result.errors && result.errors.length > 0 ) {
				setErrorMsg(result.statusCode + " - " + result.errors.join(", "));
				setSession(null);
			} else {
				setSession(result.data as IGpsSession);
				setErrorMsg("");
			}
		}
		fetchData();
	}, [id]);

	return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="card bg-dark text-white border-secondary p-4">
        <h2 className="text-center mb-4">GPS Session Details</h2>

        {errorMsg && (
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {errorMsg}
          </div>
        )}

        {!session && !errorMsg && (
          <p className="text-center">Loading session details...</p>
        )}

        {session && (
          <>
            <div className="mb-3"><strong>Name:</strong> {session.name}</div>
            <div className="mb-3"><strong>Description:</strong> {session.description}</div>
            <div className="mb-3">
              <strong>Recorded At:</strong> {new Date(session.recordedAt).toLocaleString()}
            </div>
            <div className="mb-3"><strong>Duration:</strong> {session.duration}</div>
            <div className="mb-3"><strong>Speed:</strong> {session.speed}</div>
            <div className="mb-3"><strong>Distance:</strong> {session.distance}</div>
            <div className="mb-3"><strong>Climb:</strong> {session.climb}</div>
            <div className="mb-3"><strong>Descent:</strong> {session.descent}</div>
            <div className="mb-3"><strong>Pace Min:</strong> {session.paceMin}</div>
            <div className="mb-3"><strong>Pace Max:</strong> {session.paceMax}</div>
            <div className="mb-3"><strong>Session Type:</strong> {session.gpsSessionType}</div>
            <div className="mb-3"><strong>GPS Locations Count:</strong> {session.gpsLocationsCount}</div>
            <div className="mb-3"><strong>User Name:</strong> {session.userFirstLastName}</div>

            <div className="d-flex flex-column">
				<Link href={`/sessions/edit/${session.id}`} className="btn btn-warning mb-2">Edit</Link>
				<Link href="/sessions" className="btn btn-outline-light w-100">Back to Sessions</Link>
			</div>
          </>
        )}
      </div>
    </div>
  );

}
