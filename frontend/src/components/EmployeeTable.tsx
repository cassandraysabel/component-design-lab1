interface EmployeeTableProps {
    id: number;
    name: string;
    role: string;
    salary: number;
}


const EmployeeTable = ({id, name, role, salary }: EmployeeTableProps) => {
        return (
            <div>
                <table>
                <tbody> 
                    <tr>
                    <td className="pr-3 pl-3">{id}</td>
                    <td className="pr-3 pl-3">{name}</td>
                    <td className="pr-3 pl-3">{role}</td>
                    <td className="pr-3 pl-3">{salary}</td>
                    </tr>
                </tbody>
                </table>
            </div>
            );
        };
export default EmployeeTable;
