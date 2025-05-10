// deno-lint-ignore-file
import { Aprendiz } from "../Models/aprendizModelo.ts";



export const getAprendiz = async (ctx: any)=>{
    
    const {response} = ctx;
    
    try {
        
        const objAprendiz = new Aprendiz();
        const listaaprendiz = await objAprendiz.SeleccionarAprendiz();
        response.status = 200;
        response.body ={
            success:true,
            data:listaaprendiz,
        }

    } catch (error) {
        
        response.status = 400;
        response.body = {
            success:false,
            message:"Error al procesar tu solicitud",
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
            response.body = {success:false, message:"Cuerpo de la solicitud esta vacio"};
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
            message:"Error al procesar la solicitud"
        }
    }
}

export const putAprendiz = async(ctx: any)=>{
    const {response,request} = ctx;

    try{

        const contentLength = request.headers.get("Content-length");

        if (contentLength === "0") {

            response.status = 400;
            response.body = {success: false,  message: "Cuerpo de la solicitud esta vacio"};
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
            message:"Error al procesar la solicitud"
        }
    }


    
}

    export const deleteAprendiz = async (ctx: any) => {
    const { response, request } = ctx;
    try {
        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false,  message: "El ID del usuario es requerido para eliminarlo" };
            return;
        }

        const body = await request.body.json();
        if (!body.idaprendiz) {
            response.status = 400;
            response.body = { success: false,  message: "El ID del aprendiz es requerido para eliminarlo" };
            return;
        }

        // Forma más consistente de crear el objeto Aprendiz para eliminación
        const AprendizData = {
            idaprendiz: body.idaprendiz,
            nombre: "",
            apellido: "",
            email: "",
            telefono: ""
        };
        
        const objAprendiz = new Aprendiz(AprendizData);
        const result = await objAprendiz.EliminarAprendiz();

        response.status = 200;
        response.body = {
            success: true,
            body: result,
        };
    } catch (error) {
        response.status = 400;
        response.body = {
            success: false,
            message: "Error al procesar la solicitud"
        }
    }
}

