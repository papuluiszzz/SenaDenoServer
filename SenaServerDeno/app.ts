import { Application, oakCors } from "./Dependencies/dependencias.ts";
import { routerAprendiz } from "./Routes/aprendizRouter.ts";
import { routerPrograma } from "./Routes/programaRouter.ts"
import { routerFichaHasAprendiz } from "./Routes/ficha_has_aprendiz.ts";
import { routerFicha } from "./Routes/fichaRouter.ts";
import { routerInstructor } from "./Routes/instructorRouter.ts";
import {routerprofesion} from "./Routes/profesionRouter.ts";
import {routerInstructorHasProfesion} from "./Routes/instructorHasProfesioRouter.ts"



const app = new Application();

app.use(oakCors());




const routers = [routerAprendiz, routerPrograma, routerFicha, routerInstructor, routerprofesion, routerFichaHasAprendiz, routerInstructorHasProfesion]



routers.forEach((router)=>{

    app.use(router.routes());
    app.use(router.allowedMethods());

});

console.log("Servidor corriendo por el puerto 8000")

app.listen({port:8000});