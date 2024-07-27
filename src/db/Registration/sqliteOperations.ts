
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { getAllLoginItems } from './../../db/Login/Login'
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface Item {
  id?: number;
  // name: string;
  // description: string;
  isChecked: boolean,
  isStatus: boolean,
  registrationOption: string,
  customerName: string,
  mobileNumber: number,
  address: string,
  state: string,
  state_id: number,
  pinCode: number,
  registrationNumber: string,
  make: string,
  model_id: string,
  model: string,
  registrationDate: string,
  brand: string,
  brandid: number,
  productid: number,
  series: string,
  productName: string,
  tyreSize: number,
  tyreQuantity: number,
  tyre1SerialNumber1: string,
  tyre1SerialNumber2: string,
  tyre1SerialNumber3: string,
  serial_1: string,
  tyre1Image: string,
  tyre2SerialNumber1: string,
  tyre2SerialNumber2: string,
  tyre2SerialNumber3: string,
  serial_2: string,
  tyre2Image: string,
  invoiceNumber: string,
  invoiceImage: string,
  invoiceDate: number,
  odoMeterReading: string,
  odoMeterImage: string,
  oldTyreCompany: string,
  oldTyreBrand: string,
  oldTyreSize: string,
  termsAccepted: boolean
  created_by: number,
  numberplateimage: string
}

const executeSql = async (
  db: SQLiteDatabase,
  sqlStatement: string,
  params: any[] = []
): Promise<{ rows: { raw: () => any[] } }> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sqlStatement,
        params,
        (tx, results) => {
          resolve(results);
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};

