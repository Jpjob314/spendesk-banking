
import { Request, Response, Router } from 'express';

export function checkHeaders(req: Request, extras?: string[]) {
    if (!req.headers.usr) {
        throw new Error("user id header is missing");
    } else if (isNaN(Number(req.headers.usr))) {
        throw new Error("user id header must be a number");
    }

    if (!req.headers.cmp) {
        throw new Error("company id header is missing");
    } else if (isNaN(Number(req.headers.cmp))) {
        throw new Error("company id header must be a number");
    }

    if (extras && extras.length) {
        extras.forEach((extra: string) => {
            if (!req.headers[extra]) {
                throw new Error(extra + " header is missing");
            }
        });
    }
}