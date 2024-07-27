

import SQLite from 'react-native-sqlite-storage';
import { getAllLoginItems } from './../../db/Login/Login'
// const db = SQLite.openDatabase({ name: 'BrandNasadme.db', location: 'default' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({ name: 'BrandNasadme.db', location: 'default' });
    console.log('Database opened successfully');
  } catch (error) {
    console.error('Error opening database:', error);
  }
};
export const setupBrandNasadmeDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }

    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='brandname'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS brandname', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS brandname (id INTEGER PRIMARY KEY AUTOINCREMENT,brandid INTEGER, brandname TEXT,bandarc TEXT )',
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
  //       `CREATE TABLE IF NOT EXISTS brandname (
  //         id INTEGER PRIMARY KEY AUTOINCREMENT,
  //         BrandID INTEGER, 
  //         BrandName TEXT, 
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
export const getbrandids = async (brand: string) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM brandname WHERE brandname=?',
        [brand],
        (tx, results) => {
          const tractormake = [];
          for (let i = 0; i < results.rows.length; ++i) {
            tractormake.push(results.rows.item(i));
          }
          resolve(tractormake);
        },
        (error) => {
          console.error('Error fetching states:', error);
          reject(error);
        }
      );
    });
  });
}
// Function to fetch all items from the database
export const getAllBrandNasadmeItems = async () => {
  // const userData = await getAllLoginItems()

  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM brandname',
        [],
        (tx, results) => {
          const brandnames = [];
          for (let i = 0; i < results.rows.length; ++i) {
            brandnames.push(results.rows.item(i));
          }
          resolve(brandnames);
        },
        (error) => {
          console.error('Error fetching states:', error);
          reject(error);
        }
      );
    });
  });
};

// Function to insert multiple items into the database
export const insertBrandNasadmeItems = async (items) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  db.transaction(tx => {
    items.forEach(item => {
      tx.executeSql(
        'INSERT INTO brandname (brandid, brandname,bandarc) VALUES (?,?,?)',
        [item.brandid, item.brandname, item.bandarc],
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

  // return new Promise((resolve, reject) => {
  //   db.transaction(tx => {
  //     items.forEach(item => {
  //       tx.executeSql(
  //         `INSERT INTO brandname (
  //            BrandID, 
  //           BrandName, 
  //           CreatedBy, 
  //           CreatedDate, 
  //           ModifiedBy, 
  //           ModifiedDate, 
  //           DeletedBy, 
  //           DeletedDate, 
  //           BandARC
  //         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  //         [
  //           item.BrandID,
  //           item.BrandName,
  //           item.CreatedBy,
  //           item.CreatedDate,
  //           item.ModifiedBy,
  //           item.ModifiedDate,
  //           item.DeletedBy,
  //           item.DeletedDate,
  //           item.BandARC
  //         ],
  //         (_, { insertId }) => {
  //           console.log(`Inserted item ${item.BrandName} successfully with ID ${insertId}`);
  //         },
  //         (_, error) => {
  //           console.error('SQLite insert error:', error);
  //           reject(error);
  //         }
  //       );
  //     });
  //   }, (error) => {
  //     console.error('SQLite transaction error:', error.message);
  //     reject(error);
  //   }, () => {
  //     resolve();
  //   });
  // });
};
export const clearBrandNasadmeTable = tableName => {
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
export default { setupBrandNasadmeDatabase, getAllBrandNasadmeItems, insertBrandNasadmeItems, clearBrandNasadmeTable, getbrandids };
