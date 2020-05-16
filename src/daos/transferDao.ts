import Transfer from '@entities/transfer';
import { Connection, DeleteResult, Repository, QueryRunner } from 'typeorm';
import Wallet from '@entities/wallet';

export interface ITransferDao {
    getOne: (criteria: any) => Promise<Transfer | undefined>;
    getAll: () => Promise<Transfer[]>;
    add: (transfer: Transfer) => Promise<Transfer>;
    update: (transfer: Transfer) => Promise<Transfer>;
    transfer: (from: any, to: any, load: number, rates: any) => Promise<Wallet[]>;
    delete: (id: number) => Promise<DeleteResult>;
}

class TransferDao implements ITransferDao {
    queryRunner: QueryRunner;
    walletRepository: Repository<Wallet>;
    transferRepository: Repository<Transfer>;
    constructor(connection: Connection) {
        this.queryRunner = connection.createQueryRunner();
        this.walletRepository = connection.getRepository(Wallet);
        this.transferRepository = connection.getRepository(Transfer);
    }

    public async getOne(criteria: any): Promise<Transfer | undefined> {
        return await this.transferRepository.findOne(criteria);
    }

    public async getAll(): Promise<Transfer[]> {
        return await this.transferRepository.find();
    }

    public async add(transfer: Transfer): Promise<Transfer> {
        return await this.transferRepository.save(transfer);
    }

    public async update(updatedTransfer: Transfer): Promise<Transfer> {
        let transfer = await this.transferRepository.findOne(updatedTransfer.id);
        if (transfer) {
            this.transferRepository.merge(transfer, updatedTransfer);
        } else {
            transfer = updatedTransfer;
        }
        return await this.transferRepository.save(transfer);
    }

    public async transfer(from: any, to: any, amount: number, rates: any): Promise<Wallet[]> {
        const fromWallet = await this.walletRepository.findOne(from);
        const toWallet = await this.walletRepository.findOne(to);
        let masterWallet;
        if (fromWallet && toWallet) {
            const transfert = new Transfer();
            amount = Number(amount);
            fromWallet.balance = Number(fromWallet.balance);
            toWallet.balance = Number(toWallet.balance);
            transfert.setFromTo(fromWallet, toWallet);
            transfert.amount = amount;
            if (fromWallet.balance > amount) {
                fromWallet.balance -= amount;
                if (fromWallet.currency === toWallet.currency) {
                    toWallet.balance += amount;
                } else {
                    masterWallet = await this.walletRepository.findOne({ isMaster: true });
                    if (masterWallet) {
                        masterWallet.balance = Number(masterWallet.balance);
                        const rate = Number(rates[toWallet.currency]) / Number(rates[fromWallet.currency]);
                        const targetAmount = Number(amount * rate);
                        const fee = targetAmount * 0.029;
                        toWallet.balance += targetAmount;
                        masterWallet.balance += fee;
                    } else {
                        throw new Error("can\'t find master wallet");
                    }
                }
            } else {
                throw new Error("balance is less than amount");
            }

            try {
                await this.queryRunner.startTransaction();
                if (masterWallet) {
                    await this.queryRunner.manager.save(masterWallet);
                }
                await this.queryRunner.manager.save(fromWallet);
                await this.queryRunner.manager.save(toWallet);
                await this.queryRunner.manager.save(transfert)
                await this.queryRunner.commitTransaction();
            } catch (err) {
                await this.queryRunner.rollbackTransaction();
                throw err;
            }
            return [fromWallet, toWallet];
        } else if (!fromWallet) {
            throw new Error('can\'t find from wallet');
        } else {
            throw new Error('can\'t find to wallet');
        }
    }

    public async delete(id: number): Promise<DeleteResult> {
        return await this.transferRepository.delete(id);
    }
}

export default TransferDao;
