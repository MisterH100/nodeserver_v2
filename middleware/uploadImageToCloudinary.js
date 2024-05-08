import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImagesToCloudinary = async (req, res, next) => {
  const filepaths = req.files;
  console.log(req.files);
  const imageURLs = [];

  const uploadPromises = filepaths.map((filepath) => {
    return cloudinary.uploader.upload("./uploads/" + filepath.filename, {
      public_id: filepath.originalname.replace("./png", ""),
      folder: "misc",
    });
  });

  Promise.all(uploadPromises)
    .then((results) => {
      results.forEach((result) => {
        imageURLs.push(result.url);
        console.log(result.url);
      });
      req.images = imageURLs;
      next();
    })
    .catch((error) => {
      console.error("Failed to upload images:", error);
      res.status(500).send({ message: "Failed to upload images" });
    });
};
