import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_KEY as string
);

// Get all interviewees
export const getInterviewee = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase.from("interviewees").select("*");
        if (error) throw error;
        res.status(200).json(data);
    } catch (error: any) {
        console.error("Error fetching interviewees:", error);
        res.status(500).json({ error: error.message });
    }
};

// Add a new interviewee
export const addInterviewee = async (req: Request, res: Response) => {
    console.log("🔍 Received request body:", req.body); // Debugging

    const { firstname, lastname, groupname, role, expectedsalary, dateofdefense } = req.body;

    // Validate required fields
    if (!firstname || !lastname || !groupname || !role || expectedsalary == null || !dateofdefense) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const { data, error } = await supabase
            .from("interviewees")
            .insert([{ firstname, lastname, groupname, role, expectedsalary, dateofdefense }])
            .select(); // Return the inserted record

        if (error) throw error;

        res.status(201).json(data);
    } catch (error: any) {
        console.error("Error inserting interviewee:", error);
        res.status(500).json({ error: error.message });
    }
};

// Update an existing interviewee
export const updateInterviewee = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { firstname, lastname, groupname, role, expectedsalary, dateofdefense } = req.body;

    // Validate required fields
    if (!firstname || !lastname || !groupname || !role || expectedsalary == null || !dateofdefense) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const { data, error } = await supabase
            .from("interviewees")
            .update({ firstname, lastname, groupname, role, expectedsalary, dateofdefense })
            .eq("id", id)
            .select(); // Return the updated record

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Interviewee not found" });
        }

        res.status(200).json(data);
    } catch (error: any) {
        console.error("Error updating interviewee:", error);
        res.status(500).json({ error: error.message });
    }
};

// Delete an interviewee
export const deleteInterviewee = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const { error } = await supabase.from("interviewees").delete().eq("id", id);

        if (error) throw error;

        res.status(200).json({ message: "Interviewee deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting interviewee:", error);
        res.status(500).json({ error: error.message });
    }
};