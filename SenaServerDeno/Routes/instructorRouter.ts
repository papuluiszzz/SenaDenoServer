import { Router } from "../Dependencies/dependencias.ts";
import { getInstructor, postInstructor } from '../Controllers/instructorController.ts';

const routerInstructor = new Router();

routerInstructor.get("/aprendiz",getInstructor);
routerInstructor.post("/aprendiz",postInstructor);
//routerInstructor.put("/aprendiz",putAprendiz);
//routerInstructor.delete("/aprendiz",deleteAprendiz);


export {routerInstructor}