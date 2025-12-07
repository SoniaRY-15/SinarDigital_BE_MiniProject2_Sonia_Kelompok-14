const express = require("express");
const router = express.Router();
const petRoutes = require("./petRoutes");

// Home route (returns JSON with multiple lines as an array)
router.get("/", (req, res) => {
  res.json({
    message: [
      "Welcome to the Pet Adoption Website! Use /pets to view or /adopt to add pet adoption requests.",
      "(You can also use /pets to add via Postman or other API tools).",
    ],
  });
});

// Simple HTML form for submitting adoption requests (multipart/form-data)
router.get("/adopt", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Adopt a Pet</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2rem; }
          label { display:block; margin-top:.5rem; }
          input, textarea, select { width: 320px; padding:.4rem; }
          .small { width: 120px; }
        </style>
      </head>
      <body>
        <h1>Pet Adoption Form</h1>
        <form method="POST" action="/pets" enctype="multipart/form-data">
          <label>
            Name:
            <input type="text" name="name" required />
          </label>
          <label>
            Type:
            <input type="text" name="type" required />
          </label>
          <label>
            Age (years):
            <input class="small" type="number" name="ageYears" min="0" value="0" />
          </label>
          <label>
            Age (months):
            <input class="small" type="number" name="ageMonths" min="0" max="11" value="0" />
          </label>
          <label>
            Reason for adoption:
            <textarea name="reason" required></textarea>
          </label>
          <label>
            Owner (userId):
            <input class="small" type="number" name="ownerId" required />
          </label>
          <label>
            Image:
            <input type="file" name="image" accept="image/*" />
          </label>
          <button type="submit">Submit</button>
        </form>

        <hr/>
        <p>
          View all pets (JSON): <a href="/pets">/pets</a><br/>
          Example API create (JSON, no image): POST /pets with body { "name","type","ageYears","ageMonths","reason","ownerId" }
        </p>
      </body>
    </html>
  `);
});

// Mount pet/user routes
router.use("/", petRoutes);

module.exports = router;
