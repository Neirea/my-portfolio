import { useEffect, useState } from "react";

export function useDebounce(value: any, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);
	useEffect(() => {
		// Update debounced value after delay
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Cancel the timeout if value changes (also on delay change or unmount)
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);
	return debouncedValue;
}
