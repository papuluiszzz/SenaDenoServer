// deno-lint-ignore-file
import { number } from "https://deno.land/x/zod@v3.24.1/types.ts";
import { Programa } from "../Models/programaModelo.ts";
import { errors } from "jsr:@oak/commons@^1.0/http_errors";

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
    try {
        const contentLength = request.headers.get("Content-Length");

        if (contentLength === "0") {
            response.status = 400;
            response.body = {success:false, msg:"El cuerpo de la solicitud se encuentra vacío."};
            return;
        }

        const body = await request.body.json();
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
    const { response, request } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
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
            };
            return;
        }

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