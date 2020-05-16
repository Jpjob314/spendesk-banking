import { Currencies } from '@shared/enums';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import Card from './card';
import Company from './company';
import Transfer from './transfer';

@Entity()
class Wallet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "decimal", default: 0 })
    balance: number;

    @Column({
        type: "enum",
        enum: Currencies,
        default: Currencies.EUR
    })
    currency: string;

    @ManyToOne(type => Company, company => company.wallets)
    @JoinColumn({ name: 'companyId' })
    company: Company;

    @Column({ nullable: false })
    companyId: number;

    @OneToMany(type => Card, card => card.wallet)
    cards?: Card[];

    @OneToMany(type => Transfer, transfer => transfer.toWallet)
    incomingTransfers?: Transfer[];

    @OneToMany(type => Transfer, transfer => transfer.fromWallet)
    outcomingTransfers?: Transfer[];

    @Column({ default: "false" })
    isMaster: boolean;

    constructor(args: any = {}) {
        this.balance = args.balance;
        this.currency = args.currency;
        this.company = args.company;
        this.companyId = args.companyId;
        this.isMaster = args.isMaster ? args.isMaster : false;
        this.id = args.id;
    }
}

export default Wallet;
