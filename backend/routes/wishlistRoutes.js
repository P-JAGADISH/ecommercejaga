const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const Wishlist = require("../models/Wishlist")
const Product = require("../models/Product")

// Get user's wishlist
router.get("/wishlist", authMiddleware, async (req, res) => {
  try {
    console.log("Fetching wishlist for user:", req.userId)

    const wishlistItems = await Wishlist.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "variants", "images"],
          required: true,
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    console.log("Found wishlist items:", wishlistItems.length)

    const formattedItems = wishlistItems.map((item) => {
      let variants = []
      let images = []
      let wishlistImage = item.image ? `http://localhost:5000${item.image}` : "https://via.placeholder.com/100"

      try {
        variants =
          typeof item.product.variants === "string" ? JSON.parse(item.product.variants) : item.product.variants || []
        images = typeof item.product.images === "string" ? JSON.parse(item.product.images) : item.product.images || []
      } catch (parseError) {
        console.error("Error parsing product data:", parseError)
        variants = []
        images = []
      }

      return {
        id: item.product.id,
        name: item.product.name,
        price: variants.length > 0 ? variants[0].price : 0,
        image: wishlistImage,
        color: variants.length > 0 ? variants[0].color : "",
        addedAt: item.createdAt,
      }
    })

    res.json({
      success: true,
      items: formattedItems,
      count: formattedItems.length,
    })
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
      error: error.message,
    })
  }
})

// Add item to wishlist
router.post("/wishlist", authMiddleware, async (req, res) => {
  const { productId } = req.body

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required",
    })
  }

  try {
    console.log("Adding product to wishlist:", { userId: req.userId, productId })

    // Check if product exists
    const product = await Product.findByPk(productId, {
      attributes: ["id", "name", "variants", "images"],
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    // Check if already in wishlist
    const existingWishlistItem = await Wishlist.findOne({
      where: {
        userId: req.userId,
        productId: productId,
      },
    })

    if (existingWishlistItem) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      })
    }

    // Parse images
    let images = []
    try {
      images = typeof product.images === "string" ? JSON.parse(product.images) : product.images || []
    } catch (parseError) {
      console.error("Error parsing product images:", parseError)
    }

    const imagePath = images.length > 0 ? images[0].replace('http://localhost:5000', '') : null

    // Add to wishlist with image
    const wishlistItem = await Wishlist.create({
      userId: req.userId,
      productId: productId,
      image: imagePath,
    })

    console.log("Wishlist item created:", wishlistItem.id)

    // Format response
    let variants = []
    try {
      variants = typeof product.variants === "string" ? JSON.parse(product.variants) : product.variants || []
    } catch (parseError) {
      console.error("Error parsing product data:", parseError)
    }

    const formattedItem = {
      id: product.id,
      name: product.name,
      price: variants.length > 0 ? variants[0].price : 0,
      image: wishlistItem.image ? `http://localhost:5000${wishlistItem.image}` : "https://via.placeholder.com/100",
      color: variants.length > 0 ? variants[0].color : "",
      addedAt: wishlistItem.createdAt,
    }

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      item: formattedItem,
    })
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    res.status(500).json({
      success: false,
      message: "Failed to add to wishlist",
      error: error.message,
    })
  }
})

// Remove item from wishlist
router.delete("/wishlist/:productId", authMiddleware, async (req, res) => {
  const { productId } = req.params

  try {
    console.log("Removing from wishlist:", { userId: req.userId, productId })

    const wishlistItem = await Wishlist.findOne({
      where: {
        userId: req.userId,
        productId: productId,
      },
    })

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist",
      })
    }

    await wishlistItem.destroy()
    console.log("Wishlist item removed successfully")

    res.json({
      success: true,
      message: "Product removed from wishlist",
    })
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    res.status(500).json({
      success: false,
      message: "Failed to remove from wishlist",
      error: error.message,
    })
  }
})

module.exports = router