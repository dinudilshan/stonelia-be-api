const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const sourcefileController = require("../controllers/sourcefile-controller");

router.post("/upload", sourcefileController.addSourceFile); //Add a new 
router.get("/getAll",sourcefileController.getAllSource); //Get file details


module.exports=router;