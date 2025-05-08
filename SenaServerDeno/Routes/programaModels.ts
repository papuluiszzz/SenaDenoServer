import { Router } from "../Dependencies/dependencias.ts";
import { getPrograma,postPrograma,putPrograma,deletePrograma} from "../Controllers/programaController.ts";

const routerPrograma = new Router();

routerPrograma.get("/programa",getPrograma);
routerPrograma.post("/programa",postPrograma);
routerPrograma.put("/programa",putPrograma);
routerPrograma.delete("/programa",deletePrograma);

export {routerPrograma};