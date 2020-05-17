import { Connection, createConnection } from 'typeorm';

export class TestsConnection{
    static connection: Connection;

    public static async getConnection(){
        if(!this.connection){
            this.connection = await createConnection();
        }

        return this.connection;
    }
}
export default TestsConnection;