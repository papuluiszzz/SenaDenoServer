import { Router } from "../Dependencies/dependencias.ts";

import { getInstructorHasProfesion, 
    postInstructorHasProfesion, 
    putInstructorHasProfesion, 
    deleteInstructorHasProfesion 
 } from "../Controllers/programaController.ts";

 const routerInstructorHasProfesion = new Router();


 routerInstructorHasProfesion.get("/instructor-profesion", getInstructorHasProfesion);
routerInstructorHasProfesion.post("/instructor-profesion", postInstructorHasProfesion);
routerInstructorHasProfesion.put("/instructor-profesion", putInstructorHasProfesion);
routerInstructorHasProfesion.delete("/instructor-profesion", deleteInstructorHasProfesion);

export { routerInstructorHasProfesion };