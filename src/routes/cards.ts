import CardDao from '@daos/cardDao';
import Card from '@entities/card';
import { paramMissingError } from '@shared/constants';
import { checkHeaders } from '@shared/errors';
import { Request, Response, Router } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { Connection, createConnection } from "typeorm";
import { isNullOrUndefined } from 'util';

// Init shared
const router = Router();
createConnection().then((connection: Connection) => {
    const cardDao = new CardDao(connection);

    /******************************************************************************
     *                      Get All Cards - "GET /api/cards/all"
     ******************************************************************************/

    router.get('/all', async (req: Request, res: Response) => {
        checkHeaders(req);
        const { usr, cmp } = req.headers;
        const cards = await cardDao.getAll({ userId: usr });
        return res.status(OK).json({ cards });
    });

    /******************************************************************************
     *                       Add One - "POST /api/cards/add"
     ******************************************************************************/

    router.post('/add', async (req: Request, res: Response) => {
        checkHeaders(req);
        const { card } = req.body;
        const { usr, cmp } = req.headers;
        if (!card) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        } else {
            card.userId = usr;
        }
        await cardDao.add(new Card(card));
        return res.status(CREATED).end();
    });

    /******************************************************************************
     *                       Load / Unload - "PUT /api/cards/load"
     ******************************************************************************/

    router.put('/load', async (req: Request, res: Response) => {
        checkHeaders(req);
        const { card } = req.body;
        const { usr, cmp } = req.headers;
        if (!card || !card.load || card.load === 0) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        await cardDao.load({
            id: card.id,
            load: Number(card.load),
            userId: Number(usr),
        });
        return res.status(OK).end();
    });

    /******************************************************************************
     *                       Block / Unblock - "PUT /api/cards/block"
     ******************************************************************************/

    router.put('/block', async (req: Request, res: Response) => {
        checkHeaders(req);
        const { card } = req.body;
        const { usr, cmp } = req.headers;
        if (!card || isNullOrUndefined(card.isBlocked)) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        await cardDao.block({
            id: card.id,
            isBlocked: Boolean(card.isBlocked),
            userId: Number(usr)
        });
        return res.status(OK).end();
    });
});
export default router;
