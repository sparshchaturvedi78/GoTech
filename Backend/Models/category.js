const mongoose = require("mongoose");

const category = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: { type: String },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Courses",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", category);