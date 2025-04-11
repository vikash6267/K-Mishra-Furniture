const Product = require("../models/Product");
const slugify = require("slugify");
const validateMongoDbId = require("../utills/validateMongoDbId")
const Category = require("../models/Category")
// Controller to create a new product
exports.createProduct = async (req, res) => {
  try {
    // Extracting data from the request body
    const { title, description, price, category, highPrice, quantity,sizes, images } =
      req.body;


const imagesArray = JSON.parse(req.body.images);


    if (
      !title ||
      !description ||
      !price ||
      !category ||
    
      !quantity ||
      !imagesArray
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }

     // Check if the tag given is valid
     const categoryDetails = await Category.findById(category)
     if (!categoryDetails) {
       return res.status(404).json({
         success: false,
         message: "Category Details Not Found",
       })
     }

    // Creating a new product object
    const newProduct = await Product.create({
      title,
      slug: slugify(title),
      description,
      price,
      category: categoryDetails._id,
      highPrice,
      sizes:"N/A",
      quantity,
      images:imagesArray,
    });

    res.status(200).json({
      success: true,
      data: newProduct,
      message: "Product Created Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};


exports.getAllProduct = async (req, res) => {
  try {
      const allProduct = await Product.find().populate('category', 'name'); // Sirf category ka name populate hoga
      res.status(200).json({
          success: true,
          data: allProduct,
      });
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: error.message,
      });
  }
};



exports.getProductDetails = async(req, res) =>{
  try {
    const { productID } = req.body
    validateMongoDbId(productID)
    const productDetails = await Product.findOne({
      _id: productID,
    })
    // .populate("ratingAndReviews").exec()

    if (!productDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${productID}`,
      })
    }


    return res.status(200).json({
      success: true,
      data:{
        productDetails
      }
    
   
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


exports.deleteProduct = async (req, res) => {
  try {
    console.log(req.body)
    const { id } = req.body;

    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to delete product", error: error.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    console.log(req.body)
    const updatedData = req.body;
    const  productID  = updatedData.id;
    validateMongoDbId(productID); // Validate MongoDB ID


    // अगर `title` मौजूद है तो slug को भी अपडेट करें
    if (updatedData.title) {
      updatedData.slug = slugify(updatedData.title);
    }

    // अगर images JSON string में हैं, तो इसे पार्स करें
    if (updatedData.images) {
      updatedData.images = JSON.parse(updatedData.images);
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(productID, updatedData, {
      new: true, // Updated product return होगा
      runValidators: true, // Validation rules लागू होंगी
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};
