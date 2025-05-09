// deno-lint-ignore-file
import { FichaHasAprendiz } from "../Models/ficha_has_aprendiz.ts"; 

export const getFichaHasAprendiz = async (ctx: any) => {
    const { response } = ctx;
    
    try {
        const objFichaHasAprendiz = new FichaHasAprendiz();
        const listaFichasAprendices = await objFichaHasAprendiz.SeleccionarFichaHasAprendiz();
        response.status = 200;
        response.body = {
            success: true,
            data: listaFichasAprendices,
        };
    } catch (error) {
        response.status = 400;
        response.body = {
            success: false,
            msg: "Error al procesar tu solicitud",
            errors: error
        };
    }
}

export const getAprendicesPorFicha = async (ctx: any) => {
    const { response, params } = ctx;
    
    try {
        if (!params.idficha) {
            response.status = 400;
            response.body = { 
                success: false, 
                msg: "Se requiere el ID de la ficha" 
            };
            return;
        }
        
        const objFichaHasAprendiz = new FichaHasAprendiz();
        const aprendices = await objFichaHasAprendiz.SeleccionarAprendicesPorFicha(parseInt(params.idficha));
        
        response.status = 200;
        response.body = {
            success: true,
            data: aprendices,
        };
    } catch (error) {
        response.status = 400;
        response.body = {
            success: false,
            msg: "Error al procesar tu solicitud",
            errors: error
        };
    }
}

export const getFichasPorAprendiz = async (ctx: any) => {
    const { response, params } = ctx;
    
    try {
        if (!params.idaprendiz) {
            response.status = 400;
            response.body = { 
                success: false, 
                msg: "Se requiere el ID del aprendiz" 
            };
            return;
        }
        
        const objFichaHasAprendiz = new FichaHasAprendiz();
        const fichas = await objFichaHasAprendiz.SeleccionarFichasPorAprendiz(parseInt(params.idaprendiz));
        
        response.status = 200;
        response.body = {
            success: true,
            data: fichas,
        };
    } catch (error) {
        response.status = 400;
        response.body = {
            success: false,
            msg: "Error al procesar tu solicitud",
            errors: error
        };
    }
}

export const postFichaHasAprendiz = async (ctx: any) => {
    const { response, request } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");

        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "Cuerpo de la solicitud está vacío" };
            return;
        }

        const body = await request.body.json();

        const FichaHasAprendizData = {
            ficha_idficha: body.ficha_idficha,
            aprendiz_idaprendiz: body.aprendiz_idaprendiz,
            instructor_idinstructor: body.instructor_idinstructor
        };

        const objFichaHasAprendiz = new FichaHasAprendiz(FichaHasAprendizData);
        const result = await objFichaHasAprendiz.InsertarFichaHasAprendiz();
        
        response.status = result.success ? 201 : 400;
        response.body = {
            success: result.success,
            body: result,
        };
    } catch (error) {
        response.status = 400;
        response.body = {
            success: false,
            msg: "Error al procesar la solicitud"
        };
    }
}

export const putFichaHasAprendiz = async (ctx: any) => {
    const { response, request } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");

        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "Cuerpo de la solicitud está vacío" };
            return;
        }

        const body = await request.body.json();

        const FichaHasAprendizData = {
            ficha_idficha: body.ficha_idficha,
            aprendiz_idaprendiz: body.aprendiz_idaprendiz,
            instructor_idinstructor: body.instructor_idinstructor
        };

        const objFichaHasAprendiz = new FichaHasAprendiz(FichaHasAprendizData);
        const result = await objFichaHasAprendiz.ActualizarFichaHasAprendiz();
        
        response.status = result.success ? 200 : 400;
        response.body = {
            success: result.success,
            body: result,
        };
    } catch (error) {
        response.status = 400;
        response.body = {
            success: false,
            msg: "Error al procesar la solicitud"
        };
    }
}

export const deleteFichaHasAprendiz = async (ctx: any) => {
    const { response, request } = ctx;
    
    try {
        const contentLength = request.headers.get("Content-Length");

        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "Los datos son requeridos para eliminar la relación" };
            return;
        }

        const body = await request.body.json();

        if (!body.ficha_idficha || !body.aprendiz_idaprendiz) {
            response.status = 400;
            response.body = { 
                success: false, 
                msg: "Se requieren el ID de la ficha y el ID del aprendiz para eliminar la relación" 
            };
            return;
        }

        const FichaHasAprendizData = {
            ficha_idficha: body.ficha_idficha,
            aprendiz_idaprendiz: body.aprendiz_idaprendiz,
            instructor_idinstructor: body.instructor_idinstructor || 0 // El instructor es opcional para eliminar
        };

        const objFichaHasAprendiz = new FichaHasAprendiz(FichaHasAprendizData);
        const result = await objFichaHasAprendiz.EliminarFichaHasAprendiz();
        
        response.status = result.success ? 200 : 400;
        response.body = {
            success: result.success,
            body: result,
        };
    } catch (error) {
        response.status = 400;
        response.body = {
            success: false,
            msg: "Error al procesar la solicitud"
        };
    }
}