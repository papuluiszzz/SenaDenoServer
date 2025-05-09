import { Router } from "../Dependencies/dependencias.ts";

import { 
    getInstructorHasProfesion, 
    postInstructorHasProfesion, 
    putInstructorHasProfesion, 
    deleteInstructorHasProfesion 
} from "../Controllers/instructor_has_profesionController.ts";

 const routerInstructorHasProfesion = new Router();


 routerInstructorHasProfesion.get("/instructor-profesion", getInstructorHasProfesion);
routerInstructorHasProfesion.post("/instructor-profesion", postInstructorHasProfesion);
routerInstructorHasProfesion.put("/instructor-profesion", putInstructorHasProfesion);
routerInstructorHasProfesion.delete("/instructor-profesion", deleteInstructorHasProfesion);

export { routerInstructorHasProfesion };