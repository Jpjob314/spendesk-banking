import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import Card from './card';
import Company from './company';

@Entity()
class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @OneToMany(type => Card, card => card.user)
    cards?: Card[];

    @ManyToOne(type => Company, company => company.users)
    @JoinColumn({ name: 'companyId' })
    company: Company;

    @Column({ nullable: true })
    companyId: number;

    constructor(args: any = {}) {
        this.name = args.name;
        this.email = args.email;
        this.company = args.company;
        this.companyId = args.companyId;
        this.id = args.id;
    }
}

export default User;
