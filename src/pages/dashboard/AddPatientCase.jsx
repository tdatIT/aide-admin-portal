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
import { PlusIcon, XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import axiosInstance from "@/config/axios";
import { useNavigate } from "react-router-dom";
import CreatableSelect from 'react-select/creatable';

export function AddPatientCase() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clinicalCategories, setClinicalCategories] = useState([]);
  const [paraclinicalCategories, setParaclinicalCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: 60,
    mode: "",
    occupation: "",
    reasonForVisit: "",
    medicalHistory: "",
    dentalHistory: "",
    clinicalHistory: "",
    instruction: "",
    suggestedTests: [],
    clinicalExams: [{
      testCategoryId: 1,
      textResult: "",
      notes: "",
      imageKeys: []
    }],
    paraclinicalTests: [{
      testCategoryId: 1,
      textResult: "",
      notes: "",
      imageKeys: []
    }],
    diagnosis: {
      diagPrelim: "",
      diagDiff: "",
      notes: "",
    },
    treatment: {
      treatmentNotes: "",
    }
  });
  const [uploadingImages, setUploadingImages] = useState({});

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

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (files, arrayName, index) => {
    setUploadingImages(prev => ({ ...prev, [`${arrayName}-${index}`]: true }));
    try {
      const formDataUpload = new FormData();
      Array.from(files).forEach(file => {
        formDataUpload.append('files', file);
      });

      const response = await axiosInstance.post('/api/v1/admin/uploads/images', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.data) {
        const newImages = response.data.data.map(img => ({
          id: img.id,
          publicUrl: img.publicUrl
        }));
        setFormData(prev => ({
          ...prev,
          [arrayName]: prev[arrayName].map((item, i) => {
            if (i !== index) return item;
            return {
              ...item,
              imageObjects: [...newImages, ...(item.imageObjects || [])],
              imageKeys: [...newImages.map(img => img.id), ...(item.imageKeys || [])]
            };
          })
        }));
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploadingImages(prev => ({ ...prev, [`${arrayName}-${index}`]: false }));
    }
  };

  const addArrayItem = (arrayName) => {
    const newItem = {
      testCategoryId: "",
      notes: "",
      imageKeys: [],
      imageObjects: [],
      textResult: ""
    };

    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], newItem]
    }));
  };

  const handleRemoveImage = (arrayName, index, imageIdToRemove) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => {
        if (i !== index) return item;
        return {
          ...item,
          imageObjects: (item.imageObjects || []).filter(img => img.id !== imageIdToRemove),
          imageKeys: (item.imageKeys || []).filter(id => id !== imageIdToRemove)
        };
      })
    }));
  };

  const handleArrayInputChange = (arrayName, index, field, value) => {
    console.log(value);
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
    console.log(formData);
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
        <CardHeader variant="gradient" color="green" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Thêm ca bệnh mới
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Typography variant="h6" className="mb-2">Thông tin bệnh nhân mô phỏng</Typography>

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

            <div>
              <Typography variant="h6" className="mb-2">Khám lâm sàng</Typography>
              {formData.clinicalExams.map((exam, index) => (
                <div key={index} className="border p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <Select
                        label="Danh mục xét nghiệm"
                        onChange={(value) =>
                          handleArrayInputChange("clinicalExams", index, "testCategoryId", parseInt(value))
                        }
                        required
                      >
                        {clinicalCategories.map((category) => (
                          <Option key={category.id.toString()} value={category.id.toString()}>
                            {category.name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="mb-4">
                      <Input
                        label="Kết quả"
                        value={exam.textResult}
                        onChange={(e) => handleArrayInputChange('clinicalExams', index, 'textResult', e.target.value)}
                      />
                    </div>
                  </div>
                  <Textarea
                    label="Ghi chú"
                    value={exam.notes}
                    onChange={(e) => handleArrayInputChange('clinicalExams', index, 'notes', e.target.value)}
                  />
                  <div className="mt-2">
                    <div className="flex items-center w-full gap-2">
                      {exam.imageObjects && exam.imageObjects.map((img, imgIndex) => (
                        <div key={imgIndex} className="relative w-24 h-24 flex-shrink-0">
                          <img
                            src={img.publicUrl}
                            alt={`Uploaded ${imgIndex + 1}`}
                            className="w-full h-full object-cover rounded border"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              if (window.confirm("Bạn có chắc muốn xóa mục này?")) {
                                handleRemoveImage('clinicalExams', index, img.id);
                              }
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      {exam.imageKeys && exam.imageKeys.length < 5 && (
                        <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer bg-gray-50 hover:bg-gray-100 flex-shrink-0 relative">
                          {uploadingImages[`clinicalExams-${index}`] ? (
                            <Spinner className="w-8 h-8 text-gray-400" />
                          ) : (
                            <PhotoIcon className="w-8 h-8 text-gray-400" />
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            disabled={uploadingImages[`clinicalExams-${index}`]}
                            onChange={(e) => {
                              const files = Array.from(e.target.files).slice(0, 5 - (exam.imageKeys?.length || 0));
                              handleImageUpload(files, 'clinicalExams', index);
                            }}
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Lưu ý: Chỉ cho phép các định dạng .jpg, .jpeg, .png với kích thước ảnh tối đa 5MB</p>
                  </div>
                  <Button
                    variant="text"
                    color="red"
                    onClick={() => {
                      if (window.confirm("Bạn có chắc muốn xóa mục này?")) {
                        removeArrayItem('clinicalExams', index);
                      }
                    }}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <Select
                        label="Danh mục xét nghiệm"
                        onChange={(value) => handleArrayInputChange('paraclinicalTests', index, 'testCategoryId', value)}
                        required
                      >
                        {paraclinicalCategories.map((category) => (
                          <Option key={category.id} value={category.id.toString()}>
                            {category.name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="mb-4">
                      <Input
                        label="Kết quả"
                        value={test.textResult}
                        onChange={(e) => handleArrayInputChange('paraclinicalTests', index, 'textResult', e.target.value)}
                      />
                    </div>
                  </div>

                  <Textarea
                    label="Ghi chú"
                    value={test.notes}
                    onChange={(e) => handleArrayInputChange('paraclinicalTests', index, 'notes', e.target.value)}
                  />
                  <div className="mt-2">
                    <div className="flex items-center w-full gap-2">
                      {test.imageObjects && test.imageObjects.map((img, imgIndex) => (
                        <div key={imgIndex} className="relative w-24 h-24 flex-shrink-0">
                          <img
                            src={img.publicUrl}
                            alt={`Uploaded ${imgIndex + 1}`}
                            className="w-full h-full object-cover rounded border"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              if (window.confirm("Bạn có chắc muốn xóa mục này?")) {
                                handleRemoveImage('paraclinicalTests', index, img.id);
                              }
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      {test.imageKeys && test.imageKeys.length < 5 && (
                        <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer bg-gray-50 hover:bg-gray-100 flex-shrink-0 relative">
                          {uploadingImages[`paraclinicalTests-${index}`] ? (
                            <Spinner className="w-8 h-8 text-gray-400" />
                          ) : (
                            <PhotoIcon className="w-8 h-8 text-gray-400" />
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            disabled={uploadingImages[`paraclinicalTests-${index}`]}
                            onChange={(e) => {
                              const files = Array.from(e.target.files).slice(0, 5 - (test.imageKeys?.length || 0));
                              handleImageUpload(files, 'paraclinicalTests', index);
                            }}
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Lưu ý: Chỉ cho phép các định dạng .jpg, .jpeg, .png với kích thước ảnh tối đa 5MB</p>
                  </div>
                  <Button
                    variant="text"
                    color="red"
                    onClick={() => {
                      if (window.confirm("Bạn có chắc muốn xóa mục này?")) {
                        removeArrayItem('paraclinicalTests', index);
                      }
                    }}
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
              <div className="grid grid-cols-2 gap-4 mb-4">
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
              </div>

              <Textarea
                label="Mô tả"
                value={formData.diagnosis.notes}
                onChange={(e) => handleNestedInputChange('diagnosis', 'notes', e.target.value)}
                required
              />
            </div>

            <div className="border p-4 rounded-lg">
              <Typography variant="h6" className="mb-4">Điều trị</Typography>
              <div className="flex flex-col gap-4">
                <Textarea
                  label="Mô tả"
                  value={formData.treatment.treatmentNotes}
                  onChange={(e) => handleNestedInputChange('treatment', 'treatmentNotes', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="border p-4 rounded-lg">
              <Typography variant="h6" className="mb-4">Hướng dẫn cho model AI</Typography>
              <div className="flex flex-col gap-4">
                <Textarea
                  label="Hướng dẫn"
                  value={formData.instruction}
                  onChange={(e) => handleInputChange('instruction', e.target.value)}
                  required
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
                color="green"
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