import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Checkbox,
  Avatar,
} from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import axiosInstance from "@/config/axios";
import { toast } from "react-toastify";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/admin/iam/users', {
        params: {
          page: page - 1,
          size: 10
        }
      });
      setUsers(response.data.data.items);
      setTotalPages(Math.ceil(response.data.data.total / response.data.data.size));
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/iam/roles');
      setRoles(response.data.data.items);
    } catch (error) {
      toast.error('Failed to fetch roles');
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
    fetchRoles();
  }, [currentPage]);

  const handleConfigureClick = (user) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles.map(role => role.id));
    setIsModalOpen(true);
  };

  const handleRoleChange = (roleId) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      }
      return [...prev, roleId];
    });
  };

  const handleSaveRoles = async () => {
    if (!selectedUser) return;

    try {
      // Get roles to add and remove
      const currentRoleIds = selectedUser.roles.map(role => role.id);
      const rolesToAdd = selectedRoles.filter(roleId => !currentRoleIds.includes(roleId));
      const rolesToRemove = currentRoleIds.filter(roleId => !selectedRoles.includes(roleId));

      // Add new roles
      for (const roleId of rolesToAdd) {
        await axiosInstance.post(`/api/admin/iam/users/${selectedUser.id}/roles/${roleId}`);
      }

      // Remove old roles
      for (const roleId of rolesToRemove) {
        await axiosInstance.delete(`/api/admin/iam/users/${selectedUser.id}/roles/${roleId}`);
      }

      toast.success('User roles updated successfully');
      setIsModalOpen(false);
      fetchUsers(currentPage);
    } catch (error) {
      toast.error('Failed to update user roles');
    }
  };

  const isSuperAdmin = (user) => {
    return user.roles.some(role => role.roleName === 'ROLE_SUPER_ADMIN');
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            User Management
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto p-4">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-sm">
                <th className="px-4 py-2 font-bold text-gray-700 bg-gray-100 text-sm w-[10%]">ID</th>
                <th className="px-4 py-2 font-bold text-gray-700 bg-gray-100 text-sm w-[30%]">Tên</th>
                <th className="px-4 py-2 font-bold text-gray-700 bg-gray-100 text-sm w-[30%]">Email</th>
                <th className="px-4 py-2 font-bold text-gray-700 bg-gray-100 text-sm w-[15%]">Trạng thái</th>
                <th className="px-4 py-2 font-bold text-gray-700 bg-gray-100 text-sm w-[15%]">Ngày tạo</th>
                <th className="px-4 py-2 font-bold text-gray-700 bg-gray-100 text-sm w-[15%]">Chức nắng</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200">
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">
                    <Avatar
                      src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                      alt={user.name}
                      size="sm"
                      className="border border-blue-gray-50 shadow shadow-blue-gray-500/40"
                    />
                    <span className="px-2 py-1 rounded-full text-xs">{user.fullName}</span>
                  </td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2">{user.createdAt}</td>
                  <td className="px-4 py-2">
                    <Button
                      variant="gradient"
                      color="blue"
                      size="sm"
                      onClick={() => handleConfigureClick(user)}
                      disabled={isSuperAdmin(user)}
                    >
                      Configure
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 mt-4">
            <Button
              variant="outlined"
              color="blue"
              size="sm"
              className="flex items-center gap-1"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </Button>
            <span className="px-2 text-sm">
              Page {currentPage} / {totalPages}
            </span>
            <Button
              variant="outlined"
              color="blue"
              size="sm"
              className="flex items-center gap-1"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardBody>
      </Card>

      <Dialog open={isModalOpen} handler={() => setIsModalOpen(false)}>
        <DialogHeader>Configure User Roles</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedRoles.includes(role.id)}
                  onChange={() => handleRoleChange(role.id)}
                  label={role.roleName}
                />
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setIsModalOpen(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button variant="gradient" color="blue" onClick={handleSaveRoles}>
            Save Changes
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default UsersPage; 