import { Router } from "express";
export type Route = {
    path: string;
    route: Router;
};
declare const router: import("express-serve-static-core").Router;
export default router;
