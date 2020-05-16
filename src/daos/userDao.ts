import User from '@entities/user';
import { Connection, DeleteResult, Repository } from 'typeorm';

export interface IUserDao {
    getOne: (criteria: any) => Promise<User | undefined>;
    getAll: () => Promise<User[]>;
    add: (user: User) => Promise<User>;
    update: (user: User) => Promise<User>;
    delete: (id: number) => Promise<DeleteResult>;
}

class UserDao implements IUserDao {
    userRepository: Repository<User>;
    constructor(connection: Connection) {
        this.userRepository = connection.getRepository(User);
    }

    public async getOne(criteria: any): Promise<User | undefined> {
        return await this.userRepository.findOne(criteria);
    }

    public async getAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async add(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    public async update(updatedUser: User): Promise<User> {
        let user = await this.userRepository.findOne(updatedUser.id);
        if (user) {
            this.userRepository.merge(user, updatedUser);
        } else {
            user = updatedUser;
        }
        return await this.userRepository.save(user);
    }

    public async delete(id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }
}

export default UserDao;
