"use client";
import { AccountContext } from "@/context/AccountContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function Header() {
	const router = useRouter();
	const { accountInfo, setAccountInfo } = useContext(AccountContext);

	const handleLogout = () => {
		setAccountInfo!({});
		router.push("/");
	}

	return (
		<header className="p-3 text-bg-dark">
			<div className="container">
				<div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
					<Link href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
					<span className="fs-2 fw-bold me-3">🏃‍♂️ Sportmap</span></Link>
					<ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
						<li><Link href="/" className="nav-link px-2 text-white">Home</Link></li>
						{accountInfo?.token && (
							<>
							<li><Link className="nav-link px-2 text-white" href="/sessions">My Sessions</Link></li>
							</>
						)}
					</ul>
					<ul className="text-end list-unstyled mb-0">
						{!accountInfo?.token ? (
						<>
						<li className="d-inline">
							<Link href="/login"className="btn btn-outline-light me-2">Login</Link>
						</li>
						<li className="d-inline">
							<Link href="/register" className="btn btn-warning">Register</Link>
						</li>
						</>
						) : (
							<>
							<li className="d-inline me-2 text-white"> Welcome back, {accountInfo.firstName}!</li>
							<li className="d-inline">
								<button className="btn btn-sm btn-outline-warning" onClick={handleLogout}>Logout</button>
							</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</header>
	);
}
