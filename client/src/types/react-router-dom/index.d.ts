import { Location } from "react-router-dom";

declare module "react-router-dom" {
	export declare function useLocation<T = unknown>(): Location & { state: T };
}
