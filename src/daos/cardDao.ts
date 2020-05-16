import Card from '@entities/card';
import { Connection, DeleteResult, Repository, QueryRunner } from 'typeorm';
import UserDao from './userDao';
import WalletDao from './walletDao';
import Wallet from '@entities/wallet';
import Transfer from '@entities/transfer';

export interface ICardDao {
    getOne: (criteria: any) => Promise<Card | undefined>;
    getAll: (criteria?: any) => Promise<Card[]>;
    add: (card: Card, companyId: number) => Promise<Card>;
    update: (card: Card) => Promise<Card>;
    load: (data: any) => Promise<Card>;
    delete: (id: number) => Promise<DeleteResult>;
}

class CardDao implements ICardDao {
    queryRunner: QueryRunner;
    userDao: UserDao;
    walletDao: WalletDao;
    walletRepository: Repository<Wallet>;
    cardRepository: Repository<Card>;
    constructor(connection: Connection) {
        this.queryRunner = connection.createQueryRunner();
        this.userDao = new UserDao(connection);
        this.walletDao = new WalletDao(connection);
        this.walletRepository = connection.getRepository(Wallet);
        this.cardRepository = connection.getRepository(Card);
    }

    public async getOne(criteria: any): Promise<Card | undefined> {
        return await this.cardRepository.findOne(criteria);
    }

    public async getAll(criteria?: any): Promise<Card[]> {
        return await this.cardRepository.find(criteria);
    }

    public async add(card: Card): Promise<Card> {
        if (!card.walletId) {
            throw new Error('wallet id is mandatory');
        } if (!card.userId) {
            throw new Error('user id is mandatory');
        } else {
            const existingUser = await this.userDao.getOne(card.userId)
            const existingWallet = await this.walletDao.getOne(card.walletId);

            if (!existingWallet || !existingUser) {
                throw new Error('invalid user or wallet id');
            } else if (existingWallet.companyId !== existingUser.companyId) {
                throw new Error('this wallet doesn\'t belong to your company');
            }
        }
        return await this.cardRepository.save(card);
    }

    public async update(updatedCard: Card): Promise<Card> {
        let card = await this.cardRepository.findOne(updatedCard.id);
        if (card) {
            this.cardRepository.merge(card, updatedCard);
        } else {
            card = updatedCard;
        }
        return await this.cardRepository.save(card);
    }

    public async load(data: any): Promise<Card> {
        const card = await this.cardRepository.findOne({ id: data.id, userId: data.userId }, { relations: ['wallet'] });
        if (card) {
            const transfert = new Transfer();
            const wallet = card.wallet;
            card.balance = Number(card.balance);
            wallet.balance = Number(wallet.balance);
            let load = Number(data.load);
            if (load > 0) {
                transfert.setFromTo(wallet, card);
                if (wallet.balance >= load) {
                    wallet.balance -= load;
                    card.balance += load;
                } else {
                    throw new Error("wallet balance is less than load " + load);
                }
            } else {
                load = Math.abs(load);
                transfert.setFromTo(card, wallet);
                if (card.balance >= load) {
                    wallet.balance += load;
                    card.balance -= load;
                } else {
                    throw new Error("card balance is less than load " + load);
                }
            }
            transfert.amount = load;

            try {
                await this.queryRunner.startTransaction();
                await this.queryRunner.manager.save(wallet);
                await this.queryRunner.manager.save(card);
                await this.queryRunner.manager.save(transfert);
                await this.queryRunner.commitTransaction();
            } catch (err) {
                await this.queryRunner.rollbackTransaction();
                throw err;
            }
            return card;
        } else {
            throw new Error('card not found');
        }
    }

    public async block(data: any): Promise<Card> {
        let card = await this.cardRepository.findOne({ id: data.id, userId: data.userId });
        if (card) {
            if (data.isBlocked) {
                if (!card.isBlocked) {
                    card = await this.load({
                        id: data.id,
                        load: -Number(card.balance),
                        userId: data.userId,
                    });
                    card.isBlocked = true;
                } else {
                    throw new Error('card is already blocked');
                }
            } else {
                card.isBlocked = false;
            }
            return await this.cardRepository.save(card);
        } else {
            throw new Error('card not found');
        }
    }

    public async delete(id: number): Promise<DeleteResult> {
        return await this.cardRepository.delete(id);
    }
}

export default CardDao;
