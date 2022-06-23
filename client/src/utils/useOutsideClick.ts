import { Dispatch, MutableRefObject, SetStateAction, useEffect } from "react";

/* Hook that sets state to false on click outside of the passed ref */
export const useOutsideClick = (
	ref: MutableRefObject<any>,
	set: Dispatch<SetStateAction<any>>
) => {
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target)) {
				set(false);
			}
		};
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [ref, set]);
};
