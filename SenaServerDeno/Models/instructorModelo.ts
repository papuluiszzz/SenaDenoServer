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


}