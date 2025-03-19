export const handleDate = (date: string, editedAt?: string): string => {
    const dateAt = new Date(date);
    const dateNowMs = Date.now();
    const timeDifference = dateNowMs - dateAt.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const oneHour = 1000 * 60 * 60;
    const oneMinute = 1000 * 60;

    let resultDate = "";

    if (timeDifference < oneMinute) {
        resultDate = Math.floor(timeDifference / 1000) + " sec. ago";
    } else if (timeDifference < oneHour) {
        resultDate = Math.floor(timeDifference / oneMinute) + " min. ago";
    } else if (timeDifference < oneDay) {
        resultDate = Math.floor(timeDifference / oneHour) + " hr. ago";
    } else {
        const options = {
            day: "numeric",
            month: "short",
            year: "2-digit",
        } as const;
        resultDate = dateAt.toLocaleDateString("en-US", options);
    }

    if (editedAt) {
        const editedDateAt = new Date(editedAt);
        const editDifference =
            (editedDateAt.getTime() - dateAt.getTime()) / 1000;
        if (editDifference > 180) {
            resultDate += ` (edited ${handleDate(editedDateAt.toString())})`;
        }
    }

    return resultDate;
};
