const express = require("express");
const app = express();
const morgan = require("morgan");
const getConnection = require("./src/database");
const router = require("./src/routes");
const cors = require("cors");
getConnection();

app.use(cors());
app.use(express.json());
app.use(morgan("common"));

app.get("/api/v1/", (req, res) => {
  return res.json({
    message: "hello world!!!",
  });
});
app.use("/api/v1/eccomerce", router);

app.listen(8800, () => {
  console.log("Backend server is running!");
});
