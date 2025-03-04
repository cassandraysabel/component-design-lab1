import EmployeeTable from "./EmployeeTable";

const FilterSalary = () => {
    interface EmployeeTableProps {
        id: number;
        name: string;
        role: string;
        salary: number;
    }
    
    const handleFilterChange = (e: any) => {
        //basta ma change ang value sa dropdown, i-filter ang mga employees -- hi sir if ure reading this IM SO SORRY
        if (e.target.value === "Senior") {
          employee.salary > 50000;
        } else if (e.target.value === "Entry-level") {
          employee.salary <= 50000;
        }
        else {
          employee.salary;
        }
    }
    return (
      <div>
        <filter>
          <label>Filter by Salary:</label>
          <select>
            <option value="All" onClick={handleFilterChange}>All</option>
            <option value="Senior" onClick={handleFilterChange}>Senior</option>
            <option value="Entry-level" onClick={handleFilterChange} >Entry-level</option>
          </select>
        </filter>  
      </div>
    )};
export default FilterSalary;
