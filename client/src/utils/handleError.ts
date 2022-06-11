import { NavigateFunction } from "react-router-dom";

export const handleError = (error: any, navigate?: NavigateFunction) => {
	if (error?.response?.status === 401) {
		//refresh page
		if (navigate) navigate(0);
	}
};
