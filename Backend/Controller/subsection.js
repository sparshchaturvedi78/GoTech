const Section = require("../Models/section");
const SubSection = require("../Models/subSection");
const { uploadImageToCloudinary } = require("../Utility/imageUploader")
require("dotenv").config();


exports.createSubSection = async (req, res) => {
    try {
        const { title, description, sectionId } = req.body;
        const video = req.files.video

        if (!title || !description || !sectionId || !video) {
            return res.status(400).json({
                successs: false,
                message: "All fields required"
            })
        }

        const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
        )

        // Create a new sub-section with the necessary information
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })

        const newSeubSection = await Section.findByIdAndUpdate(sectionId,
            {
                $push: {
                    subsection: SubSectionDetails._id,
                }
            },
            { new: true }
        )
            .populate("subsection")

        return res.status(200).json({
            success: true,
            message: "subSection created successfully",
            data: newSeubSection
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error, can't create subsection",
            error: error.message
        })
    }
}

exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, subsectionId, title, description } = req.body;

        const subsection = await SubSection.findById(subsectionId);
        
        if (!subsection) {
            return res.status(400).json({
                success: false,
                message: "Sub section not available"
            })
        }

        if (title !== undefined) {
            subsection.title = title;
        }

        if (description !== undefined) {
            subsection.description = description;
        }

        if (req.files && req.files.video !== undefined) {
            const video = req.files.video;
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subsection.videoUrl = uploadDetails.secure_url;
            subsection.timeDuration = uploadDetails.duration
        }

        await subsection.save();

        const updatedSection = await Section.findByIdAndUpdate(sectionId)
            .populate("subsection")


        return res.status(200).json({
            success: true,
            message: "Subsection updated successfully",
            data: updatedSection
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error, can't update subsection",
            error: error.message
        })
    }
}

exports.deleteSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId } = req.body;

        if (!sectionId || !subSectionId) {
            return res.status(404).json({
                success: false,
                message: "All properties are required"
            })
        }

        await Section.findByIdAndUpdate(sectionId,
            {
                $pull: {
                    subsection: subSectionId,
                },
            }
        )

        const subsection = await SubSection.findByIdAndDelete(subSectionId);
        if (!subsection) {
            return res
                .status(404)
                .json({ success: false, message: "SubSection not found" })
        }

        const updatedSection = await Section.findById(sectionId)
            .populate("subsection");

        return res.json({
            success: true,
            message: "SubSection deleted successfully",
            data: updatedSection,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error, can't delete subsection"
        })
    }
}