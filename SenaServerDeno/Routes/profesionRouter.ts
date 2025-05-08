import { Router } from "../Dependencies/dependencias.ts";
import { getprofesion,postprofesion,putprofesion,deliteProfesion } from "../Controllers/profesionController.ts";


const routerprofesion = new Router();

routerprofesion.get("/profesion",getprofesion);
routerprofesion.post("/profesion",postprofesion);
routerprofesion.put("/profesion",putprofesion);
routerprofesion.delete("/profesion",deliteProfesion)

export {routerprofesion}