import { Router } from "../Dependencies/dependencias.ts";
import { getInstructor, postInstructor, putInstructor, deleteInstructor } from '../Controllers/instructorController.ts';

const routerInstructor = new Router();

routerInstructor.get("/instructor",getInstructor);
routerInstructor.post("/instructor",postInstructor);
routerInstructor.put("/instructor",putInstructor);
routerInstructor.delete("/instructor",deleteInstructor);

export {routerInstructor}