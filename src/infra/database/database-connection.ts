import pgp, { IDatabase } from "pg-promise";

export default interface DatabaseConnection {
  query(statement: string, params?: any): Promise<any>;
  close(): Promise<void>;
}

export class PgPromiseAdapter implements DatabaseConnection {
  connection: IDatabase<{}>;
  private static instance: PgPromiseAdapter;

  private constructor() {
    this.connection = pgp()(
      `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`
    );
  }

  static getInstance(): PgPromiseAdapter {
    if (!PgPromiseAdapter.instance) {
      PgPromiseAdapter.instance = new PgPromiseAdapter();
    }
    return PgPromiseAdapter.instance;
  }

  query(statement: string, params: any): Promise<any> {
    return this.connection?.query(statement, params);
  }

  async close(): Promise<void> {
    await this.connection?.$pool.end();
  }
}
