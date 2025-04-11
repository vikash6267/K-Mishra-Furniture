const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()


// Signup Controller for Registering USers

// exports.signup = async (req, res) => {
//   try {
//     // Destructure fields from the request body
//     const {
//       name,
//       email,
//       password,
//       confirmPassword,
//       contactNumber,
//     } = req.body
//     // Check if All Details are there or not
//     if (
//       !name ||
//       !email ||
//       !password ||
//       !confirmPassword 
//     ) {
//       return res.status(403).send({
//         success: false,
//         message: "All Fields are required",
//       })
//     }
//     // Check if password and confirm password match
//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Password and Confirm Password do not match. Please try again.",
//       })
//     }





//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10)

  

    
//     const user = await User.create({
//       name,
//       email,
//       contactNumber,
//       password: hashedPassword,
//       image: `https://api.dicebear.com/5.x/initials/svg?seed=${name} `,
//     })

//     return res.status(200).json({
//       success: true,
//       user,
//       message: "User registered successfully",
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({
//       success: false,
//       message: "User cannot be registered. Please try again.",
//     })
//   }
// }



exports.signup = async (req, res) => {
  try {
    // Destructure fields from the request body
    const {
      name,
      email,
      password,
      contactNumber,
    } = req.body;

  console.log(req.body)

    // Check if All Details are there or not
    if (!name || !email || !password ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }



    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);




    // Create user in the database
    const user = await User.create({
      name,
      email,
      contactNumber,
      password: hashedPassword,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${name} `,
    
    });




    console.log(user)
    console.log("enter")
    // Log in the user after signup
    let token;
    try {
      token = jwt.sign(
        { email: user.email, id: user._id, role: user.accountType },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
    } catch (error) {
      console.error("JWT token generation error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to generate authentication token",
      });
    }
    console.log("end")



    // Set cookie for token
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("token", token, options);

    // Return success response
    return res.status(200).json({
      success: true,
      token,
      user,
      message: "User registered and logged in successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};




// Login controller for authenticating users
exports.login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body

    // Check if email or password is missing
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      })
    }

    // Find user with provided email
    const user = await User.findOne({ email })

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      })
    }

    // Generate JWT token and Compare Password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.accountType },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h"
        }
      )

      // Save token to user document in database
      user.token = token
      user.password = undefined
      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      })
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      })
    }
  } catch (error) {
    console.error(error)
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    })
  }
}








  
  exports.fetchMyProfile = async (req, res) => {
    try {
      // Get email and password from request body
      const id = req.user.id
  
      const userDetails = await User.findById(id);

  
  
      // Find user with provided email
      const user = await User.findById(id)
  
      // If user not found with provided email
      if (!user) {
        // Return 401 Unauthorized status code with error message
        return res.status(401).json({
          success: false,
          message: `User is not Registered with Us Please SignUp to Continue`,
        })
      }
  
             return res.status(200).json({
                user,
          success: true,
          message: `Fetch Data Successfully`,
        })
      
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: `Error During fetch data`,
      })
    }
  }

