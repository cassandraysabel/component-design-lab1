import EmployeeTable from "./components/EmployeeTable";
import FilterSalary from "./components/FilterSalary";



const App = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="center text-3xl font-bold pb-3"> Employee Management System </h1>
    <FilterSalary />
    <table>
    <thead className="items-start">
        <tr>
        <th className="pr-3 pl-3">id</th>
        <th className="pr-3 pl-3">name</th>
        <th className="pr-3 pl-3">role</th>
        <th className="pr-3 pl-3">salary</th>
        </tr>
    </thead>
    </table>
    <EmployeeTable
    id= {1}
    name="Alhena Gedalanga" 
    role="Backend Developer" 
    salary={75000} />

    <EmployeeTable
    id= {2} 
    name="Julienne Tuden" 
    role="Frontend Developer" 
    salary={50000} />

    <EmployeeTable
    id= {3}
    name="Ej Cortez"
    role="Frontend Developer"
    salary={50000} />

    <EmployeeTable
    id= {4}
    name="KJ Siaotong"
    role="Fullstack Developer"
    salary={80000} />

    <EmployeeTable
    id= {5}
    name="Nelissa Tuden"
    role="Fullstack Developer"
    salary={50000} />
    </div>   
  )
}

export default App