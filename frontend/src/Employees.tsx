import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeeTable from "./components/EmployeeTable";

interface Employee {
  id: number;
  name: string;
  role: string;
  salary: number;
}

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/employees")
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  const entryLevel = employees.filter(employee => employee.salary < 50000);
  const seniorLevel = employees.filter(employee => employee.salary >= 50000);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Employee Management System</h1>
      <div className="flex gap-8">
        <EmployeeTable title="Entry Level" employees={entryLevel} />
        <EmployeeTable title="Senior Level" employees={seniorLevel} />
      </div>
    </div>
  );
};

export default Employees;
