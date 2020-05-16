import WalletDao from '@daos/walletDao';
import { paramMissingError } from '@shared/constants';
import { checkHeaders } from '@shared/errors';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { Connection, createConnection } from 'typeorm';

// Init shared
const router = Router();
createConnection().then((connection: Connection) => {
    const walletDao = new WalletDao(connection);

    /******************************************************************************
     *                      Get All Wallets - 'GET /api/wallets/all'
     ******************************************************************************/

    router.get('/all', async (req: Request, res: Response) => {
        checkHeaders(req);
        const { usr, cmp } = req.headers;
        const wallets = await walletDao.getAll({ companyId: cmp });
        return res.status(OK).json({ wallets });
    });

    /******************************************************************************
     *                       Add One - 'POST /api/wallets/add'
     ******************************************************************************/

    router.post('/add', async (req: Request, res: Response) => {
        checkHeaders(req);
        const { wallet } = req.body;
        const { usr, cmp } = req.headers;
        if (!wallet) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        } else {
            wallet.companyId = Number(cmp);
        }
        await walletDao.add(wallet);
        return res.status(CREATED).end();
    });
});
export default router;
