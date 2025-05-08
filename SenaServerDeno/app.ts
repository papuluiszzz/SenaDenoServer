import { Application, oakCors } from "./Dependencies/dependencias.ts";
import { routerAprendiz } from "./Routes/aprendizModels.ts";
import { routerPrograma } from "./Routes/programaModels.ts";

const app = new Application();

app.use(oakCors());

<<<<<<< HEAD
const routers = [routerAprendiz, routerPrograma]
=======
const routers = [routerAprendiz,routerPrograma]
>>>>>>> 705097c8c825437417bbe3db969df20c83dffe37

routers.forEach((router)=>{

    app.use(router.routes());
    app.use(routerAprendiz.allowedMethods());
    app.use(routerPrograma.allowedMethods());

});

console.log("Servidor corriendo por el puerto 8000")

app.listen({port:8000});