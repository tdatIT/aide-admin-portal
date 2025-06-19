import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import {
  Alert,
  Button,
  Typography
} from "@material-tailwind/react";
import { useEffect } from "react";

export function SignIn() {
  const { 
    error, 
    isGoogleLoaded, 
    googleSignInRef, 
    initializeGoogleSignIn 
  } = useGoogleAuth();

  useEffect(() => {
    if (isGoogleLoaded) {
      initializeGoogleSignIn();
    }
  }, [isGoogleLoaded, initializeGoogleSignIn]);

  return (
    <section className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Image Section */}
        <div className="mb-8 text-center">
          <img
            src="/img/logo-white-square.jpg"
            className="w-40 h-40 mx-auto object-cover rounded-full shadow-lg"
            alt="Logo"
          />
        </div>

        {/* Login Form Section */}
        <div className="text-center mb-8">
          <Typography variant="h2" className="font-bold mb-4">Đăng nhập</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Đăng nhập bằng tài khoản của bạn
          </Typography>
        </div>

        <form className="w-full">
          {error && (
            <Alert color="red" className="mb-4">
              {error}
            </Alert>
          )}
          
          <div className="space-y-4">
            {/* Google Sign-In Button Container */}
            <div ref={googleSignInRef} className="flex justify-center">
              {!isGoogleLoaded && (
                <Button 
                  size="lg" 
                  className="flex items-center gap-2 justify-center shadow-md" 
                  fullWidth
                  disabled
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
                  <span>Đang tải...</span>
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default SignIn;

