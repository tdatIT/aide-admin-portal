import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  CardFooter,
} from "@material-tailwind/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function Dashboard() {
  const [userData, setUserData] = useState({
    labels: [],
    datasets: [],
  });
  const [patientData, setPatientData] = useState({
    labels: [],
    datasets: [],
  });
  const [performanceData, setPerformanceData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // Mock data cho chart 1: Số lượng user theo ngày (timeseries)
    const userChartData = {
      labels: [
        "01/01", "02/01", "03/01", "04/01", "05/01", "06/01", "07/01",
        "08/01", "09/01", "10/01", "11/01", "12/01", "13/01", "14/01"
      ],
      datasets: [
        {
          label: "Số lượng User",
          data: [120, 135, 142, 158, 165, 178, 185, 192, 210, 225, 238, 245, 260, 275],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    };

    // Mock data cho chart 2: Số lượng bệnh nhân ảo theo level (pie chart)
    const patientChartData = {
      labels: ["Dễ", "Trung bình", "Khó"],
      datasets: [
        {
          data: [45, 30, 25],
          backgroundColor: [
            "rgba(34, 197, 94, 0.8)",
            "rgba(251, 191, 36, 0.8)",
            "rgba(239, 68, 68, 0.8)",
          ],
          borderColor: [
            "rgba(34, 197, 94, 1)",
            "rgba(251, 191, 36, 1)",
            "rgba(239, 68, 68, 1)",
          ],
          borderWidth: 2,
        },
      ],
    };

    // Mock data cho chart 3: Số lượng thực hiện tăng theo ngày (line chart)
    const performanceChartData = {
      labels: [
        "01/01", "02/01", "03/01", "04/01", "05/01", "06/01", "07/01",
        "08/01", "09/01", "10/01", "11/01", "12/01", "13/01", "14/01"
      ],
      datasets: [
        {
          label: "Số lượng thực hiện",
          data: [15, 18, 22, 25, 28, 32, 35, 38, 42, 45, 48, 52, 55, 58],
          borderColor: "rgb(168, 85, 247)",
          backgroundColor: "rgba(168, 85, 247, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    };

    setUserData(userChartData);
    setPatientData(patientChartData);
    setPerformanceData(performanceChartData);
  }, []);

  const userChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Số lượng User theo ngày",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const patientChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Phân bố bệnh nhân ảo theo độ khó",
      },
    },
  };

  const performanceChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Số lượng thực hiện tăng theo ngày",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Số lượng user theo ngày */}
        <Card className="w-full">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-8 p-6"
          >
            <Typography variant="h6" color="white">
              Số lượng User theo ngày
            </Typography>
          </CardHeader>
          <CardBody className="px-0 pt-0 pb-2">
            <div className="h-80 flex items-center justify-center">
              <div className="w-full max-w-md">
                <Line data={userData} options={userChartOptions} />
              </div>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Typography variant="small" className="flex items-center gap-1 font-normal text-blue-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="-mt-0.5 h-4 w-4 text-blue-500"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
              Tăng trưởng ổn định
            </Typography>
          </CardFooter>
        </Card>

        {/* Chart 2: Số lượng bệnh nhân ảo theo level */}
        <Card className="w-full">
          <CardHeader
            variant="gradient"
            color="green"
            className="mb-8 p-6"
          >
            <Typography variant="h6" color="white">
              Phân bố bệnh nhân ảo
            </Typography>
          </CardHeader>
          <CardBody className="px-0 pt-0 pb-2">
            <div className="h-80 flex items-center justify-center">
              <div className="w-64 h-64">
                <Pie data={patientData} options={patientChartOptions} />
              </div>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Typography variant="small" className="flex items-center gap-1 font-normal text-blue-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="-mt-0.5 h-4 w-4 text-green-500"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
              Tổng cộng: 100 bệnh nhân ảo
            </Typography>
          </CardFooter>
        </Card>
      </div>

      {/* Chart 3: Số lượng thực hiện tăng theo ngày */}
      <Card className="w-full">
        <CardHeader
          variant="gradient"
          color="purple"
          className="mb-8 p-6"
        >
          <Typography variant="h6" color="white">
            Số lượng thực hiện tăng theo ngày
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          <div className="h-80 flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <Line data={performanceData} options={performanceChartOptions} />
            </div>
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          <Typography variant="small" className="flex items-center gap-1 font-normal text-blue-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="-mt-0.5 h-4 w-4 text-purple-500"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                clipRule="evenodd"
              />
            </svg>
            Tăng trưởng mạnh mẽ
          </Typography>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Dashboard; 