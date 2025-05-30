import axios, { AxiosInstance } from 'axios'

export abstract class BaseService {

	protected axiosInstance: AxiosInstance;

	constructor() {
		this.axiosInstance = axios.create({
			baseURL: 'https://sportmap.akaver.com/api/v1.0/',
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		this.axiosInstance.interceptors.request.use(
			(config) => {
				const token = localStorage.getItem("_token");
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
		},
		(error) => {
			return Promise.reject(error);
		});
	}
}
