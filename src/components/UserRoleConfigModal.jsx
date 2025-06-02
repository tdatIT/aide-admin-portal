import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Switch,
  Tooltip,
} from "@material-tailwind/react";
import { XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import axiosInstance from "@/config/axios";

export default function UserRoleConfigModal({ open, handleOpen, user }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (open && user) {
      fetchRoles();
      setUserRoles(user.roles.map(role => role.id));
      // Focus the close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }
  }, [open, user]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/admin/iam/roles");
      if (response.data.success) {
        setRoles(response.data.data.items);
      } else {
        setError("Failed to fetch roles");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching roles");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (roleId, roleName) => {
    if (roleName === "ROLE_SUPER_ADMIN") {
      setError("Không thể thay đổi quyền SUPER_ADMIN");
      return;
    }

    try {
      setLoading(true);
      const isAdding = !userRoles.includes(roleId);
      await axiosInstance.post(`/api/admin/iam/users/${user.id}/roles/${roleId}`);
      
      setUserRoles(prev => {
        if (isAdding) {
          return [...prev, roleId];
        } else {
          return prev.filter(id => id !== roleId);
        }
      });
    } catch (err) {
      setError(err.message || "An error occurred while updating role");
    } finally {
      setLoading(false);
    }
  };

  const isSuperAdminRole = (role) => role.roleName === "ROLE_SUPER_ADMIN";

  if (!user) return null;

  return (
    <Dialog 
      size="sm" 
      open={open} 
      handler={handleOpen}
      className="focus:outline-none"
    >
      <DialogHeader className="justify-between">
        <Typography variant="h5" color="blue-gray">
          Cấu hình quyền người dùng
        </Typography>
        <Button 
          variant="text" 
          color="blue-gray" 
          onClick={handleOpen}
          ref={closeButtonRef}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <XMarkIcon className="h-5 w-5" />
        </Button>
      </DialogHeader>
      <DialogBody className="max-h-[80vh] overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Typography variant="h6" color="blue-gray">
              {user.fullName}
            </Typography>
            <Typography variant="small" color="gray">
              ({user.email})
            </Typography>
          </div>

          {error && (
            <Typography color="red" className="text-sm flex items-center gap-2">
              <ExclamationTriangleIcon className="h-4 w-4" />
              {error}
            </Typography>
          )}

          <div className="space-y-2">
            {roles.map((role) => (
              <div 
                key={role.id} 
                className={`flex items-center justify-between p-2 border rounded-lg ${
                  isSuperAdminRole(role) ? 'bg-gray-50' : ''
                }`}
              >
                <div>
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    {role.roleName.replace("ROLE_", "")}
                  </Typography>
                  {role.description && (
                    <Typography variant="small" color="gray">
                      {role.description}
                    </Typography>
                  )}
                </div>
                <Tooltip
                  content={isSuperAdminRole(role) ? "Không thể thay đổi quyền SUPER_ADMIN" : ""}
                  placement="top"
                >
                  <div>
                    <Switch
                      color="blue"
                      checked={userRoles.includes(role.id)}
                      onChange={() => handleRoleToggle(role.id, role.roleName)}
                      disabled={loading || isSuperAdminRole(role)}
                      className="focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button 
          variant="text" 
          color="blue-gray" 
          onClick={handleOpen}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Đóng
        </Button>
      </DialogFooter>
    </Dialog>
  );
} 