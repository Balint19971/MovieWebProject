import sql from 'mssql';
/* It configures the pool to connect to a Microsoft SQL Server database */
export const pool = new sql.ConnectionPool({
  user: 'Shortcut',
  password: 'Balint1997',
  database: 'Shortcut',
  server: 'localhost',
  trustServerCertificate: true,
});
/* This function is used to establish a connection to a database */
export async function connectPool(connectionPool) {
  await connectionPool.connect();
}
