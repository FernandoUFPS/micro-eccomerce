const EccomerceController = require("./controllers/EccomerceController");
const router = require("express").Router();

router.post("/buy", EccomerceController.buyProduct);
router.post("/buy-cart", EccomerceController.buyProducts);
router.get("/sales/:uid", EccomerceController.getSales);
router.patch("/create-offer", EccomerceController.updateOffSale);
router.get("/report", EccomerceController.getReport);

module.exports = router;
