const mongoose = require("mongoose");
const mailSender = require("../Utility/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPschema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
        },
    },
);

async function sendVerificationEmail(email, otp) {
	// Send the email 
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		);
		console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		
	}
}

// Define a post-save hook to send email after the document has been saved
OTPschema.pre("save", async function (next) {
	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});
const OTP = mongoose.model("OTP", OTPschema);

module.exports = mongoose.model("OTP", OTPschema);