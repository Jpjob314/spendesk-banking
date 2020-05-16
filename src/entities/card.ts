import { Currencies } from '@shared/enums';
import { getRandomFixedNumbers, getRandomInt } from '@shared/functions';
import moment from 'moment';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import Transfer from './transfer';
import User from './user';
import Wallet from './wallet';

@Entity()
class Card {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Wallet, wallet => wallet.cards)
    @JoinColumn({ name: 'walletId' })
    wallet: Wallet;

    @Column({ nullable: false })
    walletId: number;

    @Column({
        type: "enum",
        enum: Currencies,
        default: Currencies.EUR
    })
    currency: string;

    @Column({ type: "decimal", default: '0' })
    balance: number;

    @Column()
    nb: string;

    @Column()
    ccv: number;

    @Column()
    expire: Date;

    @ManyToOne(type => User, user => user.cards)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ nullable: false })
    userId: number;

    @OneToMany(type => Transfer, transfer => transfer.toCard)
    incomingTransfers?: Transfer[];

    @OneToMany(type => Transfer, transfer => transfer.fromCard)
    outcomingTransfers?: Transfer[];

    @Column({ default: false})
    isBlocked: boolean;

    constructor(args: any = {}) {
        this.balance = args.balance;
        this.currency = args.currency;
        this.nb = args.nb ? args.nb : getRandomFixedNumbers(16);
        this.ccv = args.ccv ? args.ccv : getRandomInt();
        this.expire = args.expire ? args.expire : moment().add(1, 'month');
        this.user = args.user;
        this.userId = args.userId;
        this.isBlocked = args.isBlocked;
        this.wallet = args.wallet;
        this.walletId = args.walletId;
        this.id = args.id;
    }
}

export default Card;
