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
} from "@material-tailwind/react";
import { PlusIcon, XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import axiosInstance from "@/config/axios";
import { useNavigate } from "react-router-dom";

export function AddPatientCase() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clinicalCategories, setClinicalCategories] = useState([]);
  const [paraclinicalCategories, setParaclinicalCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: 0,
    occupation: "",
    medicalHistory: "",
    dentalHistory: "",
    suggestedTests: [""],
    clinicalExams: [{
      testCategoryId: "",
      result: "",
      notes: "",
      imageKey: 0
    }],
    paraclinicalTests: [{
      testCategoryId: "",
      result: "",
      notes: "",
      imageKey: 0
    }],
    diagnosis: {
      diagnosisName: "",
      description: "",
      notes: ""
    },
    treatment: {
      description: "",
      notes: ""
    }
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [clinicalResponse, paraclinicalResponse] = await Promise.all([
          axiosInstance.get('/api/v1/admin/clinical-ex-cats?page=0&limit=1000'),
          axiosInstance.get('/api/v1/admin/paraclinical-test-cats?page=0&limit=1000')
        ]);

        const clinicalData = clinicalResponse.data.data?.items || [];
        const paraclinicalData = paraclinicalResponse.data.data?.items || [];

        setClinicalCategories(clinicalData);
        setParaclinicalCategories(paraclinicalData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

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

  const handleArrayInputChange = (arrayName, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => {
        if (i !== index) return item;
        // Nếu là suggestedTests (mảng string)
        if (arrayName === "suggestedTests") return value;
        // Nếu là mảng object
        return { ...item, [field]: value };
      })
    }));
  };

  const addSuggestedTest = () => {
    if (formData.suggestedTests.some(test => !test || test.trim() === "")) return;
    setFormData(prev => ({
      ...prev,
      suggestedTests: [...prev.suggestedTests, ""]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (file, arrayName, index) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post('/api/v1/admin/uploads/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.data?.id) {
        setFormData(prev => ({
          ...prev,
          [arrayName]: prev[arrayName].map((item, i) => {
            if (i !== index) return item;
            return {
              ...item,
              imageKey: response.data.data.id,
              imageUrl: response.data.data.url // Sử dụng URL từ Cloudinary
            };
          })
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const addArrayItem = (arrayName) => {
    const newItem = {
      testCategoryId: "",
      result: "",
      notes: "",
      imageKey: 0,
      imageUrl: ""
    };

    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], newItem]
    }));
  };

  const handleRemoveImage = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => {
        if (i !== index) return item;
        return {
          ...item,
          imageKey: 0,
          imageUrl: ""
        };
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post('/api/v1/admin/patient-cases', formData);
      navigate('/dashboard/patient-case');
    } catch (error) {
      console.error('Error creating patient case:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="light-green" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Thêm ca bệnh mới
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            <Input
              label="Tên ca bệnh"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <Input
              label="Nghề nghiệp"
              value={formData.occupation}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
              required
            />

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

            <div>
              <Typography variant="h6" className="mb-2">Các xét nghiệm đề xuất</Typography>
              {formData.suggestedTests.map((test, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={test}
                    onChange={(e) => handleArrayInputChange('suggestedTests', index, '', e.target.value)}
                    required
                  />
                  <Button
                    variant="text"
                    color="red"
                    onClick={() => removeArrayItem('suggestedTests', index)}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </Button>
                </div>
              ))}
              <Button
                variant="text"
                color="blue"
                onClick={addSuggestedTest}
                className="mt-2"
              >
                Thêm xét nghiệm
              </Button>
            </div>

            <div>
              <Typography variant="h6" className="mb-2">Khám lâm sàng</Typography>
              {formData.clinicalExams.map((exam, index) => (
                <div key={index} className="border p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Select
                      label="Danh mục xét nghiệm"
                      value={exam.testCategoryId}
                      onChange={(value) => handleArrayInputChange('clinicalExams', index, 'testCategoryId', value)}
                      required
                    >
                      {clinicalCategories.map((category) => (
                        <Option key={category.id} value={category.id}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>
                    <Input
                      label="Kết quả"
                      value={exam.result}
                      onChange={(e) => handleArrayInputChange('clinicalExams', index, 'result', e.target.value)}
                      required
                    />
                  </div>
                  <Textarea
                    label="Ghi chú"
                    value={exam.notes}
                    onChange={(e) => handleArrayInputChange('clinicalExams', index, 'notes', e.target.value)}
                  />
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {exam.imageKey && exam.imageUrl ? (
                            <div className="relative w-full h-full">
                              <img
                                src={exam.imageUrl}
                                alt="Uploaded"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                                }}
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemoveImage('clinicalExams', index);
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <PhotoIcon className="w-8 h-8 mb-2 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files[0], 'clinicalExams', index)}
                        />
                      </label>
                    </div>
                  </div>
                  <Button
                    variant="text"
                    color="red"
                    onClick={() => removeArrayItem('clinicalExams', index)}
                    className="mt-2"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </Button>
                </div>
              ))}
              <Button
                variant="text"
                color="blue"
                onClick={() => addArrayItem('clinicalExams')}
                className="mt-2"
              >
                <span className="flex items-center gap-2">
                  <PlusIcon className="h-5 w-5" />
                  Thêm khám lâm sàng
                </span>
              </Button>
            </div>

            <div>
              <Typography variant="h6" className="mb-2">Xét nghiệm cận lâm sàng</Typography>
              {formData.paraclinicalTests.map((test, index) => (
                <div key={index} className="border p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Select
                      label="Danh mục xét nghiệm"
                      value={test.testCategoryId}
                      onChange={(value) => handleArrayInputChange('paraclinicalTests', index, 'testCategoryId', value)}
                      required
                    >
                      {paraclinicalCategories.map((category) => (
                        <Option key={category.id} value={category.id}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>
                    <Input
                      label="Kết quả"
                      value={test.result}
                      onChange={(e) => handleArrayInputChange('paraclinicalTests', index, 'result', e.target.value)}
                      required
                    />
                  </div>
                  <Textarea
                    label="Ghi chú"
                    value={test.notes}
                    onChange={(e) => handleArrayInputChange('paraclinicalTests', index, 'notes', e.target.value)}

                  />
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {test.imageKey && test.imageUrl ? (
                            <div className="relative w-full h-full">
                              <img
                                src={test.imageUrl}
                                alt="Uploaded"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                                }}
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemoveImage('paraclinicalTests', index);
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <PhotoIcon className="w-8 h-8 mb-2 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files[0], 'paraclinicalTests', index)}
                        />
                      </label>
                    </div>
                  </div>
                  <Button
                    variant="text"
                    color="red"
                    onClick={() => removeArrayItem('paraclinicalTests', index)}
                    className="mt-2"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </Button>
                </div>
              ))}
              <Button
                variant="text"
                color="blue"
                onClick={() => addArrayItem('paraclinicalTests')}
                className="mt-2"
              >
                <span className="flex items-center gap-2">
                  <PlusIcon className="h-5 w-5" />
                  Thêm xét nghiệm cận lâm sàng
                </span>
              </Button>
            </div>

            <div className="border p-4 rounded-lg">
              <Typography variant="h6" className="mb-4">Chẩn đoán</Typography>
              <div className="flex flex-col gap-4">
                <Input
                  label="Tên chẩn đoán"
                  value={formData.diagnosis.diagnosisName}
                  onChange={(e) => handleNestedInputChange('diagnosis', 'diagnosisName', e.target.value)}
                  required
                />
                <Textarea
                  label="Mô tả"
                  value={formData.diagnosis.description}
                  onChange={(e) => handleNestedInputChange('diagnosis', 'description', e.target.value)}
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
                <Textarea
                  label="Mô tả"
                  value={formData.treatment.description}
                  onChange={(e) => handleNestedInputChange('treatment', 'description', e.target.value)}
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
                {loading ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default AddPatientCase; 