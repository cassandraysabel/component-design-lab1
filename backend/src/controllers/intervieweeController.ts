import {Request, Response} from "express";
import { supabase } from "../database/supabase";

const app = require("express")();
export const getInterviewee = async (req: Request, res: Response) => {
    const { data, error } = await supabase.from("interviewees").select();
    if (error) 
        return res.status(500).json({ error: error.message });
    res.json(data);
};

export const addInterviewee = async (req: Request, res: Response) => {
    const { firstName, lastName, groupName, role, expectedSalary, expectedDateOfDefense } = req.body;
    const { data, error } = await supabase
        .from("interviewees")
        .insert([{ firstName, lastName, groupName, role, expectedSalary, expectedDateOfDefense }]);

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
};

export const updateInterviewee = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { firstName, lastName, groupName, role, expectedSalary, expectedDateOfDefense } = req.body;

    const { data, error } = await supabase
        .from("interviewees")
        .update({ firstName, lastName, groupName, role, expectedSalary, expectedDateOfDefense })
        .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

export const deleteInterviewee = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { error } = await supabase.from("interviewees").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Interviewee deleted successfully" });
};
