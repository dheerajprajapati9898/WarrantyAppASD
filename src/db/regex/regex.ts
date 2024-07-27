import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
    try {
        db = await SQLite.openDatabase({ name: 'RegexTable.db', location: 'default' });
        console.log('Database opened successfully');
    } catch (error) {
        console.error('Error opening database:', error);
    }
};

// openDB();

export const setupRegexDatabase = async () => {
    try {
        if (!db) {
            await openDB(); // Ensure the database is opened
        }
        db.transaction(txn => {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='regex'",
                [],
                (tx, res) => {
                    console.log('item:', res.rows.length);
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS regex', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS regex (id INTEGER PRIMARY KEY AUTOINCREMENT, AgencyId INTEGER, AgencyListId INTEGER, DefaultValue TEXT, FeatureCode TEXT, FeatureDesc TEXT, FeatureID INTEGER, FeatureShortName TEXT, KeyValue TEXT)',
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
export const getAllRegexItems = async () => {
    if (!db) {
        await openDB(); // Ensure the database is opened
    }
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM regex',
                [],
                (tx, results) => {
                    const regex = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        regex.push(results.rows.item(i));
                    }
                    resolve(regex);
                },
                (error) => {
                    console.error('Error fetching regex:', error);
                    reject(error);
                }
            );
        });
    });
};

// Function to insert multiple items into the database
export const insertRegexItems = async (item) => {
    if (!db) {
        await openDB(); // Ensure the database is opened
    }
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO regex (AgencyId, AgencyListId, DefaultValue, FeatureCode, FeatureDesc, FeatureID, FeatureShortName, KeyValue) VALUES (?,?,?,?,?,?,?,?)',
            [item.AgencyId, item.AgencyListId, item.DefaultValue, item.FeatureCode, item.FeatureDesc, item.FeatureID, item.FeatureShortName, item.KeyValue
            ],
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
export const clearRegexTable = tableName => {
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
export default { setupRegexDatabase, getAllRegexItems, insertRegexItems, clearRegexTable };
