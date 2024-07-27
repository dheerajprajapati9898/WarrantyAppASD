import SQLite from 'react-native-sqlite-storage';
import { getAllLoginItems } from './../Login/Login'
import AsyncStorage from '@react-native-async-storage/async-storage';
// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
    try {
        db = await SQLite.openDatabase({ name: 'PinTable.db', location: 'default' });
        console.log('Database opened successfully');
    } catch (error) {
        console.error('Error opening database:', error);
    }
};

// openDB();

export const setupPinDatabase = async () => {
    try {
        if (!db) {
            await openDB(); // Ensure the database is opened
        }
        db.transaction(txn => {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='pintable'",
                [],
                (tx, res) => {
                    console.log('item:', res.rows.length);
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS pintable', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS pintable (id INTEGER PRIMARY KEY AUTOINCREMENT, pin TEXT,created_by INTEGER)',
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
export const getAllPinItems = async () => {
    const savedUserId = await AsyncStorage.getItem('userid');
    const userData = await getAllLoginItems()
    console.log("savedUserId", userData);

    if (!db) {
        await openDB(); // Ensure the database is opened
    }
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM pintable ',
                [],
                (tx, results) => {
                    const Pins = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        Pins.push(results.rows.item(i));
                    }
                    resolve(Pins);
                },
                (error) => {
                    console.error('Error fetching Pins:', error);
                    reject(error);
                }
            );
        });
    });
    // return new Promise((resolve, reject) => {
    //   db.transaction(tx => {
    //     tx.executeSql(
    //       'SELECT * FROM Pins',
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

// Function to insert multiple items into the database
// Function to insert multiple items into the database
export const insertPinItems = async (pin: string) => {
    console.log("checking");

    // const userData = await getAllLoginItems()
    const savedUserId = await AsyncStorage.getItem('userid');
    console.log("userData.UserId", savedUserId, pin);
    // return
    if (!db) {
        await openDB(); // Ensure the database is opened
    }
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO pintable (pin,created_by) VALUES (?,?)',
            [pin, savedUserId],
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
}
export const clearPinTable = tableName => {
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
export default { setupPinDatabase, getAllPinItems, insertPinItems, clearPinTable };
