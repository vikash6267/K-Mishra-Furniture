const bodyParser = require("body-parser");

const express = require("express")
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const {errorHandler} = require("./middlewares/errorHandler")
const imageRoute = require("./routes/imageRoute");
const productsRoutes = require("./routes/products")
const userRoutes = require("./routes/userRoutes")

const couponRoute = require("./routes/couponRoutes")
const orderRoutes = require("./routes/orderRoutes")
// Loading environment variables from .env file
dotenv.config();

// Setting up port number
const PORT = process.env.PORT || 3010;
// Connecting to database
database.connect();

// Middlewares
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json());
app.use(cookieParser());

app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);


// Connecting to cloudinary
cloudinaryConnect();


// Setting up routes
app.use("/api/v1/product", productsRoutes);
app.use("/api/v1/user",userRoutes)

app.use("/api/v1/image", imageRoute);
app.use("/api/v1/coupon", couponRoute);
app.use("/api/v1/order", orderRoutes);



app.use(errorHandler)
// Testing the server
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});

// End of code.
