import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({ name: 'PinCodeTable.db', location: 'default' });
    console.log('Database opened successfully');
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

export const setupPinCodeDatabase = async () => {
  try {
    await openDB(); // Ensure the database is opened
    // Create tables if they do not exist
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='pincodetable'",
        [],
        (tx, res) => {
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS pincodetable', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS pincodetable (id INTEGER PRIMARY KEY AUTOINCREMENT, districtid INTEGER, districtname TEXT, isActive TEXT, cityvillageid INTEGER, cityvillagename TEXT, pincodeid INTEGER, areapincode INTEGER)',
              [],
              () => console.log('Table pincodetable created successfully'),
              error => console.error('Error creating pincodetable:', error)
            );
          }
        }
      );
    });
  } catch (error) {
    console.error('Transaction error:', error);
  }
};

export const insertPinCodeItems = async (items) => {
  // console.log(items);
  // return
  try {
    await openDB(); // Ensure the database is opened
    await setupPinCodeDatabase(); // Ensure the table is created

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Items must be a non-empty array');
    }

    db.transaction(tx => {
      items.forEach(item => {
        tx.executeSql(
          'INSERT INTO pincodetable (districtid, districtname, isActive, cityvillageid, cityvillagename, pincodeid, areapincode) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [item.districtid, item.districtname, item.isActive, item.cityvillageid, item.cityvillagename, item.pincodeid, item.areapincode],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('Inserted successfully');
            } else {
              console.log('Failed to insert');
            }
          },
          (tx, error) => {
            console.log('Error executing SQL:', error);
          }
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

export const getAllPinCodeItems = async () => {
  try {
    await openDB(); // Ensure the database is opened

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT DISTINCT areapincode FROM pincodetable;',
          [],
          (tx, results) => {
            const pincodes = [];
            for (let i = 0; i < results.rows.length; ++i) {
              pincodes.push(results.rows.item(i));
            }
            resolve(pincodes);
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

export const clearPinCodeTable = tableName => {
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

export default { setupPinCodeDatabase, getAllPinCodeItems, insertPinCodeItems, clearPinCodeTable };
