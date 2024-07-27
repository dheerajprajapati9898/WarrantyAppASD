import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({ name: 'SettingsTable.db', location: 'default' });
    console.log('Database opened successfully');
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

// openDB();

export const setupSettingDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='setting'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS setting', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS setting (id INTEGER PRIMARY KEY AUTOINCREMENT ,state_id INTEGER, statename TEXT,quality_compression INTEGER)',
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
export const getSettingItems = async () => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM setting',
        [],
        (tx, results) => {
          const setting = [];
          for (let i = 0; i < results.rows.length; ++i) {
            setting.push(results.rows.item(i));
          }
          console.log("setting", setting);

          resolve(setting);
        },
        (error) => {
          console.error('Error fetching setting:', error);
          reject(error);
        }
      );
    });
  });
};

export const insertSettingItems = async (statename: string, stateid: number, quality_compression: number) => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    await db.transaction(async tx => {
      await tx.executeSql(
        'INSERT INTO setting (state_id, statename, quality_compression) VALUES (?, ?, ?)',
        [stateid, statename, quality_compression],
        (tx, results) => {
          console.log('Insert result:', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('Inserted successfully');
          } else {
            console.log('Failed to insert');
          }
        },
        (error) => {
          console.error('Error executing SQL:', error);
        }
      );
    });
  } catch (error) {
    console.error('SQLite transaction error:', error);
  }
};
export const clearSettingTable = tableName => {
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
export default { setupSettingDatabase, getSettingItems, insertSettingItems, clearSettingTable };
