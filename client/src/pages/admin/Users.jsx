import React from "react";
import { MdEmail, MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import {
  useGetAllUserQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "../../redux/api/userApi";

const Users = () => {
  const { data, isLoading, isError, error, refetch } = useGetAllUserQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = data?.users || [];

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateUserRole({ userId, role: newRole }).unwrap();
      toast.success("User role updated successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        console.log("Attempting to delete user with ID:", userId); // Debug log
        const response = await deleteUser(userId).unwrap();
        console.log("Delete response:", response); // Debug log
        toast.success("User deleted successfully");
        refetch();
      } catch (err) {
        console.error("Detailed delete error:", {
          error: err,
          status: err.status,
          data: err.data,
        });
        toast.error(err?.data?.message || "Failed to delete user");
      }
    }
  };
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader />

        {Array.isArray(users) && users.length > 0 ? (
          <UserTable
            users={users}
            onUpdateRole={handleUpdateRole}
            onDeleteUser={handleDeleteUser}
          />
        ) : (
          <NoUsersFound />
        )}
      </div>
    </div>
  );
};

// Sub-components
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading users...</p>
    </div>
  </div>
);

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
    <div className="text-center">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h3 className="text-xl font-medium text-gray-900">
        Failed to load users
      </h3>
      <p className="mt-2 text-gray-600">
        {error?.data?.message || "Please try again later"}
      </p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Retry
      </button>
    </div>
  </div>
);

const PageHeader = () => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
      <p className="text-gray-600">Manage all platform users</p>
    </div>
  </div>
);

const UserTable = ({ users, onUpdateRole, onDeleteUser }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <TableHeader>User</TableHeader>
            <TableHeader>Contact</TableHeader>
            <TableHeader>Role</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <UserRow
              key={user._id}
              user={user}
              onUpdateRole={onUpdateRole}
              onDeleteUser={onDeleteUser}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TableHeader = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const UserRow = ({ user, onUpdateRole, onDeleteUser }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState(user.role);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleRoleSubmit = () => {
    onUpdateRole(user._id, selectedRole);
    setIsEditing(false);
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <UserAvatar name={user.name} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <UserContact email={user.email} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="border rounded p-1 text-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleRoleSubmit}
              className="text-green-600 hover:text-green-800"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <UserRole role={user.role} />
            <button
              onClick={() => setIsEditing(true)}
              className="text-indigo-600 hover:text-indigo-800"
              title="Edit role"
            >
              <MdEdit size={16} />
            </button>
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onDeleteUser(user._id)}
          className="text-red-600 hover:text-red-800"
          title="Delete user"
        >
          <MdDelete size={18} />
        </button>
      </td>
    </tr>
  );
};

const UserAvatar = ({ name }) => (
  <div className="flex items-center">
    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
      <span className="text-gray-600 font-medium">
        {(name?.charAt(0) || "U").toUpperCase()}
      </span>
    </div>
    <div className="ml-4">
      <div className="text-sm font-medium text-gray-900">
        {name || "Unknown"}
      </div>
    </div>
  </div>
);

const UserContact = ({ email }) => (
  <div className="flex items-center gap-2 text-sm text-gray-900">
    <MdEmail className="text-gray-400" />
    {email || "No email"}
  </div>
);

const UserRole = ({ role }) => (
  <span
    className={`px-2 py-1 text-xs font-medium rounded-full ${
      role === "admin"
        ? "bg-indigo-100 text-indigo-800"
        : "bg-gray-100 text-gray-800"
    }`}
  >
    {role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}
  </span>
);

const NoUsersFound = () => (
  <div className="text-center py-12">
    <h3 className="text-lg font-medium text-gray-900">No users found</h3>
    <p className="mt-1 text-sm text-gray-500">
      There are currently no users in the system
    </p>
  </div>
);

export default Users;
