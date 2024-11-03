import DatabaseConnection, {
  PgPromiseAdapter,
} from "src/infra/database/database-connection";

let connection: DatabaseConnection;
beforeAll(async () => {
  if (process.env.DIALECT === "postgres" || !process.env.DIALECT)
    connection = PgPromiseAdapter.getInstance();
});

afterAll(async () => {
  await connection.close();
});
