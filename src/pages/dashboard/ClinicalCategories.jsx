import { useState, useEffect } from "react";
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
  Input,
  Textarea,
  Tooltip,
} from "@material-tailwind/react";
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import axiosInstance from "@/config/axios";
import { toast } from "react-toastify";

export function ClinicalCategories() {
  const [clinicalCategories, setClinicalCategories] = useState([]);
  const [paraclinicalCategories, setParaclinicalCategories] = useState([]);
  const [openClinicalDialog, setOpenClinicalDialog] = useState(false);
  const [openParaclinicalDialog, setOpenParaclinicalDialog] = useState(false);
  const [openDeleteClinicalDialog, setOpenDeleteClinicalDialog] = useState(false);
  const [openDeleteParaclinicalDialog, setOpenDeleteParaclinicalDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Pagination states
  const [clinicalPagination, setClinicalPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const [paraclinicalPagination, setParaclinicalPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });

  const fetchClinicalCategories = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/admin/clinical-ex-cats", {
        params: {
          page: clinicalPagination.currentPage-1,
          size: clinicalPagination.pageSize,
        },
      });

      setClinicalCategories(response.data.data.items);
      setClinicalPagination({
        ...clinicalPagination,
        totalItems: response.data.data.total,
        totalPages: Math.ceil(response.data.data.total / clinicalPagination.pageSize),
      });
    } catch (error) {
      console.error("Error fetching clinical categories:", error);
    }
  };

  const fetchParaclinicalCategories = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/admin/paraclinical-test-cats", {
        params: {
          page: paraclinicalPagination.currentPage-1,
          size: paraclinicalPagination.pageSize,
        },
      });
      setParaclinicalCategories(response.data.data.items);
      setParaclinicalPagination({
        ...paraclinicalPagination,
        totalItems: response.data.data.total,
        totalPages: Math.ceil(response.data.data.total / paraclinicalPagination.pageSize),
      });
    } catch (error) {
      console.error("Error fetching paraclinical categories:", error);
    }
  };

  useEffect(() => {
    fetchClinicalCategories();
  }, [clinicalPagination.currentPage]);

  useEffect(() => {
    fetchParaclinicalCategories();
  }, [paraclinicalPagination.currentPage]);

  const handleEditClinicalCategory = async () => {
    try {
      await axiosInstance.put(`/api/v1/admin/clinical-ex-cats/${selectedCategory.id}`, newCategory);
      setOpenClinicalDialog(false);
      setNewCategory({ name: "", description: "" });
      setSelectedCategory(null);
      setIsEditMode(false);
      fetchClinicalCategories();
      toast.success("Cập nhật danh mục thành công!");
    } catch (error) {
      console.error("Error updating clinical category:", error);
      toast.error("Cập nhật danh mục thất bại!");
    }
  };

  const handleEditParaclinicalCategory = async () => {
    try {
      await axiosInstance.put(`/api/v1/admin/paraclinical-test-cats/${selectedCategory.id}`, newCategory);
      setOpenParaclinicalDialog(false);
      setNewCategory({ name: "", description: "" });
      setSelectedCategory(null);
      setIsEditMode(false);
      fetchParaclinicalCategories();
      toast.success("Cập nhật danh mục thành công!");
    } catch (error) {
      console.error("Error updating paraclinical category:", error);
      toast.error("Cập nhật danh mục thất bại!");
    }
  };

  const handleAddClinicalCategory = async () => {
    try {
      await axiosInstance.post("/api/v1/admin/clinical-ex-cats", newCategory);
      setOpenClinicalDialog(false);
      setNewCategory({ name: "", description: "" });
      fetchClinicalCategories();
      toast.success("Thêm danh mục thành công!");
    } catch (error) {
      console.error("Error adding clinical category:", error);
      toast.error("Thêm danh mục thất bại!");
    }
  };

  const handleAddParaclinicalCategory = async () => {
    try {
      await axiosInstance.post("/api/v1/admin/paraclinical-test-cats", newCategory);
      setOpenParaclinicalDialog(false);
      setNewCategory({ name: "", description: "" });
      fetchParaclinicalCategories();
      toast.success("Thêm danh mục thành công!");
    } catch (error) {
      console.error("Error adding paraclinical category:", error);
      toast.error("Thêm danh mục thất bại!");
    }
  };

  const handleDeleteClinicalCategory = async () => {
    try {
      await axiosInstance.delete(`/api/v1/admin/clinical-ex-cats/${selectedCategory.id}`);
      setOpenDeleteClinicalDialog(false);
      setSelectedCategory(null);
      fetchClinicalCategories();
      toast.success("Xóa danh mục thành công!");
    } catch (error) {
      console.error("Error deleting clinical category:", error);
      toast.error("Xóa danh mục thất bại!");
    }
  };

  const handleDeleteParaclinicalCategory = async () => {
    try {
      await axiosInstance.delete(`/api/v1/admin/paraclinical-test-cats/${selectedCategory.id}`);
      setOpenDeleteParaclinicalDialog(false);
      setSelectedCategory(null);
      fetchParaclinicalCategories();
      toast.success("Xóa danh mục thành công!");
    } catch (error) {
      console.error("Error deleting paraclinical category:", error);
      toast.error("Xóa danh mục thất bại!");
    }
  };

  const handleEditClick = (category, type) => {
    setSelectedCategory(category);
    setNewCategory({ name: category.name, description: category.description });
    setIsEditMode(true);
    if (type === 'clinical') {
      setOpenClinicalDialog(true);
    } else {
      setOpenParaclinicalDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenClinicalDialog(false);
    setOpenParaclinicalDialog(false);
    setNewCategory({ name: "", description: "" });
    setSelectedCategory(null);
    setIsEditMode(false);
  };

  const renderPagination = (pagination, setPagination) => {
    const pages = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      pages.push(
        <Button
          key={i}
          variant={pagination.currentPage === i ? "filled" : "text"}
          color="blue"
          size="sm"
          onClick={() => setPagination({ ...pagination, currentPage: i })}
          className="mx-1"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Button
          variant="text"
          color="blue"
          size="sm"
          onClick={() => {
            if (pagination.currentPage > 1) {
              setPagination({ ...pagination, currentPage: pagination.currentPage - 1 });
            }
          }}
          disabled={pagination.currentPage === 1}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        {pages}
        <Button
          variant="text"
          color="blue"
          size="sm"
          onClick={() => {
            if (pagination.currentPage < pagination.totalPages) {
              setPagination({ ...pagination, currentPage: pagination.currentPage + 1 });
            }
          }}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Clinical Categories Table */}
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <div className="flex justify-between items-center">
            <Typography variant="h6" color="white">
              Danh mục khám lâm sàng
            </Typography>
            <Button
              variant="gradient"
              color="white"
              size="sm"
              onClick={() => {
                setIsEditMode(false);
                setOpenClinicalDialog(true);
              }}
            >
              Thêm mới
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto p-4">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-sm">
                <th className="px-4 py-2 font-bold text-gray-700 bg-gray-100 text-sm w-[10%]">ID</th>
                <th className="px-4 py-2 font-bold text-gray-700 bg-gray-100 text-sm w-[30%]">Tên danh mục</th>
                <th className="px-4 py-2 font-bold text-gray-700 bg-gray-100 text-sm w-[40%]">Mô tả</th>
                <th className="px-4 py-2 font-bold text-gray-700 bg-gray-100 text-sm w-[20%]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {clinicalCategories.map(({ id, name, description }) => (
                <tr key={id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{id}</td>
                  <td className="px-4 py-2 max-w-xs truncate text-sm" title={name}>{name}</td>
                  <td className="px-4 py-2 max-w-xs truncate text-sm" title={description}>{description}</td>
                  <td className="px-4 py-2 flex gap-2 items-center text-sm">
                    <Tooltip content="Chỉnh sửa">
                      <Button
                        variant="text"
                        color="blue-gray"
                        size="sm"
                        onClick={() => handleEditClick({ id, name, description }, 'clinical')}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Xóa">
                      <Button
                        variant="text"
                        color="red"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory({ id, name });
                          setOpenDeleteClinicalDialog(true);
                        }}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between p-4 border-t border-blue-gray-50">
            <Typography variant="small" color="blue-gray" className="font-normal">
              Tổng số: {clinicalPagination.totalItems} mục
            </Typography>
            {renderPagination(clinicalPagination, setClinicalPagination)}
          </div>
        </CardBody>
      </Card>

      {/* Paraclinical Categories Table */}
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <div className="flex justify-between items-center">
            <Typography variant="h6" color="white">
              Danh mục xét nghiệm cận lâm sàng
            </Typography>
            <Button
              variant="gradient"
              color="white"
              size="sm"
              onClick={() => {
                setIsEditMode(false);
                setOpenParaclinicalDialog(true);
              }}
            >
              Thêm mới
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto p-4">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-sm">
                <th className="px-4 py-2 font-bold text-gray-700 bg-gray-100 text-sm w-[10%]">ID</th>
                <th className="px-4 py-2 font-bold text-gray-700 bg-gray-100 text-sm w-[30%]">Tên danh mục</th>
                <th className="px-4 py-2 font-bold text-gray-700 bg-gray-100 text-sm w-[40%]">Mô tả</th>
                <th className="px-4 py-2 font-bold text-gray-700 bg-gray-100 text-sm w-[20%]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {paraclinicalCategories.map(({ id, name, description }) => (
                <tr key={id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{id}</td>
                  <td className="px-4 py-2 max-w-xs truncate text-sm" title={name}>{name}</td>
                  <td className="px-4 py-2 max-w-xs truncate text-sm" title={description}>{description}</td>
                  <td className="px-4 py-2 flex gap-2 items-center text-sm">
                    <Tooltip content="Chỉnh sửa">
                      <Button
                        variant="text"
                        color="blue-gray"
                        size="sm"
                        onClick={() => handleEditClick({ id, name, description }, 'paraclinical')}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Xóa">
                      <Button
                        variant="text"
                        color="red"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory({ id, name });
                          setOpenDeleteParaclinicalDialog(true);
                        }}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between p-4 border-t border-blue-gray-50">
            <Typography variant="small" color="blue-gray" className="font-normal">
              Tổng số: {paraclinicalPagination.totalItems} mục
            </Typography>
            {renderPagination(paraclinicalPagination, setParaclinicalPagination)}
          </div>
        </CardBody>
      </Card>

      {/* Add/Edit Clinical Category Dialog */}
      <Dialog open={openClinicalDialog} handler={handleCloseDialog}>
        <DialogHeader>
          {isEditMode ? "Chỉnh sửa danh mục khám lâm sàng" : "Thêm danh mục khám lâm sàng mới"}
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-6">
            <Input
              label="Tên danh mục"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />
            <Textarea
              label="Mô tả"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleCloseDialog}>
            Hủy
          </Button>
          <Button
            variant="gradient"
            color="blue"
            onClick={isEditMode ? handleEditClinicalCategory : handleAddClinicalCategory}
          >
            {isEditMode ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Add/Edit Paraclinical Category Dialog */}
      <Dialog open={openParaclinicalDialog} handler={handleCloseDialog}>
        <DialogHeader>
          {isEditMode ? "Chỉnh sửa danh mục xét nghiệm cận lâm sàng" : "Thêm danh mục xét nghiệm cận lâm sàng mới"}
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-6">
            <Input
              label="Tên danh mục"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />
            <Textarea
              label="Mô tả"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleCloseDialog}>
            Hủy
          </Button>
          <Button
            variant="gradient"
            color="blue"
            onClick={isEditMode ? handleEditParaclinicalCategory : handleAddParaclinicalCategory}
          >
            {isEditMode ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Clinical Category Dialog */}
      <Dialog open={openDeleteClinicalDialog} handler={() => setOpenDeleteClinicalDialog(false)}>
        <DialogHeader>Xác nhận xóa</DialogHeader>
        <DialogBody>
          Bạn có chắc chắn muốn xóa danh mục "{selectedCategory?.name}"?
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="blue" onClick={() => setOpenDeleteClinicalDialog(false)}>
            Hủy
          </Button>
          <Button variant="gradient" color="red" onClick={handleDeleteClinicalCategory}>
            Xóa
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Paraclinical Category Dialog */}
      <Dialog open={openDeleteParaclinicalDialog} handler={() => setOpenDeleteParaclinicalDialog(false)}>
        <DialogHeader>Xác nhận xóa</DialogHeader>
        <DialogBody>
          Bạn có chắc chắn muốn xóa danh mục "{selectedCategory?.name}"?
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="blue" onClick={() => setOpenDeleteParaclinicalDialog(false)}>
            Hủy
          </Button>
          <Button variant="gradient" color="red" onClick={handleDeleteParaclinicalCategory}>
            Xóa
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ClinicalCategories; 