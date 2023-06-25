const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./Routes/userRoutes");
dotenv.config();
const port = process.env.PORT || 9000;
const dbURI = process.env.DATABASE;

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to the Job Portal API Ho ni haina rw !");
});

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server started at Port number ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
app.use(userRoutes);

app.use(express.urlencoded({ extended: false }));

// Additional routes and middleware can be defined here
