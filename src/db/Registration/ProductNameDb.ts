// import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

// SQLite.enablePromise(true); // Enable promises for SQLite

// const openDatabase = () => {
//   const databaseName = 'ProductName.db';
//   const databaseLocation = 'default';

//   return SQLite.openDatabase({
//     name: databaseName,
//     location: databaseLocation,
//   });
// };

// const setupDatabase = async (): Promise<SQLiteDatabase> => {
//   const db = await openDatabase();
//   // Create tables if they don't exist
//   await db.executeSql(`
//     CREATE TABLE IF NOT EXISTS items (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       ProductID INTEGER, 
//       Brand_Id INTEGER, 
//       ProductName TEXT, 
//       Series TEXT, 
//       CreatedBy TEXT, 
//       CreatedDate TEXT, 
//       ModifiedBy TEXT, 
//       ModifiedDate TEXT, 
//       DeletedBy TEXT, 
//       DeletedDate TEXT, 
//       productARC TEXT
//     );
//   `);

//   return db;
// };

// export { setupDatabase };



import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase({ name: 'ProductName.db', location: 'default' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({ name: 'ProductName.db', location: 'default' });
    console.log('Database opened successfully');
  } catch (error) {
    console.error('Error opening database:', error);
  }
};
export const setupProductNameDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='productname'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS productname', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS productname (id INTEGER PRIMARY KEY AUTOINCREMENT, productId INTEGER, productName TEXT,brandId INTEGER,series TEXT)',
              [],
            );
          }
        },
        (error) => {
          console.log('Error checking/creating table:', error);
        },
      );
    });
  } catch (error) {
    console.error('Transaction error:', error);
  }

  // return new Promise((resolve, reject) => {
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       `CREATE TABLE IF NOT EXISTS productname (
  //         id INTEGER PRIMARY KEY AUTOINCREMENT,
  //          ProductID INTEGER,
  //     ProductName TEXT
  //       )`,
  //       [],
  //       () => {
  //         console.log('Table created');
  //         resolve();
  //       },
  //       (_, error) => {
  //         console.error('Error creating table:', error);
  //         reject(error);
  //       }
  //     );
  //   }, (error) => {
  //     console.error('SQLite transaction error:', error);
  //     reject(error);
  //   });
  // });
};

// Function to fetch all items from the database
export const getAllProductNameItems = async () => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM productname',
        [],
        (tx, results) => {
          const states = [];
          for (let i = 0; i < results.rows.length; ++i) {
            states.push(results.rows.item(i));
          }
          resolve(states);
        },
        (error) => {
          console.error('Error fetching states:', error);
          reject(error);
        }
      );
    });
  });
};
export const getProductNameByProductId = async (productId: number): Promise<Item[]> => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM productname WHERE productId =?', [productId],
        (tx, results) => {

          const productname = [];
          for (let i = 0; i < results.rows.length; ++i) {
            productname.push(results.rows.item(i));
          }

          resolve(productname);
        },
        (error) => {
          console.error('Error fetching states:', error);
          reject(error);
        }
      );
    });
  });
}
// Function to insert multiple items into the database
export const insertProductNameItems = async (items) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  db.transaction(tx => {
    items.forEach(item => {
      tx.executeSql(
        'INSERT INTO productname (productId, productName,brandId,series) VALUES (?,?,?,?)',
        [item.productId, item.productName, item.brandId, item.series],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('Inserted successfully');
          } else {
            console.log('Failed to insert');
          }
        },
        (error) => {
          console.log('Error executing SQL:', error);
        }
      );
    });
  }, (transactionError) => {
    console.error('SQLite transaction error:', transactionError.message);
  }, () => {
    console.log('Transaction complete');
  });
};
export const clearProductNameTable = tableName => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(`DELETE FROM ${tableName}`, [], (_, result) => {
        resolve(result);
      }, (_, error) => {
        reject(error);
      });
    });
  });
};
export default { setupProductNameDatabase, getAllProductNameItems, insertProductNameItems, clearProductNameTable, getProductNameByProductId };