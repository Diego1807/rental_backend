import { Database } from 'neo4j-query-builder';

export default class db {
    static getInstance() {
        return new Database('bolt://127.0.0.1','neo4j','12345');
    }
}