"use client";
import { AccountContext } from "@/context/AccountContext";
import { AccountService } from "@/services/AccountService";
import { ILoginRequest } from "@/types/domain/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Login() {

	const router = useRouter();
	const [ errorMsg, setErrorMsg] = useState("");
	const { register, handleSubmit, formState: { errors }} = useForm<ILoginRequest>()
	const accountService = new AccountService();
	const { setAccountInfo } = useContext(AccountContext);

	const onSubmit: SubmitHandler<ILoginRequest> = async (data: ILoginRequest) => {
		setErrorMsg("Loading...");
		try {
			const result = await accountService.loginAsync(data);
			if (result.errors || !result.data) {
				setErrorMsg("Wrong username or password.");
				return;
			}
			setErrorMsg("")
			console.log("Login was successful.")
			console.log("token: " + result.data.token);
			if (result.data.token && setAccountInfo) {
				setAccountInfo({
				token: result.data.token,
				firstName: result.data.firstName,
				lastName: result.data.lastName
			})
		}

			localStorage.setItem("_token", result.data.token);
			localStorage.setItem("firstName", result.data.firstName);
			localStorage.setItem("lastName", result.data.lastName);
			router.push("/");

		} catch (error) {
			setErrorMsg("Login failed - " + (error as Error).message);
		}
	}

	return (
		<div className="container mt-5" style={{ maxWidth: "500px" }}>
			<div className="card bg-dark text-white border-secondary p-4">
			<h2 className="text-center text-white mb-4">Login</h2>
				<div className="card-body">
					{errorMsg && (
 					 <div className="alert alert-danger text-center py-2" role="alert">{errorMsg}</div>
					)}
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="mb-3">
							<label htmlFor="email" className="form-label">Email address</label>
							<input
								type="email"
								className="form-control"
								id="email"
								maxLength={256}
								minLength={1}
								{...register("email", {required: true})}
							/>
							{ errors.email && <span className="text-danger"> Email is required!</span>}

						</div>
						<div className="mb-3">
							<label htmlFor="password" className="form-label">Password</label>
							<input
								type="password"
								className="form-control"
								id="password"
								maxLength={100}
								minLength={6}
								{...register("password", {required: true})}
							/>
							{errors.password && <span className="text-danger"> Password is required!</span>}
						</div>
						<button type="submit" className="btn btn-warning w-100">Login</button>
					</form>
					<div className="text-center mt-3">
    					<p>Not a member? <Link href="/register">Register</Link></p>
					</div>
				</div>
			</div>
		</div>
	);
}
