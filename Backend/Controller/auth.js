const User = require("../Models/user");
const OTP = require("../Models/otp");
const AdditionalDetails = require("../Models/additionalDetails");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator")
const mailSender = require("../Utility/mailSender");
require("dotenv").config();
const passwordUpdated = require('../mail/templates/passwordUpdate')


//SignUp
exports.signUp = async (req, res) => {
    try {
        //Fetch all the details from the body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp,
        } = req.body;

        console.log("Email received for otp verification", email)

        //Validate if any entry is missing
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword ||
            !accountType ||
            !otp
        ) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            })
        }


        //check password and confrm password is to be same
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passoword and ConfirmPassword do not match...try again"
            })
        }

        //check if user already exist
        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already exist. Try to log in"
            })
        }

        //find the most recent otp
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

        console.log("Retrieved OTP from DB:", recentOtp)

        if (recentOtp.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Otp is not valid"
            })
        }
        if (recentOtp[0].otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Otp does not match"
            })
        }

        //Hash the passoword all validations are performed
        let hashPassword = await bcrypt.hash(password, 10);

        //approval set true for student and false for instructor
        let approved = ""
        approved = approved === "Instructor" ? false : true;
        console.log("approved status while signup", approved);

        //Add additionalDetails in user
        const additionalDetails = await AdditionalDetails.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        //Create the user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: additionalDetails._id,
        });
        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong, User Not registered successfully",
            error: err.message
        })
    }
}


//LogIn
exports.login = async (req, res) => {
    try {
        //fetch data from user body 
        const { email, password } = req.body;

        //validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //Check user exist in DB
        const user = await User.findOne({ email }).populate("additionalDetails")
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not Registered with Us Please SignUp to Continue"
            })
        }

        //Match password and generate token if matched
        let payload = {
            email: email,
            id: user._id,
            accountType: user.accountType
        }
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h",
                }
            )
            user.token = token
            user.password = undefined

            //create options for cookies
            const options = {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: `User Login Success`,
            })

        } else {
            return res.status(400).json({
                success: false,
                message: "Password does not match"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed, please wait or try after some time",
            error: error.message
        });
    }
}


//Send OTP
exports.sendOtp = async (req, res) => {
    try {
        //fetch email from body 
        const { email } = req.body;
        //validate data
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Fill all the fields"
            });
        }

        //check user exist or not in case of signup
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User is already registered"
            });
        }

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        const result = await OTP.findOne({ otp: otp })
        // console.log("Result is Generate OTP Func")
        // console.log("OTP", otp)
        // console.log("Result", result)
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            })
        }


        //Store otp in our db
        const otpBody = await OTP.create({ email, otp });
        console.log("OTP Body", otpBody)
        return res.status(200).json({
            success: true,
            message: "OTP send successfully",
            otp
        })


    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error occured while sending OTP",
            error: err.message
        })
    }
}


//Change Password
exports.changePassword = async (req, res) => {
    try {
        //fetch data from user body 
        const { oldPassword, newPassword } = req.body;


        //find user details from DB
        const user = await User.findById(req.user.id);
        console.log("user details", user);


        // Validate old password
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            user.password
        )
        if (!isPasswordMatch) {
            // If old password does not match, return a 401 (Unauthorized) error
            return res
                .status(401)
                .json({ success: false, message: "The old password is incorrect" })
        }

        let hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updateDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: hashedNewPassword },
            { new: true }
        );

        if (!updateDetails) {
            return res.status(400).json({
                success: false,
                message: "Password update failed. User not found."
            });
        }

        //send update password mail
        try {
            const emailResponse = await mailSender(
                updateDetails.email,
                "Password for your account has been updated",
                passwordUpdated(
                    updateDetails.email,
                    `Password updated successfully for ${updateDetails.firstName} ${updateDetails.lastName}`
                )
            )
            console.log("Email sent successfully:", emailResponse.response)

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Error occured while sending update password mail",
                error: error.message
            });
        }

        //return success mail
        return res.status(200).json({
            success: true,
            message: "Password update successfully"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Can't change password right now, try again",
            error: error.message
        })
    }
}

