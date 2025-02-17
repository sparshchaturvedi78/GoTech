const mongoose = require("mongoose");

const courseProgress = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courses"
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        completeVideos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection"
        }],
    },
    { timestamps: true }
);

module.exports = mongoose.models.CourseProgress || mongoose.model("CourseProgress", courseProgress);