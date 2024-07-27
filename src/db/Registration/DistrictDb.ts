import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true); // Enable promises for SQLite

const openDatabase = () => {
  const databaseName = 'District.db';
  const databaseLocation = 'default';

  return SQLite.openDatabase({
    name: databaseName,
    location: databaseLocation,
  });
};

const setupDatabase = async (): Promise<SQLiteDatabase> => {
  const db = await openDatabase();
  // Create tables if they don't exist
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      DistrictID INTEGER, DistrictState INTEGER, DistrictCode TEXT, DistrictName TEXT, CreatedDate TEXT, CreatedBy TEXT, UpdatedDate TEXT, UpdatedBy TEXT, DeletedDate TEXT, DeletedBy TEXT, Field1 TEXT, Field2 TEXT, CityDistrictARC INTEGER, EQZone  TEXT
    );
  `);

  return db;
};

export { setupDatabase };
