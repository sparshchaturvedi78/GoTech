const Course = require("../Models/courses");
const User = require("../Models/user");
const Section = require("../Models/section");
const SubSection = require("../Models/subSection");
const { uploadImageToCloudinary } = require("../Utility/imageUploader");
const CourseProgress = require("../Models/courseProgress");
const { convertSecondsToDuration } = require("../Utility/secToDuration");
const Category = require("../Models/category");
require("dotenv").config();

// Create a new course
exports.createCourse = async (req, res) => {
    try {
        // Ensure user exists
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        const User_id = req.user.id;


        // Ensure thumbnail is provided
        if (!req.files || !req.files.thumbnailImage) {
            return res.status(400).json({
                success: false,
                message: "Thumbnail image is required",
            });
        }
        const thumbnail = req.files.thumbnailImage;

        // Fetch course details
        const {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag: _tag,
            category,
            status,
            instructions: _instructions,
        } = req.body;

        console.log("in the backend body", req.body)
        // Convert the tag and instructions from stringified Array to Array
        let tag, instructions;
        try {
            tag = JSON.parse(_tag);
            instructions = JSON.parse(_instructions);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Invalid JSON format for tag or instructions",
            });
        }

        // Validate required fields
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag.length || !category || !instructions.length) {
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory",
            });
        }

        // Set default status if not provided
        const finalStatus = status || "Draft";

        // Check if user is an instructor
        const instructorDetails = await User.findById(User_id);
        if (!instructorDetails || instructorDetails.accountType !== "Instructor") {
            return res.status(400).json({
                success: false,
                message: "Instructor not found or user is not an instructor",
            });
        }

        // Check if category exists
        const findCategory = await Category.findById(category);
        if (!findCategory) {
            return res.status(400).json({
                success: false,
                message: "Category not found",
            });
        }

        // Upload thumbnail to Cloudinary
        const uploadThumbnail = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME, 1000, 1000);
        if (!uploadThumbnail) {
            return res.status(500).json({
                success: false,
                message: "Error uploading thumbnail",
            });
        }

        // Create course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag,
            category: findCategory,
            thumbnail: uploadThumbnail.secure_url,
            status: finalStatus,
            instructions,
        });

        // Add course to instructor's list
        await User.findByIdAndUpdate(instructorDetails._id, { $push: { courses: newCourse._id } }, { new: true });

        // Add course to category
        await Category.findByIdAndUpdate(findCategory._id, { $push: { courses: newCourse._id } }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            course: newCourse,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Course was not created successfully",
            error: err.message,
        });
    }
};

