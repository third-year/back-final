const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(console.log("connected successfully"))
  .catch((err) => console.log(err));

const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
