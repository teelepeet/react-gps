"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

export interface IAccountInfo {
  token?: string;
  firstName?: string;
  lastName?: string;
}

export interface IAccountState {
  accountInfo?: IAccountInfo;
  setAccountInfo?: (value: IAccountInfo) => void;
}

export const AccountContext = createContext<IAccountState>({});

export const AccountProvider = ({ children }: { children: ReactNode }) => {
	const [isMounted, setIsMounted] = useState(false);
	// Prevent server side rendering mismatch by rendering only after component is mounted (client-side).

  	const [accountInfo, setAccountInfo] = useState<IAccountInfo | undefined>(undefined)

	useEffect(() => {
		const token = localStorage.getItem("_token");
		const firstName = localStorage.getItem("firstName") || "";
		const lastName = localStorage.getItem("lastName") || "";

		if (token) {
		setAccountInfo({ token, firstName, lastName });
		}

		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (accountInfo?.token) {
		localStorage.setItem("_token", accountInfo.token);
		if (accountInfo.firstName) localStorage.setItem("firstName", accountInfo.firstName);
		if (accountInfo.lastName) localStorage.setItem("lastName", accountInfo.lastName);
		} else {
		localStorage.removeItem("_token");
		localStorage.removeItem("firstName");
		localStorage.removeItem("lastName");
		}
	}, [accountInfo]);

	if (!isMounted) return null;

	return (
		<AccountContext.Provider value={{ accountInfo, setAccountInfo }}>
		{children}
		</AccountContext.Provider>
	);
};

export const useAccount = (): IAccountState => useContext(AccountContext);
