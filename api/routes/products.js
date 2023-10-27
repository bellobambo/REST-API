const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling get req to /product",
  });
});

router.post("/", (req, res, next) => {
  const product = {
    name: req.body.name,
    price: req.body.price,

  }
  res.status(201).json({
    message: "Handling post req to /product",
    createdProduct: product
  });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  if (id === "special") {
    res.status(200).json({
      message: "you discovered the special ID",
      id: id,
    });
  } else {
    res.status(200).json({
      message: "you passed an ID",
    });
  }
});

router.patch("/:productId", (req, res, next) => {
    res.status(200).json({
      message: "Edited Product",
    });

});
router.delete("/:productId", (req, res, next) => {
    res.status(200).json({
      message: "Deleted Product",
    });

});

module.exports = router;
