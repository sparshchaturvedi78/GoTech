const User = require("../Models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Authenticate user req
exports.auth = async (req, res, next) => {
    try {
        //extract token from body, cookies, header
        const token =
			req.cookies.token ||
			req.body.token ||
			req.header("Authorization").replace("Bearer ", "");


        // If JWT is missing, return 401 Unauthorized response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            })
        }

        try {
            // Verifying the JWT using the secret key stored in environment variables
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("jwt token decoded, its payload is", decode);
            // Storing the decoded JWT payload in the request object for further use
            req.user = decode;
        } catch (err) {
            return res
                .status(401)
                .json({ success: false, message: "Token is invalid" });
        }
        // If JWT is valid, move on to the next middleware or request handler
        next();
    } catch (error) {
        // If there is an error during the authentication process, return 401 Unauthorized response
        return res.status(401).json({
            success: false,
            message: `Something Went Wrong While Validating the Token`,
            error: error.message
        });
    }
}

//Protectec route for student
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Students",
            });
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User Role Can't be Verified` });
    }
}

//Protected route for instructor
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Instructor",
            });
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User Role Can't be Verified` });
    }
}

//Protected route for admin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Admin",
            });
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User Role Can't be Verified` });
    }
}

