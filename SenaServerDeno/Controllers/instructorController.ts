// deno-lint-ignore-file

import { number } from "https://deno.land/x/zod@v3.24.1/types.ts";
import { Instructor } from "../Models/instructorModelo.ts";
import { errors } from "jsr:@oak/commons@^1.0/http_errors";

export const getInstructor = async(ctx:any)=>{
    const { response } = ctx;

    try {
        const objPrograma = new Instructor();
        const listaProgramas = await objPrograma.SeleccionarInstructores();
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

export const postInstructor = async(ctx:any)=>{
    const { response, request } = ctx;
    try {
        const contentLength = request.headers.get("Content-Length");

        if (contentLength === "0") {
            response.status = 400;
            response.body = {success:false, msg:"El cuerpo de la solicitud se encuentra vacío."};
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

        const objPrograma = new Instructor(InstructorData)
        const result = await objPrograma.InsertarInstructor();
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

export const putInstructor = async(ctx: any)=>{
    const {response,request} = ctx;

    try{
        const contentLength = request.headers.get("Content-length");

        if (contentLength === "0") {

            response.status = 400;
            response.body = {success: false, msg: "Cuerpo de la solicitud esta vacio"};
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

        const objAprendiz = new Instructor(InstructorData);
        const result = await objAprendiz.ActualizarInstructor();
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

export const deleteInstructor = async(ctx:any)=>{
    const { response, request } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
        if (!contentLength || Number(contentLength) === 0) {
            response.status = 400;
            response.body = { success:false, msg:"El cuerpo de la solicitud esta vacio"};
            return;
        }        

        const body = await request.body.json();

        if (!body.idinstructor) {
            response.status = 400;
            response.body = {
                success:false,
                msg:"id del instructor no proporcionado"
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