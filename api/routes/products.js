const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require('../middleware/check-auth')
const ProductsController = require('../controllers/products')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter
});

const Product = require("../models/product");


router.get("/", ProductsController.products_get_all);


router.post("/", checkAuth, upload.single("productImage"), ProductsController.products_create_product);


router.get("/:productId", ProductsController.produts_get_product);

router.patch("/:productId", checkAuth, ProductsController.update_a_product);

router.delete("/:productId", checkAuth, ProductsController.product_delete);

module.exports = router;
