import { Router } from "../Dependencies/dependencias.ts";
import { getAprendiz,postAprendiz,putAprendiz,deleteAprendiz} from "../Controllers/aprendizController.ts";

const routerAprendiz = new Router();

routerAprendiz.get("/aprendiz",getAprendiz);
routerAprendiz.post("/aprendiz",postAprendiz);
routerAprendiz.put("/aprendiz",putAprendiz);
routerAprendiz.delete("/aprendiz",deleteAprendiz);


export {routerAprendiz}