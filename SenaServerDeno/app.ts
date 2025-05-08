import { Application, oakCors } from "./Dependencies/dependencias.ts";


import { routerAprendiz } from "./Routes/aprendizModels.ts";
import { routerPrograma } from "./Routes/programaModels.ts";
import { routerFicha } from "./Routes/fichaRouter.ts";


const app = new Application();

app.use(oakCors());



const routers = [routerAprendiz,routerPrograma,routerFicha]


routers.forEach((router)=>{

    app.use(router.routes());
    app.use(routerAprendiz.allowedMethods());
    app.use(routerPrograma.allowedMethods());

});

console.log("Servidor corriendo por el puerto 8000")

app.listen({port:8000});