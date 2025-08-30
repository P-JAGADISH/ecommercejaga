const User = require("../models/User")
const Order = require("../models/Order")
const { Op } = require("sequelize")

exports.getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, sortBy = "createdAt", sortOrder = "DESC" } = req.query

    const offset = (page - 1) * limit
    const where = {}

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ]
    }

    if (status) where.status = status

    const { count, rows: users } = await User.findAndCountAll({
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
      include: [
        {
          model: Order,
          as: "orders",
          attributes: ["id", "orderNumber", "total", "status", "createdAt"],
          limit: 5,
          order: [["createdAt", "DESC"]],
        },
      ],
    })

    res.json({
      success: true,
      data: {
        customers: users,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: Number.parseInt(limit),
        },
      },
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error: error.message,
    })
  }
}

exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findByPk(id, {
      include: [
        {
          model: Order,
          as: "orders",
          attributes: ["id", "orderNumber", "total", "status", "createdAt"],
          order: [["createdAt", "DESC"]],
        },
      ],
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Error fetching customer:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
      error: error.message,
    })
  }
}

exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, gender, addresses, preferences, notes } = req.body

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Customer with this email already exists",
      })
    }

    const referralCode = `REF${Date.now().toString().slice(-6)}`

    const user = await User.create({
      name,
      email,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender,
      addresses: addresses ? JSON.parse(addresses) : null,
      preferences: preferences ? JSON.parse(preferences) : null,
      referralCode,
      notes,
      role: "user",
      status: "Active",
    })

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: user,
    })
  } catch (error) {
    console.error("Error creating customer:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create customer",
      error: error.message,
    })
  }
}

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = { ...req.body }

    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth)
    }

    if (updateData.addresses && typeof updateData.addresses === "string") {
      updateData.addresses = JSON.parse(updateData.addresses)
    }
    if (updateData.preferences && typeof updateData.preferences === "string") {
      updateData.preferences = JSON.parse(updateData.preferences)
    }

    const [updatedRowsCount] = await User.update(updateData, {
      where: { id },
    })

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      })
    }

    const updatedUser = await User.findByPk(id)

    res.json({
      success: true,
      message: "Customer updated successfully",
      data: updatedUser,
    })
  } catch (error) {
    console.error("Error updating customer:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update customer",
      error: error.message,
    })
  }
}

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      })
    }

    const orderCount = await Order.count({ where: { userId: id } })
    if (orderCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete customer with existing orders",
      })
    }

    await user.destroy()

    res.json({
      success: true,
      message: "Customer deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting customer:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete customer",
      error: error.message,
    })
  }
}

exports.getCustomerStats = async (req, res) => {
  try {
    const totalCustomers = await User.count()
    const activeCustomers = await User.count({ where: { status: "Active" } })
    const inactiveCustomers = await User.count({ where: { status: "Inactive" } })
    const blockedCustomers = await User.count({ where: { status: "Blocked" } })

    const monthlyRegistrations = await User.findAll({
      attributes: [
        [User.sequelize.fn("DATE_FORMAT", User.sequelize.col("createdAt"), "%Y-%m"), "month"],
        [User.sequelize.fn("COUNT", User.sequelize.col("id")), "count"],
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 12)),
        },
      },
      group: [User.sequelize.fn("DATE_FORMAT", User.sequelize.col("createdAt"), "%Y-%m")],
      order: [[User.sequelize.fn("DATE_FORMAT", User.sequelize.col("createdAt"), "%Y-%m"), "ASC"]],
    })

    const topCustomers = await User.findAll({
      attributes: ["id", "name", "email", "totalSpent", "totalOrders"],
      order: [["totalSpent", "DESC"]],
      limit: 10,
    })

    const genderStats = await User.findAll({
      attributes: ["gender", [User.sequelize.fn("COUNT", User.sequelize.col("id")), "count"]],
      where: {
        gender: {
          [Op.not]: null,
        },
      },
      group: ["gender"],
    })

    res.json({
      success: true,
      data: {
        overview: {
          totalCustomers,
          activeCustomers,
          inactiveCustomers,
          blockedCustomers,
        },
        monthlyRegistrations,
        topCustomers,
        genderStats,
      },
    })
  } catch (error) {
    console.error("Error fetching customer stats:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer statistics",
      error: error.message,
    })
  }
}

module.exports = exports