const insertItem = async (db: SQLiteDatabase, item: Item, state_id: number, districtid: number, districtname: string, cityvillageid: number, cityvillagename: string, pincodeid: number, make_id: number, brandid: number,
  productid: number,
  series: string, veh_type_id: number, veh_type_name: string, variantid: number, variantname: string, numberplateimage: string, status: boolean): Promise<number> => {
  const userData = await getAllLoginItems()
  console.log("item.state_id", userData.UserId);

  // return
  try {
    const result = await db.executeSql(
      'INSERT INTO warrantyregistratointable (registrationOption,isChecked,isStatus,customerName, mobileNumber, address, state,state_id, pinCode,districtid, districtname, cityvillageid, cityvillagename, pincodeid, registrationNumber,registrationDate, make,make_id, model, brand,brandid, productid,series, productName, tyreSize, tyreQuantity,tyre1SerialNumber1,tyre1SerialNumber2,tyre1SerialNumber3, tyre1Image, tyre2SerialNumber1,tyre2SerialNumber2,tyre2SerialNumber3,tyre2Image, invoiceNumber, invoiceImage, invoiceDate, odoMeterReading, odoMeterImage, oldTyreCompany, oldTyreBrand, oldTyreSize, termsAccepted,created_by,veh_type_id ,veh_type_name ,variantid ,variantname,numberplateimage ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        item.registrationOption,
        item.isChecked,
        status,
        item.customerName,
        item.mobileNumber,
        item.address,
        item.state,
        state_id,
        item.pinCode,
        districtid,
        districtname,
        cityvillageid,
        cityvillagename,
        pincodeid,
        item.registrationNumber,
        item.registrationDate,
        item.make,
        make_id,

        item.model,
        item.brand,
        brandid, productid, series,
        item.productName,
        item.tyreSize,
        item.tyreQuantity,
        item.tyre1SerialNumber1,
        item.tyre1SerialNumber2,
        item.tyre1SerialNumber3,
        item.tyre1Image,
        item.tyre2SerialNumber1,
        item.tyre2SerialNumber2,
        item.tyre2SerialNumber3,
        item.tyre2Image,
        item.invoiceNumber,
        item.invoiceImage,
        item.invoiceDate,
        item.odoMeterReading,
        item.odoMeterImage,
        item.oldTyreCompany,
        item.oldTyreBrand,
        item.oldTyreSize,
        item.termsAccepted,
        userData.UserId,
        veh_type_id,
        veh_type_name,
        variantid,
        variantname,
        numberplateimage
      ]
    );
    console.log("result", result);

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
const getAllItems = async (db: SQLiteDatabase): Promise<Item[]> => {
  const userData = await getAllLoginItems()
  const result = await executeSql(db, 'SELECT * FROM warrantyregistratointable WHERE created_by=?', [userData.UserId]);
  return result.rows.raw();
};
const getAll = async (db: SQLiteDatabase): Promise<Item[]> => {
  const result = await executeSql(db, 'SELECT * FROM warrantyregistratointable');
  // console.log("result", result);

  return result.rows.raw();
};
// const getAllItems = async (db: SQLiteDatabase): Promise<Item[]> => {
//   const userData = await getAllLoginItems()
//   console.log("userData", userData.UserId);
//   console.log("checking");

//   const result = await executeSql(db, 'SELECT * FROM warrantyregistratointable WHERE created_?');
//   console.log("result", result);

//   return result.rows.raw();
// };
const getItemsById = async (db: SQLiteDatabase, id: number): Promise<Item[]> => {
  console.log(id);
  const userData = await getAllLoginItems()

  const result = await executeSql(db, 'SELECT * FROM warrantyregistratointable WHERE id=? AND created_by=?', [id, userData.UserId]);

  return result.rows.raw();
};
const formatDateForORM = () => {
  const date = new Date()

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
function getMonthsDate(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = (today.getMonth()).toString().padStart(2, '0'); // Month is zero-indexed
  const day = today.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  console.log(formattedDate);

  return formattedDate;
}
const getTodayWarrantyDashbaordCount = async (db: SQLiteDatabase): Promise<Item[]> => {
  const todayDateORMFormat = formatDateForORM();
  const result = await executeSql(db, 'SELECT * FROM warrantyregistratointable WHERE registrationDate =?', [todayDateORMFormat]);

  return result.rows.length;
}
const getMonthWarrantyDashbaordCount = async (db: SQLiteDatabase): Promise<Item[]> => {
  const todayDateORMFormat = formatDateForORM()
  const monthDateORMFormat = getMonthsDate();

  const result = await executeSql(db, 'SELECT * FROM warrantyregistratointable WHERE registrationDate BETWEEN 2024-06-12 AND 2024-07-12');

  console.log("Start", result);
  // console.log("length", result.rows.length);
  // console.log("end");
  return result.rows.length;
}
const searchItems = (db: SQLiteDatabase, keyword: string, fromDate: string, toDate: string): Promise<Item[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM warrantyregistratointable WHERE mobileNumber LIKE ? AND registrationDate BETWEEN ? AND ?',
        [`%${keyword}%`, fromDate, toDate], // Use actual dates in 'YYYY-MM-DD' format
        (tx, results) => {
          let items: Item[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            items.push(results.rows.item(i));
          }
          resolve(items);
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};
const updateSyncStatusWR = async (db: SQLiteDatabase, id: number, status: boolean): Promise<number> => {
  const result = await executeSql(
    db,
    'UPDATE warrantyregistratointable SET isStatus = ? WHERE id = ?',
    [
      status,
      id
    ]
  );
  console.log("result", result.rows);

  return result.rowsAffected;
};
const updateItem = async (db: SQLiteDatabase, id: number,
  registrationOption: string, customerName: string, mobileNumber: number, address: string, state: string, state_id: number, pinCode: number, districtid: number, districtname: string, cityvillageid: number, cityvillagename: string, pincodeid: number, registrationNumber: string, registrationDate: string, make: string, make_id: number, model: string, brand: string, brandid: number, productid: number, series: string, productName: string, tyreSize: string, tyreQuantity: string, tyre1SerialNumber2: string, tyre1SerialNumber3: string, tyre1Image: string, tyre2SerialNumber2: string, tyre2SerialNumber3: string, tyre2Image: string, invoiceNumber: number, invoiceImage: string, invoiceDate: string, odoMeterReading: string, odoMeterImage: string, oldTyreCompany: string, oldTyreBrand: string, oldTyreSize: string, termsAccepted: boolean, veh_type_id: number, veh_type_name: string, variantid: number, variantname: string, numberplateimage: String, model_id: number
): Promise<number> => {
  const result = await executeSql(
    db,
    'UPDATE warrantyregistratointable SET registrationOption=?,customerName=?, mobileNumber=?, address=?, state=?,state_id=?, pinCode=?,districtid=?, districtname=?, cityvillageid=?, cityvillagename=?, pincodeid=?, registrationNumber=?,registrationDate=?, make=?,make_id=?, model=?, brand=?,brandid=?, productid=?,series=?, productName=?, tyreSize=?, tyreQuantity=?,tyre1SerialNumber2=?,tyre1SerialNumber3=?, tyre1Image=?,tyre2SerialNumber2=?,tyre2SerialNumber3=?,tyre2Image=?, invoiceNumber=?, invoiceImage=?, invoiceDate=?, odoMeterReading=?, odoMeterImage=?, oldTyreCompany=?, oldTyreBrand=?, oldTyreSize=?, termsAccepted=?,veh_type_id=? ,veh_type_name=? ,variantid=? ,variantname=?,numberplateimage=?,model_id=? WHERE id = ?',
    [
      registrationOption, customerName, mobileNumber, address, state, state_id, pinCode, districtid, districtname, cityvillageid, cityvillagename, pincodeid, registrationNumber, registrationDate, make, make_id, model, brand, brandid, productid, series, productName, tyreSize, tyreQuantity, tyre1SerialNumber2, tyre1SerialNumber3, tyre1Image, tyre2SerialNumber2, tyre2SerialNumber3, tyre2Image, invoiceNumber, invoiceImage, invoiceDate, odoMeterReading, odoMeterImage, oldTyreCompany, oldTyreBrand, oldTyreSize, termsAccepted, veh_type_id, veh_type_name, variantid, variantname, numberplateimage, model_id,
      id
    ]
  );
  console.log("result", result);

  return result.rowsAffected;
};

const getAllisstatusfase = async (db: SQLiteDatabase): Promise<Item[]> => {
  const result = await executeSql(db, 'SELECT * FROM warrantyregistratointable');
  // console.log("result", result);

  return result.rows.raw();
};
const deleteItem = async (db: SQLiteDatabase, id: number): Promise<number> => {
  const result = await executeSql(db, 'DELETE FROM warrantyregistratointable WHERE id = ?', [id]);
  return result.rowsAffected;
};

export { Item, insertItem, getAllItems, updateItem, deleteItem, searchItems, getItemsById, updateSyncStatusWR, getAll, getTodayWarrantyDashbaordCount, getMonthWarrantyDashbaordCount };