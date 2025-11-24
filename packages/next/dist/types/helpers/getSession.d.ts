import { AuthOptions, Session } from "@fullauth/core";
import { NextRequest } from "next/server";
declare function getServerSession(options: AuthOptions): Promise<Session | null>;
declare function getServerSession(req: Request | NextRequest, options: AuthOptions): Promise<Session | null>;
export default getServerSession;
