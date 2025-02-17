const express = require("express");
const app = express();

const { dbConnect } = require("./Config/database");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
require("dotenv").config();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(cors({
    origin: '*',  // Allow all origins
}));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
)

//fetch all the routes
const userRoutes = require("./Routes/User");
const profileRoutes = require("./Routes/Profile");
const paymentRoutes = require("./Routes/Payments");
const courseRoutes = require("./Routes/Courses");
const contactUsRoute = require("./Routes/Contact");


const PORT = process.env.PORT || 4000;

//database connect
dbConnect();

//mount routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);



//cloudinary connection
cloudinaryConnect();

//def route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: 'Your server is up and running....'
    });
});

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`)
})