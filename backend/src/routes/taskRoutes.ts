import express from "express";
import taskController from "../controllers/taskController";


const router = express.Router();


router.get("/tasks", taskController.getAllTasks);
router.get("/tasks/:id", taskController.getTaskById); 
router.post("/tasks", taskController.createTask); 
router.put("/tasks/:id", taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask); 
router.patch("/tasks/:id/completion", taskController.toggleTaskCompletion); 


router.patch("/tasks/:taskId/checklist/:subtaskId/completion", taskController.toggleSubtaskCompletion); 

export default router;
