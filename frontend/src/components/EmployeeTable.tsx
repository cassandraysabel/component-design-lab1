import React from "react";

interface Employee {
  id: number;
  name: string;
  role: string;
  salary: number;
}

interface Props {
  title: string;
  employees: Employee[];
}

const EmployeeTable: React.FC<Props> = ({ title, employees }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg w-1/2">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Salary</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="text-center">
              <td className="border p-2">{employee.id}</td>
              <td className="border p-2">{employee.name}</td>
              <td className="border p-2">{employee.role}</td>
              <td className="border p-2">${employee.salary.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;