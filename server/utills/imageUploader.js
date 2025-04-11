const cloudinary = require("cloudinary").v2

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = { folder }
  if (height) {
    options.height = height
  }
  if (quality) {
    options.quality = 50
  }
  options.resource_type = "auto"
  console.log("OPTIONS", options)
  return await cloudinary.uploader.upload(file.tempFilePath, options)
}







exports.cloudinaryUploadImg = (fileToUploads, folderName) => {
  return new Promise((resolve, reject) => {
    console.log("enter the cloudinary");

    const uploadOptions = {
      folder: process.env.FOLDER_NAME,
      resource_type: "auto",
    };

    cloudinary.uploader.upload(fileToUploads, uploadOptions, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        reject(error);
      } else {
        console.log('Cloudinary upload result:', result);
        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
          resource_type: "auto",
        });
      }
    });
  });
};
