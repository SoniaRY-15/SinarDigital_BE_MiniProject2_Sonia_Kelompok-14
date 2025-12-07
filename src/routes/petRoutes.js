const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");
const userController = require("../controllers/userController");
const upload = require("../middlewares/upload");
const validate = require("../middlewares/validator");

// Pet CRUD
router.get("/pets", petController.listPets); // list (GET)
router.get("/pets/:id", petController.getPetById); // detail (GET)
router.post(
  "/pets",
  upload.single("image"),
  validate.create,
  petController.createPet
); // create (POST)
router.put(
  "/pets/:id",
  upload.single("image"),
  validate.update,
  petController.updatePet
); // update (PUT)
router.delete("/pets/:id", petController.deletePet); // delete (DELETE)

// optional user endpoints
router.get("/users", userController.listUsers);
router.post("/users", userController.createUser);
router.get("/users/:id", userController.getUserById);

module.exports = router;
