const User = require("../Models/user");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const  mailSender  = require("../Utility/mailSender");


//Generate token and url or Send resete password mail 
exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        const userDetails = await User.findOne({ email: email });
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: `User with this email ${email} is not registered with us. Please enter valid id`
            })
        }

        const token = crypto.randomBytes(20).toString("hex");
        const updateDetails = await User.findByIdAndUpdate(
            { _id: userDetails._id },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            { new: true }
        )
        console.log("DETAILS", updateDetails);
        const url = `http://localhost:5173/update-password/${token}`;

        await mailSender(
            email,
            "Password Reset",
            `Your Link for email verification is ${url}. Please click this url to reset your password.`
        );

        return res.status(200).json({
            success: true,
            message: "Email Sent Successfully, Please Check Your Email to Continue Further",
            token: token,
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            success: false,
            message: `Some Error in Sending the Reset Message`,
        })
    }
}

//Reset password and update the user
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirmPassword does not match"
            })
        }

        const userDetails = await User.findOne({ token: token });
        console.log(userDetails);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "Invalid token"
            })
        }

        if (!(userDetails.resetPasswordExpires > Date.now())) {
            return res.status(404).json({
                success: false,
                message: "Link expired"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findByIdAndUpdate(
            userDetails._id,
            { password: hashPassword },
            { new: true }
        );

        userDetails.token = "",
        userDetails.resetPasswordExpires = ""

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
            Data: updatedUser
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}