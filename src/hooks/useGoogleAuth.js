import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axiosInstance from "@/config/axios";

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setError(null);
        const res = await axiosInstance.post(`/api/v1/auth/oauth2/google?token=${response.access_token}`);
        if (!res.data.data) {
          throw new Error('Dữ liệu phản hồi không hợp lệ');
        }

        const { userProfile, tokenResponse } = res.data.data;

        // Validate user profile data
        if (!userProfile.username || !userProfile.fullName) {
          throw new Error('Thông tin người dùng không đầy đủ');
        }

        // Validate token response data
        if (!tokenResponse.accessToken || !tokenResponse.refreshToken) {
          throw new Error('Thông tin token không hợp lệ');
        }

        try {
          // Store user profile separately
          localStorage.setItem('userProfile', JSON.stringify(userProfile));
          
          // Store token information separately
          localStorage.setItem('accessToken', tokenResponse.accessToken);
          localStorage.setItem('refreshToken', tokenResponse.refreshToken);
          localStorage.setItem('tokenType', tokenResponse.tokenType || 'Bearer');
          localStorage.setItem('tokenExpiresIn', tokenResponse.expiresIn?.toString() || '86400');
        } catch (storageError) {
          console.error('Lỗi khi lưu dữ liệu:', storageError);
          throw new Error('Không thể lưu thông tin đăng nhập');
        }
        
        navigate('/');
      } catch (error) {
        console.error('Login failed:', error);
        setError(error.message || error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      setError('Không thể kết nối với Google. Vui lòng thử lại.');
    },
    flow: 'implicit',
    popup_type: 'window',
    popup_width: 500,
    popup_height: 600,
    popup_position: 'center',
    ux_mode: 'popup',
    context: 'signin',
    prompt: 'select_account'
  });

  // Helper function to safely get data from localStorage
  const getStoredData = (key) => {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      if (key === 'userProfile') {
        return JSON.parse(data);
      }
      return data;
    } catch (error) {
      console.error(`Lỗi khi lấy dữ liệu ${key}:`, error);
      return null;
    }
  };

  return {
    login,
    error,
    getStoredData
  };
}; 