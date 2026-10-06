import oracledb from 'oracledb';

// Configure oracledb to output plain JavaScript objects instead of arrays from query results
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

interface QueryOptions {
  autoCommit?: boolean;
}

export async function executeQuery(
  sql: string, 
  binds: Record<string, unknown> | unknown[] = {}, 
  options: QueryOptions = {}
) {
  let connection;
  try {
    // Acquire a connection from the default pool using environment variables
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING,
    });

    const result = await connection.execute(sql, binds, {
      autoCommit: options.autoCommit ?? true,
    });

    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}