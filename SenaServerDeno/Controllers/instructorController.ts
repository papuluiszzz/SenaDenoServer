// deno-lint-ignore-file

import { Instructor } from "../Models/instructorModelo.ts";

export const getInstructor = async(ctx:any)=>{
    const { response } = ctx;

    try {
        const objInstructor = new Instructor();
        const listaProgramas = await objInstructor.SeleccionarInstructores();
        response.status = 200;
        response.body = {
            success:true,
            data:listaProgramas,
        }
    } catch (error) {
        response.status = 400;
        response.body = {
            success:false,
            message: "Error al procesar la solicitud",
            errors: error
        }
    }
};

export const postInstructor = async(ctx:any)=>{
    const { response, request } = ctx;
    try {
        const contentLength = request.headers.get("Content-Length");

        if (contentLength === "0") {
            response.status = 400;
            response.body = {success:false,  message:"El cuerpo de la solicitud se encuentra vacío."};
            return;
        }

        const body = await request.body.json();
        const InstructorData = {
            idinstructor: null,
            nombre: body.nombre,
            apellido: body.apellido,
            email: body.email,
            telefono: body.telefono
        }

        const objInstructor = new Instructor(InstructorData)
        const result = await objInstructor.InsertarInstructor();
        response.status = 200;
        response.body = {
            success:true,
            body: result
        };

    } catch (error) {
        response.status = 400;
        response.body = {
            success:false,
            message:"Error al procesar la solicitud",
            errors:error
        }
    }
};

export const putInstructor = async(ctx: any)=>{
    const {response,request} = ctx;

    try{
        const contentLength = request.headers.get("Content-length");

        if (contentLength === "0") {

            response.status = 400;
            response.body = {success: false,  message: "Cuerpo de la solicitud esta vacio"};
            return;
        }

        const body = await request.body.json();
        const InstructorData = {

            idinstructor: body.idinstructor,
            nombre: body.nombre,
            apellido: body.apellido,
            email: body.email,
            telefono: body.telefono,
        }

        const objInstructor = new Instructor(InstructorData);
        const result = await objInstructor.ActualizarInstructor();
        response.status = 200;
        response.body = {
            success:true,
            body:result,
        };

    }catch(error){
        response.status = 400;
        response.body = {
            success:false,
            message:"Error al procesar la solicitud"
        }
    }
};

export const deleteInstructor = async(ctx:any)=>{
    const { response, request } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
        if (!contentLength || Number(contentLength) === 0) {
            response.status = 400;
            response.body = { success:false,  message:"El cuerpo de la solicitud esta vacio"};
            return;
        }        

        const body = await request.body.json();

        if (!body.idinstructor) {
            response.status = 400;
            response.body = {
                success:false,
                message:"id del instructor no proporcionado"
            };
            return;
        }

        const InstructorData = {
            idinstructor: body.idinstructor,
            nombre: "",
            apellido: "",
            email:"",
            telefono:""
        }

        const objInstructor = new Instructor(InstructorData);
        const result = await objInstructor.EliminarInstructor();

        if (!result.success) {
            response.status = 404;
            response.body = {success:false,  message:result.message};
            return;
        }

        response.status = 200;
        response.body = {
            success:true,
            message: result.message
        };        

    } catch (error) {
        response.status = 400;
        response.body = {
            success:false,
            message:"Error al borrar el usuario",
            errors:error
        }        
    }
};