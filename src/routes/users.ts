import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import UserDao from '@daos/userDao';
import { paramMissingError } from '@shared/constants';
import { createConnection, Connection } from "typeorm";

// Init shared
const router = Router();
createConnection().then((connection: Connection) => {
    const userDao = new UserDao(connection);


    /******************************************************************************
     *                      Get All Users - "GET /api/users/all"
     ******************************************************************************/

    router.get('/all', async (req: Request, res: Response) => {
        const users = await userDao.getAll();
        return res.status(OK).json({ users });
    });


    /******************************************************************************
     *                      Get All Users - "GET /api/users/all"
     ******************************************************************************/

    router.get('/:id', async (req: Request, res: Response) => {
        const { id } = req.params as ParamsDictionary;
        const users = await userDao.getOne({ id });
        return res.status(OK).json({ users });
    });

    /******************************************************************************
     *                       Add One - "POST /api/users/add"
     ******************************************************************************/

    router.post('/add', async (req: Request, res: Response) => {
        let { user } = req.body;
        if (!user) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        user = await userDao.add(user);
        return res.status(CREATED).json({ user });
    });


    /******************************************************************************
     *                       Update - "PUT /api/users/update"
     ******************************************************************************/

    router.put('/update', async (req: Request, res: Response) => {
        const { user } = req.body;
        if (!user) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        await userDao.update(user);
        return res.status(OK).end();
    });


    /******************************************************************************
     *                    Delete - "DELETE /api/users/delete/:id"
     ******************************************************************************/

    router.delete('/delete/:id', async (req: Request, res: Response) => {
        const { id } = req.params as ParamsDictionary;
        await userDao.delete(Number(id));
        return res.status(OK).end();
    });
});
export default router;
