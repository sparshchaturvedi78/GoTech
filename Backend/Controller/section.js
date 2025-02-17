const Courses = require("../Models/courses");
const Section = require("../Models/section");
const SubSection = require("../Models/subSection");


//Create Section 
exports.createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;

        if (!sectionName || !courseId) {
            return res.status(404).json({
                success: false,
                message: "Missing required properties"
            })
        }

        // Check if the section already exists in the course
        const course = await Courses.findById(courseId)
            .populate('courseContent'); // Populate the courseContent to check sections

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check if a section with the same name exists in the course
        const sectionExists = course.courseContent.some(
            (section) => section.sectionName === sectionName
        );

        if (sectionExists) {
            return res.status(400).json({
                success: false,
                message: "Section with this name already exists"
            });
        }


        const newSection = await Section.create({ sectionName });

        const updateCourse = await Courses.findByIdAndUpdate(courseId,
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            { new: true }
        )
            .populate({
                path: "courseContent",
                populate: {
                    path: "subsection",
                },
            })

        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse: updateCourse
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Section creation failed",
            error: error.message
        })
    }
}

//Update Section
exports.updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId, courseId } = req.body;

        if (!sectionName || !sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing required properties",
            });
        }

        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(400).json({
                success: false,
                message: "Section not found",
            });
        }

        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName: sectionName }
        )

        const courseDetails = await Courses.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subsection",
                }
            })
            .exec();
        res.status(200).json({
            success: true,
            message: section,
            data: courseDetails,
        });
    } catch (error) {
        console.error("Error updating section:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

//Delete Section
exports.deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.body;

        if (!sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing required properties",
            });
        }

        const updateCourse = await Courses.findByIdAndUpdate(courseId,
            {
                $pull: {
                    courseContent: sectionId,
                }
            }
        );

        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not Found",
            })
        }
        //Deleting all the subsection first before deleting the section

        //approach 1
        // if(section.subsection.length > 0) {
        //     for(let subsectionId  of section.subsection){
        //         await SubSection.findByIdAndDelete(subsectionId );
        //     }
        // }


        //optimal approach to delete all the subsection instead of using above approach - approach - 2
        await SubSection.deleteMany({ _id: { $in: section.subsection } });


        await Section.findByIdAndDelete(sectionId);

        const updatedCourse = await Courses.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subsection"
                }
            })
            .exec();
        res.status(200).json({
            success: true,
            message: "Section deleted",
            data: updatedCourse
        });
    } catch (error) {
        console.error("Error deleting section:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}