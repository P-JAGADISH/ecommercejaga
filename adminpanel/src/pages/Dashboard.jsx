

import { useState } from "react"
import { TrendingUp, TrendingDown, ShoppingCart, Users, Package, DollarSign, Eye, Calendar } from "lucide-react"
import { allProducts } from "../data/productsData"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 89432,
    totalOrders: 156,
    totalProducts: allProducts.length,
    totalCustomers: 1245,
    revenueGrowth: 16,
    ordersGrowth: 23,
    customersGrowth: 8,
  })

  const [recentOrders] = useState([
    {
      id: "#NY1234",
      customer: "Priya Sharma",
      email: "priya@example.com",
      status: "Delivered",
      amount: 2999,
      date: "2024-03-15",
      items: 2,
    },
    {
      id: "#NY1235",
      customer: "Rahul Kumar",
      email: "rahul@example.com",
      status: "Processing",
      amount: 1499,
      date: "2024-03-14",
      items: 1,
    },
    {
      id: "#NY1236",
      customer: "Anita Singh",
      email: "anita@example.com",
      status: "Shipped",
      amount: 3299,
      date: "2024-03-13",
      items: 3,
    },
    {
      id: "#NY1237",
      customer: "Vikram Patel",
      email: "vikram@example.com",
      status: "Pending",
      amount: 899,
      date: "2024-03-12",
      items: 1,
    },
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      case "Pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const StatCard = ({ title, value, growth, icon: Icon, color }) => (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {growth !== undefined && (
            <div className="flex items-center mt-2">
              {growth > 0 ? (
                <TrendingUp className="text-green-500 mr-1" size={16} />
              ) : (
                <TrendingDown className="text-red-500 mr-1" size={16} />
              )}
              <span className={`text-sm font-medium ${growth > 0 ? "text-green-600" : "text-red-600"}`}>
                {Math.abs(growth)}% from last month
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} />
          <span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          growth={stats.revenueGrowth}
          icon={DollarSign}
          color="bg-gradient-to-r from-green-500 to-emerald-600"
        />
        <StatCard
          title="Orders"
          value={stats.totalOrders.toLocaleString()}
          growth={stats.ordersGrowth}
          icon={ShoppingCart}
          color="bg-gradient-to-r from-blue-500 to-cyan-600"
        />
        <StatCard
          title="Products"
          value={stats.totalProducts.toLocaleString()}
          icon={Package}
          color="bg-gradient-to-r from-purple-500 to-indigo-600"
        />
        <StatCard
          title="Customers"
          value={stats.totalCustomers.toLocaleString()}
          growth={stats.customersGrowth}
          icon={Users}
          color="bg-gradient-to-r from-orange-500 to-red-600"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50">
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View All</button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-sm text-gray-500">{order.items} items</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{order.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50">
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View All</button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {allProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl">
                  <img
                    src={product.image || "/placeholder.svg?height=48&width=48"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 line-clamp-1">{product.name}</h4>
                    <p className="text-sm text-gray-600">₹{product.price}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp size={16} />
                      <span className="text-sm font-medium">+{product.reviewCount}</span>
                    </div>
                    <p className="text-xs text-gray-500">sales</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-colors">
            <Package className="text-indigo-600" size={24} />
            <span className="text-sm font-medium text-gray-700">Add Product</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-colors">
            <ShoppingCart className="text-green-600" size={24} />
            <span className="text-sm font-medium text-gray-700">View Orders</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-colors">
            <Users className="text-blue-600" size={24} />
            <span className="text-sm font-medium text-gray-700">Customers</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:from-orange-100 hover:to-red-100 transition-colors">
            <Eye className="text-orange-600" size={24} />
            <span className="text-sm font-medium text-gray-700">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
