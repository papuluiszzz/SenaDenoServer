import { conexion } from "./conexion.ts";
import { z } from "../Dependencies/dependencias.ts";

interface AprendizData{
    idaprendiz: number | null;
    nombre : string,
    apellido: string,
    email: string,
    telefono: string;
}

export class Aprendiz{

    public _objAprendiz : AprendizData | null;
    public _idUsuario : number | null;

    constructor(objAprendiz:AprendizData | null = null, idaprendiz : number | null = null){

        this._objAprendiz = objAprendiz;
        this._idUsuario = idaprendiz;
    }

    public async SeleccionarAprendiz():Promise<AprendizData[]>{

        const {rows: aprendiz} = await conexion.execute('select * from aprendiz ');
        return aprendiz as AprendizData[];

    }

    public async InsertarAprendiz():Promise<{success: boolean; message: string; aprendiz? : Record<string, unknown>}>{
       
        try {
            
            if (!this._objAprendiz) {

                throw new Error("No se a proporcionado un objeto de aprendi valido")
            }

            const {nombre, apellido, email, telefono} = this._objAprendiz;

            if(!nombre || !apellido || !email || !telefono ){

                throw new Error("Faltan campos requeridos para insertar el aprendiz.");
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(`insert into aprendiz(nombre,apellido,email,telefono) values(?,?,?,?)`,[
                nombre,apellido,email,telefono,
            ]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                
                const[aprendiz] = await conexion.query(`select * from aprendiz where idaprendiz = LAST_INSERT_ID()`,);

                await conexion.execute("COMMIT");

                return {success: true,message:"Aprendiz registrado correctamente",aprendiz:aprendiz};
            }else{

                throw new Error("No fue posible registrar el usuario");
            }

        } catch (error) {
            
            if (error instanceof z.ZodError) {

                return {success: false,message:error.message}
                
            }else{

                return {success:false,message:"Error interno del servidor"}
            }
        }
    }

    public async ActualizarAprendiz(): Promise<{success: boolean; message:string; aprendiz?: Record<string, unknown>}>{

        try {
            
            if (!this._objAprendiz) {
                throw new Error("No se ha proporcionado un objeto de aprendiz valido")
            }

            const {idaprendiz,nombre,apellido,email,telefono} = this._objAprendiz;

            if (!idaprendiz) {
                throw new Error("Se requiere el ID del aprendiz para actualizarlo");
            }

            if (!nombre || !apellido || !email || !telefono) {
                
                throw new Error("Faltan campos requeridos para actualizar el aprendiz");
            } 

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(
            `UPDATE aprendiz SET nombre = ?, apellido = ?, email = ?, telefono = ? WHERE idaprendiz = ?`,[
                nombre,apellido,email,telefono,idaprendiz
            
            ]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                
                const [aprendiz] = await conexion.query(
                    `SELECT * FROM aprendiz WHERE idaprendiz = ?`,[idaprendiz]
                );

                await conexion.execute("COMMIT");

                return{ success: true, message:"Aprendiz Actualizado correctamente",aprendiz:aprendiz};
            }else{

                throw new Error("No fue posible actualizar el aprendiz")

            }


        } catch (error) {
            

            if (error instanceof z.ZodError) {
                return {success:false,message: error.message}
            }else{
                return {success: false, message:"Error interno del servidor"}
            }
        }
    }
}