import { Entity, OneToMany, PrimaryGeneratedColumn, Column } from "typeorm";
import Wallet from './wallet';
import User from './user';

@Entity()
class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Wallet, wallet => wallet.company)
    wallets?: Wallet[];

    @OneToMany(type => User, user => user.company)
    users?: User[];

    constructor(args: any = {}) {
        this.name = args.name;
        this.id = args.id;
    }
}

export default Company;
