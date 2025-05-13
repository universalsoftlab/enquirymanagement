const db = require("../Config/Db"); // Ensure 'db' matches the file name casing

const insertUser = (
  Name,
  mobile_no,
  email,
  password,
  Authority,
  is_Active,
  callback
) => {
  const query = "CALL signup_user(?, ?, ?, ?, ?, ?)";

  // Execute the query with parameterized values
  db.query(
    query,
    [Name, mobile_no, email, password, Authority, is_Active],
    (err, results) => {
      if (err) {
        console.error("Error calling stored procedure:", err);
        return callback(err, null);
      }

      const message = results[0][0].message;
      callback(null, message);
    }
  );
};

const findUserByEmail = (email, callback) => {
  const query = "SELECT * FROM loginTabel WHERE email = ?";

  // Query the database
  db.query(query, [email], (err, results) => {
    if (err) {
      return callback(err, null); // Return error if any
    }

    if (results.length === 0) {
      return callback(null, null); // If no user found, return null
    }

    callback(null, results[0]); // Return the first user from the results
  });
};

// const addEnquiry =   (enquiryData, callback) => {
//     const {
//         productCode,
//         customerName,
//         CompanyName,
//         stateCode,
//         cityCode,
//         codeStatus,
//         enquiryDate,
//         refId,
//         contactType,
//         contactNumber,
//         addressType,
//         address,
//         followUpDate,
//         followUpTime,
//         narration,
//     } = enquiryData;

