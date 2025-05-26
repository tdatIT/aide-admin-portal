import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Button,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import axios from "axios";
import { patientCasesData } from "@/data/patientCasesData";
import { useNavigate } from "react-router-dom";

export function PatientCase() {
  const navigate = useNavigate();
  const [patientCases, setPatientCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with sample data
    const fetchPatientCases = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPatientCases(patientCasesData);
        setLoading(false);

        // TODO: Uncomment below code to use real API
        // try {
        //   const response = await axios.get('/api/patient-cases');
        //   setPatientCases(response.data);
        //   setLoading(false);
        // } catch (error) {
        //   console.error('Error fetching patient cases:', error);
        //   setLoading(false);
        // }
      } catch (error) {
        console.error('Error fetching patient cases:', error);
        setLoading(false);
      }
    };

    fetchPatientCases();
  }, []);

  const handleEdit = (id) => {
    // Implement edit functionality
    console.log('Edit patient case:', id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ca bệnh này?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setPatientCases(prevCases => prevCases.filter(case_ => case_.id !== id));

        // TODO: Uncomment below code to use real API
        // try {
        //   await axios.delete(`/api/patient-cases/${id}`);
        //   // Refresh the list after successful deletion
        //   const response = await axios.get('/api/patient-cases');
        //   setPatientCases(response.data);
        // } catch (error) {
        //   console.error('Error deleting patient case:', error);
        // }
      } catch (error) {
        console.error('Error deleting patient case:', error);
      }
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="light-green" className="mb-8 p-6">
          <div className="flex items-center justify-between">
            <Typography variant="h6" color="white">
              Danh sách bệnh nhân
            </Typography>
            <Button
              size="sm"
              color="white"
              className="flex items-center gap-2"
              onClick={() => navigate('/dashboard/patient-case/add')}
            >
              <PlusIcon className="h-4 w-4" />
              Thêm mới
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["ID", "Tên ca bệnh", "Chuẩn đoán", "Số lượt thực hiện", "Trạng thái", "Ngày tạo", "Chức năng"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <Typography>Đang tải dữ liệu...</Typography>
                  </td>
                </tr>
              ) : patientCases.map((patientCase, key) => {
                const className = `py-3 px-5 ${
                  key === patientCases.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={patientCase.id}>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {patientCase.id}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {patientCase.caseName}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {patientCase.diagnosis}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {patientCase.executionCount}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={patientCase.status === 'active' ? "green" : "blue-gray"}
                        value={patientCase.status === 'active' ? "Hiển thị" : "Tạm ẩn"}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                      />
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {new Date(patientCase.createdAt).toLocaleDateString('vi-VN')}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex gap-2">
                        <Button
                          variant="text"
                          color="blue"
                          className="p-1"
                          onClick={() => handleEdit(patientCase.id)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="text"
                          color="red"
                          className="p-1"
                          onClick={() => handleDelete(patientCase.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default PatientCase;
