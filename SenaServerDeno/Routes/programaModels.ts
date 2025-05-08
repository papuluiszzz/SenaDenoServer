import { Router } from "../Dependencies/dependencias.ts";
import { getPrograma,postPrograma,putPrograma,deletePrograma} from "../Controllers/aprendizController.ts";

const routerPrograma = new Router();

routerAprendiz.get("/aprendiz",getPrograma);
routerAprendiz.post("/aprendiz",postPrograma);
routerAprendiz.put("/aprendiz:id",putPrograma);
routerAprendiz.put("/aprendiz",deletePrograma);

export {routerPrograma};