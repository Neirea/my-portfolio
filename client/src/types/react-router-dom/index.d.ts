import type { Location } from "react-router";

declare module "react-router" {
    export declare function useLocation<T = unknown>(): Location<T>;
}
