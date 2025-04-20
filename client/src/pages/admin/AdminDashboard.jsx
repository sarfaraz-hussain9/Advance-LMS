import React, { useState, useMemo } from "react";
import {
  FaUsers,
  FaBook,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { MdDashboard, MdPayment, MdMessage } from "react-icons/md";
import Users from "./Users";
import AllCourses from "./AllCourses"; // Import the CourseAdmin component

const SIDEBAR_ITEMS = [
  {
    icon: <MdDashboard className="text-xl" />,
    name: "Dashboard",
    key: "dashboard",
  },
  { icon: <FaUsers className="text-xl" />, name: "Users", key: "users" },
  { icon: <FaBook className="text-xl" />, name: "Courses", key: "courses" },
  {
    icon: <MdPayment className="text-xl" />,
    name: "Payments",
    key: "payments",
  },
  {
    icon: <MdMessage className="text-xl" />,
    name: "Messages",
    key: "messages",
  },
  { icon: <FaCog className="text-xl" />, name: "Settings", key: "settings" },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = useMemo(
    () => [
      {
        id: 1,
        title: "Total Users",
        value: "1,243",
        change: "+12%",
        icon: <FaUsers className="text-3xl text-indigo-500" />,
        bgColor: "bg-indigo-50",
      },
      {
        id: 2,
        title: "Courses",
        value: "56",
        change: "+5%",
        icon: <FaBook className="text-3xl text-teal-500" />,
        bgColor: "bg-teal-50",
      },
      {
        id: 3,
        title: "Revenue",
        value: "$8,245",
        change: "+23%",
        icon: <MdPayment className="text-3xl text-amber-500" />,
        bgColor: "bg-amber-50",
      },
      {
        id: 4,
        title: "Messages",
        value: "24",
        change: "-3%",
        icon: <MdMessage className="text-3xl text-indigo-500" />,
        bgColor: "bg-indigo-50",
      },
    ],
    []
  );

  const recentUsers = useMemo(
    () => [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        joined: "2 days ago",
        status: "active",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        joined: "1 week ago",
        status: "pending",
      },
    ],
    []
  );

  const handleLogout = () => {
    console.log("Logging out...");
    // Add actual logout logic here
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "users":
        return <Users />;
      case "courses":
        return <AllCourses />; // Render the CourseAdmin component
      case "dashboard":
      default:
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className={`${stat.bgColor} rounded-lg shadow p-6 hover:shadow-md transition-shadow`}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold mt-2 text-gray-800">
                        {stat.value}
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          stat.change.startsWith("+")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change} from last month
                      </p>
                    </div>
                    <div>{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg text-gray-800">
                  Recent Users
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.joined}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              user.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.status.charAt(0).toUpperCase() +
                              user.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-indigo-700 text-white ${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-4 flex justify-between items-center border-b border-indigo-600">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:text-indigo-200 focus:outline-none transition-colors"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <FaBars className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center w-full p-4 ${
                activeTab === item.key ? "bg-indigo-800" : "hover:bg-indigo-600"
              } transition-colors`}
              aria-label={item.name}
            >
              <span>{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-600">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 hover:bg-indigo-600 rounded transition-colors"
            aria-label="Logout"
          >
            <FaSignOutAlt className="text-xl" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {activeTab.replace("-", " ")}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                  A
                </div>
                {sidebarOpen && <span>Admin</span>}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">{renderActiveTab()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
