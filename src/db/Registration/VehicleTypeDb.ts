

import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({ name: 'VehicleType.db', location: 'default' });
    console.log('Database opened successfully');
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

// openDB();

export const setupVehicleTypeDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='vehicletype'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS vehicletype', []);
            txn.executeSql(
              ' CREATE TABLE IF NOT EXISTS vehicletype (id INTEGER PRIMARY KEY AUTOINCREMENT,Veh_Type_ID INTEGER, Veh_Type_Name TEXT)',
              [],
            );

          }
          console.log("Success setup vehicletype");
        },
        (error) => {
          console.log('Error checking/creating table:', error);
          console.log("faild setup vehicletype");
        },
      );
    });
  } catch (error) {
    console.error('Transaction error:', error);
    console.log("faild setup vehicletype");
  }
};


// Function to fetch all items from the database
export const getAllVehicleTypeItems = async () => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM vehicletype',
        [],
        (tx, results) => {
          const vehicletype = [];
          for (let i = 0; i < results.rows.length; ++i) {
            vehicletype.push(results.rows.item(i));
          }
          console.log("vehicletype", vehicletype.length);

          resolve(vehicletype);
        },
        (error) => {
          console.error('Error fetching states:', error);
          reject(error);
        }
      );
    });
  });
};
export const getvehtype = async (vehtype: string) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM vehicletype WHERE Veh_Type_Name=?',
        [vehtype],
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
// Function to insert multiple items into the database
export const insertVehicleTypeItems = async (items) => {

  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  db.transaction(tx => {
    items.forEach(item => {
      console.log("veh_typename", item.veh_type_name, "type_id", item.veh_type_id);
      tx.executeSql(
        'INSERT INTO vehicletype (Veh_Type_ID, Veh_Type_Name) VALUES (?,?)',
        [item.veh_type_id, item.veh_type_name],
        (tx, results) => {
          console.log("results", results);

          console.log('Results vehicletype', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('Inserted vehicletype successfully');
          } else {
            console.log('Failed to insert vehicletype');
          }
        },
        (error) => {
          console.log('Error executing vehicletype SQL:', error);
        }
      );
    });
  }, (transactionError) => {
    console.error('SQLite transaction error:', transactionError.message);
  }, () => {
    console.log('Transaction complete');
  });
}
export const clearVehicleTypeTable = () => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction(tx => {
        tx.executeSql(`DELETE FROM vehicletype`, [], (_, result) => {
          resolve(result);
        }, (_, error) => {
          reject(error);
        });
      });
    }
    catch (error) {
      console.log('deleting table failed');
      console.log('error', error);


    }
  });
};
export default { setupVehicleTypeDatabase, getAllVehicleTypeItems, insertVehicleTypeItems, clearVehicleTypeTable, getvehtype };
