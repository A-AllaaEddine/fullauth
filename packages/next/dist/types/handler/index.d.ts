import { NextRequest } from 'next/server';
import { AuthOptions } from '@lazyauth/core';
declare function NextHandler(options: AuthOptions): any;
declare function NextHandler(req: NextRequest, res: Response, options: AuthOptions): any;
export default NextHandler;
