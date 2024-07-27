// import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

// SQLite.enablePromise(true); // Enable promises for SQLite

// const openDatabase = () => {
//   const databaseName = 'TyreSize.db';
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
//       size_Id INTEGER, 
//       size_name TEXT, 
//       productId INTEGER, 
//       createdby TEXT, 
//       datetime TEXT, 
//       tyreARC TEXT
//     );
//   `);

//   return db;
// };

// export { setupDatabase };




import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({ name: 'TyreSizeTable.db', location: 'default' });
    console.log('Database opened successfully');
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

// openDB();

export const setupTyreSizeDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='tyresize'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS tyresize', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS tyresize (id INTEGER PRIMARY KEY AUTOINCREMENT, tyreSizeId INTEGER,  sizeName TEXT,productId INTEGER)',
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
};


// Function to fetch all items from the database
export const getAllTyreSizeItems = async () => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tyresize',
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
export const gettyresize = async (tyresize: string) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tyresize WHERE sizeName=?',
        [tyresize],
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
// Function to insert multiple items into the database
export const insertTyreSizeItems = async (items) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  db.transaction(tx => {
    items.forEach(item => {
      tx.executeSql(
        'INSERT INTO tyresize (tyreSizeId , sizeName,productId ) VALUES (?,?,?)',
        [item.tyreSizeId, item.sizeName, item.productId],
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

// import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase({ name: 'TyreSize.db', location: 'default' });

// export const setupTyreSizeDatabase = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS tyresize (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           size_Id INTEGER, 
//       size_name TEXT, 
//       productId INTEGER, 
//       createdby TEXT, 
//       datetime TEXT, 
//       tyreARC TEXT
//         )`,
//         [],
//         () => {
//           console.log('Table created');
//           resolve();
//         },
//         (_, error) => {
//           console.error('Error creating table:', error);
//           reject(error);
//         }
//       );
//     }, (error) => {
//       console.error('SQLite transaction error:', error);
//       reject(error);
//     });
//   });
// };

// // Function to fetch all items from the database
// export const getAllTyreSizeItems = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT * FROM tyresize',
//         [],
//         (_, { rows }) => {
//           const items = [];
//           for (let i = 0; i < rows.length; i++) {
//             items.push(rows.item(i));
//           }
//           resolve(items);
//         },
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// // Function to insert multiple items into the database
// export const insertTyreSizeItems = (items) => {
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       items.forEach(item => {
//         tx.executeSql(
//           `INSERT INTO tyresize (
//             size_Id , 
//       size_name , 
//       productId , 
//       createdby , 
//       datetime , 
//       tyreARC 
//           ) VALUES (?, ?, ?, ?, ?, ?)`,
//           [
//             item.size_Id,
//             item.size_name,
//             item.productId,
//             item.CreatedBy,
//             item.datetime,
//             item.tyreARC,
//           ],
//           (_, { insertId }) => {
//             console.log(`Inserted item ${item.size_name} successfully with ID ${insertId}`);
//           },
//           (_, error) => {
//             console.error('SQLite insert error:', error);
//             reject(error);
//           }
//         );
//       });
//     }, (error) => {
//       console.error('SQLite transaction error:', error.message);
//       reject(error);
//     }, () => {
//       resolve();
//     });
//   });
// };
export const clearTyreSizeTable = tableName => {
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
export default { setupTyreSizeDatabase, getAllTyreSizeItems, insertTyreSizeItems, clearTyreSizeTable, gettyresize };
