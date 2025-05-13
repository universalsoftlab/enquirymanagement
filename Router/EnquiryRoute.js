    // routes/authRoutes.js
    const express = require("express");
    const router = express.Router();
    const authController = require("../Controller/Enquirycontroller");

    // Signup Route
    router.post("/signup", authController.Sinup);

    // Login Route
    router.post("/login", authController.Login);
    // router.get("/login", (req, res) => {
    //   res.json({ message: "Login API working with GET request!" });
    // });


router.get("/getlogin",authController.getloginuser)

router.post("/addEnquiry", authController.addEnquiry);

router.get("/getProduct", authController.getProducts);
router.post("/addproduct", authController.addproduct);

router.get("/getRefid", authController.getReferences);

router.post("/addcity", authController.addcityes);

router.get("/getState", authController.getAllStates);

router.post("/addState", authController.addStates);

router.get("/getcity", authController.getcityes);

router.get("/getInquiry", authController.getInquiries);

router.post("/postupdatelocation", authController.addlocations);

router.get("/getparson", authController.getPerson);

router.get("/getallremark", authController.getAllRemark);

router.post("/addAction",authController.addAction)

router.get("/getallStatus", authController.getAllStatuses);

router.post("/insertEnquirymaster", authController.createEnquiry);

router.get("/getinquiryAllDetials", authController.getAllInquirieDetiales);

router.get("/getapiServerconnection", authController.getAllServerConnections);

router.get("/getDesignation", authController.getDesignation);

router.post("/addcontectmaster", authController.addContectmasterDetials);

router.post("/addrefrence", authController.addrefrence);

router.get("/getActions", authController.getActions);

router.get("/getEnqiryTransections", authController.getEnquieryTransection);

router.put("/updateRefrence/:id", authController.updateRefrence);

router.put("/updateProduct/:code", authController.updateproduct);

router.put("/updatecity/:code", authController.updatecity);

router.put("/updatestate/:code", authController.updateState);
router.put("/updateActions/:code", authController.updateactions)

router.delete("/DeleteProduct/:code", authController.DeleteProduct);

router.delete("/Deletecity/:code", authController.Deletecity);

router.delete("/DeleteState/:code",authController.DeleteState);

router.delete("/deleteAction/:code",authController.DeleteAction);
router.delete("/Deletedref/:code",authController.Deleteref)
module.exports = router;
