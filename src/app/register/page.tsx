"use client";

import { AccountContext } from "@/context/AccountContext";
import { AccountService } from "@/services/AccountService";
import { IRegisterRequest } from "@/types/domain/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";


export default function Register() {

	const accountService = new AccountService();
	const { setAccountInfo } = useContext(AccountContext);
	const [ errorMsg, setErrorMsg ] = useState("");
	const router = useRouter();
	const { register, handleSubmit, watch, formState: { errors }} = useForm<IRegisterRequest & { passwordConfirm: string}>({
		mode: "onTouched"
	});
	const password = watch("password", "");

	const onSubmit = async (data: IRegisterRequest & { passwordConfirm: string}) => {
		setErrorMsg("");
		const { passwordConfirm, ...registerData } = data;

		try {
			const result = await accountService.registerAsync(registerData);
			if (result.errors) {
				setErrorMsg(result.statusCode + " - " + result.errors.join(", "));
				return;
			} else {
				setErrorMsg("");
				setAccountInfo!({
					token: result.data!.token,
					firstName: result.data!.firstName,
					lastName: result.data!.lastName,
				})
				localStorage.setItem("_token", result.data!.token);
				localStorage.setItem("firstName", result.data!.firstName);
				localStorage.setItem("lastName", result.data!.lastName);
				router.push('/');
			}
		}
		catch (error) {
			console.log("Error registrating new user ", error);
		}
	}

	return (
		<div className="container mt-5" style={{ maxWidth: "600px" }}>
			<div className="card bg-dark text-white border-secondary p-4">
				<h2 className="text-center text-white mb-4">Register</h2>
				<div className="card-body">
					{errorMsg && (
 					 <div className="alert alert-danger text-center py-2" role="alert">{errorMsg}</div>
					)}
					{errors.passwordConfirm && (
 					 <div className="alert alert-danger text-center py-2" role="alert">Password confirmation does not match the password. </div>
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
						<div className="mb-3">
							<label htmlFor="passwordConfirm" className="form-label">Confirm Password</label>
							<input
								type="password"
								className="form-control"
								id="passwordConfirm"
								{...register("passwordConfirm", {required: "Please confirm your password",
									validate: (value: string) => value === password || "Passwords do not match",
								})}
								/>
						</div>
						<div className="mb-3">
							<label htmlFor="firstName" className="form-label">First name</label>
							<input
								type="text"
								className="form-control"
								id="firstName"
								maxLength={128}
								minLength={1}
								{...register("firstName", {required: true})}
							/>
							{errors.firstName && <span className="text-danger"> First name is required!</span>}

						</div>
						<div className="mb-3">
							<label htmlFor="lastName" className="form-label">Last name</label>
							<input
								type="text"
								className="form-control"
								id="lastName"
								maxLength={128}
								minLength={1}
								{...register("lastName", {required: true})}
							/>
							{errors.lastName && <span className="text-danger"> Password is required!</span>}
						</div>
						<button type="submit" className="btn btn-warning w-100">Register</button>
					</form>
					<div className="text-center mt-3">
    					<p>Already a member? <Link href="/login">Login</Link></p>
					</div>
				</div>
			</div>
		</div>
	);
}
