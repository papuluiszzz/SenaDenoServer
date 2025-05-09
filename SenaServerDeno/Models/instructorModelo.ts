import { conexion } from "./conexion.ts";
import { z } from "../Dependencies/dependencias.ts";

interface InstructorData{
    idinstructor: number | null;
    nombre : string,
    apellido: string,
    email: string,
    telefono: string;
}

export class Instructor {
    public _objInstructor: InstructorData | null;
    public _idInstructor: number |null;

    constructor(objInstruc: InstructorData | null = null,  idInstruc: number | null = null){
        this._objInstructor = objInstruc;
        this._idInstructor = idInstruc;
    }

    public async SeleccionarInstructores():Promise<InstructorData[]>{
        const { rows: instructores } = await conexion.execute('select * from instructor');
        return instructores as InstructorData[];
    }

    public async InsertarInstructor():Promise<{ success:boolean;message:string; instructor?: Record<string, unknown> }>{

        try {
            if (!this._objInstructor) {
                throw new Error("No se ha proporcionado un objeto de instructor válido");
            }
    
            const {nombre, apellido, email, telefono} = this._objInstructor;
            if (!nombre || !apellido || !email || !telefono) {
                throw new Error("Faltan campos requeridos para insertar la información");
            }
            await conexion.execute("START TRANSACTION");
            const result = await conexion.execute('insert into instructor (nombre, apellido, email, telefono) values (?, ?, ?, ?)', [
                nombre, 
                apellido, 
                email,
                telefono,
            ]);
    
            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [instructor] = await conexion.query('select * from instructor WHERE idinstructor = LAST_INSERT_ID()',);
                await conexion.execute("COMMIT");
                return { success:true, message:"instructor registrado correctamente.", instructor:instructor };
            } else {
                throw new Error("No fué posible registrar el instructor.");
            }            
        } catch (error) {
            if (error instanceof z.ZodError) {
                return {success:false, message: error.message};
            } else {
                return {success:false, message:"Erro interno del servidor"};
            }
        }
    }

    public async ActualizarInstructor(): Promise<{success: boolean; message:string; instructor?: Record<string, unknown>}>{
        try {
            if (!this._objInstructor) {
                throw new Error("No se ha proporcionado un objeto de instructor valido")
            }

            const { idinstructor, nombre, apellido, email, telefono } = this._objInstructor;

            if (!idinstructor) {
                throw new Error("Se requiere el ID del instructor para actualizarlo");
            }

            if (!nombre || !apellido || !email || !telefono) {
                throw new Error("Faltan campos requeridos para actualizar el instructor");
            } 

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(
                `UPDATE instructor SET nombre = ?, apellido = ?, email = ?, telefono = ? WHERE idinstructor = ?`,[
                    nombre, apellido, email, telefono, idinstructor
                ]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                
                const [instructor] = await conexion.query(
                    `SELECT * FROM instructor WHERE idinstructor = ?`,[idinstructor]
                );

                await conexion.execute("COMMIT");
                return{ success: true, message:"instructor Actualizado correctamente",instructor:instructor};
            }else{

                throw new Error("No fue posible actualizar el instructor")
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                return {success:false,message: error.message}
            }else{
                return {success: false, message:"Error interno del servidor"}
            }
        }
    }
 
    public async EliminarInstructor(): Promise<{ success: boolean; message: string; instructor?: Record<string, unknown> }> {
        try{
            if (!this._objInstructor) {
                throw new Error("No se ha proporcionado un objeto de instructor valido.");
            }

            const { idinstructor } = this._objInstructor;

            if (!idinstructor) {
                throw new Error("Faltan campos requeridos");
            }

            await conexion.execute("START TRANSACTION")

            const [existingProgram] = await conexion.query('select * from instructor where idinstructor = ?', [idinstructor]);

            if (!existingProgram || existingProgram.length === 0) {
                await conexion.execute("ROLLBACK");
                return {
                    success: false,
                    message: "No se encontró el instructor especificado"
                };
            }

            const result = await conexion.execute('delete from instructor where idinstructor = ?', [idinstructor]);
            
            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                await conexion.execute("COMMIT");
                return { success:true, message:"instructor eliminado exitosamente" };
            } else {
                await conexion.execute("ROLLBACK");
                return {success:false, message:"No fué posible eliminar el instructor"};
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
