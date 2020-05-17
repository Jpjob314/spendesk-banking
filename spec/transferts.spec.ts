import TransferDao from '@daos/transferDao';
import Wallet from '@entities/wallet';
import { paramMissingError } from '@shared/constants';
import { pErr } from '@shared/functions';
import { BAD_REQUEST, OK } from 'http-status-codes';
import app from 'src/server';
import supertest, { Response, SuperTest, Test } from 'supertest';
import TestsConnection from './connection';


describe('Transfers Routes', () => {
    const transfersPath = '/api/transfers';
    const putTransferPath = `${transfersPath}/`;

    let agent: SuperTest<Test>;
    let transferDao: TransferDao;

    beforeAll(async (done) => {
        agent = supertest.agent(app);
        if (!transferDao) {
            transferDao = new TransferDao(await TestsConnection.getConnection());
        }
        done();
    });

    describe(`'PUT:${putTransferPath}'`, () => {

        const callApi = (reqBody: object) => {
            return agent.put(putTransferPath)
                .set('Content-Type', 'application/json')
                .set('usr', '7')
                .set('cmp', '1')
                .type('form').send(reqBody);
        };

        const transferData = {
            'from': 12,
            'to': 15,
            'amount': 15.5
        };

        const transferResult = [
            new Wallet({
                'id': 12
            }), new Wallet({
                'id': 15
            })
        ];

        it(`should return a status code of '${OK}' if the request was successful.`, (done) => {

            spyOn(TransferDao.prototype, 'transfer').and.returnValue(Promise.resolve(transferResult));

            callApi(transferData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message of '${paramMissingError}' and a
            status code of '${BAD_REQUEST}' if the user param was missing.`, (done) => {

            callApi({})
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(paramMissingError);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of '${BAD_REQUEST}'
            if the request was unsuccessful.`, (done) => {

            const updateErrMsg = 'Could not update user.';
            spyOn(TransferDao.prototype, 'transfer').and.throwError(updateErrMsg);

            callApi(transferData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(updateErrMsg);
                    done();
                });
        });
    });


});
