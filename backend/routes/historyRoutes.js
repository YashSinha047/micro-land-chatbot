const express = require("express");
const { savemedicalhistory, fetchmedicalhistory } = require("../controllers/historyController");

const router = express.Router();

router.post("/add", savemedicalhistory);
router.post("/fetch", fetchmedicalhistory);

module.exports = router;