import { Router } from "../Dependencies/dependencias.ts";
import { getAprendiz,postAprendiz,putAprendiz} from "../Controllers/aprendizController.ts";

const routerAprendiz = new Router();

routerAprendiz.get("/aprendiz",getAprendiz);
routerAprendiz.post("/aprendiz",postAprendiz);
routerAprendiz.put("/aprendiz",putAprendiz);


export {routerAprendiz}