//     db.query(
//         'CALL InsertEnquiryData(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
//         [
//             productCode,
//             customerName,
//             CompanyName,
//             stateCode,
//             cityCode,
//             codeStatus,
//             enquiryDate,
//             refId,
//             contactType,
//             contactNumber,
//             addressType,
//             address,
//             followUpDate,
//             followUpTime,
//             narration,
//         ],
//         (err, result) => {
//             if (err) {
//                 console.log('Error executing stored procedure:', err);
//                 callback(err, null);
//             } else {
//                 callback(null, result);
//             }
//         }
//     );
// };
const updateRefrence = (data, callback) => {
  console.log("Input Data (Update):", data);

  const query = "CALL update_refrence_by_id(?, ?)";

  db.query(query, [data.id, data.refrenceName], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

const updateProduct = (data, callback) => {
  console.log("product data", data);

  const query = "Call updateproduct(?,?)";

  db.query(query, [data.newname, data.newcode], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

const updatecity = (data, callback) => {
  console.log(data);
  const quiery = "CALL updatecity(?,?)";
  db.query(quiery, [data.city, data.citycode], (err, result) => {
    if (err) {
      callback(err, null);
    }

    callback(null, result);
  });
};

const addEnquiry = (enquiryData, callback) => {
  const {
    productCode,
    customerName,
    CompanyName,
    stateCode,
    cityCode,
    codeStatus,
    enquiryDate,
    refId,
    contactType,
    contactNumber,
    addressType,
    address,
    followUpDate,
    followUpTime,
    narration,
    latitude,
    longitude,
  } = enquiryData;

  console.log(CompanyName);

  // Query to check if the enquiry already exists
  const checkQuery =
    "SELECT 1 FROM AddEnquiry WHERE productCode = ? AND customerName = ? AND enquiryDate = ?";

  db.query(
    checkQuery,
    [productCode, customerName, enquiryDate],
    (err, results) => {
      if (err) {
        console.error("Error checking for existing enquiry:", err);
        return callback(err, null);
      }

      // If the enquiry already exists, return a message to the callback
      if (results.length > 0) {
        return callback(null, {
          message:
            "Enquiry already exists for this product and customer on this date.",
        });
      }

      // If the enquiry doesn't exist, proceed with the insertion
      db.query(
        "CALL InsertEnquiryData(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)",
        [
          productCode,
          customerName,
          CompanyName,
          stateCode,
          cityCode,
          codeStatus,
          enquiryDate,
          refId,
          contactType,
          contactNumber,
          addressType,
          address,
          followUpDate,
          followUpTime,
          narration,
          latitude,
          longitude,
        ],
        (err, result) => {
          if (err) {
            console.log("Error executing stored procedure:", err);
            callback(err, null);
          } else {
            callback(null, result);
          }
        }
      );
    }
  );
};

const getProducts = (callback) => {
  const query =
    "SELECT code, product_name FROM product_master WHERE isActive = 1"; // Get only active products

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return callback(err, null); // Return the error
    }
    callback(null, results); // Return the fetched products
  });
};

const addProductData = (data, callback) => {
  const query = "CALL product(?)";
  console.log(data);
  db.query(query, [data.newname], (err, result) => {
    if (err) {
      callback(err, null);
    }
    callback(null, result);
  });
};

const addcity = (data, callback) => {
  console.log(data);
  const quiery = "Call cityProcedure(?,?)";

  db.query(quiery, [data.city, data.statecode], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

const getAllReferences = (callback) => {
  const query = "SELECT * FROM refrence_master";
  db.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

const addrefrence = (data, callback) => {
  console.log("Input Data:", data);

  const query = "CALL refrence(?)";

  db.query(query, [data.refrenceName], (err, result) => {
    if (err) {
      return callback(err, null); // use return to avoid calling callback twice
    }
    callback(null, result);
  });
};

const getAllStates = (callback) => {
  const query = "SELECT * FROM statemaster";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching states:", err.stack);
      return;
    }
    callback(results);
  });
};

const getcity = (callback) => {
  const quary = " select * from citymaster";
  db.query(quary, (err, result) => {
    if (err) {
      console.error("error fetching states:", err.stack);
      return;
    }
    callback(result);
  });
};

const getAllInquiries = (callback) => {
  const query = "SELECT * FROM addenquiry";
  db.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

const getPersons = (callback) => {
  const query = "SELECT * FROM contactmaster"; // Ensure 'persons' is the correct table name
  db.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

const getAllremarks = (callback) => {
  const query = "SELECT * FROM remark_master";
  db.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

const getAllStatuses = (callback) => {
  const query = "SELECT * FROM enquiry_status_master";
  db.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

const createEnquiry = (data, documentPath, callback) => {
  console.log(data);
  const sql = `CALL Create_EnquiryTransaction(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      data.enquiry_id,
      data.person_id,
      data.contact_number,
      data.action_id,
      data.enquiry_status_id,
      data.enquiry_date,
      data.followup_date,
      data.followup_time,
      data.remark_id,
      documentPath,
      data.userId || null,
      data.calltime || null,
      data.Demodate || null,
      data.DemoTime || null,
      data.demoStatus || null,
      data.latitude || null,
      data.longitude || null,
      data.location || null,
    ],
    (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results[0]); // Assuming `results[0]` contains the response from your procedure
      }
    }
  );
};

const addcontectmaster = (data, callback) => {
  console.log("Received Data:", data);

  const sql = `CALL InsertContact(?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      data.EnquiryCode,
      data.ContactNumber,
      data.Name,
      data.Designation_Id,
      data.Email,
    ],
    (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return callback(err, null);
      }
      console.log("Inserted Data:", results);
      callback(null, results[0]);
    }
  );
};

// const updatelocation = (data, callback) =>{

//   console.log(data)
//   if (!data.code || !data.address || !data.cityCode) {
//     return res.status(400).json({ message: 'Missing required fields.' });
//   }

//   const quiery = " CALL UpdateAddEnquiryLocation(?, ?, ?)"

//   db.query(quiery,[data.code,data.address,cityCode],(err,result)=>{

//     if(err){
//       console.error("Database Error:", err);
//       return callback(err, null);
//     }
//     callback(null, result[0]);
//   })

// }
const updatelocation = (data, callback) => {
  console.log(data);

  // Ensure all required fields are provided, including latitude and longitude
  if (
    !data.code ||
    !data.address ||
    !data.cityCode ||
    !data.latitude ||
    !data.longitude
  ) {
    return callback({ message: "Missing required fields." }, null);
  }

  // Query for calling the stored procedure
  const query = "CALL UpdateAddEnquiryLocation(?, ?, ?, ?, ?)";

  // Execute the query
  db.query(
    query,
    [data.code, data.address, data.cityCode, data.latitude, data.longitude],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return callback(err, null); // Pass error to callback
      }
      // Pass the result to the callback
      callback(null, result[0]); // Assuming result[0] contains the needed data
    }
  );
};
const getAllInquirieDetiales = (callback) => {
  const quary = " select * from enquiry_transaction ";
  db.query(quary, (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
};

const ServerConnection = (callback) => {
  const quary = " SELECT * FROM server_connection ";
  db.query(quary, (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
};

const DasignationM = (callback) => {
  const quiry = " Select * from designation_master";
  db.query(quiry, (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
};

const ActionMaster = (callback) => {
  const quiry = " Select * from ActionMaster ";
  db.query(quiry, (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
};

const getEnqueryTransection = (callback) => {
  const quiry = " Select * from enquiry_transaction";
  db.query(quiry, (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
};

const deleteproduct = (code, callback) => {
  console.log(code);
  const quiery = " CALL deleteproduct(?)";
  db.query(quiery, [code], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

const Deletecity = (data, callback) => {
  console.log(data);
  const query = "CALL Deletecity(?)";

  db.query(query, [data.code], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

const addStates = (data, callback) => {
  console.log(data);
  const sql = "CALL ADDSTATE(?)";
  db.query(sql, [data.state_name], (err, result) => {
    if (err) {
      return callback(err, null);
    }

    callback(null, result);
  });
};

const Updatestate = (data, callback) => {
  const sql = "CALL UPDATESTATE (?,?)";
  db.query(sql, [data.state_name, data.stateCode], (err, result) => {
    if (err) {
      callback(err, null);
    }
    callback(null, result);
  });
};

const DeleteState = (data, callback) => {
  console.log(data);
  const sql = "CALL Deletestate(?)";

  db.query(sql, [data.code], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

const addactions = (data, callback) => {
  const sql = "CALL AddActions(?)";

  db.query(sql, [data.action_name], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

const updateActions = (data, callback) => {
  const sql = "CALL UPDATEACTION(?,?)";
  db.query(sql, [data.actionCode, data.action_name], (err, result) => {
    if (err) {
      callback(err, null);
    }
    callback(null, result);
  });
};

const DeleteAction = (data,callback)=>{
const sql = "CALL DELETEACTION(?)"
  db.query(sql,[data.code],(err,result)=>{
    if(err){
      return  callback(err, null)
    }
    callback(null, result)
  })
 
};

const Deletedref = (data,callback)=>{
const sql = "CALL DeleterefProcedure(?)"
db.query(sql,[data.code],(err, result)=>{
 
  if(err){
    return callback(err, null)
  }
  callback(null, result)
})
};


const getAllUsers = (callback)=>{

const sql = "SELECT name, code FROM logintabel "

db.query(sql,callback)

};
module.exports = {
  insertUser,
  findUserByEmail,
  addEnquiry,
  getProducts,
  getAllReferences,
  getAllStates,
  getcity,
  getAllInquiries,
  getPersons,
  getAllremarks,
  getAllStatuses,
  createEnquiry,
  getAllInquirieDetiales,
  ServerConnection,
  DasignationM,
  addcontectmaster,
  ActionMaster,
  getEnqueryTransection,
  addrefrence,
  updateRefrence,
  updatelocation,
  addProductData,
  updateProduct,
  deleteproduct,
  addcity,
  updatecity,
  Deletecity,
  addStates,
  Updatestate,
  DeleteState,
  addactions,
  updateActions,
  DeleteAction,
  Deletedref,getAllUsers
};
