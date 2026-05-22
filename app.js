const express = require("express");

const foodRoutes = require('./routes/foodRoutes');
const userRoutes = require("./routes/userRoutes");

const app = express();

//MIDDLEWARE

module.exports = app;

//ROUTES
app.use("/api/v1/food", foodRoutes);
// app.use("/api/v1/user", userRoutes);
