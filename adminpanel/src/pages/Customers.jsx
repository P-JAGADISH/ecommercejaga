import { useState, useEffect } from "react"
import { Search, Eye, Edit, Trash2, Mail, Phone, MapPin, ShoppingBag } from "lucide-react"
import { useToast } from "../context/ToastContext"
import Modal from "../components/Modal"
import ConfirmDialog from "../components/ConfirmDialog"

const API_BASE_URL = "http://localhost:5000/api"
const getAuthToken = () => localStorage.getItem("token") || ""

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customers, setCustomers] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    addresses: "",
    status: "Active",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { addToast } = useToast()

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      try {
        const token = getAuthToken()
        if (!token) throw new Error("No authentication token found")
        const response = await fetch(`${API_BASE_URL}/customers?page=1&limit=100`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })
        if (!response.ok) throw new Error(`HTTP error ${response.status}: ${response.statusText}`)
        const { data } = await response.json()
        const mappedCustomers = data.customers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || "N/A",
          address: user.userAddresses ? user.userAddresses[0]?.street || "N/A" : "N/A",
          joinDate: user.joinDate || "N/A",
          totalOrders: user.totalOrders || 0,
          totalSpent: parseFloat(user.totalSpent) || 0,
          status: user.status || "Active",
          lastOrder: user.lastOrderDate ? new Date(user.lastOrderDate).toISOString().split("T")[0] : "N/A",
          avatar: user.avatar || "/placeholder.svg?height=40&width=40",
        }))
        setCustomers(mappedCustomers)
      } catch (err) {
        setError(err.message)
        addToast(`Failed to load customers: ${err.message}`, "error")
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [addToast])

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)

    const matchesStatus = statusFilter === "all" || customer.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleEditCustomer = async () => {
    try {
      const token = getAuthToken()
      if (!token) throw new Error("No authentication token found")
      const response = await fetch(`${API_BASE_URL}/customers/${selectedCustomer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          addresses: formData.addresses ? [{ street: formData.addresses }] : null,
          status: formData.status,
        }),
      })
      if (!response.ok) throw new Error(`HTTP error ${response.status}: ${response.statusText}`)
      const { data } = await response.json()
      setCustomers(customers.map(customer =>
        customer.id === selectedCustomer.id
          ? {
              ...customer,
              name: data.name,
              email: data.email,
              phone: data.phone,
              address: data.userAddresses ? data.userAddresses[0]?.street || "N/A" : "N/A",
              status: data.status,
            }
          : customer
      ))
      setShowEditModal(false)
      setSelectedCustomer(null)
      addToast("Customer updated successfully!", "success")
    } catch (err) {
      addToast(`Failed to update customer: ${err.message}`, "error")
    }
  }

  const handleDeleteCustomer = async () => {
    try {
      const token = getAuthToken()
      if (!token) throw new Error("No authentication token found")
      const response = await fetch(`${API_BASE_URL}/customers/${selectedCustomer.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error(`HTTP error ${response.status}: ${response.statusText}`)
      setCustomers(customers.filter(customer => customer.id !== selectedCustomer.id))
      setShowDeleteDialog(false)
      setSelectedCustomer(null)
      addToast("Customer deleted successfully!", "success")
    } catch (err) {
      addToast(`Failed to delete customer: ${err.message}`, "error")
    }
  }

  const openCustomerModal = (customer) => {
    setSelectedCustomer(customer)
    setShowCustomerModal(true)
  }

  const openEditModal = (customer) => {
    setSelectedCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      addresses: customer.address,
      status: customer.status,
    })
    setShowEditModal(true)
  }

  const openDeleteDialog = (customer) => {
    setSelectedCustomer(customer)
    setShowDeleteDialog(true)
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "blocked":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">View and manage customer information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl">
              <ShoppingBag className="text-white" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter((c) => c.status === "Active").length}
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
              <ShoppingBag className="text-white" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{customers.reduce((sum, c) => sum + c.totalOrders, 0)}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl">
              <ShoppingBag className="text-white" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl">
              <ShoppingBag className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search customers..."
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Contact</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Orders</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Total Spent</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Order</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                  

                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">Joined {customer.joinDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">{customer.totalOrders}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900">₹{customer.totalSpent.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-700">{customer.lastOrder}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openCustomerModal(customer)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(customer)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Customer"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(customer)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Customer"
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

        <div className="px-6 py-4 border-t border-gray-200/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of{" "}
            {filteredCustomers.length} customers
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={showCustomerModal} onClose={() => setShowCustomerModal(false)} title="Customer Details" size="lg">
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">

              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedCustomer.name}</h3>
                <p className="text-gray-600">Customer since {selectedCustomer.joinDate}</p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedCustomer.status)}`}
                >
                  {selectedCustomer.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-gray-700">{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-gray-700">{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-gray-400 mt-1" />
                    <span className="text-gray-700">{selectedCustomer.address}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Order Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Orders:</span>
                    <span className="font-medium">{selectedCustomer.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Spent:</span>
                    <span className="font-medium">₹{selectedCustomer.totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Order:</span>
                    <span className="font-medium">
                      ₹{selectedCustomer.totalOrders ? Math.round(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toLocaleString() : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Order:</span>
                    <span className="font-medium">{selectedCustomer.lastOrder}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Customer" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              name="addresses"
              value={formData.addresses}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <option value="Blocked">Blocked</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleEditCustomer}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Update Customer
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteCustomer}
        title="Delete Customer"
        message={`Are you sure you want to delete "${selectedCustomer?.name}"? This action cannot be undone.`}
        type="danger"
      />
    </div>
  )
}

export default Customers