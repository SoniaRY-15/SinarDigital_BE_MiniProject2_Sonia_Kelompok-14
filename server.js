require("dotenv").config();
const app = require("./src/app");
const { APP_PORT } = require("./src/config/app.config");

const PORT = process.env.PORT || APP_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Pet Adoption API is running at http://localhost:${PORT}`);
});
