const fs = require("fs");
const path = require("path");
const { formatPetList } = require("../utils/helpers");

const dataPath = path.join(__dirname, "../../data/data.json");

// GET /pets
const getPets = (req, res, next) => {
  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    const pets = JSON.parse(data);
    res.json({
      pets: formatPetList(pets),
    });
  } catch (err) {
    next(err);
  }
};

// POST /pets
const addPet = (req, res, next) => {
  try {
    // Accept both JSON and form-urlencoded
    let { name, type, age, reason, ageYears, ageMonths } = req.body;

    // If age is not provided as an object, but as separate fields (from form)
    if (!age && (ageYears !== undefined || ageMonths !== undefined)) {
      age = {
        years: Number(ageYears) || 0,
        months: Number(ageMonths) || 0,
      };
    } else if (typeof age === "string") {
      // If frontend sends nested JSON as string (not typical)
      age = JSON.parse(age);
    }

    const data = fs.readFileSync(dataPath, "utf-8");
    const pets = JSON.parse(data);

    const newPet = {
      id: Date.now(),
      name,
      type,
      age,
      reason,
    };

    pets.push(newPet);
    fs.writeFileSync(dataPath, JSON.stringify(pets, null, 2));

    // If submitted from the form, redirect to /pets for user
    if (req.headers["content-type"] === "application/x-www-form-urlencoded") {
      return res.redirect("/pets");
    }

    // Otherwise, send API JSON response
    res.status(201).json({
      message: "New pet adoption entry added!",
      pet: newPet,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPets, addPet };