// Edit Course Details --- testing pending
exports.editCourse = async (req, res) => {
    try {

        //get course_id form req body
        const { course_id } = req.body;

        //get all the changes made in course from body
        const updates = req.body;

        //check course exist or not
        const existCourse = await Course.findById(course_id);
        if (!existCourse) {
            return res.status(400).json({
                success: false,
                message: "Course is not exists"
            })
        }

        //Make chagnes if it happens in images upload
        if (req.files) {
            console.log("Thumbnail update");
            const newThumbNail = req.files.thumbnailImages;
            const updateThumbnail = await uploadImageToCloudinary(
                newThumbNail,
                process.env.FOLDER_NAME
            )
            Course.thumbnail = updateThumbnail.secure_url;
        }

        //update only the fields which are present in the req body
        for (let key in updates) {
            if (updates.hasOwnProperty(key)) {
                if (key === "tag" || key === "instructions") {
                    existCourse[key] = JSON.parse(updates[key]);
                } else {
                    existCourse[key] = updates[key];
                }
            }
        }

        await existCourse.save();

        const updatedCourse = await Course.findById(
            course_id,
        ).populate({
            path: "instructor",
            populate: {
                path: "additionalDetails"
            }
        })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subsection"
                }
            }).exec();

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            updatedCourse
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while updating course",
            err: error.message
        })
    }
}
// Get Course List
exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find(
            { status: "Published" },
            {
                courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentsEnrolled: true,
            }
        )
            .populate("instructor")
            .exec()

        return res.status(200).json({
            success: true,
            data: allCourses,
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            success: false,
            message: `Can't Fetch Course Data`,
            error: error.message,
        })
    }
}
// Get One Single Course Details
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;
        const courseDetail = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails"
                }
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subsection"
                },
            })

        if (!courseDetail) {
            return res.status(400).json({
                success: false,
                message: "Given course is not available"
            })
        }

        if (courseDetail.status === "Draft") {
            return res.status(403).json({
                success: false,
                message: `Accessing a draft course is forbidden`,
            });
        }

        console.log("CourseDetail", courseDetail)

        //calculating the duration of the course 
        let totalDurationOfTheCourse = 0;
        if (courseDetail.courseContent !== null) {
            courseDetail.courseContent.forEach((section) => {
                section.subsection.forEach((subSection) => {
                    const timeDurationInSecont = parseInt(subSection.timeDuration);
                    totalDurationOfTheCourse += timeDurationInSecont
                })
            })
        }
        const totalDuration = convertSecondsToDuration(totalDurationOfTheCourse);

        return res.status(200).json({
            success: true,
            data: {
                courseDetail,
                totalDuration,
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to find course details",
            error: error.message
        });
    }
}
// Get Full Course Detail
exports.getFullCourseDetails = async (req, res) => {
    try {
        let { courseId } = req.body;
        let userId = req.user.id


        //Find all the course details
        const courseDetail = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails"
                },
            })
            .populate("category")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subsection"
                }
            })
            .populate("ratingAndReviews")
            .exec();


        //get course progress data
        let courseProgressCount = await CourseProgress.findOne(
            {
                courseId: courseId,
                userId: userId
            }
        )


        //validate for corseDetails
        if (!courseDetail) {
            return res.status(400).json({
                success: false,
                message: "course not found"
            })
        }

        //calcualte totalduration of the course
        let totalDurationOfTheCourse = 0;
        courseDetail.courseContent.forEach((section) => {
            section.subsection.forEach((subsection) => {
                let durationOfSubSection = parseInt(subsection.timeDuration);
                totalDurationOfTheCourse += durationOfSubSection
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationOfTheCourse);
        return res.status(200).json({
            success: true,
            data: {
                courseDetail,
                totalDuration,
                completedVideos: courseProgressCount
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get full course details",
            error: error.message
        })
    }
}
//Get Instructor Courses
exports.getInstructorCourses = async (req, res) => {
    try {
        //get instructor id
        const instructor_id = req.user.id;


        //fetch all the courses for user
        const instructor_courses = await Course.find({
            instructor: instructor_id
        }).sort({ createdAt: -1 });

        //validate if course exists?
        if (instructor_courses < 1) {
            return res.status(400).json({
                success: false,
                message: "No course exist for instrutor"
            })
        }
        res.status(200).json({
            success: true,
            data: instructor_courses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses"
        })
    }
}
//Delete the course
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        //find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({
                success: false,
                message: "Course not exist",
            })
        }

        //find all the students and unroll them from the course
        const studentEnrolled = course.studentEnrolled;
        for (let studentId of studentEnrolled) {
            await User.findByIdAndUpdate(
                studentId,
                {
                    $pull: {
                        courses: courseId,
                    },
                }
            );
        }

        //delete all the subsection of the course
        const CourseSections = course.courseContent;
        for (let sectionId of CourseSections) {
            const section = await Section.findById(sectionId);
            //check section exist
            if (section) {
                const subSections = section.subsection;
                for (let subsectionId of subSections) {
                    //delete the subsection
                    await SubSection.findByIdAndDelete(subsectionId);
                }
            }
            //delete  the section
            await Section.findByIdAndDelete(sectionId);
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId);
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error, Course not deleted",
            error: error.message
        })
    }
}


