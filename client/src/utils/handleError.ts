export const handleError = (error: any, navigate: any = null) => {
	if (error?.response?.status === 401) {
		//refresh page
		if (navigate) navigate(0);
	}
};
