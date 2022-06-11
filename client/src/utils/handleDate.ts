export const handleDate = (date: string) => {
	const dateAt = new Date(date);
	const dateNowMs = Date.now();
	const timeDifference = dateNowMs - dateAt.getTime();
	const oneDay = 1000 * 60 * 60 * 24;
	const oneHour = 1000 * 60 * 60;
	const oneMinute = 1000 * 60;

	let resultDate = "";
	let testDate = new Date(timeDifference);

	if (timeDifference < oneMinute) {
		resultDate = testDate.getSeconds().toString() + " sec. ago";
	} else if (timeDifference < oneHour) {
		resultDate = testDate.getMinutes().toString() + " min. ago";
	} else if (timeDifference < oneDay) {
		resultDate = testDate.getHours().toString() + " hr. ago";
	} else {
		const options = {
			day: "numeric",
			month: "short",
			year: "2-digit",
		} as const;
		resultDate = dateAt.toLocaleDateString("en-US", options);
	}

	return resultDate;
};
