import { conexion } from "./conexion.ts";
import { z } from "../Dependencies/dependencias.ts";

interface ProgramaData {
    idPrograma: number | null;
    nombre_programa: string;
}

export class Programa{
    public _objPrograma: ProgramaData | null;
    public _idPrograma: number | null;

    constructor(objPrograma: ProgramaData | null = null, idPrograma: number | null = null){
        this._objPrograma = objPrograma;
        this._idPrograma = idPrograma;
    }

    public async SeleccionarPrograma(): Promise<ProgramaData[]>{
        const { rows: programa } = await conexion.execute('select * from programa');
        return programa as ProgramaData[];
    }

    public async InsertarPrograma(): Promise<{ success: boolean; message: string; programa?: Record<string, unknown> }> {
        try{
            if (!this._objPrograma) {
                throw new Error("No se ha proporcionado un objeto de Programa valido.");
            }

            const nombre_programa = this._objPrograma;
            if (!nombre_programa) {
                throw new Error("Faltan campos requeridos");
            }

            await conexion.execute("START TRANSACTION")
            const result = await conexion.execute('insert into programa (nombre_programa) values (?)', [nombre_programa]);
            
            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [programa] = await conexion.query('select * from programa idPrograma = LAST_INSERT_ID()',);
                await conexion.execute("COMMIT");
                return { success:true, message:"Programa registrado exitosamente", programa:programa };
            } else {
                throw new Error("No fué posible registrar el programa");
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                return { success:false, message: error.message};
            } else {
                return { success:false, message:"Error interno del servidor" };
            }
        }
    }

    public async ActualizarPrograma(): Promise<{ success: boolean; message: string; programa?: Record<string, unknown> }> {
        try{
            if (!this._objPrograma) {
                throw new Error("No se ha proporcionado un objeto de Programa valido.");
            }

            const { idPrograma, nombre_programa } = this._objPrograma;

            if (!idPrograma || nombre_programa) {
                throw new Error("Faltan campos requeridos");
            }

            await conexion.execute("START TRANSACTION")
            const result = await conexion.execute('update programa set nombre_programa = ? where idPrograma = ?', [idPrograma, nombre_programa]);
            
            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [programa] = await conexion.query('select * from programa where idPrograma = ?', [idPrograma]);
                await conexion.execute("COMMIT");
                return { success:true, message:"Programa actualizado exitosamente", programa:programa };
            } else {
                await conexion.execute("ROLLBACK");
                return {success:false, message:"No fué posible actualizar el programa"};
            }
        } catch (error) {
            await conexion.execute("ROLLBACK");

            if (error instanceof z.ZodError) {
                return { success:false, message: error.message };
            } else {
                return { success:false, message: "Error interno del servidor" };
            }
        }
    }
 
    public async EliminarPrograma(): Promise<{ success: boolean; message: string; programa?: Record<string, unknown> }> {
        try{
            if (!this._objPrograma) {
                throw new Error("No se ha proporcionado un objeto de Programa valido.");
            }

            const idPrograma = this._objPrograma;

            if (!idPrograma) {
                throw new Error("Faltan campos requeridos");
            }

            await conexion.execute("START TRANSACTION")

            const [existingProgram] = await conexion.query('select * from programa where idPrograma = ?', [idPrograma]);

            if (!existingProgram || existingProgram.length === 0) {
                await conexion.execute("ROLLBACK");
                return {
                    success: false,
                    message: "No se encontró el programa especificado"
                };
            }

            const result = await conexion.execute('delete from programa where idPrograma = ?', [idPrograma]);
            
            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                await conexion.execute("COMMIT");
                return { success:true, message:"Programa eliminado exitosamente" };
            } else {
                await conexion.execute("ROLLBACK");
                return {success:false, message:"No fué posible eliminar el programa"};
            }
        } catch (error) {
            await conexion.execute("ROLLBACK");

            if (error instanceof z.ZodError) {
                return { success:false, message: error.message };
            } else {
                return { success:false, message: "Error interno del servidor" };
            }
        }
    }    
}