import { Currencies } from '@shared/enums';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Check, JoinColumn } from 'typeorm';
import Card from './card';
import Wallet from './wallet';

// Transfer should have only one origin 'fromX' and only one destination 'toX' card or wallet
@Check(`('fromCardId' IS NULL AND 'fromWalletId' IS NOT NULL `
    + `OR 'fromCardId' IS NOT NULL AND 'fromWalletId' IS NOT NULL) `
    + `AND ('toCardId' IS NULL OR 'toWalletId' IS NOT NULL `
    + `OR 'toCardId' IS NOT NULL OR 'toWalletId' IS NULL)`)
@Entity()
class Transfer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    at: Date;

    @Column({ type: 'decimal' })
    amount: number;

    @Column({
        type: 'enum',
        enum: Currencies,
        default: Currencies.EUR
    })
    fromCurrency: string;

    @Column({
        type: 'enum',
        enum: Currencies,
        default: Currencies.EUR
    })
    toCurrency: string;

    @Column({ nullable: true })
    fee?: number;

    @ManyToOne(type => Wallet, wallet => wallet.outcomingTransfers, { nullable: true })
    @JoinColumn({ name: 'fromWalletId' })
    fromWallet: Wallet;

    @Column({ nullable: true })
    fromWalletId: number;

    @ManyToOne(type => Wallet, wallet => wallet.incomingTransfers, { nullable: true })
    @JoinColumn({ name: 'toWalletId' })
    toWallet: Wallet;

    @Column({ nullable: true })
    toWalletId: number;

    @ManyToOne(type => Card, card => card.incomingTransfers, { nullable: true })
    @JoinColumn({ name: 'fromCardId' })
    fromCard: Card;

    @Column({ nullable: true })
    fromCardId: number;

    @ManyToOne(type => Card, card => card.outcomingTransfers, { nullable: true })
    @JoinColumn({ name: 'toCardId' })
    toCard: Card;

    @Column({ nullable: true })
    toCardId: number;

    setFrom(item: any) {
        if (item instanceof Wallet) {
            this.fromWalletId = item.id;
            this.fromCurrency = item.currency;
        } else if (item instanceof Card) {
            this.fromCardId = item.id;
            this.fromCurrency = item.currency;
        } else {
            throw new Error('Invalid from type ' + typeof item);
        }
    }

    setTo(item: any) {
        if (item instanceof Wallet) {
            this.toWalletId = item.id;
            this.toCurrency = item.currency;
        } else if (item instanceof Card) {
            this.toCardId = item.id;
            this.toCurrency = item.currency;
        } else {
            throw new Error('Invalid to type ' + typeof item);
        }
    }

    setFromTo(from: any, to: any) {
        this.setFrom(from);
        this.setTo(to);
    }

    constructor(args: any = {}) {
        this.at = args.at;
        this.amount = args.amount;
        this.fromCurrency = args.fromCurrency;
        this.toCurrency = args.toCurrency;
        this.fee = args.fee;
        this.fromWallet = args.fromWallet;
        this.fromWalletId = args.fromWalletId;
        this.toWallet = args.toWallet;
        this.toWalletId = args.toWalletId;
        this.fromCard = args.fromCard;
        this.fromCardId = args.fromCardId;
        this.toCard = args.toCard;
        this.toCardId = args.toCardId;
        this.id = args.id;
    }
}

export default Transfer;
