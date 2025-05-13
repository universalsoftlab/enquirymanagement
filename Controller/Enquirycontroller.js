const userModel = require("../Modal/Enquirymodal");
const bcrypt = require("bcryptjs");
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const saltRounds = 10; // You can adjust the number of salt rounds to increase security

const Sinup = (req, res) => {
  console.log(req.body);
  const { name, mobile, email, password, authority, isActive } = req.body;

  // Check if all required fields are provided
  if (!name || !mobile || !email || !password || !authority || !isActive) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields." });
  }

  // Hash the password before storing it in the database
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({
        message: "Error hashing password",
        error: err.message,
      });
    }

    // Now insert the user with the hashed password into the database
    userModel.insertUser(
      name,
      mobile,
      email,
      hashedPassword,
      authority,
      isActive,
      (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Error registering user",
            error: err.message,
          });
        }

        res.status(200).json({
          message: "User registered successfully",
          data: results,
        });
      }
    );
  });
};

const Login = (req, res) => {
  // Destructure the request body for email and password
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both email and password." });
  }

  // Check if the user exists in the database
  userModel.findUserByEmail(email, (err, user) => {
    if (err) {
      return res.status(500).json({
        message: "Error checking user in the database",
        error: err.message,
      });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error comparing passwords", error: err.message });
      }

      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      // Password is correct, generate JWT token
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({
          message: "JWT_SECRET is not defined in the environment variables",
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET, // Secret key, make sure to keep it in .env file
        { expiresIn: "1h" } // Token expiration time (e.g., 1 hour)
      );

      // Send success response with the JWT token
      res.status(200).json({
        message: "Login successful",
        token: token, // Return the token to frontend
      });
    });
  });
};

const addEnquiry = (req, res) => {
  const enquiryData = req.body;
  console.log(enquiryData);
  // Add enquiry to the database via the model
  userModel.addEnquiry(enquiryData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "Enquiry added successfully" });
  });
};

const addContectmasterDetials = (req, res) => {
  const contectmasterData = req.body;
  console.log(contectmasterData);

  userModel.addcontectmaster(contectmasterData, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ err: "Databse error " });
    }

    res.status(200).json({ massage: "contectmaster data added sucsess " });
  });
};

const getProducts = (req, res) => {
  userModel.getProducts((err, products) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch products", error: err });
    }
    res.json(products); // Send the product data as a JSON response
  });
};

const addproduct = (req, res) => {
  const adddata = req.body;

  userModel.addProductData(adddata, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to add product", error: err });
    }
    res
      .status(200)
      .json({ message: "Product added successfully", data: result });
  });
};

const addlocations = (req, res) => {
  const data = req.body; // Extract data from the request body

  userModel.updatelocation(data, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to update location",
        error: err,
      });
    }

    // Successfully updated the location
    res.status(200).json({
      message: "Location updated successfully",
      data: result,
    });
  });
};

const getReferences = (req, res) => {
  userModel.getAllReferences((err, references) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(references); // Send the result to the client
  });
};
const getAllStates = (req, res) => {
  userModel.getAllStates((states) => {
    res.json(states);
  });
};

const getcityes = (req, res) => {
  userModel.getcity((cityes) => {
    res.json(cityes);
  });
};

const getInquiries = (req, res) => {
  userModel.getAllInquiries((err, inquiries) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching inquiries", error: err.message });
    }
    res.status(200).json({ inquiries });
  });
};

const getPerson = (req, res) => {
  userModel.getPersons((err, persons) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching persons", error: err.message });
    }
    res.status(200).json({ persons });
  });
};

const getAllRemark = (req, res) => {
  userModel.getAllremarks((err, persons) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching persons", error: err.message });
    }
    res.status(200).json({ persons });
  });
};

const getAllStatuses = (req, res) => {
  userModel.getAllStatuses((err, statuses) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(statuses);
  });
};

const createEnquiry = (req, res) => {
  const documentPath = req.file ? req.file.path : null;

  userModel.createEnquiry(req.body, documentPath, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Enquiry created successfully!", result });
  });
};

