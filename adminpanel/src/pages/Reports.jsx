"use client"

import { useState } from "react"
import { BarChart, LineChart, PieChart, Download, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react"

const Reports = () => {
  const [dateRange, setDateRange] = useState("month")
  const [reportType, setReportType] = useState("sales")

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        name: "Sales",
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 26000, 35000, 32000, 40000, 48000],
      },
    ],
  }

  const ordersData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        name: "Orders",
        data: [65, 85, 72, 95, 88, 120, 110, 105, 130, 125, 145, 160],
      },
    ],
  }

  const categoryData = {
    labels: ["Dresses", "Tops", "Pants", "Jackets", "Skirts", "Accessories", "Activewear"],
    datasets: [
      {
        name: "Sales by Category",
        data: [35, 25, 15, 10, 8, 5, 2],
      },
    ],
  }

  const renderChart = () => {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {reportType === "sales"
              ? "Sales Overview"
              : reportType === "orders"
                ? "Orders Overview"
                : "Sales by Category"}
          </h3>
          <div className="flex gap-3">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last 12 Months</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        <div className="h-80 w-full">
          {/* This is a placeholder for the chart. In a real app, you would use a charting library like Chart.js, Recharts, etc. */}
          <div className="h-full w-full bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-indigo-600 mb-2">
                {reportType === "sales" ? (
                  <LineChart size={48} />
                ) : reportType === "orders" ? (
                  <BarChart size={48} />
                ) : (
                  <PieChart size={48} />
                )}
              </div>
              <p className="text-gray-600">
                {reportType === "sales"
                  ? "Sales Chart"
                  : reportType === "orders"
                    ? "Orders Chart"
                    : "Category Distribution Chart"}
              </p>
              <p className="text-sm text-gray-500 mt-2">(This is a placeholder for a real chart)</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">View detailed reports and insights about your business</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
            <span className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUpRight size={16} />
              16%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹89,432</p>
          <p className="text-sm text-gray-500 mt-2">Compared to ₹77,125 last month</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
            <span className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUpRight size={16} />
              23%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">156</p>
          <p className="text-sm text-gray-500 mt-2">Compared to 127 last month</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Average Order Value</h3>
            <span className="flex items-center text-red-600 text-sm font-medium">
              <ArrowDownRight size={16} />
              5%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹573</p>
          <p className="text-sm text-gray-500 mt-2">Compared to ₹607 last month</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Conversion Rate</h3>
            <span className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUpRight size={16} />
              8%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">3.2%</p>
          <p className="text-sm text-gray-500 mt-2">Compared to 2.9% last month</p>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setReportType("sales")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              reportType === "sales" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <LineChart size={16} />
            Sales Report
          </button>
          <button
            onClick={() => setReportType("orders")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              reportType === "orders" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <BarChart size={16} />
            Orders Report
          </button>
          <button
            onClick={() => setReportType("categories")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              reportType === "categories" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <PieChart size={16} />
            Category Report
          </button>
        </div>
      </div>

      {/* Chart */}
      {renderChart()}

      {/* Data Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
        <div className="p-6 border-b border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900">
            {reportType === "sales" ? "Sales Data" : reportType === "orders" ? "Orders Data" : "Category Data"}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  {reportType === "categories" ? "Category" : "Period"}
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  {reportType === "sales" ? "Revenue" : reportType === "orders" ? "Orders" : "Sales (%)"}
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  {reportType === "categories" ? "Products" : "Growth"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {(reportType === "sales" ? salesData : reportType === "orders" ? ordersData : categoryData).labels.map(
                (label, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{label}</td>
                    <td className="py-4 px-6">
                      {reportType === "sales"
                        ? `₹${salesData.datasets[0].data[index].toLocaleString()}`
                        : reportType === "orders"
                          ? ordersData.datasets[0].data[index]
                          : `${categoryData.datasets[0].data[index]}%`}
                    </td>
                    <td className="py-4 px-6">
                      {reportType === "categories" ? (
                        Math.floor(Math.random() * 50) + 5
                      ) : (
                        <span
                          className={`flex items-center ${Math.random() > 0.3 ? "text-green-600" : "text-red-600"}`}
                        >
                          {Math.random() > 0.3 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                          {Math.floor(Math.random() * 30) + 1}%
                        </span>
                      )}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Reports
