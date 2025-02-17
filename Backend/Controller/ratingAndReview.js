const RatingAndReviews = require("../Models/ratingsAndReviews");
const Courses = require("../Models/courses");
const mongoose = require("mongoose");
    
//create ratings
exports.createRating = async (req, res) => {
    try {
        //fetch the required data
        const userId = req.user.id;
        const { review, rating, courseId } = req.body;

        //find course details
        const courseDetails = await Courses.findOne({
            _id: courseId,
            studentEnrolled: {
                $elemMatch: {
                    $eq: userId
                }
            },
        })
        console.log(courseDetails);
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Student is not enrolled in the course',
            });
        }

        //chech user already not reviewed
        if (await RatingAndReviews.findOne({
            course: courseId,
            user: userId
        })) {
            return res.status(403).json({
                success: false,
                message: 'Course is already reviewed by the user',
            });
        }

        //create rating and review
        const ratingandreviews = await RatingAndReviews.create({
            rating,
            review,
            user: userId,
            course: courseId
        });

        //update course Details
        const updateCourse = await Courses.findByIdAndUpdate(courseId,
            {
                $push: { ratingAndReviews: ratingandreviews._id, },
            },
            { new: true }
        );

        console.log(updateCourse);
        //return response
        return res.status(200).json({
            success: true,
            message: "Rating and Review created Successfully",
            ratingandreviews,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//get average ratings
exports.getAverageRating = async (req, res) => {
    try {
        //get course ID
        const { courseId } = req.body;
        //calculate avg rating

        const result = await RatingAndReviews.aggregate([
            {
                $match: {
                    course: mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                }
            }
        ])

        //return rating
        if (result.length > 0) {

            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })

        }

        //if no rating/Review exist
        return res.status(200).json({
            success: true,
            message: 'Average Rating is 0, no ratings given till now',
            averageRating: 0,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//get all ratings and reviews
exports.getAllRating = async (req, res) => {
    try {
        const allRatings = await RatingAndReviews.find({})
            .sort("desc")
            .populate(
                {
                    path: "user",
                    select: "firstName lastName email image"
                },
            )
            .populate(
                {
                    path: "course",
                    select: "courseName"
                }
            )
            .exec();

        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allRatings,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
