import {
  ServerStackIcon,
  RectangleStackIcon,
  ClipboardDocumentIcon,
  BeakerIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import PatientCaseList from "@/pages/dashboard/PatientCaseList";
import { SignIn, SignUp } from "@/pages/auth";
import { ClinicalCategories } from "@/pages/dashboard/ClinicalCategories";
import { AddPatientCase } from "@/pages/dashboard/AddPatientCase";
import UserManagement from "@/pages/dashboard/UserManagement";

const icon = {
  className: "w-5 h-5 text-inherit",
};

// Routes cho sidebar
export const sidebarRoutes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <ClipboardDocumentIcon {...icon} />,
        name: "Danh sách bệnh nhân",
        path: "/patient-case",
        element: <PatientCaseList />,
      },
      {
        icon: <BeakerIcon {...icon} />,
        name: "Danh mục khám/XN",
        path: "/clinical-categories",
        element: <ClinicalCategories />,
      },
      {
        icon: <UsersIcon {...icon} />,
        name: "Quản lý người dùng",
        path: "/users",
        element: <UserManagement />,
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
        name: "Thêm ca bệnh",
        path: "/patient-case/add",
        element: <AddPatientCase />,
      },
    ],
  },
];

const routes = [
  {
    type: "collapse",
    name: "Quản lý người dùng",
    key: "user-management",
    route: "/dashboard/users",
    icon: <UsersIcon className="h-5 w-5" />,
    component: <UserManagement />,
    noCollapse: true,
  },
  // ... existing routes ...
];

export default routes;
