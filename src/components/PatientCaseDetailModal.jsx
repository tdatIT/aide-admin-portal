import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Chip,
  Switch,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import PatientCaseJsonModal from "./PatientCaseJsonModal";
import { useNavigate } from "react-router-dom";

export default function PatientCaseDetailModal({ open, handleOpen, patientCase }) {
  if (!patientCase) return null;
  const [jsonOpen, setJsonOpen] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const navigate = useNavigate();

  const statusMap = {
    PUBLISHED: {
      label: "Hiển thị",
      className: "bg-green-400 text-gray-900"
    },
    UNPUBLISHED: {
      label: "Ẩn",
      className: "bg-amber-400 text-gray-900"
    },
    DEFAULT: {
      label: "Chưa có",
      className: "bg-gray-400 text-gray-900"
    }
  };

  const renderStatusChip = (status) => {
    const { label, className } = statusMap[status] || statusMap.DEFAULT;
    return (
      <span
        className={`inline-block px-3 py-1 text-xs font-bold rounded-lg uppercase ${className}`}
        style={{ minWidth: 80, textAlign: "center", letterSpacing: 1 }}
      >
        {label}
      </span>
    );
  };

  const renderImage = (imageUrl, alt) => {
    if (!imageUrl) return null;
    return (
      <div className="mt-2">
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          onClick={() => window.open(imageUrl, '_blank')}
        />
      </div>
    );
  };

  // Toggle publish/unpublish
  const handleToggleStatus = async () => {
    setToggleLoading(true);
    try {
      const isPublished = patientCase.status !== "PUBLISHED";
      await import("@/config/axios").then(({ default: axiosInstance }) =>
        axiosInstance.put(`/api/v1/admin/patient-cases/${patientCase.id}/status?isPublished=${isPublished}`)
      );
      if (typeof window !== 'undefined' && window.location) window.location.reload();
    } catch (err) {
      alert("Cập nhật trạng thái thất bại!");
    } finally {
      setToggleLoading(false);
    }
  };

  return (
    jsonOpen ? (
      <PatientCaseJsonModal
        open={jsonOpen}
        handleClose={() => setJsonOpen(false)}
        patientCase={patientCase}
      />
    ) : (
      <Dialog size="lg" open={open} handler={handleOpen}>
        <DialogHeader className="justify-between">
          <Typography variant="h5" color="blue-gray">
            Chi tiết ca bệnh
          </Typography>
          <Button variant="text" color="blue-gray" onClick={handleOpen}>
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </DialogHeader>
        <DialogBody className="max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <Typography variant="h6" color="blue-gray" className="mb-4 border-b pb-2">
                  Thông tin cơ bản
                </Typography>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Typography variant="small" color="blue-gray" className="font-bold w-32">Tên ca bệnh:</Typography>
                    <Typography className="flex-1">{patientCase.name || "Không có"}</Typography>
                  </div>
                  <div className="flex items-start">
                    <Typography variant="small" color="blue-gray" className="font-bold w-32">Giới tính:</Typography>
                    <Typography className="flex-1">{patientCase.gender === "MALE" ? "Nam" : patientCase.gender === "FEMALE" ? "Nữ" : "Không có"}</Typography>
                  </div>
                  <div className="flex items-start">
                    <Typography variant="small" color="blue-gray" className="font-bold w-32">Tuổi:</Typography>
                    <Typography className="flex-1">{patientCase.age || "Không có"}</Typography>
                  </div>
                  <div className="flex items-start">
                    <Typography variant="small" color="blue-gray" className="font-bold w-32">Nghề nghiệp:</Typography>
                    <Typography className="flex-1">{patientCase.occupation || "Không có"}</Typography>
                  </div>
                  <div className="flex items-start">
                    <Typography variant="small" color="blue-gray" className="font-bold w-32">Trạng thái:</Typography>
                    <div className="flex-1">{renderStatusChip(patientCase.status)}</div>
                  </div>
                </div>
              </div>


              <div className="bg-gray-50 rounded-lg p-4">
                <Typography variant="h6" color="blue-gray" className="mb-4 border-b pb-2">
                  Tiền sử
                </Typography>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Typography variant="small" color="blue-gray" className="font-bold w-32">Tiền sử y khoa:</Typography>
                    <Typography className="flex-1">{patientCase.medicalHistory || "Không có"}</Typography>
                  </div>
                  <div className="flex items-start">
                    <Typography variant="small" color="blue-gray" className="font-bold w-32">Tiền sử nha khoa:</Typography>
                    <Typography className="flex-1">{patientCase.dentalHistory || "Không có"}</Typography>
                  </div>
                  <div className="flex items-start">
                    <Typography variant="small" color="blue-gray" className="font-bold w-32">Bệnh sử:</Typography>
                    <Typography className="flex-1">{patientCase.clinicalHistory || "Không có"}</Typography>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <Typography variant="h6" color="blue-gray" className="mb-4 border-b pb-2">
                  Xét nghiệm đề xuất
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {patientCase.suggestedTests?.length > 0 ? (
                    patientCase.suggestedTests.map((test, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-lg shadow border border-blue-300 text-sm hover:bg-blue-200 transition"
                      >
                        {test}
                      </span>
                    ))
                  ) : (
                    <Typography variant="small" color="gray">Không có xét nghiệm đề xuất</Typography>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <Typography variant="h6" color="blue-gray" className="mb-4 border-b pb-2">
                  Hướng dẫn cho model AI
                </Typography>
                <Typography variant="small" className="flex-1">{patientCase.instruction || "Không có"}</Typography>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <Typography variant="h6" color="blue-gray" className="mb-4 border-b pb-2">
                  Khám lâm sàng
                </Typography>
                <div className="space-y-4">
                  {patientCase.clinicalExResults?.length > 0 ? (
                    patientCase.clinicalExResults.map((exam) => (
                      <div key={exam.id} className="border rounded-lg p-4 bg-white">

                        <div className="space-y-2">
                          <div className="flex items-start">
                            <Typography variant="small" color="blue-gray" className="font-bold w-20">Danh mục:</Typography>
                            <Typography variant="small" className="flex-1">{exam.name || "Không có"}</Typography>
                          </div>
                          <div className="flex items-start">
                            <Typography variant="small" color="blue-gray" className="font-bold w-20">Ghi chú:</Typography>
                            <Typography variant="small" className="flex-1">{exam.notes || "Không có"}</Typography>
                          </div>
                          {exam.images && exam.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {exam.images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img.url}
                                  alt={exam.name}
                                  className="w-24 h-24 object-cover rounded border cursor-pointer"
                                  onClick={() => window.open(img.url, '_blank')}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <Typography variant="small" color="gray">Không có thông tin khám lâm sàng</Typography>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <Typography variant="h6" color="blue-gray" className="mb-4 border-b pb-2">
                  Xét nghiệm cận lâm sàng
                </Typography>
                <div className="space-y-4">
                  {patientCase.paraclinicalExResults?.length > 0 ? (
                    patientCase.paraclinicalExResults.map((test) => (
                      <div key={test.id} className="border rounded-lg p-4 bg-white">
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <Typography variant="small" color="blue-gray" className="font-bold w-20">Danh mục:</Typography>
                            <Typography variant="small" className="flex-1">{test.name || "Không có"}</Typography>
                          </div>
                          <div className="flex items-start">
                            <Typography variant="small" color="blue-gray" className="font-bold w-20">Ghi chú:</Typography>
                            <Typography variant="small" className="flex-1">{test.notes || "Không có"}</Typography>
                          </div>
                          {test.images && test.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {test.images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img.url}
                                  alt={test.name}
                                  className="w-24 h-24 object-cover rounded border cursor-pointer"
                                  onClick={() => window.open(img.url, '_blank')}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <Typography variant="small" color="gray">Không có thông tin xét nghiệm cận lâm sàng</Typography>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <Typography variant="h6" color="blue-gray" className="mb-4 border-b pb-2">
                  Chẩn đoán
                </Typography>
                <div className="border rounded-lg p-4 bg-white">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Typography variant="small" color="blue-gray" className="font-bold w-32">Chẩn đoán sơ bộ:</Typography>
                      <Typography variant="small" className="flex-1">{patientCase.diagnosis?.diagPrelim || "Không có"}</Typography>
                    </div>
                    <div className="flex items-start">
                      <Typography variant="small" color="blue-gray" className="font-bold w-32">Chẩn đoán phân biệt:</Typography>
                      <Typography variant="small" className="flex-1">{patientCase.diagnosis?.diagDiff || "Không có"}</Typography>
                    </div>
                    <div className="flex items-start">
                      <Typography variant="small" color="blue-gray" className="font-bold w-32">Mô tả:</Typography>
                      <Typography variant="small" className="flex-1">{patientCase.diagnosis?.notes || "Không có"}</Typography>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <Typography variant="h6" color="blue-gray" className="mb-4 border-b pb-2">
                  Điều trị
                </Typography>
                <div className="border rounded-lg p-4 bg-white">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Typography variant="small" color="blue-gray" className="font-bold w-32">Mô tả:</Typography>
                      <Typography variant="small" className="flex-1">{patientCase.treatment?.treatmentNotes || "Không có"}</Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="flex items-center mr-4">
            <Switch
              color="green"
              checked={patientCase.status === "PUBLISHED"}
              onChange={handleToggleStatus}
              disabled={toggleLoading}
              className="mr-2"
            />
          </div>
          <Button
            ariant="text"
            color="blue-gray"
            size="sm"
            onClick={() => navigate(`/dashboard/patient-case/edit/${patientCase.id}`)}
            className="mr-2"
          >
            Chỉnh sửa
          </Button>

          <Button ariant="text"
            color="red"
            size="sm" onClick={handleOpen}>
            Đóng
          </Button>
        </DialogFooter>
      </Dialog>
    )
  );
} 