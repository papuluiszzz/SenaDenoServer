// deno-lint-ignore-file
<<<<<<< HEAD
import { Programa } from '../Models/programaModelo.ts';

export const getPrograma = async(ctx:any)=>{
    const { response } = ctx;
    try {
        const objPrograma = new Programa();
        const listaProgramas = await objPrograma.SeleccionarPrograma();
        response.status = 200;
        response.body = {
            success:true,
            data:listaProgramas,
        }
    } catch (error) {
        response.status = 400;
        response.body = {
            success:false,
            msg: "Error al procesar la solicitud",
            errors: error
        }
    }
};

export const postPrograma = async(ctx:any)=>{
    const { response, request } = ctx;
=======
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

>>>>>>> Luis
    try {
        const contentLength = request.headers.get("Content-Length");

        if (contentLength === "0") {
            response.status = 400;
<<<<<<< HEAD
            response.body = {success:false, msg:"El cuerpo de la solicitud se encuentra vacío."};
=======
            response.body = { success: false, msg: "Cuerpo de la solicitud está vacío" };
>>>>>>> Luis
            return;
        }

        const body = await request.body.json();
<<<<<<< HEAD
        const ProgramaData = {
            idprograma: null,
            nombre_programa: body.nombre_programa
        }

        const objPrograma = new Programa(ProgramaData)
        const result = await objPrograma.InsertarPrograma();
        response.status = 200;
        response.body = {
            success:true,
            body: result
        };

    } catch (error) {
        response.status = 400;
        response.body = {
            success:false,
            msg:"Error al procesar la solicitud",
            errors:error
        }
    }
};

export const putPrograma = async(ctx: any)=>{
    const {response,request} = ctx;

    try{
        const contentLength = request.headers.get("Content-length");

        if (contentLength === "0") {

            response.status = 400;
            response.body = {success: false, msg: "Cuerpo de la solicitud esta vacio"};
            return;
        }

        const body = await request.body.json();
        const ProgramaData = {

            idprograma: body.idprograma,
            nombre_programa: body.nombre_programa,
        }

        const objAprendiz = new Programa(ProgramaData);
        const result = await objAprendiz.ActualizarPrograma();
        response.status = 200;
        response.body = {
            success:true,
            body:result,
        };

    }catch(error){
        response.status = 400;
        response.body = {
            success:false,
            msg:"Error al procesar la solicitud"
        }
    }
};

export const deletePrograma = async(ctx:any)=>{
=======

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
>>>>>>> Luis
    const { response, request } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
<<<<<<< HEAD
        if (!contentLength || Number(contentLength) === 0) {
            response.status = 400;
            response.body = { success:false, msg:"El cuerpo de la solicitud esta vacio"};
            return;
        }        

        const body = await request.body.json();

        if (!body.idprograma) {
            response.status = 400;
            response.body = {
                success:false,
                msg:"id del programa no proporcionado"
=======

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
>>>>>>> Luis
            };
            return;
        }

<<<<<<< HEAD
        const ProgramaData = {
            idprograma: body.idprograma,
            nombre_programa:""
        }

        const objPrograma = new Programa(ProgramaData);
        const result = await objPrograma.EliminarPrograma();

        if (!result.success) {
            response.status = 404;
            response.body = {success:false, msg:result.message};
            return;
        }

        response.status = 200;
        response.body = {
            success:true,
            msg: result.message
        };        

    } catch (error) {
        response.status = 400;
        response.body = {
            success:false,
            msg:"Error al borrar el usuario",
            errors:error
        }        
    }
};
=======
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
>>>>>>> Luis
