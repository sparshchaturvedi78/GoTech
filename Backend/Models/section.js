const mongoose = require("mongoose");

const section = new mongoose.Schema(
    {
        sectionName: {
            type: String,
        },
        subsection: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "subsection",
                required: true,
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Section", section);