import Company from '@entities/company';
import { Connection, DeleteResult, Repository } from 'typeorm';

export interface ICompanyDao {
    getOne: (criteria: any) => Promise<Company | undefined>;
    getAll: () => Promise<Company[]>;
    add: (company: Company) => Promise<Company>;
    update: (company: Company) => Promise<Company>;
    delete: (id: number) => Promise<DeleteResult>;
}

class CompanyDao implements ICompanyDao {
    companyRepository: Repository<Company>;
    constructor(connection: Connection) {
        this.companyRepository = connection.getRepository(Company);
    }

    public async getOne(criteria: any): Promise<Company | undefined> {
        return await this.companyRepository.findOne(criteria);
    }

    public async getAll(): Promise<Company[]> {
        return await this.companyRepository.find();
    }

    public async add(company: Company): Promise<Company> {
        return await this.companyRepository.save(company);
    }

    public async update(updatedCompany: Company): Promise<Company> {
        let company = await this.companyRepository.findOne(updatedCompany.id);
        if (company) {
            this.companyRepository.merge(company, updatedCompany);
        } else {
            company = updatedCompany;
        }
        return await this.companyRepository.save(company);
    }

    public async delete(id: number): Promise<DeleteResult> {
        return await this.companyRepository.delete(id);
    }
}

export default CompanyDao;
