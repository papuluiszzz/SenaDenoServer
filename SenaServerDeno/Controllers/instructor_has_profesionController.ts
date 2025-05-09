// deno-lint-ignore-file
import { InstructorHasProfesion } from "../Models/instructor_has_profesionModelo.ts"; 
export const getInstructorHasProfesion = async (ctx: any) => {
    const { response } = ctx;
    
    try {
        const objInstructorHasProfesion = new InstructorHasProfesion();
        const listaInstructorProfesiones = await objInstructorHasProfesion.SeleccionarInstructorHasProfesion();
        response.status = 200;
        response.body = {
            success: true,
            data: listaInstructorProfesiones,
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

export const postInstructorHasProfesion = async (ctx: any) => {
    const { response, request } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");

        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "Cuerpo de la solicitud está vacío" };
            return;
        }

        const body = await request.body.json();

        const InstructorHasProfesionData = {
            instructor_idinstructor: body.instructor_idinstructor,
            profesion_idprofesion: body.profesion_idprofesion
        };

        const objInstructorHasProfesion = new InstructorHasProfesion(InstructorHasProfesionData);
        const result = await objInstructorHasProfesion.InsertarInstructorHasProfesion();
        
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

export const putInstructorHasProfesion = async (ctx: any) => {
    const { response, request } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");

        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "Cuerpo de la solicitud está vacío" };
            return;
        }

        const body = await request.body.json();

        const InstructorHasProfesionData = {
            instructor_idinstructor: body.instructor_idinstructor,
            profesion_idprofesion: body.profesion_idprofesion,
            nueva_profesion_idprofesion: body.nueva_profesion_idprofesion
        };

        const objInstructorHasProfesion = new InstructorHasProfesion(InstructorHasProfesionData);
        const result = await objInstructorHasProfesion.ActualizarInstructorHasProfesion();
        
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

export const deleteInstructorHasProfesion = async (ctx: any) => {
    const { response, request } = ctx;
    
    try {
        const contentLength = request.headers.get("Content-Length");

        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "Los datos son requeridos para eliminar la relación" };
            return;
        }

        const body = await request.body.json();

        if (!body.instructor_idinstructor || !body.profesion_idprofesion) {
            response.status = 400;
            response.body = { 
                success: false, 
                msg: "Se requieren el ID del instructor y el ID de la profesión para eliminar la relación" 
            };
            return;
        }

        const InstructorHasProfesionData = {
            instructor_idinstructor: body.instructor_idinstructor,
            profesion_idprofesion: body.profesion_idprofesion
        };

        const objInstructorHasProfesion = new InstructorHasProfesion(InstructorHasProfesionData);
        const result = await objInstructorHasProfesion.EliminarInstructorHasProfesion();
        
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