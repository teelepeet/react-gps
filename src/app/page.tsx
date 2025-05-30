"use client"
import { AccountContext } from "@/context/AccountContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Home() {

	const { accountInfo } = useContext(AccountContext);


  return (
	<main>
		<div className="container mt-5 text-white">
			<div className="row justify-content-center">
				<div className="col-md-8 col-lg-6">
  					<div className="p-4 mb-4 bg-dark rounded shadow-sm text-center">
    					<h1 className="mb-3">Welcome to GPS Sessions</h1>
   						<p className="lead fs-6">Track and manage your running, orienteering, and cycling sessions. Add locations, waypoints, and checkpoints to visualize your routes and progress.</p>
    					<Link href="/sessions/create" className="btn btn-warning btn-lg mt-3">➕ Create Sessions</Link>
  					</div>
				</div>
			</div>
		</div>
	</main>
  );
}
