import { NextHandler } from "@fullauth/next";
import { authOptions } from "@/lib/auth-options";

const handler = NextHandler(authOptions);
export { handler as GET, handler as POST };
