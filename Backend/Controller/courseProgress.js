const Subsection = require("../Models/subSection");
const CourseProgress = require("../Models/courseProgress");

exports.updateCourseProgress = async (req, res) => {
    try {
        //Fetch the details from req body
        const { courseId, subsectionId } = req.body;
        const userId = req.user.id;

        //check if the section is present of not
        const subsection = await Subsection.findById(subsectionId);
        if (!subsection) {
            return res.status(400).json({
                success: false,
                message: "Invalid subsection"
            })
        }

        console.log('courseId', courseId)
        console.log('userId', userId)


        //fetch the courseprogress from CourseProgress model
        const courseProgress = await CourseProgress.findOne({
            userId: userId,
            courseId: courseId
        })
        
        console.log('courseprogess', courseProgress)

        //check if the courseProgress is present or not
        if (!courseProgress) {
            return res.status(400).json({
                success: false,
                message: "Course progress does not exist"
            })
        } else {
            //check if section is already added ?
            if (courseProgress.completeVideos.includes(subsectionId)) {
                return res.status(400).json({ success: false, message: "Subsection already completed" });
            }
            //push section in courseProgress complete videos array
            courseProgress.completeVideos.push(subsectionId);
        }
        //call save(); 
        await courseProgress.save();

        //return successful response
        return res.status(200).json({
            success: true,
            message: "Course progress updated"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}