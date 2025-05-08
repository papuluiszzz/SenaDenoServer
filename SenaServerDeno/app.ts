import { Application, oakCors } from "./Dependencies/dependencias.ts";
import { routerAprendiz } from "./Routes/aprendizModels.ts";

const app = new Application();

app.use(oakCors());

const routers = [routerAprendiz]

routers.forEach((router)=>{

    app.use(router.routes());
    app.use(routerAprendiz.allowedMethods());
});

console.log("Servidor corriendo por el puerto 8000")

app.listen({port:8000});