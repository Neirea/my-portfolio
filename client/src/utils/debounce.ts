import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);
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
