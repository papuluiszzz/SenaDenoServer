import { Router } from "../Dependencies/dependencias.ts"; 
import { 
    getFichaHasAprendiz, 
    getAprendicesPorFicha, 
    getFichasPorAprendiz,
    postFichaHasAprendiz, 
    putFichaHasAprendiz, 
    deleteFichaHasAprendiz 
} from "../Controllers/ficha_has_aprendiz.ts"

const routerFichaHasAprendiz = new Router();

// Rutas para FichaHasAprendiz
routerFichaHasAprendiz.get("/ficha-aprendiz", getFichaHasAprendiz);
routerFichaHasAprendiz.get("/ficha-aprendiz/ficha/:idficha", getAprendicesPorFicha);
routerFichaHasAprendiz.get("/ficha-aprendiz/aprendiz/:idaprendiz", getFichasPorAprendiz);
routerFichaHasAprendiz.post("/ficha-aprendiz", postFichaHasAprendiz);
routerFichaHasAprendiz.put("/ficha-aprendiz", putFichaHasAprendiz);
routerFichaHasAprendiz.delete("/ficha-aprendiz", deleteFichaHasAprendiz);

export {routerFichaHasAprendiz}