import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip,
  Avatar,
} from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import axiosInstance from "@/config/axios";
import UserRoleConfigModal from "@/components/UserRoleConfigModal";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/admin/iam/users");
      if (response.data.success) {
        setUsers(response.data.data.items);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleConfigClick = (user) => {
    setSelectedUser(user);
    setConfigModalOpen(true);
  };

  const handleConfigClose = () => {
    setConfigModalOpen(false);
    setSelectedUser(null);
    fetchUsers(); // Refresh the user list after role changes
  };

  const getRoleColor = (roleName) => {
    switch (roleName) {
      case "ROLE_SUPER_ADMIN":
        return "bg-red-500";
      case "ROLE_ADMIN":
        return "bg-blue-500";
      case "ROLE_USER":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Typography color="red">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Quản lý người dùng
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["ID", "Avatar", "Tên đầy đủ", "Email", "Trạng thái", "Vai trò", "Thao tác"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-6 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-medium uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-3 px-6">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {user.id}
                    </Typography>
                  </td>
                  <td className="py-3 px-6">
                    <Avatar
                      src={user.avatarUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                      alt={user.fullName}
                      size="sm"
                      className="rounded-full"
                    />
                  </td>
                  <td className="py-3 px-6">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {user.fullName}
                    </Typography>
                  </td>
                  <td className="py-3 px-6">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {user.email}
                    </Typography>
                  </td>
                  <td className="py-3 px-6">
                    <Chip
                      value={user.active ? "Hoạt động" : "Không hoạt động"}
                      color={user.active ? "green" : "red"}
                      size="sm"
                    />
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Chip
                          key={role.id}
                          value={role.roleName.replace("ROLE_", "")}
                          color={role.roleName === "ROLE_SUPER_ADMIN" ? "red" : role.roleName === "ROLE_ADMIN" ? "blue" : "green"}
                          size="sm"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <Button
                      variant="text"
                      color="blue"
                      size="sm"
                      className="mr-2"
                      onClick={() => handleConfigClick(user)}
                    >
                      Cấu hình
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <UserRoleConfigModal
        open={configModalOpen}
        handleOpen={handleConfigClose}
        user={selectedUser}
      />
    </div>
  );
} 