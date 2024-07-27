// import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase({ name: 'OldTyreBrandName.db', location: 'default' });

// export const setupOldTyreBrandNameDatabase = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS oldtyrebrandname (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//         brand_pattern_Id INTEGER, 
//         competitor_tyre_company_id INTEGER,  
//         brand_pattern TEXT, 
//         is_active BOOLEAN, 
//         createdby TEXT, 
//         created_datetime TEXT, 
//         updatedby TEXT, 
//         updated_datetime TEXT

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
// export const getAllOldTyreBrandNameItems = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT * FROM oldtyrebrandname',
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
// export const insertOldTyreBrandNameItems = (items) => {
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       items.forEach(item => {
//         tx.executeSql(
//           `INSERT INTO oldtyrebrandname (
//             brand_pattern_Id , 
//         competitor_tyre_company_id ,  
//         brand_pattern , 
//         is_active , 
//         createdby , 
//         created_datetime , 
//         updatedby , 
//         updated_datetime 
//           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//           [
//             item.brand_pattern_Id,
// item.competitor_tyre_company_id,
// item.brand_pattern,
// item.is_active,
// item.createdby,
// item.created_datetime,
// item.updatedby,
// item.updated_datetime,
//           ],
//           (_, { insertId }) => {
//             console.log(`Inserted item ${item.BrandName} successfully with ID ${insertId}`);
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

  



import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({ name: 'OldTyreBrandNameTable.db', location: 'default' });
    console.log('Database opened successfully');
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

export const setupOldTyreBrandNameDatabase = async () => {
  try {
    await openDB(); // Ensure the database is opened
    // Create tables if they do not exist
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='oldtyrebrandname'",
        [],
        (tx, res) => {
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS oldtyrebrandname', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS oldtyrebrandname (id INTEGER PRIMARY KEY AUTOINCREMENT, brandpatternId INTEGER, competitortyrecompanyid INTEGER,brandpattern TEXT)',
              [],
              () => console.log('Table oldtyrebrandname created successfully'),
              error => console.error('Error creating oldtyrebrandname:', error)
            );
          }
        }
      );
    });
  } catch (error) {
    console.error('Transaction error:', error);
  }
};
export const insertOldTyreBrandNameItems = async (items) => {
  try {
    await openDB(); // Ensure the database is opened
    await setupOldTyreBrandNameDatabase(); // Ensure the table is created

    db.transaction(tx => {
      items.forEach(item => {
        tx.executeSql(
          'INSERT INTO oldtyrebrandname (brandpatternId,competitortyrecompanyid ,brandpattern) VALUES (?, ?,?)',
          [item.brandpatternId,item.competitortyrecompanyid, item.brandpattern],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('Inserted successfully');
            } else {
              console.log('Failed to insert');
            }
          },
          error => console.log('Error executing SQL:', error)
        );
      });
    }, (transactionError) => {
      console.error('SQLite transaction error:', transactionError.message);
    }, () => {
      console.log('Transaction complete');
    });
  } catch (error) {
    console.error('Error in insertPinCodeItems:', error);
  }
};

export const getAllOldTyreBrandNameItems = async () => {
  try {
    await openDB(); // Ensure the database is opened

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM oldtyrebrandname',
          [],
          (tx, results) => {
            const oldtyrebrandname = [];
            for (let i = 0; i < results.rows.length; ++i) {
              oldtyrebrandname.push(results.rows.item(i));
            }
            resolve(oldtyrebrandname);
          },
          error => {
            console.error('Error fetching pincodes:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Error in getAllPinCodeItems:', error);
  }
};
export const clearOldTyreBrandNameTable = tableName => {
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
export default { setupOldTyreBrandNameDatabase, getAllOldTyreBrandNameItems, insertOldTyreBrandNameItems,clearOldTyreBrandNameTable };