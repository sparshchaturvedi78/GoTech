const mongoose = require("mongoose");

const additionalDetails = new mongoose.Schema(
    {
        gender: {
            type: String,
        },
        dateOfBirth: {
            type: String,
        },
        about: {
            type: String,
            trim: true,
        },
        contactNumber: {
            type: Number,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Profile", additionalDetails);