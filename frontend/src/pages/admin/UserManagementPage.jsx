import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUser } from "../../features/admin/adminSlice";
import Spinner from "../../components/common/Spinner";
import { Trash2 } from "lucide-react";

const UserManagementPage = () => {
  const dispatch = useDispatch();
  const { users, status } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleDelete = (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      dispatch(deleteUser(userId));
    }
  };

  if (status === "loading") return <Spinner />;

  return (
    <div className="bg-dark-secondary p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-dark-text mb-6">
        User Management
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-green-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
