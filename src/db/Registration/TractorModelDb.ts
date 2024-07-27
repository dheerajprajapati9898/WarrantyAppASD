// import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

// SQLite.enablePromise(true); // Enable promises for SQLite

// const openDatabase = () => {
//   const databaseName = 'TractorModel.db';
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
//       ModelID INTEGER, 
//       MakeID INTEGER,  
//       ModelTacCode INTEGER, 
//       ModelListID INTEGER, 
//       ModelName TEXT, 
//       TacCode INTEGER, 
//       VehSubTypeID INTEGER, 
//       VehTypeID INTEGER, 
//       Wheels TEXT, 
//       ManufacturingYear TEXT, 
//       OperatedBy TEXT, 
//       Amp TEXT, CC TEXT,
//       UnitID INTEGER, 
//       BatteryManufacturer TEXT, 
//       GrossWeight INTEGER, 
//       SeatingCapacity INTEGER, 
//       CarryingCapacity INTEGER, 
//       BodyType TEXT, 
//       IsObsolete BOOLEAN, 
//       IsImported BOOLEAN, 
//       IsBlackListed BOOLEAN, 
//       VehicleSegmentID INTEGER , 
//       CreatedDate TEXT, 
//       CreatedBy TEXT, 
//       UpdatedDate TEXT, 
//       UpdatedBy TEXT, 
//       DeletedDate TEXT, 
//       DeletedBy TEXT, 
//       ModelARC TEXT
//     );
//   `);

//   return db;
// };

// export { setupDatabase };





// import SQLite from 'react-native-sqlite-storage';

// SQLite.DEBUG(true);
// SQLite.enablePromise(true);
// let db;

// const openDB = async () => {
//   try {
//     db = await SQLite.openDatabase({ name: 'TractorModelTable.db', location: 'default' });
//     console.log('Database opened successfully');
//   } catch (error) {
//     console.error('Error opening database:', error);
//   }
// };

// export const setupTractorModelDatabase = async () => {
//   try {
//     if (!db) {
//       await openDB(); // Ensure the database is opened
//     }
//     db.transaction(txn => {
//       txn.executeSql(
//         "SELECT name FROM sqlite_master WHERE type='table' AND name='tractormodel'",
//         [],
//         (tx, res) => {
//           console.log('Table check result:', res.rows.length);
//           if (res.rows.length === 0) {
//             txn.executeSql(
//               'CREATE TABLE IF NOT EXISTS tractormodel (id INTEGER PRIMARY KEY AUTOINCREMENT, ModelID INTEGER, MakeID INTEGER, ModelName TEXT)',
//               [],
//               () => console.log('Table tractormodel created successfully'),
//               error => console.error('Error creating tractormodel table:', error)
//             );
//           }
//         },
//         error => console.error('Error checking/creating table:', error)
//       );
//     });
//   } catch (error) {
//     console.error('Transaction error:', error);
//   }
// };
// export const insertTractorModelItems = async (items) => {
//   if (!db) {
//     await openDB(); // Ensure the database is opened
//   }

//   try {
//     await db.transaction(async tx => {
//       await tx.executeSql(
//         'CREATE TABLE IF NOT EXISTS tractormodel (id INTEGER PRIMARY KEY AUTOINCREMENT, ModelID INTEGER, MakeID INTEGER, ModelName TEXT)',
//         []
//       );
//       items.forEach(item => {
//         tx.executeSql(
//           'INSERT INTO tractormodel (ModelID, MakeID, ModelName) VALUES (?, ?, ?)',
//           [item.ModelID, item.MakeID, item.ModelName],
//           (_, results) => {
//             console.log('Insertion result:', results.rowsAffected);
//             if (results.rowsAffected > 0) {
//               console.log('Inserted successfully');
//             } else {
//               console.log('Failed to insert');
//             }
//           },
//           error => console.error('Error executing SQL:', error)
//         );
//       });
//     });
//   } catch (error) {
//     console.error('Transaction error:', error.message);
//   }
// };
// export const getAllTractorModelItems = async () => {
//   if (!db) {
//     await openDB(); // Ensure the database is opened
//   }

//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT * FROM tractormodel',
//         [],
//         (tx, results) => {
//           const tractorModels = [];
//           for (let i = 0; i < results.rows.length; ++i) {
//             tractorModels.push(results.rows.item(i));
//           }
//           resolve(tractorModels);
//         },
//         error => {
//           console.error('Error fetching tractor models:', error);
//           reject(error);
//         }
//       );
//     });
//   });
// };

import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({ name: 'TractorModelTable.db', location: 'default' });
    console.log('Database opened successfully');
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

// openDB();

export const setupTractorModelDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='tractormodel'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS tractormodel', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS tractormodel (id INTEGER PRIMARY KEY AUTOINCREMENT,   makeID INTEGER,makeName TEXT, modelName TEXT,modelARC TEXT)',
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
export const getAllTractorModelItems = async () => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tractormodel',
        [],
        (tx, results) => {
          const tractormodel = [];
          for (let i = 0; i < results.rows.length; ++i) {
            // console.log("data",tractormodel)
            tractormodel.push(results.rows.item(i));
          }
          resolve(tractormodel);

        },
        (error) => {
          console.error('Error fetching tractormodel:', error);
          reject(error);
        }
      );
    });
  });
}
export const getmodelid = async (model_id) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tractormodel WHERE ',
        [model_id],
        (tx, results) => {
          const tractormodel = [];
          for (let i = 0; i < results.rows.length; ++i) {
            // console.log("data",tractormodel)
            tractormodel.push(results.rows.item(i));
          }
          resolve(tractormodel);

        },
        (error) => {
          console.error('Error fetching tractormodel:', error);
          reject(error);
        }
      );
    });
  });
}
export const getVehicleModelByVehTypeid = async (makeID: number): Promise<Item[]> => {

  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tractormodel WHERE makeID =?', [makeID],
        (tx, results) => {

          const tractormodel = [];
          for (let i = 0; i < results.rows.length; ++i) {
            tractormodel.push(results.rows.item(i));
          }

          resolve(tractormodel);
        },
        (error) => {
          console.error('Error fetching states:', error);
          reject(error);
        }
      );
    });
  });
}
export const insertTractorModelItems = async (items) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  db.transaction(tx => {
    items.forEach(item => {
      tx.executeSql(
        'INSERT INTO tractormodel ( makeID ,makeName, modelName ,modelARC) VALUES (?,?,?,?)',
        [item.makeID, item.makeName, item.modelName],
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
export const clearTractorModelTable = tableName => {
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
// export default { setupTractorModelDatabase, getAllTractorModelItems, insertTractorMakeItems  };
export default { setupTractorModelDatabase, getAllTractorModelItems, insertTractorModelItems, clearTractorModelTable, getVehicleModelByVehTypeid, getmodelid };
