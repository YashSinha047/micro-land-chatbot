const express = require("express");
const { savereminder, fetchreminder } = require("../controllers/reminderController");

const router = express.Router();

router.post("/addreminder", savereminder);
router.post("/fetchreminder", fetchreminder);

module.exports = router;