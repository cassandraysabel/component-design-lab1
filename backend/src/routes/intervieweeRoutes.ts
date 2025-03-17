import { addInterviewee, getInterviewee, updateInterviewee, deleteInterviewee } from "../controllers/intervieweeController";
import { Router } from "express";

const Intervieweerouter = Router();

Intervieweerouter.get("/", getInterviewee);
Intervieweerouter.post("/", addInterviewee);
Intervieweerouter.put("/:id", updateInterviewee);
Intervieweerouter.delete("/:id", deleteInterviewee);

export default Intervieweerouter;