"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Calendar, Copy } from "lucide-react"
import { useToast } from "../context/ToastContext"
import Modal from "../components/Modal"
import ConfirmDialog from "../components/ConfirmDialog"

const Coupons = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minPurchase: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    status: "Active",
  })

  const { addToast } = useToast()

  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: "SUMMER25",
      type: "percentage",
      value: 25,
      minPurchase: 1000,
      maxDiscount: 500,
      startDate: "2024-06-01",
      endDate: "2024-06-30",
      usageLimit: 100,
      usageCount: 45,
      status: "Active",
    },
    {
      id: 2,
      code: "WELCOME10",
      type: "percentage",
      value: 10,
      minPurchase: 500,
      maxDiscount: 200,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      usageLimit: 0,
      usageCount: 156,
      status: "Active",
    },
    {
      id: 3,
      code: "FLAT200",
      type: "fixed",
      value: 200,
      minPurchase: 1500,
      maxDiscount: 0,
      startDate: "2024-05-15",
      endDate: "2024-07-15",
      usageLimit: 50,
      usageCount: 12,
      status: "Active",
    },
    {
      id: 4,
      code: "SPRING30",
      type: "percentage",
      value: 30,
      minPurchase: 2000,
      maxDiscount: 800,
      startDate: "2024-03-01",
      endDate: "2024-04-30",
      usageLimit: 200,
      usageCount: 187,
      status: "Expired",
    },
  ])

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || coupon.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddCoupon = () => {
    const newCoupon = {
      id: Date.now(),
      ...formData,
      value: Number.parseFloat(formData.value),
      minPurchase: Number.parseFloat(formData.minPurchase),
      maxDiscount: Number.parseFloat(formData.maxDiscount),
      usageLimit: Number.parseInt(formData.usageLimit),
      usageCount: 0,
    }

    setCoupons([...coupons, newCoupon])
    setFormData({
      code: "",
      type: "percentage",
      value: "",
      minPurchase: "",
      maxDiscount: "",
      startDate: "",
      endDate: "",
      usageLimit: "",
      status: "Active",
    })
    setShowAddModal(false)
    addToast("Coupon added successfully!", "success")
  }

  const handleEditCoupon = () => {
    const updatedCoupons = coupons.map((coupon) =>
      coupon.id === selectedCoupon.id
        ? {
            ...coupon,
            ...formData,
            value: Number.parseFloat(formData.value),
            minPurchase: Number.parseFloat(formData.minPurchase),
            maxDiscount: Number.parseFloat(formData.maxDiscount),
            usageLimit: Number.parseInt(formData.usageLimit),
          }
        : coupon,
    )
    setCoupons(updatedCoupons)
    setShowEditModal(false)
    setSelectedCoupon(null)
    addToast("Coupon updated successfully!", "success")
  }

  const handleDeleteCoupon = () => {
    const updatedCoupons = coupons.filter((coupon) => coupon.id !== selectedCoupon.id)
    setCoupons(updatedCoupons)
    setSelectedCoupon(null)
    addToast("Coupon deleted successfully!", "success")
  }

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon)
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      minPurchase: coupon.minPurchase.toString(),
      maxDiscount: coupon.maxDiscount.toString(),
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      usageLimit: coupon.usageLimit.toString(),
      status: coupon.status,
    })
    setShowEditModal(true)
  }

  const openDeleteDialog = (coupon) => {
    setSelectedCoupon(coupon)
    setShowDeleteDialog(true)
  }

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
    addToast(`Coupon code "${code}" copied to clipboard!`, "success")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Expired":
        return "bg-red-100 text-red-800"
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const CouponForm = ({ isEdit = false }) => (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. SUMMER25"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formData.type === "percentage" ? "Discount Percentage" : "Discount Amount"}
          </label>
          <input
            type="number"
            name="value"
            value={formData.value}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={formData.type === "percentage" ? "e.g. 25" : "e.g. 200"}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Purchase</label>
          <input
            type="number"
            name="minPurchase"
            value={formData.minPurchase}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. 1000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Discount</label>
          <input
            type="number"
            name="maxDiscount"
            value={formData.maxDiscount}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. 500 (0 for no limit)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
          <input
            type="number"
            name="usageLimit"
            value={formData.usageLimit}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. 100 (0 for unlimited)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Scheduled">Scheduled</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={() => (isEdit ? setShowEditModal(false) : setShowAddModal(false))}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={isEdit ? handleEditCoupon : handleAddCoupon}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {isEdit ? "Update Coupon" : "Add Coupon"}
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Coupon Management</h1>
          <p className="text-gray-600 mt-1">Create and manage discount coupons</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700"
        >
          <Plus size={20} />
          Add Coupon
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search coupons..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="scheduled">Scheduled</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Code</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Discount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Min. Purchase</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Validity</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Usage</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-indigo-600">{coupon.code}</span>
                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Copy code"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                    {coupon.maxDiscount > 0 && coupon.type === "percentage" && (
                      <span className="text-sm text-gray-500 block">Max: ₹{coupon.maxDiscount}</span>
                    )}
                  </td>
                  <td className="py-4 px-6">{coupon.minPurchase > 0 ? `₹${coupon.minPurchase}` : "None"}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span>
                        {coupon.startDate} to {coupon.endDate}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {coupon.usageCount} / {coupon.usageLimit > 0 ? coupon.usageLimit : "∞"}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(coupon.status)}`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Coupon"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(coupon)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Coupon Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Coupon" size="lg">
        <CouponForm />
      </Modal>

      {/* Edit Coupon Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Coupon" size="lg">
        <CouponForm isEdit={true} />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteCoupon}
        title="Delete Coupon"
        message={`Are you sure you want to delete the coupon "${selectedCoupon?.code}"? This action cannot be undone.`}
        type="danger"
      />
    </div>
  )
}

export default Coupons
