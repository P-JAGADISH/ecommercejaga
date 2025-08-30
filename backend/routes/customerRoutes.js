const express = require("express")
const router = express.Router()
const customerController = require("../controllers/customerController")
const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

router.use(authMiddleware)
router.use(adminMiddleware)

router.get("/", customerController.getAllCustomers)
router.get("/stats", customerController.getCustomerStats)
router.get("/:id", customerController.getCustomerById)
router.post("/", customerController.createCustomer)
router.put("/:id", customerController.updateCustomer)
router.delete("/:id", customerController.deleteCustomer)

module.exports = router