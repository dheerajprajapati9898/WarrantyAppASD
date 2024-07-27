
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true); // Enable promises for SQLite

const openDatabase = () => {
  const databaseName = 'Registration.db';
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
    CREATE TABLE IF NOT EXISTS warrantyregistratointable (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      isChecked BOOLEAN,
      isStatus BOOLEAN,
      registrationOption TEXT,
      customerName TEXT,
      mobileNumber TEXT,
      address TEXT,
      state TEXT,
      state_id INTEGER,
      pinCode TEXT,
      pincodeid INTEGER,
      districtid INTEGER, 
      districtname TEXT, 
      cityvillageid INTEGER, 
      cityvillagename TEXT,
      registrationNumber TEXT,
      make TEXT,
      make_id INTEGER,
      model_id INTEGER,
      model TEXT,
      registrationDate TEXT,
      brand TEXT,
      brandid INTEGER,
      productid INTEGER,
      series TEXT,
      productName TEXT,
      tyreSize TEXT,
      tyreQuantity INTEGER,
      tyre1SerialNumber1 TEXT,
      tyre1SerialNumber2 TEXT,
      tyre1SerialNumber3 TEXT,
      serial_1 TEXT,
      tyre1Image TEXT,
      tyre2SerialNumber1 TEXT,
      tyre2SerialNumber2 TEXT,
      tyre2SerialNumber3 TEXT,
      seria2 TEXT,
      tyre2Image TEXT,
      invoiceNumber TEXT,
      invoiceImage TEXT,
      invoiceDate TEXT,
      odoMeterReading TEXT,
      odoMeterImage TEXT,
      oldTyreCompany TEXT,
      oldTyreBrand TEXT,
      oldTyreSize TEXT,
      termsAccepted BOOLEAN,
      created_by INTEGER,
      veh_type_id INTEGER,
      veh_type_name TEXT,
      variantid INTEGER,
      variantname TEXT,
      numberplateimage TEXT
    );
  `);

  return db;
};

export { setupDatabase };