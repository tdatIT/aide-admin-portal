import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export function Error403() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/auth/sign-in");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-[32rem] mx-4">
        <CardBody className="text-center">
          <div className="flex justify-center mb-4">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500" />
          </div>
          <Typography variant="h3" color="red" className="mb-4">
            Lỗi truy cập
          </Typography>
          <Typography variant="h5" color="blue-gray" className="mb-4">
            Tài khoản của bạn không có quyền truy cập vào trang này
          </Typography>
          <Typography variant="paragraph" color="blue-gray" className="mb-8">
            Vui lòng đăng nhập bằng tài khoản khác có quyền truy cập
          </Typography>
          <Typography variant="small" color="blue-gray" className="mb-4">
            Tự động chuyển hướng sau {countdown} giây
          </Typography>
          <Button
            variant="gradient"
            color="blue"
            onClick={() => navigate("/auth/sign-in")}
            className="mt-4"
          >
            Đăng nhập lại
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default Error403; 