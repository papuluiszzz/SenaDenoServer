import { Router } from "../Dependencies/dependencias.ts";
import { getPrograma,postPrograma,putPrograma,deletePrograma} from "../Controllers/aprendizController.ts";

const routerAprendiz = new Router();

routerAprendiz.get("/aprendiz",getPrograma);
routerAprendiz.post("/aprendiz",postPrograma);
routerAprendiz.put("/aprendiz:id",putPrograma);
routerAprendiz.put("/aprendiz",deletePrograma);

export {routerPrograma};