// deno-lint-ignore-file
import { number } from "https://deno.land/x/zod@v3.24.1/types.ts";
import { Programa } from "../Models/programaModelo.ts";

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
}