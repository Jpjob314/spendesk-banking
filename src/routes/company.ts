import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import CompanyDao from '@daos/companyDao';
import { paramMissingError } from '@shared/constants';
import { createConnection, Connection } from "typeorm";

// Init shared
const router = Router();
createConnection().then((connection: Connection) => {
    const companyDao = new CompanyDao(connection);

    /******************************************************************************
     *                      Get All companies - "GET /api/companies/all"
     ******************************************************************************/

    router.get('/all', async (req: Request, res: Response) => {
        const companies = await companyDao.getAll();
        return res.status(OK).json({ companies });
    });


    /******************************************************************************
     *                      Get All companies - "GET /api/companies/all"
     ******************************************************************************/

    router.get('/:id', async (req: Request, res: Response) => {
        const { id } = req.params as ParamsDictionary;
        const companies = await companyDao.getOne({ id });
        return res.status(OK).json({ companies });
    });

    /******************************************************************************
     *                       Add One - "POST /api/companies/add"
     ******************************************************************************/

    router.post('/add', async (req: Request, res: Response) => {
        let { company } = req.body;
        if (!company) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        company = await companyDao.add(company);
        return res.status(CREATED).json({ company });
    });


    /******************************************************************************
     *                       Update - "PUT /api/companies/update"
     ******************************************************************************/

    router.put('/update', async (req: Request, res: Response) => {
        const { company } = req.body;
        if (!company) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        company.id = Number(company.id);
        await companyDao.update(company);
        return res.status(OK).end();
    });


    /******************************************************************************
     *                    Delete - "DELETE /api/companies/delete/:id"
     ******************************************************************************/

    router.delete('/delete/:id', async (req: Request, res: Response) => {
        const { id } = req.params as ParamsDictionary;
        await companyDao.delete(Number(id));
        return res.status(OK).end();
    });
});
export default router;
