import {
  ClipboardDocumentIcon,
  BeakerIcon,
  UsersIcon,
  ChartBarIcon
} from "@heroicons/react/24/solid";
import { lazy, Suspense } from "react";
import { SignIn, SignUp } from "@/pages/auth";

// Lazy load components for code splitting
const PatientCaseList = lazy(() => import("@/pages/dashboard/PatientCaseList"));
const ClinicalCategories = lazy(() => import("@/pages/dashboard/ClinicalCategories"));
const AddPatientCase = lazy(() => import("@/pages/dashboard/AddPatientCase"));
const UsersPage = lazy(() => import("./pages/dashboard/UsersPage"));
const UpdatePatientCase = lazy(() => import("./pages/dashboard/UpdatePatientCase"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const UpdateTestResults = lazy(() => import("@/pages/dashboard/UpdateTestResults"));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

// Wrapper component to handle Suspense
const LazyComponent = ({ component: Component }) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

const icon = {
  className: "w-5 h-5 text-inherit",
};

// Routes cho sidebar
export const sidebarRoutes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <ChartBarIcon {...icon} />,
        name: "Dashboard",
        path: "/",
        element: <LazyComponent component={Dashboard} />,
      },
      {
        icon: <ClipboardDocumentIcon {...icon} />,
        name: "Danh sách bệnh nhân",
        path: "/patient-case",
        element: <LazyComponent component={PatientCaseList} />,
      },
      {
        icon: <BeakerIcon {...icon} />,
        name: "Danh mục khám/XN",
        path: "/clinical-categories",
        element: <LazyComponent component={ClinicalCategories} />,
      },
      {
        icon: <UsersIcon {...icon} />,
        name: "Quản lý người dùng",
        path: "/users",
        element: <LazyComponent component={UsersPage} />,
      },
    ],
  },
];

// Routes cho authentication
export const authRoutes = [
  {
    layout: "auth",
    pages: [
      {
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

// Routes cho dashboard (không hiển thị trong sidebar)
export const dashboardRoutes = [
  {
    layout: "dashboard",
    pages: [
      {
        name: "Dashboard",
        path: "/dashboard",
        element: <LazyComponent component={Dashboard} />,
      },
      {
        name: "Thêm ca bệnh",
        path: "/patient-case/add",
        element: <LazyComponent component={AddPatientCase} />,
      },
      {
        name: "Chỉnh sửa ca bệnh",
        path: "/patient-case/edit/:id",
        element: <LazyComponent component={UpdatePatientCase} />,
      },
      {
        name: "Cập nhật kết quả xét nghiệm",
        path: "/patient-case/edit/:id/test-results",
        element: <LazyComponent component={UpdateTestResults} />,
      },
    ],
  },
];

// Kết hợp tất cả routes
export const appRoutes = [...sidebarRoutes, ...authRoutes, ...dashboardRoutes];

export default appRoutes;
