import { Router } from "../Dependencies/dependencias.ts";
import { getprofesion,postprofesion,putprofesion,deleteProfesion } from "../Controllers/profesionController.ts";


const routerprofesion = new Router();

routerprofesion.get("/profesion",getprofesion);
routerprofesion.post("/profesion",postprofesion);
routerprofesion.put("/profesion",putprofesion);
routerprofesion.delete("/profesion",deleteProfesion)

export {routerprofesion}