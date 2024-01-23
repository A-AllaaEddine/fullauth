import { AuthOptions } from '@fullauth/core';
import { NextRequest } from 'next/server';
declare function getServerSession(options: AuthOptions): any;
declare function getServerSession(req: Request | NextRequest, options: AuthOptions): any;
export default getServerSession;
