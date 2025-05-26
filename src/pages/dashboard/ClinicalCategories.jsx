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
} from "@material-tailwind/react";
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import axiosInstance from "@/config/axios";

export function ClinicalCategories() {
  const [clinicalCategories, setClinicalCategories] = useState([]);
  const [paraclinicalCategories, setParaclinicalCategories] = useState([]);
  const [openClinicalDialog, setOpenClinicalDialog] = useState(false);
  const [openParaclinicalDialog, setOpenParaclinicalDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  
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
      const response = await axiosInstance.get("/api/v1/clinical-exam-categories", {
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
      const response = await axiosInstance.get("/api/v1/paraclinical-test-categories", {
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

  const handleAddClinicalCategory = async () => {
    try {
      await axiosInstance.post("/api/v1/clinical-exam-categories", newCategory);
      setOpenClinicalDialog(false);
      setNewCategory({ name: "", description: "" });
      fetchClinicalCategories();
    } catch (error) {
      console.error("Error adding clinical category:", error);
    }
  };

  const handleAddParaclinicalCategory = async () => {
    try {
      await axiosInstance.post("/api/v1/paraclinical-test-categories", newCategory);
      setOpenParaclinicalDialog(false);
      setNewCategory({ name: "", description: "" });
      fetchParaclinicalCategories();
    } catch (error) {
      console.error("Error adding paraclinical category:", error);
    }
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
              onClick={() => setOpenClinicalDialog(true)}
            >
              Thêm mới
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                    ID
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                    Tên danh mục
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                    Mô tả
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                    Thao tác
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {clinicalCategories.map(({ id, name, description }) => (
                <tr key={id}>
                  <td className="py-3 px-6 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {id}
                    </Typography>
                  </td>
                  <td className="py-3 px-6 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {name}
                    </Typography>
                  </td>
                  <td className="py-3 px-6 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {description}
                    </Typography>
                  </td>
                  <td className="py-3 px-6 border-b border-blue-gray-50">
                    <Button variant="text" size="sm" color="blue">
                      Sửa
                    </Button>
                    <Button variant="text" size="sm" color="red">
                      Xóa
                    </Button>
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
              onClick={() => setOpenParaclinicalDialog(true)}
            >
              Thêm mới
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                    ID
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                    Tên danh mục
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                    Mô tả
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                    Thao tác
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {paraclinicalCategories.map(({ id, name, description }) => (
                <tr key={id}>
                  <td className="py-3 px-6 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {id}
                    </Typography>
                  </td>
                  <td className="py-3 px-6 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {name}
                    </Typography>
                  </td>
                  <td className="py-3 px-6 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {description}
                    </Typography>
                  </td>
                  <td className="py-3 px-6 border-b border-blue-gray-50">
                    <Button variant="text" size="sm" color="blue">
                      Sửa
                    </Button>
                    <Button variant="text" size="sm" color="red">
                      Xóa
                    </Button>
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

      {/* Add Clinical Category Dialog */}
      <Dialog open={openClinicalDialog} handler={() => setOpenClinicalDialog(false)}>
        <DialogHeader>Thêm danh mục khám lâm sàng mới</DialogHeader>
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
          <Button variant="text" color="red" onClick={() => setOpenClinicalDialog(false)}>
            Hủy
          </Button>
          <Button variant="gradient" color="blue" onClick={handleAddClinicalCategory}>
            Thêm mới
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Add Paraclinical Category Dialog */}
      <Dialog open={openParaclinicalDialog} handler={() => setOpenParaclinicalDialog(false)}>
        <DialogHeader>Thêm danh mục xét nghiệm cận lâm sàng mới</DialogHeader>
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
          <Button variant="text" color="red" onClick={() => setOpenParaclinicalDialog(false)}>
            Hủy
          </Button>
          <Button variant="gradient" color="blue" onClick={handleAddParaclinicalCategory}>
            Thêm mới
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ClinicalCategories; 