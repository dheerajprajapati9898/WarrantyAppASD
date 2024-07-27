// import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

// SQLite.enablePromise(true); // Enable promises for SQLite

// const openDatabase = () => {
//   const databaseName = 'TractorMake.db';
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
//       MakeID INTEGER, 
//       MakeTacCode INTEGER, 
//       MakeName TEXT, 
//       MakeDesc TEXT, 
//       CreatedDate TEXT, 
//       CreatedBy TEXT, 
//       UpdatedDate TEXT, 
//       UpdatedBy TEXT, 
//       DeletedDate TEXT, 
//       DeletedBy TEXT, 
//       MakeARC TEXT, 
//       Veh_Type_ID INTEGER
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
    db = await SQLite.openDatabase({ name: 'TractoreMakeTable.db', location: 'default' });
    console.log('Database opened successfully');
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

// openDB();

export const setupTractorMakeDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='tractormake'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS tractormake', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS tractormake (id INTEGER PRIMARY KEY AUTOINCREMENT,Veh_Type_ID INTEGER, MakeID INTEGER, MakeName TEXT,makeARC TEXT)',
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
export const getAllTractorMakeItems =async () => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tractormake',
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
}
export const getmakeids =async (makename:string) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tractormake WHERE MakeName=?',
        [makename],
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
export const getVehicleByVehTypeid = async (Veh_Type_ID: number): Promise<Item[]> => {


  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tractormake WHERE Veh_Type_ID =?', [Veh_Type_ID],
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

export const insertTractorMakeItems = async(items) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
db.transaction(tx => {
    items.forEach(item => {
      tx.executeSql(
        'INSERT INTO tractormake (Veh_Type_ID,MakeID, MakeName,makeARC) VALUES (?,?,?,?)',
        [item.Veh_Type_ID,item.MakeID, item.MakeName,item.makeARC],
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
export const clearTractorMakeTable = tableName => {
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
export default { setupTractorMakeDatabase, getAllTractorMakeItems, insertTractorMakeItems  ,clearTractorMakeTable,getVehicleByVehTypeid,getmakeids};

// import SQLite from 'react-native-sqlite-storage';

// // const db = SQLite.openDatabase({ name: 'TractorMakeTable.db' });
// SQLite.DEBUG(true);
// SQLite.enablePromise(true);
// let db;

// const openDB = async () => {
//   try {
//     db = await SQLite.openDatabase({ name: 'TractoreMakeTable.db', location: 'default' });
//     console.log('Database opened successfully');
//   } catch (error) {
//     console.error('Error opening database:', error);
//   }
// };
// export const setupTractorMakeDatabase = async() => {
//   try {
//     if (!db) {
//       await openDB(); // Ensure the database is opened
//     }
//     db.transaction(txn => {
//       txn.executeSql(
//         "SELECT name FROM sqlite_master WHERE type='table' AND name='tractormake'",
//         [],
//         (tx, res) => {
//           console.log('item:', res.rows.length);
//           if (res.rows.length == 0) {
//             txn.executeSql('DROP TABLE IF EXISTS tractormake', []);
//             txn.executeSql(
//               'CREATE TABLE IF NOT EXISTS tractormake (id INTEGER PRIMARY KEY AUTOINCREMENT, MakeID INTEGER, MakeName TEXT)',
//               [],
//             );
//           }
//         },
//         (error) => {
//           console.log('Error checking/creating table:', error);
//         },
//       );
//     });
//   } catch (error) {
//     console.error('Transaction error:', error);
//   }
//   // db.transaction(txn => {
//   //   txn.executeSql(
//   //     "SELECT name FROM sqlite_master WHERE type='table' AND name='tractormake'",
//   //     [],
//   //     (tx, res) => {
//   //       console.log('item:', res.rows.length);
//   //       if (res.rows.length == 0) {
//   //         txn.executeSql('DROP TABLE IF EXISTS tractormake', []);
//   //         txn.executeSql(
//   //           'CREATE TABLE IF NOT EXISTS tractormake(id INTEGER PRIMARY KEY AUTOINCREMENT , MakeID INTEGER, MakeName TEXT)',
//   //           [],
//   //         );
//   //       }
//   //     },
//   //     (error) => {
//   //       console.log(error);
//   //     },
//   //   );
//   // });
//   // return new Promise((resolve, reject) => {
//   //   db.transaction(tx => {
//   //     tx.executeSql(
//   //       `CREATE TABLE IF NOT EXISTS tractormake(
//   //         id INTEGER PRIMARY KEY AUTOINCREMENT,
//   //         MakeID INTEGER, 
//   //     MakeName TEXT
//   //       )`,
//   //       [],
//   //       () => {
//   //         console.log('Table created');
//   //         resolve();
//   //       },
//   //       (_, error) => {
//   //         console.error('Error creating table:', error);
//   //         reject(error);
//   //       }
//   //     );
//   //   }, (error) => {
//   //     console.error('SQLite transaction error:', error);
//   //     reject(error);
//   //   });
//   // });
// };

// // Function to fetch all items from the database
// export const getAllTractorMakeItems = async() => {
//   if (!db) {
//     await openDB(); // Ensure the database is opened
//   }
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT * FROM tractormake',
//         [],
//         (tx, results) => {
//           const tractormake = [];
//           for (let i = 0; i < results.rows.length; ++i) {
//             tractormake.push(results.rows.item(i));
//           }
//           resolve(tractormake);
//         },
//         (error) => {
//           console.error('Error fetching states:', error);
//           reject(error);
//         }
//       );
//     });
//   });
// };

// // Function to insert multiple items into the database
// export const insertTractorMakeItems =async (items) => {
//   if (!db) {
//     await openDB(); // Ensure the database is opened
//   }
//   db.transaction(tx => {
//     items.forEach(item => {
//       tx.executeSql(
//         'INSERT INTO tractormake (MakeID, MakeName) VALUES (?,?)',
//         [item.MakeID, item.MakeName],
//         (tx, results) => {
//           console.log('Results', results.rowsAffected);
//           if (results.rowsAffected > 0) {
//             console.log('Inserted successfully');
//           } else {
//             console.log('Failed to insert');
//           }
//         },
//         (error) => {
//           console.log('Error executing SQL:', error);
//         }
//       );
//     });
//   }, (transactionError) => {
//     console.error('SQLite transaction error:', transactionError.message);
//   }, () => {
//     console.log('Transaction complete');
//   });
//   // return new Promise((resolve, reject) => {
//   //   db.transaction(tx => {
//   //     items.forEach(item => {
//   //       tx.executeSql(
//   //         `INSERT INTO tractormake (
//   //           MakeID , 
//   //     MakeTacCode , 
//   //     MakeName , 
//   //     MakeDesc , 
//   //     CreatedDate , 
//   //     CreatedBy , 
//   //     UpdatedDate , 
//   //     UpdatedBy , 
//   //     DeletedDate , 
//   //     DeletedBy , 
//   //     MakeARC , 
//   //     Veh_Type_ID 

             
//   //         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//   //         [
//   //           item.MakeID,
//   //           item.MakeTacCode,
//   //           item.MakeName,
//   //           item.MakeDesc,
//   //           item.CreatedDate,
//   //           item.CreatedBy,
//   //           item.UpdatedDate,
//   //           item.UpdatedBy,
//   //           item.DeletedDate,
//   //           item.DeletedBy,
//   //           item.MakeARC,
//   //           item.Veh_Type_ID,
//   //         ],
//   //         (_, { insertId }) => {
//   //           console.log(`Inserted item ${item.BrandName} successfully with ID ${insertId}`);
//   //         },
//   //         (_, error) => {
//   //           console.error('SQLite insert error:', error);
//   //           reject(error);
//   //         }
//   //       );
//   //     });
//   //   }, (error) => {
//   //     console.error('SQLite transaction error:', error.message);
//   //     reject(error);
//   //   }, () => {
//   //     resolve();
//   //   });
//   // });
// };

// export default { setupTractorMakeDatabase, getAllTractorMakeItems, insertTractorMakeItems };
