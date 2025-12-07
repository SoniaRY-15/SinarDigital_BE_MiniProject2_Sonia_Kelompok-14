const express = require("express");
const router = express.Router();
const { getPets, addPet } = require("../controllers/apiController");
const validatePet = require("../middlewares/validator");

// GET /pets - List all pets
router.get("/pets", getPets);

// POST /pets - Add a new pet adoption request (from form or API) --> can use postman
router.post("/pets", validatePet, addPet);

module.exports = router;
