// deno-lint-ignore-file
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
            message: "Error al procesar la solicitud",
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
            response.body = {success:false,  message:"El cuerpo de la solicitud se encuentra vacío."};
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
            message:"Error al procesar la solicitud",
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
            response.body = {success: false,  message: "Cuerpo de la solicitud esta vacio"};
            return;
        }

        const body = await request.body.json();
        
        // Verificar que los campos necesarios existan
        if (!body.idprograma) {
            response.status = 400;
            response.body = {success: false, message: "Se requiere el ID del programa"};
            return;
        }
        
        if (!body.nombre_programa) {
            response.status = 400;
            response.body = {success: false, message: "Se requiere el nombre del programa"};
            return;
        }
        
        const ProgramaData = {
            idprograma: parseInt(body.idprograma),  // Convertir a número
            nombre_programa: body.nombre_programa,
        }

        // Usar nombre consistente con la entidad
        const objPrograma = new Programa(ProgramaData);
        const result = await objPrograma.ActualizarPrograma();
        
        // Manejar el resultado adecuadamente
        if (!result.success) {
            response.status = 400;  // Código más apropiado para error de negocio
            response.body = {
                success: false,
                message: result.message
            };
            return;
        }
        
        response.status = 200;
        response.body = {
            success: true,
            data: result.programa,
            message: result.message
        };

    }catch(error){
        console.error("Error en putPrograma:", error);
        
        response.status = 500;  // Código más apropiado para error interno
        response.body = {
            success: false,
            message: "Error al procesar la solicitud"
        }
    }
};
export const deletePrograma = async(ctx:any)=>{
    const { response, request } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
        if (!contentLength || Number(contentLength) === 0) {
            response.status = 400;
            response.body = { success:false,  message:"El cuerpo de la solicitud esta vacio"};
            return;
        }        

        const body = await request.body.json();

        if (!body.idprograma) {
            response.status = 400;
            response.body = {
                success:false,
                message:"id del programa no proporcionado"
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
            message:"Error al borrar el programa",
            errors:error
        }        
    }
};