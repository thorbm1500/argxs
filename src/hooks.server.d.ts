import { type Handle, type HandleServerError, type ServerInit } from '@sveltejs/kit';
import { Resources } from '$lib/server/Resources';
export declare const VERSION: string;
export declare const RESOURCES: Resources;
export declare const handleError: HandleServerError;
export declare const init: ServerInit;
export declare const handle: Handle;
