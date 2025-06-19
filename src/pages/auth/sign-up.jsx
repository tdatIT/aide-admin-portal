import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Alert,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/config/axios";

export function SignUp() {
  const navigate = useNavigate();
  const { login, error: googleError, isGoogleLoaded } = useGoogleAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const googleSignInRef = useRef(null);

  useEffect(() => {
    if (isGoogleLoaded && googleSignInRef.current) {
      // Tạo div cho Google Sign-In button
      const googleSignInDiv = document.createElement('div');
      googleSignInDiv.className = 'g_id_signin';
      googleSignInDiv.setAttribute('data-type', 'standard');
      googleSignInDiv.setAttribute('data-size', 'large');
      googleSignInDiv.setAttribute('data-theme', 'outline');
      googleSignInDiv.setAttribute('data-text', 'sign_in_with');
      googleSignInDiv.setAttribute('data-shape', 'rectangular');
      googleSignInDiv.setAttribute('data-logo_alignment', 'left');
      
      // Xóa nội dung cũ và thêm div mới
      googleSignInRef.current.innerHTML = '';
      googleSignInRef.current.appendChild(googleSignInDiv);

      // Khởi tạo Google Sign-In
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_prompt: false,
        });
        
        window.google.accounts.id.renderButton(googleSignInDiv, {
          type: 'standard',
          size: 'large',
          theme: 'outline',
          text: 'sign_in_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        });
      }
    }
  }, [isGoogleLoaded]);

  const handleCredentialResponse = async (response) => {
    if (response.error) {
      console.error('Google Sign-In error:', response.error);
      return;
    }

    const idToken = response.credential;
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/oauth2/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: idToken }),
      });

      if (!res.ok) {
        throw new Error('Xác thực không thành công');
      }

      const json = await res.json();
      const { accessToken, refreshToken, profile } = json.data;

      localStorage.setItem('userProfile', JSON.stringify(profile));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      window.location.href = '/';
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/v1/auth/register", formData);
      setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
      setTimeout(() => {
        navigate("/auth/sign-in");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Đăng ký tài khoản</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Nhập thông tin của bạn để đăng ký tài khoản.</Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          {error && (
            <Alert color="red" className="mb-4">
              {error}
            </Alert>
          )}
          {googleError && (
            <Alert color="red" className="mb-4">
              {googleError}
            </Alert>
          )}
          {success && (
            <Alert color="green" className="mb-4">
              {success}
            </Alert>
          )}
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Họ và tên <span className="text-red-500">*</span>
            </Typography>
            <Input
              size="lg"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyen Van A"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Email <span className="text-red-500">*</span>
            </Typography>
            <Input
              size="lg"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Mật khẩu <span className="text-red-500">*</span>
            </Typography>
            <Input
              size="lg"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                Tôi đồng ý với&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Chính sách và điều kiện
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
            required
          />
          <Button 
            type="submit"
            className="mt-6" 
            fullWidth 
            color="light-green"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </Button>

          <div className="space-y-4 mt-8">
            {/* Google Sign-In Button Container */}
            <div ref={googleSignInRef} className="flex justify-center">
              {!isGoogleLoaded && (
                <Button 
                  size="lg" 
                  color="white" 
                  className="flex items-center gap-2 justify-center shadow-md" 
                  fullWidth
                  onClick={() => login()}
                >
                  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_1156_824)">
                      <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4" />
                      <path d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z" fill="#34A853" />
                      <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04" />
                      <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335" />
                    </g>
                    <defs>
                      <clipPath id="clip0_1156_824">
                        <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span>Đăng nhập bằng Google</span>
                </Button>
              )}
            </div>
          </div>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Đã có tài khoản
            <Link to="/auth/sign-in" className="text-gray-900 ml-1">Đăng nhập</Link>
          </Typography>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/vertical-bg.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
    </section>
  );
}

export default SignUp;
