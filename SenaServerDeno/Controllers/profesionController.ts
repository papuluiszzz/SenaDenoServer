// deno-lint-ignore-file
import { Profesion } from "../Models/profesionModelo.ts";






export const getprofesion = async (ctx:any)=>{

    const {response} = ctx;

    try{
        const objprofesion = new Profesion();
        const listaprofesion = await objprofesion.SeleccionarProfesion();
        response.status = 200;
        response.body = {
            success:true,
            data:listaprofesion,
        }
    }catch(error){
        response.status = 400;
        response.body = {
            success:false,
            message:"Error al procesar tu solicitud",
            errors:error
        }

    }
}
export const postprofesion = async (ctx:any)=>{
    const {response,request}= ctx;
    try{
        const contentLength = request.headers.get("Content-Length");
        if(contentLength === "0"){
            response.status = 400;
        response.body = {succes:false, message:"cuerpo de la solicitud esta vacio"};
        return;
          }
          const body = await request.body.json();
          const ProfesionData={
            idprofesion:null,
            nombre_profesion:body.nombre_profesion,
          }

        const objprofesion = new Profesion(ProfesionData);
        const result = await objprofesion.InsertarProfesion();
        response.status = 200;
        response.body={
            success:true,
            body:result,

        }
    }catch(error){
        response.status = 400;
        response.body ={
            success:false,
            message:"Error al proceer la solicitud"
        }
    }
}

export const putprofesion = async (ctx:any)=>{
    const {response,request}=ctx;
    try{
        const contentLength = request.headers.get("Content-length");
        if(contentLength ==="0"){
            response.status = 400;
            response.body={success:false, message:"cuerpo de la solicitud esta vacio"};
            return;
        }
        const body = await request.body.json();

        const profesionData = {
            idprofesion:body.idprofesion,
            nombre_profesion:body.nombre_profesion
        }

        const objprofesion = new  Profesion(profesionData);
        const result = await objprofesion.ActualizarProfesion();
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



export const deleteProfesion = async(ctx:any)=>{
    const {response, request} = ctx;
    try {
        const contentLength = request.headers.get("Content-Length");
        if (!contentLength || Number(contentLength) === 0) {
            response.status = 400;
            response.body = { success:false,  message:"El cuerpo pde la solicitud esta vacio"};
            return;
        }

        const body = await request.body.json();
        
        if (!body.idprofesion) {
            response.status = 400;
            response.body = {success:false,  message:"id de la profesion  no proporcionado"};
            return;
        }

        const profesionData = {
            idprofesion: body.idprofesion,
            nombre_profesion: ""  
            
        }

        const objprofesion = new Profesion(profesionData);
        const result = await objprofesion.eliminarprofesion();

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
            message:"Error al borrar la profesion",
            errors:error
        }
    }
};
