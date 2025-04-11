const Category = require("../models/Category")

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" })
    }
    const CategorysDetails = await Category.create({
      name: name,
    
    })
    // console.log(CategorysDetails)
    return res.status(200).json({
      CategorysDetails,
      success: true,
      message: "Categorys Created Successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.showAllCategories = async (req, res) => {
  try {
    const allCategorys = await Category.find()
    res.status(200).json({
      success: true,
      data: allCategorys,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body

    // Get product for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "product",
        populate: "ratingAndReviews",
      })
      .exec()

    console.log("SELECTED PRODUCT", selectedCategory)
    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.")
      return res
        .status(404)
        .json({ success: false, message: "Category not found" })
    }
    // Handle the case when there are no product
    console.log(selectedCategory)
    if (selectedCategory.products.length < 0) {
      console.log("No product found for the selected category.")
      return res.status(404).json({
        success: false,
        message: "No product found for the selected category.",
      })
    }

    // Get product for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "product",
      })
      .exec()
    console.log()
    // Get top-selling product across all categories
    const allCategories = await Category.find()
      .populate({
        path: "product",
       
      })
      .exec()
    const allProducts = allCategories.flatMap((category) => category.products)
    const mostSellingProduct = allProducts
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingProduct,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}


exports.editCategory = async (req,res)=>{
try{
  const { categoryId,name } = req.body
  if (!name||
      !categoryId )
       {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" })

      }
  const categories = await Category.findByIdAndUpdate(
  {_id:categoryId},
  {
    name:name,

  },
  {new:true})

if(!categories){
  return res
  .status(400)
  .json({ success: false, message: "Category is not avaialble" })
}
res.status(200).json({
  success: true,
  message: `Category Updated successfully`,
  data: updatedProfile,
})

}catch (error) {
  return res.status(500).json({
    success: false,
    message: error.message,
  })
}
}