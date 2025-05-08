// deno-lint-ignore-file
import { Body } from "https://deno.land/x/oak@v17.1.3/body.ts";
import { Aprendiz } from "../Models/aprendizModelo.ts";
import { Status } from 'https://deno.land/x/oak@v17.1.3/deps.ts';


export const getAprendiz = async (ctx: any)=>{
    
    const {response} = ctx;
    
    try {
        
        const objAprendiz = new Aprendiz();
        const listaaprendiz = await objAprendiz.SeleccionarAprendiz();
        response.body = 200;
        response.body ={
            success:true,
            data:listaaprendiz,
        }

    } catch (error) {
        
        response.status = 400;
        response.body = {
            success:false,
            msg:"Error al procesar tu solicitud",
            errors : error
        }
    }
}

export const postAprendiz = async (ctx: any)=>{
    
    const {response,request} = ctx;

    try{

        const contentLength = request.headers.get("Content-Length");

        if (contentLength === "0") {
            
            response.status = 400;
            response.body = {success:false,msg:"Cuerpo de la solicitud esta vacio"};
            return;
        }

        const body = await request.body.json();

        const AprendizData={

            idaprendiz:null,
            nombre: body.nombres,
            apellido: body.apellidos,
            email:body.email,
            telefono:body.telefonos,
        }

        const objAprendiz = new Aprendiz(AprendizData);
        const result = await objAprendiz.InsertarAprendiz();
        response.status = 200;
        response.body = {

            success: true,
            body: result,
        };
    }catch(error){
        response.status = 400;
        response.body = {
            success:false,
            msg:"Error al procesar la solicitud"
        }
    }
}

export const putAprendiz = async(ctx: any)=>{
    const {response,request} = ctx;

    try{

        const contentLength = request.headers.get("Content-length");

        if (contentLength === "0") {

            response.status = 400;
            response.body = {success: false, msg: "Cuerpo de la solicitud esta vacio"};
            return;
            
        }

        const body = await request.body.json();

        const AprendizData = {

            idaprendiz: body.idaprendiz,
            nombre:body.nombres,
            apellido:body.apellidos,
            email:body.email,
            telefono:body.telefonos,
        }

        const objAprendiz = new Aprendiz(AprendizData);
        const result = await objAprendiz.ActualizarAprendiz();
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
}

    export const deleteAprendiz  = async (ctx: any)=>{

        const {response,request} = ctx;

        try {

            const contentLength = request.headers.get("Content-Length");

            if (contentLength === "0") {
                response.status = 400;
                response.body = {success:false, msg:"El ID del usuario es requerido para eliminarlo"};
                return;
                
            }

            const body = await request.body.json();

            if (!body.idaprendiz) {

                response.status = 400;
                response.body = {success:false, msg:"El ID del aprendiz es requerido para eliminarlo"};
                return;
                
            }

            const objAprendiz = new Aprendiz();
            objAprendiz._objAprendiz = {
                idaprendiz: body.idaprendiz,
                nombre:"",
                apellido:"",
                email:"",
                telefono:""

            };

            const result = await objAprendiz.EliminarAprendiz();

            response.status = 200;
            response.body = {
                success:true,
                body:result,
            };
            
        } catch (error) {
            response.status = 400;
            response.body = {
                success:false,
                msg:"Error al procesar la solicitud"
            }

        }
    }
