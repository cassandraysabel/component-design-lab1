import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  const data =[
    {
        name:"Alhena Gedalanga",
        role:"Backend Developer",
        salary:75000
    },
    {
        name:"Julienne Tuden",
        role:"Frontend Developer",
        salary:50000
    },
    {
        name:"Ej Cortez",
        role:"Frontend Developer",
        salary:50000
    },
    {
        name:"KJ Siaotong",
        role:"Fullstack Developer",
        salary:80000
    },
    {
        name:"Nelissa Tuden",
        role:"Fullstack Developer",
        salary:50000
    }

];
  res.json(data);
});

export default router;