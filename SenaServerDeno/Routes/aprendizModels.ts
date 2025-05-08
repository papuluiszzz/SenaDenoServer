import { Router } from "../Dependencies/dependencias.ts";
import { getAprendiz,postAprendiz } from "../Controllers/aprendizController.ts";

const routerAprendiz = new Router();

routerAprendiz.get("/aprendiz",getAprendiz);
routerAprendiz.post("/aprendiz",postAprendiz);


export {routerAprendiz}