const User = require("../Models/user");
const Profile = require("../Models/additionalDetails");
const Courses = require("../Models/courses");
const { uploadImageToCloudinary } = require("../Utility/imageUploader");
const courseProgress = require("../Models/courseProgress");
const { convertSecondsToDuration } = require('../Utility/secToDuration')

require("dotenv").config();

//Update profile controller
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body

    const id = req.user.id;


    //find the user by id and profile by user additional detail
    const user = await User.findById(id);
    const profile = await Profile.findById(user.additionalDetails);

    //update the  user firstName and lastName and save
    if (firstName || lastName) {
      if (firstName) {
        user.firstName = firstName;
      } if (lastName) {
        user.lastName = lastName;
      }
    }

    await user.save();

    //update the profile fields and save
    profile.dateOfBirth = dateOfBirth
    profile.about = about
    profile.contactNumber = contactNumber
    profile.gender = gender

    await profile.save();

    //find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    //return res
    return res.status(200).json({
      success: true,
      message: "User profile updatd successfully",
      updatedUserDetails
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    })
  }
}

//Deleted User profile
exports.deleteAccount = async (req, res) => {
  try {
    //fetch user id from req body
    const id = req.user.id;
    console.log("ID", id);
    //find user
    const user = await User.findOne({ _id: id });
    console.log(user);
    //delete user from additional detail model
    await Profile.findByIdAndDelete(
      { _id: user.additionalDetails }
    );

    //delete user from every course they link
    for (const course in user.courses) {
      await Courses.findByIdAndDelete(course,
        { $pull: { studentEnrolled: id } },
        { new: true }
      );
    }

    //delete user and also the courseProgress of the user
    await courseProgress.deleteMany({ userId: id })
    await User.findByIdAndDelete(id);
    //send response
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({
        success: false,
        message: "User Cannot be deleted successfully",
        error: error.message
      })
  }
}

//Get all userDetails 
exports.getAllUserDetails = async (req, res) => {
  try {
    //fetch the user id 
    const id = req.user.id;

    //find the user
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    //validate user available or not
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not present in database"
      })
    }
    //return res
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

//update display picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    const updatedProfile = await User.findByIdAndUpdate({ _id: userId },
      { image: image.secure_url },
      { new: true }
    )

    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

//Get enrolled course - copy paste
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id

    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subsection",
          },
        },
      })
      .exec()

    userDetails = userDetails.toObject()

    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subsection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subsection.length
      }

      let courseProgressCount = await courseProgress.findOne({
        courseId: userDetails.courses[i]._id,
        userId: userId,
      })

      // Default to 0 if courseProgressCount is null or completeVideos is undefined
      courseProgressCount = courseProgressCount?.completeVideos?.length || 0;

      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        // Calculate progress percentage and cap it at 100
        const progress = (courseProgressCount / SubsectionLength) * 100;
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage = Math.min(
          Math.round(progress * multiplier) / multiplier,
          100 // Cap at 100
        );
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

//Instructor dashboard - go through one more time
exports.instructorDashboard = async (req, res) => {
  try {

    const courseDetails = await Courses.find({ instructor: req.user.id })
    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}