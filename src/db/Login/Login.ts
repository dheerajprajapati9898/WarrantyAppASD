
import { setUserName, getUserName, setUserId, getUserId } from "./../../components/SharedPreference"
import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({ name: 'LoginTable.db', location: 'default' });
    console.log('Database opened successfully');
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

// openDB();
export const setupLoginDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='login'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS login', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS login (id INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, ProfileURL TEXT,AgencyUrl TEXT,Password TEXT ,StateName TEXT,Pin_Code INTEGER,CurrentDate INTEGER,Name TEXT,MobileNo INTEGER,UserId INTEGER,RoleName TEXT,AgencyId INTEGER,AgencyName TEXT,IsLockedOut BOOLEAN,SessionID TEXT,Address TEXT,EmailId TEXT,mpin TEXT)',
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
export const getAllLoginItems = async () => {
  const savedUserId = await AsyncStorage.getItem('userid');
  console.log("savedUserId", savedUserId);

  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM login WHERE UserId=?',
        [savedUserId],
        (tx, results) => {

          const login = [];
          for (let i = 0; i < results.rows.length; ++i) {
            login.push(results.rows.item(i));
          }
          console.log("success", results);
          console.log("success", login);

          resolve(login[0]);
        },
        (error) => {
          console.error('Error fetching states:', error);
          reject(error);
        }
      );
    });
  });
};
// Function to insert multiple items into the database
export const insertLoginItems = async (item, userid: number) => {
  // console.log(item);
  // return
  // const savedUserId = await AsyncStorage.getItem('userid');
  try {
    const result = await db.executeSql(
      'INSERT INTO login (Username , ProfileURL ,AgencyUrl,Password ,StateName,Pin_Code,CurrentDate,Name,MobileNo,UserId,RoleName ,AgencyId ,AgencyName ,IsLockedOut ,SessionID,Address,EmailId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [item.Username, item.ProfileURL, item.AgencyUrl, item.Password, item.StateName, item.Pin_Code, item.CurrentDate, item.Name, item.MobileNo, userid, item.RoleName, item.AgencyId, item.AgencyName, item.IsLockedOut, item.SessionID, item.Address, item.EmailId]
    );

    if (result && result.length > 0) {
      return result[0].insertId;
    } else {
      throw new Error('Failed to insert item');
    }
  } catch (error) {
    console.error('Error inserting item:', error);
    throw error;
  }
};
export const updatelogintable = async (item, UserId) => {
  try {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO login (Username, ProfileURL, AgencyUrl, Password, StateName, Pin_Code, CurrentDate, Name, MobileNo, UserId, RoleName, AgencyId, AgencyName, IsLockedOut, SessionID, Address, EmailId  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          item.Username,
          item.ProfileURL,
          item.AgencyUrl,
          item.Password,
          item.StateName,
          item.Pin_Code,
          item.CurrentDate,
          item.Name,
          item.MobileNo,
          UserId,
          item.RoleName,
          item.AgencyId,
          item.AgencyName,
          item.IsLockedOut,
          item.SessionID,
          item.Address,
          item.EmailId,
        ],
      );
    });

  } catch (error) {
    console.error("updatelogintable", error);
  }

};
export const loginInsertChecked = async (item, UserId) => {
  // console.log(item);
  // return

  try {
    const tx = await db.transaction(async (tx) => {
      // Check if record with UserId exists
      new Promise(async (resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM login WHERE UserId=?',
            [UserId],
            async (tx, results) => {

              const len = results.rows.length;
              console.log("len", len);
              if (len === 0) {

                // Insert record if UserId doesn't exist
                const insertResult = await new Promise((resolve, reject) => {
                  tx.executeSql(
                    'INSERT INTO login (Username, ProfileURL, AgencyUrl, Password, StateName, Pin_Code, CurrentDate, Name, MobileNo, UserId, RoleName, AgencyId, AgencyName, IsLockedOut, SessionID, Address, EmailId  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                      item.Username,
                      item.ProfileURL,
                      item.AgencyUrl,
                      item.Password,
                      item.StateName,
                      item.Pin_Code,
                      item.CurrentDate,
                      item.Name,
                      item.MobileNo,
                      UserId,
                      item.RoleName,
                      item.AgencyId,
                      item.AgencyName,
                      item.IsLockedOut,
                      item.SessionID,
                      item.Address,
                      item.EmailId,
                    ],
                    (_, results) => resolve(results.insertId),
                    (error) => reject(error)
                  );
                });
                console.log("insertResult", results);

                if (insertResult) {
                  console.log('insertResult successfully:');
                  return insertResult;
                } else {
                  throw new Error('Failed to insert item');
                }
              } else {
                console.log('insertResult available:');
                // Record with UserId already exists
                return null // Return existing record ID or relevant identifier
              }
            },
            (error) => {
              console.error('Error fetching states:', error);
              reject(error);
            }
          );
        });
      });



    });


  } catch (error) {
    console.error('Error executing transaction:', error);
  }

};
export const updateLoginItem = async (UserId: number, mpin: number) => {
  // console.log(apiname, status);

  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  db.transaction(tx => {
    tx.executeSql(

      'UPDATE login SET  mpin =?  WHERE  UserId=?',
      [
        mpin, UserId
      ]
    )
  })
};
// export const insertLoginItems = async(items) => {
//   if (!db) {
//     await openDB(); // Ensure the database is opened
//   }
// db.transaction(tx => {
//     items.forEach(item => {
//       tx.executeSql(
//         'INSERT INTO login (username, password) VALUES (?,?)',
//         [item.username, item.password],
//         (tx, results) => {
//           console.log('Results', results.rowsAffected);
//           if (results.rowsAffected > 0) {
//             console.log('Inserted successfully');
//           } else {
//             console.log('Failed to insert');
//           }
//         },
//         (error) => {
//           console.log('Error executing SQL:', error);
//         }
//       );
//     });
//   }, (transactionError) => {
//     console.error('SQLite transaction error:', transactionError.message);
//   }, () => {
//     console.log('Transaction complete');
//   });
// };
export const clearLoginTable = tableName => {
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
export default { setupLoginDatabase, getAllLoginItems, insertLoginItems, loginInsertChecked, clearLoginTable, updateLoginItem, updatelogintable };