const getAllInquirieDetiales = (req, res) => {
  userModel.getAllInquirieDetiales((err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

const getAllServerConnections = (req, res) => {
  userModel.ServerConnection((err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
};

const getDesignation = (req, res) => {
  userModel.DasignationM((err, result) => {
    if (err) {
      return res.status(500).json({ error: "DataBase Quaery failed " });
    }
    res.json(result);
  });
};
const getActions = (req, res) => {
  userModel.ActionMaster((err, result) => {
    if (err) {
      return res.status(500).json({ error: "DataBase Quaery failed " });
    }
    res.json(result);
  });
};

const getEnquieryTransection = (req, res) => {
  userModel.getEnqueryTransection((err, result) => {
    if (err) {
      return res.status(500).json({ err: " Database query failed " });
    }

    res.json(result);
  });
};

const addrefrence = (req, res) => {
  const data = req.body;
  userModel.addrefrence(data, (err, result) => {
    if (err) {
      console.error("MySQL Error:", err);
      return res.status(500).json({ err: "databse quiery fail" });
    }

    res.json(result);
  });
};
const updateRefrence = (req, res) => {
  const { id } = req.params; // Get the reference ID from URL
  const data = { ...req.body, id };

  userModel.updateRefrence(data, (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database update failed" });
    }
    res
      .status(200)
      .json({ message: "Reference updated successfully", data: result });
  });
};

const updateproduct = (req, res) => {
  console.log("reqvest", req);
  const { code } = req.body;

  const data = { ...req.body, code };
  userModel.updateProduct(data, (err, result) => {
    if (err) {
      console.error("DB error", err);

      return res.status(500).json({ error: "Database update failed" });
    }
    res
      .status(200)
      .json({ massage: " product updated successfully", data: result });
  });
};

const updatecity = (req, res) => {
  console.log("data", req.body);
  const { citycode } = req.body;
  const data = { ...req.body, citycode };
  console.log("data", data);
  userModel.updatecity(data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ massage: "Somthing went wrong ", data: err });
    }
    res
      .status(200)
      .json({ massage: "city upated succseefully ", data: result });
  });
};

const DeleteProduct = (req, res) => {
  console.log(req.params);
  const { code } = req.params;

  userModel.deleteproduct(code, (err, result) => {
    if (err) {
      return res.status(500).json({ massage: "somthin when rong", err });
    }

    res.status(200).json({ massage: "Product Deleted", data: result });
  });
};

const addcityes = (req, res) => {
  const data = req.body;

  userModel.addcity(data, (err, result) => {
    if (err) {
      res.status(500).json({ massage: "Somthing went wrong", err });
    }

    res
      .status(200)
      .json({ massage: " this data is succsessfully submit", data: result });
  });
};

const Deletecity = (req, res) => {
  console.log(req);
  const data = req.params;
  userModel.Deletecity(data, (err, result) => {
    if (err) {
      return res.ststus(500).json({ massage: "Somthing went wrong", err });
    }
    res.status(200).json({ massage: " Deleted  completed", data: result });
  });
};

const addStates = (req, res) => {
  console.log(req);
  const data = req.body;

  userModel.addStates(data, (err, result) => {
    if (err) {
      return res.status(500).json({ massage: " somthing went wrong", err });
    }

    res.status(200).json({ massage: "State addede ", data: result });
  });
};

const updateState = (req, res) => {
  const data = req.body;
  console.log(data);
  userModel.Updatestate(data, (err, resulte) => {
    if (err) {
      return res
        .status(500)
        .json({ massage: " Something went wrong", data: err });
    }

    res.status(200).json({
      massage: " updated sucssed",
      data: resulte,
    });
  });
};

const DeleteState = (req, res) => {
  const data = req.params;

  userModel.DeleteState(data, (err, result) => {
    if (err) {
      return res.status(500).json({
        massage: "State is not Deleted",
        data: err,
      });
    }
    res.status(200).json({ massage: "Deleted", data: result });
  });
};

const addAction = (req, res) => {
  const data = req.body;
  console.log(data);
  userModel.addactions(data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ massage: "somthing went wornge", data: result });
    }
    res.status(200).json({ massage: "action was add " });
  });
};

const updateactions = (req, res) => {
  const data = req.body;

  console.log(data);
  userModel.updateActions(data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ massage: "somthing went wrong", data: err });
    }
    res.status(200).json({ massage: "Updated", data: result });
  });
};

const DeleteAction = (req, res) => {
  const data = req.params;

  console.log(data);
  userModel.DeleteAction(data, (err, result) => {
    if (err) {
      res.status(500).json({ massage: "Somthing went wrong", data: err });
    }
    res.status(200).json({ massage: " Data added complite ", data: result });
  });
};


const getloginuser = (req, res)=>{



  userModel.getAllUsers((err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong",
        error: err
      });
    }

    res.status(200).json({
      message: "Users retrieved successfully",
      data: result
    });
  });
}

const Deleteref = (req, res)=>{
  const data = req.params;

  userModel.Deletedref(data,(err, result)=>{
   
    if(err){
     return res.status(500).json({massage:"Somthing went wrong",data:err})
    } 
    res.status(500).json({massage:"Deleted", data:result})
  })
}

module.exports = {
  Sinup,
  Login,
  addEnquiry,
  getProducts,
  getReferences,
  getAllStates,
  getcityes,
  getInquiries,
  getPerson,
  getAllRemark,
  getAllStatuses,
  createEnquiry,
  getAllInquirieDetiales,
  getAllServerConnections,
  getDesignation,
  addContectmasterDetials,
  getActions,
  getEnquieryTransection,
  addrefrence,
  updateRefrence,
  addlocations,
  addproduct,
  updateproduct,
  DeleteProduct,
  addcityes,
  updatecity,
  Deletecity,
  addStates,
  updateState,
  DeleteState,
  addAction,
  updateactions,
  DeleteAction,
  Deleteref,getloginuser
};
