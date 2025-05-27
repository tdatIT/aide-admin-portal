import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Switch,
  Tooltip,
  Chip,
} from "@material-tailwind/react";
import { EyeIcon, PencilIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import axiosInstance from "@/config/axios";
import { useNavigate } from "react-router-dom";
import PatientCaseDetailModal from "@/components/PatientCaseDetailModal";
import { toast } from "react-toastify";
import PatientCaseJsonModal from "@/components/PatientCaseJsonModal";

const columns = [
  { label: "ID", key: "id" },
  { label: "Tên ca bệnh", key: "name" },
  { label: "Yêu cầu", key: "requestCounter" },
  { label: "Mô tả điều trị", key: "treatmentDescription" },
  { label: "Trạng thái", key: "status" },
  { label: "Ngày tạo", key: "createdAt" },
  { label: "Người tạo", key: "createdBy" },
  { label: "Hành động", key: "action" },
];

export default function PatientCaseList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [selectedPatientCase, setSelectedPatientCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jsonOpen, setJsonOpen] = useState(false);
  const [jsonPatientCase, setJsonPatientCase] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/v1/admin/patient-cases?page=${page}&limit=${size}`);
        const items = res.data.data?.items || [];
        setData(items);
        setTotal(res.data.data?.total || 0);
        setHasMore(res.data.data?.hasMore || false);
      } catch (err) {
        setData([]);
        setTotal(0);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, size]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const isPublished = currentStatus !== "PUBLISHED";
      await axiosInstance.put(`/api/v1/admin/patient-cases/${id}/status?isPublished=${isPublished}`);
      toast.success(isPublished ? "Đã xuất bản thành công!" : "Đã ẩn ca bệnh!");
      // Reload data
      const res = await axiosInstance.get(`/api/v1/admin/patient-cases?page=${page}&limit=${size}`);
      const items = res.data.data?.items || [];
      setData(items);
      setTotal(res.data.data?.total || 0);
      setHasMore(res.data.data?.hasMore || false);
    } catch (err) {
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  const handleAddPatientCase = () => {
    navigate("/dashboard/patient-case/add");
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/v1/admin/patient-cases/${id}`);
      setSelectedPatientCase(response.data.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching patient case details:", error);
    }
  };

  const handleViewJson = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/v1/admin/patient-cases/${id}`);
      setJsonPatientCase(response.data.data);
      setJsonOpen(true);
    } catch (error) {
      console.error("Error fetching patient case details:", error);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="light-green" className="mb-8 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Typography variant="h6" color="white">
            Danh sách ca bệnh
          </Typography>
          <Button color="white" className="flex items-center gap-2 text-light-green-700" onClick={handleAddPatientCase}>
            <PlusIcon className="h-5 w-5" />
            Thêm mới ca bệnh
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-auto p-4">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-sm">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-2 font-bold text-gray-700 bg-gray-100 text-sm">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                data.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">{patient.id}</td>
                    <td className="px-4 py-2 max-w-xs truncate text-sm" title={patient.name}>{patient.name}</td>
                    <td className="px-4 py-2 text-sm">{patient.requestCounter}</td>
                    <td className="px-4 py-2 max-w-xs truncate text-sm" title={patient.treatment?.description}>{patient.treatment?.description || ""}</td>
                    <td className="px-4 py-2 text-sm">
                      {patient.status === "PUBLISHED" ? (
                        <Chip color="green" size="sm" value="PUBLISHED" className="font-bold" />
                      ) : patient.status === "UNPUBLISHED" ? (
                        <Chip color="amber" size="sm" value="UNPUBLISHED" className="font-bold" />
                      ) : (
                        <Chip color="gray" size="sm" value="Chưa có" className="font-bold" />
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm">{new Date(patient.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 max-w-xs truncate text-sm" title={patient.createdBy}>{patient.createdBy}</td>
                    <td className="px-4 py-2 flex gap-2 items-center text-sm">
                      <Tooltip content="Xem chi tiết">
                        <Button variant="text" color="blue-gray" size="sm" onClick={() => handleViewDetails(patient.id)}>
                          <EyeIcon className="h-5 w-5" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Xem JSON">
                        <Button variant="text" color="teal" size="sm" onClick={() => handleViewJson(patient.id)}>
                          {'{ }'}
                        </Button>
                      </Tooltip>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 mt-4">
            <Button
              variant="outlined"
              color="light-green"
              size="sm"
              className="flex items-center gap-1"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Trước
            </Button>
            <span className="px-2 text-sm">
              Trang {page + 1} / {Math.max(1, Math.ceil(total / size))}
            </span>
            <Button
              variant="outlined"
              color="light-green"
              size="sm"
              className="flex items-center gap-1"
              disabled={!hasMore && (page + 1) * size >= total}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardBody>
      </Card>

      <PatientCaseDetailModal
        open={isModalOpen}
        handleOpen={() => setIsModalOpen(false)}
        patientCase={selectedPatientCase}
      />

      <PatientCaseJsonModal
        open={jsonOpen}
        handleClose={() => setJsonOpen(false)}
        patientCase={jsonPatientCase}
      />
    </div>
  );
} 