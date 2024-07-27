

import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
    try {
        db = await SQLite.openDatabase({ name: 'VehicleVariant.db', location: 'default' });
        console.log('Database opened successfully');
    } catch (error) {
        console.error('Error opening database:', error);
    }
};

// openDB();

export const setupVehicleVariantDatabase = async () => {
    try {
        if (!db) {
            await openDB(); // Ensure the database is opened
        }
        db.transaction(txn => {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='vehiclevariant'",
                [],
                (tx, res) => {
                    console.log('item:', res.rows.length);
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS vehiclevariant', []);
                        txn.executeSql(
                            ' CREATE TABLE IF NOT EXISTS vehiclevariant (id INTEGER PRIMARY KEY AUTOINCREMENT,makeid INTEGER, makename TEXT,variantid INTEGER, variantname TEXT)',
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
export const getAllVehicleVariantItems = async () => {
    if (!db) {
        await openDB(); // Ensure the database is opened
    }
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM vehiclevariant',
                [],
                (tx, results) => {
                    const vehiclevariant = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        vehiclevariant.push(results.rows.item(i));
                    }
                    resolve(vehiclevariant);
                },
                (error) => {
                    console.error('Error fetching states:', error);
                    reject(error);
                }
            );
        });
    });
    // return new Promise((resolve, reject) => {
    //   db.transaction(tx => {
    //     tx.executeSql(
    //       'SELECT * FROM states',
    //       [],
    //       (_, { rows }) => {
    //         const items = [];
    //         for (let i = 0; i < rows.length; i++) {
    //           items.push(rows.item(i));
    //         }
    //         resolve(items);
    //       },
    //       (_, error) => reject(error),
    //     );
    //   });
    // });
};
export const getVariantByMakeID = async (MakeID: number): Promise<Item[]> => {


    if (!db) {
        await openDB(); // Ensure the database is opened
    }
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM vehiclevariant WHERE makeid =?', [MakeID],
                (tx, results) => {

                    const vehiclevariant = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        vehiclevariant.push(results.rows.item(i));
                    }

                    resolve(vehiclevariant);
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
export const insertVehicleVariantItems = async (items) => {
    if (!db) {
        await openDB(); // Ensure the database is opened
    }
    db.transaction(tx => {
        items.forEach(item => {
            tx.executeSql(
                'INSERT INTO vehiclevariant (makeid , makename ,variantid , variantname ) VALUES (?,?,?,?)',
                [item.makeid, item.makename, item.variantid, item.variantname],
                (tx, results) => {
                    console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        console.log('Inserted vehiclevariant successfully');
                    } else {
                        console.log('Failed to insert vehiclevariant');
                    }
                },
                (error) => {
                    console.log('Error executing vehiclevariant SQL:', error);
                }
            );
        });
    }, (transactionError) => {
        console.error('SQLite transaction error:', transactionError.message);
    }, () => {
        console.log('Transaction complete');
    });
}
export const clearVehicleVariantTable = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(`DELETE FROM vehiclevariant`, [], (_, result) => {
                resolve(result);
            }, (_, error) => {
                reject(error);
            });
        });
    });
};
export default { setupVehicleVariantDatabase, getAllVehicleVariantItems, insertVehicleVariantItems, clearVehicleVariantTable, getVariantByMakeID };
