import { Router } from "../Dependencies/dependencias.ts";
import { getFicha,postFicha,putFicha,deleteFicha,getFichaPorId,getFichasPorPrograma } from "../Controllers/fichaControllers.ts";

const routerFicha = new Router();

routerFicha.get("/ficha",getFicha);
routerFicha.post("/ficha",postFicha);
routerFicha.put("/ficha",putFicha);
routerFicha.delete("/ficha",deleteFicha);
routerFicha.get("/ficha/programa/:idprograma", getFichasPorPrograma);
routerFicha.get("/ficha",getFichaPorId)

export{routerFicha}