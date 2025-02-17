const mongoose  = require("mongoose");
require("dotenv").config();

exports.dbConnect = () => {
    mongoose.connect(process.env.DB_CONNECTION_URL)
    .then( () => {
        console.log("DataBase Connected Successfully");
    })
    .catch((err) => {
        console.log(err);
        console.log("Error occured during DB connection");
        process.exit(1);
    })
}

