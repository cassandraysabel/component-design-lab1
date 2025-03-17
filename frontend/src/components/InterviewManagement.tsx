import { useState, useEffect } from "react";
import axios from "axios";

interface Interviewee {
    id?: number;
    firstname: string;
    lastname: string;
    groupname: string;
    role: string;
    expectedsalary: number;
    dateofdefense: string;
}

const InterviewManagement = () => {
    const [interviewees, setInterviewees] = useState<Interviewee[]>([]);
    const [form, setForm] = useState<Interviewee>({
        firstname: "",
        lastname: "",
        groupname: "",
        role: "",
        expectedsalary: 0,
        dateofdefense: "",
    });

    useEffect(() => {
        fetchInterviewees();
    }, []);

    const fetchInterviewees = async () => {
        const res = await axios.get("http://localhost:5000/api/interviewees");
        setInterviewees(res.data);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            const res = await axios.post("http://localhost:5000/api/interviewees", form);
            
            if (res.status === 201 || res.status === 200) {
                fetchInterviewees(); ``
                setForm({
                    firstname: "",
                    lastname: "",
                    groupname: "",
                    role: "",
                    expectedsalary: 0,
                    dateofdefense: "",
                });
            } else {
                console.error("Failed to add student:", res.data);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };
    

    const handleDelete = async (id: number) => {
        await axios.delete(`http://localhost:5000/api/interviewees/${id}`);
        fetchInterviewees();
    };

    return (
        <div className="p-5 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Student Management</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <input type="text" name="firstname" placeholder="First Name" value={form.firstname} onChange={handleChange} className="border p-2 m-1 w-full" required />
                <input type="text" name="lastname" placeholder="Last Name" value={form.lastname} onChange={handleChange} className="border p-2 m-1 w-full" required />
                <input type="text" name="groupname" placeholder="Group Name" value={form.groupname} onChange={handleChange} className="border p-2 m-1 w-full" required />
                <input type="text" name="role" placeholder="Role" value={form.role} onChange={handleChange} className="border p-2 m-1 w-full" required />
                <input type="number" name="expectedaslary" placeholder="Expected Salary" value={form.expectedsalary} onChange={handleChange} className="border p-2 m-1 w-full" required />
                <input type="date" name="dateofdefense" value={form.dateofdefense} onChange={handleChange} className="border p-2 m-1 w-full" required />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Student</button>
            </form>

            <table className="w-full border-collapse border border-gray-400">
                <thead>
                    <tr>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Group</th>
                        <th className="border p-2">Role</th>
                        <th className="border p-2">Salary</th>
                        <th className="border p-2">Defense Date</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {interviewees.map((interviewee) => (
                        <tr key={interviewee.id}>
                            <td className="border p-2">{interviewee.firstname} {interviewee.lastname}</td>
                            <td className="border p-2">{interviewee.groupname}</td>
                            <td className="border p-2">{interviewee.role}</td>
                            <td className="border p-2">${interviewee.expectedsalary}</td>
                            <td className="border p-2">{interviewee.dateofdefense}</td>
                            <td className="border p-2">
                                <button onClick={() => handleDelete(interviewee.id!)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                                <button className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InterviewManagement;
