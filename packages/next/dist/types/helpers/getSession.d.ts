import { Session } from "@fullauth/core";
import { NextRequest } from "next/server";
declare function getServerSession(secret: string): Promise<Session | null>;
declare function getServerSession(secret: string, req: Request | NextRequest): Promise<Session | null>;
export default getServerSession;
