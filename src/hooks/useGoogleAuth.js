import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const googleSignInRef = useRef(null);

  useEffect(() => {
    const scriptId = 'google-identity-script';
    if (document.getElementById(scriptId)) {
      setIsGoogleLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleLoaded(true);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, []);

  // Khởi tạo Google Sign-In button
  const initializeGoogleSignIn = () => {
    if (!isGoogleLoaded || !googleSignInRef.current) return;

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
  };

  const login = async () => {
    if (!isGoogleLoaded) {
      setError('Tính năng đăng nhập bằng Google chưa sẵn sàng');
      return;
    }
  
    try {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_prompt: false,
      });

      google.accounts.id.prompt();
    } catch (err) {
      console.error('Init failed:', err);
      setError('Không thể khởi tạo đăng nhập Google');
    }
  };

  const handleCredentialResponse = async (response) => {
    if (response.error) {
      console.error('Google Sign-In error:', response.error);
      setError('Không lấy được ID token từ Google');
      return;
    }

    const idToken = response.credential;

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/oauth2/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ token: idToken }),
      });

      if (!res.ok) {
        throw new Error('Xác thực không thành công');
      }

      const json = await res.json();
      const { accessToken, refreshToken, profile } = json.data;

      localStorage.setItem('userProfile', JSON.stringify(profile));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Đăng nhập thất bại');
    }
  };

  const getStoredData = (key) => {
    try {
      const data = localStorage.getItem(key);
      return key === 'userProfile' ? JSON.parse(data) : data;
    } catch (err) {
      console.error(`Lỗi khi lấy ${key}:`, err);
      return null;
    }
  };

  return {
    login,
    error,
    getStoredData,
    isGoogleLoaded,
    googleSignInRef,
    initializeGoogleSignIn,
  };
};