import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
    try {
        db = await SQLite.openDatabase({ name: 'AddImageTable.db', location: 'default' });
        console.log('Database opened successfully');
    } catch (error) {
        console.error('Error opening database:', error);
    }
};

// openDB();

export const setupAddImageDatabase = async () => {
    try {
        if (!db) {
            await openDB(); // Ensure the database is opened
        }
        db.transaction(txn => {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='addimage'",
                [],
                (tx, res) => {
                    console.log('item:', res.rows.length);
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS addimage', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS addimage (id INTEGER PRIMARY KEY AUTOINCREMENT, ref_id INTEGER, addimage TEXT)',
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
export const getAllAddImageItems = async () => {
    if (!db) {
        await openDB(); // Ensure the database is opened
    }
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM addimage',
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
export const insertAddImageItems = async (items) => {
    if (!db) {
        await openDB(); // Ensure the database is opened
    }
    db.transaction(tx => {
        items.forEach(item => {
            tx.executeSql(
                'INSERT INTO addimage (ref_id, addimage) VALUES (?,?)',
                [item.ref_id, item.addimage],
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
}
export const clearAddImageTable = tableName => {
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
export default { setupAddImageDatabase, getAllAddImageItems, insertAddImageItems, clearAddImageTable };
