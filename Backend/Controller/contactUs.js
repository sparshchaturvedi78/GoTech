const  { contactUsEmail }  = require("../mail/templates/contactFormRes")
const { mailSender } = require("../Utility/mailSender");

exports.contactUsController = async(req, res) => {
    try {
        //get all the data from req body
        const { firstName, lastName, email, phoneNo, message, countryCode} = req.body;

        const mailRes = await mailSender(
            email,
            "Your Feedback Send Successfully",
            contactUsEmail(firstName, lastName, email, phoneNo, message, countryCode)
        )

        console.log("code yaha tak aaya hai")

        return res.status(200).json({
            success: true,
            message: "Feedback mail sent successfully",
            mailRes
        });     
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}