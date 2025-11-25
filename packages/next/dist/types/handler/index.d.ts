import { NextRequest } from "next/server";
import { AuthOptions } from "@fullauth/core";
type AppRouteHandlerRoutes = "/api/auth/[...fullauth]";
interface ParamMap {
    "/": {};
    "/api/auth/[...fullauth]": {
        fullauth: string[];
    };
    "/server": {};
}
interface RouteContext<AppRouteHandlerRoute extends AppRouteHandlerRoutes> {
    params: Promise<ParamMap[AppRouteHandlerRoute]>;
}
declare function NextHandler(options: AuthOptions): any;
declare function NextHandler(req: NextRequest, ctx: RouteContext<"/api/auth/[...fullauth]">, options: AuthOptions): any;
export default NextHandler;
