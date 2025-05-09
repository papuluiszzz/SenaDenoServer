// deno-lint-ignore-file
import { Ficha } from "../Models/fichaModelo.ts";

export const getFicha = async (ctx: any) => {
    const { response } = ctx;
    
    try {
        const objFicha = new Ficha();
        const listaFichas = await objFicha.SeleccionarFichas();
        response.status = 200;
        response.body = {
            success: true,
            data: listaFichas,
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

export const getFichaPorId = async (ctx: any) => {
    const { response, params } = ctx;
    
    try {
        if (!params.id) {
            response.status = 400;
            response.body = { 
                success: false, 
                msg: "Se requiere el ID de la ficha" 
            };
            return;
        }
        
        const objFicha = new Ficha();
        const ficha = await objFicha.SeleccionarFichaPorId(parseInt(params.id));
        
        if (!ficha) {
            response.status = 404;
            response.body = { 
                success: false, 
                msg: "Ficha no encontrada" 
            };
            return;
        }
        
        response.status = 200;
        response.body = {
            success: true,
            data: ficha,
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

export const getFichasPorPrograma = async (ctx: any) => {
    const { response, params } = ctx;
    
    try {
        if (!params.idprograma) {
            response.status = 400;
            response.body = { 
                success: false, 
                msg: "Se requiere el ID del programa" 
            };
            return;
        }
        
        const objFicha = new Ficha();
        const fichas = await objFicha.SeleccionarFichasPorPrograma(parseInt(params.idprograma));
        
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

export const postFicha = async (ctx: any) => {
    const { response, request } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");

        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "Cuerpo de la solicitud está vacío" };
            return;
        }

        const body = await request.body.json();

        const FichaData = {
            idficha: null,
            codigo: body.codigo,
            fecha_inicio_lectiva: body.fecha_inicio_lectiva,
            fecha_fin_lectiva: body.fecha_fin_lectiva,
            fecha_fin_practica: body.fecha_fin_practica,
            programa_idprograma: body.programa_idprograma
        };

        const objFicha = new Ficha(FichaData);
        const result = await objFicha.InsertarFicha();
        
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

export const putFicha = async (ctx: any) => {
    const { response, request } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");

        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "Cuerpo de la solicitud está vacío" };
            return;
        }

        const body = await request.body.json();

        const FichaData = {
            idficha: body.idficha,
            codigo: body.codigo,
            fecha_inicio_lectiva: body.fecha_inicio_lectiva,
            fecha_fin_lectiva: body.fecha_fin_lectiva,
            fecha_fin_practica: body.fecha_fin_practica,
            programa_idprograma: body.programa_idprograma
        };

        const objFicha = new Ficha(FichaData);
        const result = await objFicha.ActualizarFicha();
        
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

export const deleteFicha = async (ctx: any) => {
    const { response, request } = ctx;
    
    try {
        const contentLength = request.headers.get("Content-Length");

        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El ID de la ficha es requerido para eliminarla" };
            return;
        }

        const body = await request.body.json();

        if (!body.idficha) {
            response.status = 400;
            response.body = { success: false, msg: "El ID de la ficha es requerido para eliminarla" };
            return;
        }

        // Forma más consistente con el resto del código
        const FichaData = {
            idficha: body.idficha,
            codigo: "",
            fecha_inicio_lectiva: "",
            fecha_fin_lectiva: "",
            fecha_fin_practica: "",
            programa_idprograma: 0
        };
        
        const objFicha = new Ficha(FichaData);
        const result = await objFicha.EliminarFicha();
        
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