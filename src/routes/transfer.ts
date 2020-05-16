import TransferDao from '@daos/transferDao';
import { paramMissingError, ratesMissingError } from '@shared/constants';
import { checkHeaders } from '@shared/errors';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, OK, GATEWAY_TIMEOUT } from 'http-status-codes';
import { Connection, createConnection } from 'typeorm';
import * as config from '../config.json';
import fetch from 'node-fetch';


// Init shared
const router = Router();
createConnection().then((connection: Connection) => {
    const transferDao = new TransferDao(connection);

    /******************************************************************************
     *                      Get All Cards - "GET /api/cards/all"
     ******************************************************************************/

    router.get('/all', async (req: Request, res: Response) => {
        checkHeaders(req);
        const { usr, cmp } = req.headers;
        const transfers = await transferDao.getAll();
        return res.status(OK).json({ transfers });
    });

    /******************************************************************************
     *                       Transfer - 'PUT /api/transfer'
     ******************************************************************************/

    router.put('/', async (req: Request, res: Response) => {
        checkHeaders(req);
        const { from, to, amount } = req.body;
        const { usr, cmp } = req.headers;
        if (!from || !to || !amount || amount <= 0) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }

        const response = await (await fetch(config.fixerEndpoint)).json();
        if (response && response.rates) {
            const wallets = await transferDao.transfer(from, to, Number(amount), response.rates);
            return res.status(OK).json({ wallets });
        } else {
            return res.status(GATEWAY_TIMEOUT).json({
                error: ratesMissingError,
            });
        }
    });
});
export default router;
