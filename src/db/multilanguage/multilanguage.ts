import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
    try {
        db = await SQLite.openDatabase({ name: 'MultiLanguageTable.db', location: 'default' });
        console.log('Database opened successfully');
    } catch (error) {
        console.error('Error opening database:', error);
    }
};

// openDB();

export const setupMultiLanguageDatabase = async () => {
    try {
        if (!db) {
            await openDB(); // Ensure the database is opened
        }
        db.transaction(txn => {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='multilaguage'",
                [],
                (tx, res) => {
                    console.log('item:', res.rows.length);
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS multilaguage', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS multilaguage (id INTEGER PRIMARY KEY AUTOINCREMENT, languagejson TEXT ,value TEXT )',
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

export const getAllMultiLanguageItems = async () => {
    if (!db) {
        await openDB(); // Ensure the database is opened
    }
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM multilaguage',
                [],
                (tx, results) => {

                    resolve(results.rows.item(0));
                },
                (error) => {
                    console.error('Error fetching multilaguage:', error);
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

// Function to insert multiple items into the database
// Function to insert multiple items into the database
export const insertMultiLanguageItems = async (json: string, value: string) => {
    console.log("json", json, value);

    if (!db) {
        await openDB(); // Ensure the database is opened
    }
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO multilaguage (languagejson ,value) VALUES(?,?)',
            [json, value],
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
    }, (transactionError) => {
        console.error('SQLite transaction error:', transactionError.message);
    }, () => {
        console.log('Transaction complete');
    });
}
export const clearMultiLanguageTable = tableName => {
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
export default { setupMultiLanguageDatabase, getAllMultiLanguageItems, insertMultiLanguageItems, clearMultiLanguageTable };
