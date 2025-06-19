import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Select,
  Option,
  Textarea,
  Spinner,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import axiosInstance from "@/config/axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CreatableSelect from 'react-select/creatable';

const UpdatePatientCase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: 0,
    occupation: "",
    mode: "",
    reasonForVisit: "",
    medicalHistory: "",
    dentalHistory: "",
    clinicalHistory: "",
    suggestedTests: [""],
    instruction: "",
    diagnosis: {
      diagPrelim: "",
      diagDiff: "",
      notes: ""
    },
    treatment: {
      treatmentNotes: "",
    }
  });

  useEffect(() => {
    if (id) {
      fetchPatientCase();
    }
  }, [id]);

  const fetchPatientCase = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/v1/admin/patient-cases/${id}`);
      const data = response.data.data;
      setFormData({
        name: data.name || "",
        gender: data.gender || "",
        age: data.age || 0,
        occupation: data.occupation || "",
        mode: data.mode || "",
        reasonForVisit: data.reasonForVisit || "",
        medicalHistory: data.medicalHistory || "",
        dentalHistory: data.dentalHistory || "",
        clinicalHistory: data.clinicalHistory || "",
        suggestedTests: data.suggestedTests && data.suggestedTests.length > 0 ? data.suggestedTests : [""],
        instruction: data.instruction || "",
        diagnosis: {
          diagPrelim: data.diagnosis?.diagPrelim || "",
          diagDiff: data.diagnosis?.diagDiff || "",
          notes: data.diagnosis?.notes || ""
        },
        treatment: {
          treatmentNotes: data.treatment?.treatmentNotes || "",
        }
      });
    } catch (error) {
      console.error("Error fetching patient case:", error);
      toast.error("Failed to fetch patient case");
      navigate("/dashboard/patient-case");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      suggestedTests: prev.suggestedTests.map((item, i) => (i === index ? value : item))
    }));
  };

  const addSuggestedTest = () => {
    if (formData.suggestedTests.some(test => !test || test.trim() === "")) return;
    setFormData(prev => ({
      ...prev,
      suggestedTests: [...prev.suggestedTests, ""]
    }));
  };

  const removeSuggestedTest = (index) => {
    setFormData(prev => ({
      ...prev,
      suggestedTests: prev.suggestedTests.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put(`/api/v1/admin/patient-cases/${id}`, formData);
      toast.success("Patient case updated successfully");
      navigate('/dashboard/patient-case');
    } catch (error) {
      console.error('Error updating patient case:', error);
      toast.error("Failed to update patient case");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Typography variant="h6" color="white">
            Cập nhật thông tin bệnh nhân mô phỏng
          </Typography>
          <Button color="white" className="flex items-center gap-2 text-blue-700"
            onClick={() => navigate(`/dashboard/patient-case/edit/${id}/test-results`)}
          >
            Cập nhật thông tin xét nghiệm
          </Button>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Tên ca bệnh"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
              <Select
                label="Độ khó"
                value={formData.mode}
                onChange={(value) => handleInputChange('mode', value)}
                required>
                <Option value="EASY">Dễ</Option>
                <Option value="NORMAL">Trung bình</Option>
                <Option value="HARD">Khó</Option>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Select
                  label="Giới tính"
                  value={formData.gender}
                  onChange={(value) => handleInputChange('gender', value)}
                  required
                >
                  <Option value="MALE">Nam</Option>
                  <Option value="FEMALE">Nữ</Option>
                </Select>
              </div>
              <div>
                <Input
                  type="number"
                  label="Tuổi"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="text"
                  label="Nghề nghiệp"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                />
              </div>
            </div>

            <Input
              label="Lý do đến khám"
              value={formData.reasonForVisit}
              onChange={(e) => handleInputChange('reasonForVisit', e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Textarea
                label="Tiền sử bệnh"
                value={formData.medicalHistory}
                onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                required
              />

              <Textarea
                label="Tiền sử nha khoa"
                value={formData.dentalHistory}
                onChange={(e) => handleInputChange('dentalHistory', e.target.value)}
                required
              />
            </div>

            <Input
              label="Bệnh sử"
              value={formData.instruction}
              onChange={(e) => handleInputChange('clinicalHistory', e.target.value)}
              required
            />

            <div>
              <CreatableSelect
                isMulti
                value={formData.suggestedTests.map(val => ({ value: val, label: val }))}
                onChange={(selected) => {
                  handleInputChange('suggestedTests', selected ? selected.map(opt => opt.value) : []);
                }}
                placeholder="Xét nghiệm đề xuất (nhập và nhấn Enter để thêm)"
              />
            </div>

            <Textarea
              label="Chỉ dẫn"
              value={formData.instruction}
              onChange={(e) => handleInputChange('instruction', e.target.value)}
              required
            />
            <div className="border p-4 rounded-lg">
              <Typography variant="h6" className="mb-4">Chẩn đoán</Typography>
              <div className="flex flex-col gap-4">
                <Input
                  label="Chẩn đoán sơ bộ"
                  value={formData.diagnosis.diagPrelim}
                  onChange={(e) => handleNestedInputChange('diagnosis', 'diagPrelim', e.target.value)}
                  required
                />
                <Input
                  label="Chẩn đoán phân biệt"
                  value={formData.diagnosis.diagDiff}
                  onChange={(e) => handleNestedInputChange('diagnosis', 'diagDiff', e.target.value)}
                  required
                />
                <Textarea
                  label="Ghi chú"
                  value={formData.diagnosis.notes}
                  onChange={(e) => handleNestedInputChange('diagnosis', 'notes', e.target.value)}
                />
              </div>
            </div>
            <div className="border p-4 rounded-lg">
              <Typography variant="h6" className="mb-4">Điều trị</Typography>
              <div className="flex flex-col gap-4">
                <Input
                  label="Kế hoạch điều trị"
                  value={formData.treatment.plan}
                  onChange={(e) => handleNestedInputChange('treatment', 'plan', e.target.value)}
                  required
                />
                <Textarea
                  label="Ghi chú"
                  value={formData.treatment.notes}
                  onChange={(e) => handleNestedInputChange('treatment', 'notes', e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant="outlined"
                color="red"
                onClick={() => navigate('/dashboard/patient-case')}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                color="light-green"
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Cập nhật'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default UpdatePatientCase; 