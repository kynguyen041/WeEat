const express = require("express");
const morgan = require("morgan");
const foodRoutes = require("./routes/foodRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

//MIDDLEWARE
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.set("query parser", "extended");

//ROUTES
app.use("/api/v1/food", foodRoutes);
app.use("/api/v1/user", userRoutes);

module.exports = app;
