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
import { useNavigate, useParams } from "react-router-dom";

const ACTIONS = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  REMOVE: "REMOVE",
};

const UpdateTestResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clinicalCategories, setClinicalCategories] = useState([]);
  const [paraclinicalCategories, setParaclinicalCategories] = useState([]);
  const [uploadingImages, setUploadingImages] = useState({});
  const [clinicalTests, setClinicalTests] = useState([]);
  const [paraclinicalTests, setParaclinicalTests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const [clinicalRes, paraclinicalRes] = await Promise.all([
          axiosInstance.get('/api/v1/admin/clinical-ex-cats?page=0&limit=1000'),
          axiosInstance.get('/api/v1/admin/paraclinical-test-cats?page=0&limit=1000'),
        ]);
        setClinicalCategories(clinicalRes.data.data?.items || []);
        setParaclinicalCategories(paraclinicalRes.data.data?.items || []);
        // Fetch test results
        const detailRes = await axiosInstance.get(`/api/v1/admin/patient-cases/${id}`);
        const data = detailRes.data.data;
        setClinicalTests(
          (data.clinicalExResults || []).map((item) => ({
            ...item,
            action: ACTIONS.UPDATE,
            imageObjects: (item.images || []).map(img => ({ id: img.id, publicUrl: img.url })),
            imageKeys: (item.images || []).map(img => img.id),
          }))
        );
        setParaclinicalTests(
          (data.paraclinicalExResults || []).map((item) => ({
            ...item,
            action: ACTIONS.UPDATE,
            imageObjects: (item.images || []).map(img => ({ id: img.id, publicUrl: img.url })),
            imageKeys: (item.images || []).map(img => img.id),
          }))
        );
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleImageUpload = async (files, arrayName, index) => {
    setUploadingImages((prev) => ({ ...prev, [`${arrayName}-${index}`]: true }));
    try {
      const formDataUpload = new FormData();
      Array.from(files).forEach((file) => {
        formDataUpload.append('files', file);
      });
      const response = await axiosInstance.post('/api/v1/admin/uploads/images', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.data) {
        const newImages = response.data.data.map((img) => ({ id: img.id, publicUrl: img.publicUrl }));
        if (arrayName === 'clinicalTests') {
          setClinicalTests((prev) =>
            prev.map((item, i) =>
              i === index
                ? {
                  ...item,
                  imageObjects: [...newImages, ...(item.imageObjects || [])],
                  imageKeys: [...newImages.map((img) => img.id), ...(item.imageKeys || [])],
                }
                : item
            )
          );
        } else {
          setParaclinicalTests((prev) =>
            prev.map((item, i) =>
              i === index
                ? {
                  ...item,
                  imageObjects: [...newImages, ...(item.imageObjects || [])],
                  imageKeys: [...newImages.map((img) => img.id), ...(item.imageKeys || [])],
                }
                : item
            )
          );
        }
      }
    } catch (err) {
      console.error('Error uploading images:', err);
    } finally {
      setUploadingImages((prev) => ({ ...prev, [`${arrayName}-${index}`]: false }));
    }
  };

  const handleRemoveImage = (arrayName, index, imageIdToRemove) => {
    if (arrayName === 'clinicalTests') {
      setClinicalTests((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
              ...item,
              imageObjects: (item.imageObjects || []).filter((img) => img.id !== imageIdToRemove),
              imageKeys: (item.imageKeys || []).filter((id) => id !== imageIdToRemove),
            }
            : item
        )
      );
    } else {
      setParaclinicalTests((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
              ...item,
              imageObjects: (item.imageObjects || []).filter((img) => img.id !== imageIdToRemove),
              imageKeys: (item.imageKeys || []).filter((id) => id !== imageIdToRemove),
            }
            : item
        )
      );
    }
  };

  const handleArrayInputChange = (arrayName, index, field, value) => {
    console.log(value);
    if (arrayName === 'clinicalTests') {
      setClinicalTests((prev) =>
        prev.map((item, i) => (i === index ? { ...item, [field]: value, action: item.id ? ACTIONS.UPDATE : ACTIONS.CREATE } : item))
      );
    } else {
      setParaclinicalTests((prev) =>
        prev.map((item, i) => (i === index ? { ...item, [field]: value, action: item.id ? ACTIONS.UPDATE : ACTIONS.CREATE } : item))
      );
    }
  };

  const addArrayItem = (arrayName) => {
    const newItem = {
      testCategoryId: '',
      notes: '',
      imageKeys: [],
      imageObjects: [],
      textResult: '',
      action: ACTIONS.CREATE,
    };
    if (arrayName === 'clinicalTests') {
      setClinicalTests((prev) => [...prev, newItem]);
    } else {
      setParaclinicalTests((prev) => [...prev, newItem]);
    }
  };

  const removeArrayItem = (arrayName, index) => {
    if (arrayName === 'clinicalTests') {
      setClinicalTests((prev) => {
        const item = prev[index];
        if (item.id) {
          return prev.map((it, i) => (i === index ? { ...it, action: ACTIONS.REMOVE } : it));
        } else {
          return prev.filter((_, i) => i !== index);
        }
      });
    } else {
      setParaclinicalTests((prev) => {
        const item = prev[index];
        if (item.id) {
          return prev.map((it, i) => (i === index ? { ...it, action: ACTIONS.REMOVE } : it));
        } else {
          return prev.filter((_, i) => i !== index);
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const clinicalPayload = clinicalTests.filter((t) => t.action !== ACTIONS.REMOVE || t.id).map((t) => {
        const { id, testCategoryId, textResult, notes, imageKeys, action } = t;
        const payload = { action, testCategoryId, textResult, notes, imageKeys };
        if (id) payload.id = id;
        return payload;
      });
      const paraclinicalPayload = paraclinicalTests.filter((t) => t.action !== ACTIONS.REMOVE || t.id).map((t) => {
        const { id, testCategoryId, textResult, notes, imageKeys, action } = t;
        const payload = { action, testCategoryId, textResult, notes, imageKeys };
        if (id) payload.id = id;
        return payload;
      });
      await axiosInstance.put(`/api/v1/admin/patient-cases/${id}/test-results`, {
        clinicalTests: clinicalPayload,
        paraclinicalTests: paraclinicalPayload,
      });
      navigate(`/dashboard/patient-case/edit/${id}`);
    } catch (err) {
      console.error('Error updating test results:', err);
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
            Cập nhật kết quả khám lâm sàng & cận lâm sàng
          </Typography>
          <Button color="white" className="flex items-center gap-2 text-blue-700"
            onClick={() => navigate(`/dashboard/patient-case/edit/${id}`)}
          >
            Quay lại
          </Button>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <Typography variant="h6" className="mb-2">Khám lâm sàng</Typography>
              {clinicalTests.filter((t) => t.action !== ACTIONS.REMOVE).map((exam, index) => (
                <div key={index} className="border p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <Select
                        label="Danh mục xét nghiệm"
                        value={exam.clinicalCateId?.toString()}
                        onChange={(value) => handleArrayInputChange('clinicalTests', index, 'testCategoryId', value)}
                        required
                      >
                        {clinicalCategories.map((category) => (
                          <Option key={category.name.toString()} value={category.id.toString()}>
                            {category.name}
                          </Option>

                        ))}
                      </Select>
                    </div>
                    <div className="mb-4">
                      <Input
                        label="Kết quả"
                        value={exam.textResult || ''}
                        onChange={(e) => handleArrayInputChange('clinicalTests', index, 'textResult', e.target.value)}
                      />
                    </div>
                  </div>
                  <Textarea
                    label="Ghi chú"
                    value={exam.notes || ''}
                    onChange={(e) => handleArrayInputChange('clinicalTests', index, 'notes', e.target.value)}
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
                                handleRemoveImage('clinicalTests', index, img.id);
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
                          {uploadingImages[`clinicalTests-${index}`] ? (
                            <Spinner className="w-8 h-8 text-gray-400" />
                          ) : (
                            <PhotoIcon className="w-8 h-8 text-gray-400" />
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            disabled={uploadingImages[`clinicalTests-${index}`]}
                            onChange={(e) => {
                              const files = Array.from(e.target.files).slice(0, 5 - (exam.imageKeys?.length || 0));
                              handleImageUpload(files, 'clinicalTests', index);
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
                        removeArrayItem('clinicalTests', index);
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
                onClick={() => addArrayItem('clinicalTests')}
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
              {paraclinicalTests.filter((t) => t.action !== ACTIONS.REMOVE).map((test, index) => (
                <div key={index} className="border p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <Select
                        label="Danh mục xét nghiệm"
                        value={test.paraclinicalId?.toString()}
                        onChange={(value) => handleArrayInputChange('paraclinicalTests', index, 'testCategoryId', value)}
                        required
                      >
                        {paraclinicalCategories.map((category) => (
                          <Option key={category.id.toString()} value={category.id.toString()}>
                            {category.name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="mb-4">
                      <Input
                        label="Kết quả"
                        value={test.textResult || ''}
                        onChange={(e) => handleArrayInputChange('paraclinicalTests', index, 'textResult', e.target.value)}
                      />
                    </div>
                  </div>
                  <Textarea
                    label="Ghi chú"
                    value={test.notes || ''}
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
            <div className="flex justify-end gap-4">
              <Button
                variant="outlined"
                color="red"
                onClick={() => navigate(`/dashboard/patient-case/edit/${id}`)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                color="green"
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

export default UpdateTestResults; 