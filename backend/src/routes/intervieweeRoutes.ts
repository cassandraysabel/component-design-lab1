import { addInterviewee, getInterviewee, updateInterviewee, deleteInterviewee } from "../controllers/intervieweeController";
import { Router } from "express";

const router = Router();

router.get("/interviewees", getInterviewee);
router.post("/interviewees", addInterviewee);
router.put("/interviewees/:id", updateInterviewee);
router.delete("/interviewees/:id", deleteInterviewee);

export default router;