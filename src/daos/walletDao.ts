import Wallet from '@entities/wallet';
import { Connection, DeleteResult, Repository } from 'typeorm';

export interface IWalletDao {
    getOne: (criteria: any) => Promise<Wallet | undefined>;
    getAll: (criteria?: any) => Promise<Wallet[]>;
    add: (wallet: Wallet) => Promise<Wallet>;
    update: (wallet: Wallet) => Promise<Wallet>;
    delete: (id: number) => Promise<DeleteResult>;
}

class WalletDao implements IWalletDao {
    walletRepository: Repository<Wallet>;
    constructor(connection: Connection) {
        this.walletRepository = connection.getRepository(Wallet);
    }

    public async getOne(criteria: any): Promise<Wallet | undefined> {
        return await this.walletRepository.findOne(criteria);
    }

    public async getAll(criteria?: any): Promise<Wallet[]> {
        return await this.walletRepository.find(criteria);
    }

    public async add(wallet: Wallet): Promise<Wallet> {
        return await this.walletRepository.save(wallet);
    }

    public async update(updatedWallet: Wallet): Promise<Wallet> {
        let wallet = await this.walletRepository.findOne(updatedWallet.id);
        if (wallet) {
            this.walletRepository.merge(wallet, updatedWallet);
        } else {
            wallet = updatedWallet;
        }
        return await this.walletRepository.save(wallet);
    }

    public async delete(id: number): Promise<DeleteResult> {
        return await this.walletRepository.delete(id);
    }
}

export default WalletDao;
