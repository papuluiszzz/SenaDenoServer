import { conexion } from "./conexion.ts";
import { z } from "../Dependencies/dependencias.ts";



interface ProfesionData{
    idprofesion:number|null;
    nombre_profesion:string;
}

export class Profesion{

    public _objProfesion : ProfesionData | null;
    public _idprofesion:number|null;

    constructor (objProfesion:ProfesionData|null = null,idprofesion:number | null = null){

        this._objProfesion =objProfesion;
        this._idprofesion=idprofesion;
    }
    public async SeleccionarProfesion():Promise<ProfesionData[]>{
        const {rows: profesion}= await conexion.execute(`select * from profesion`);
        return profesion as ProfesionData[];
    }


    public async InsertarProfesion():Promise<{success: boolean; message: string; profesion? : Record<string, unknown>}>{
       
        try {
            
            if (!this._objProfesion) {

                throw new Error("No se a proporcionado un objeto de profesion  valido")
            }

            const {nombre_profesion} = this._objProfesion;

            if(!nombre_profesion ){

                throw new Error("Faltan campos requeridos para insertar el profesion.");
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(`insert into profesion(nombre_profesion) values(?)`,[
                nombre_profesion,
            ]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                
                const[profesion] = await conexion.query(`select * from profesion where idprofesion = LAST_INSERT_ID()`,);

                await conexion.execute("COMMIT");

                return {success: true,message:"profesion registrado correctamente",profesion:profesion};
            }else{

                throw new Error("No fue posible resgistrar la profesion");
            }

        } catch (error) {
            
            if (error instanceof z.ZodError) {

                return {success: false,message:error.message}
                
            }else{

                return {success:false,message:"Error interno del servidor"}
            }
        }
    }



    public async ActualizarProfesion():Promise<{success:boolean;message:string;profesion?:Record<string,unknown>}>{
        try {
            if(!this._objProfesion){
                throw new Error("no se a proporcionado un objeto de profesion valido")
            }
            const {idprofesion,nombre_profesion} = this._objProfesion;

            if (!idprofesion) {
                throw new Error("Se requiere el ID de la profesion para actualizarlo");
            }

            if (!nombre_profesion) {
                
                throw new Error("Faltan campos requeridos para actualizar el aprendiz");
            } 
            
            await conexion.execute("START TRANSACTION");
            const result = await conexion.execute(
                `UPDATE profesion SET nombre_profesion = ? WHERE idprofesion = ?`,[nombre_profesion, idprofesion
            ]);     

                if (result && typeof result.affectedRows === "number" && result.affectedRows>0){
                    const [profesion] = await conexion.query(
                        `SELECT * FROM profesion WHERE idprofesion = ?`,[idprofesion]
                    );
                    await conexion.execute("COMMIT");
                    return {success: true ,message:"Profesion Actualizado correctamente",profesion:profesion};
                }else{
                    throw new Error ("no fue posible actualizar la profesion")
                }
        } catch(error){
            if(error instanceof z.ZodError){
                return {success:false,message:error.message}
            }else{
                return {success:false,message:"Error interno del servidor "}
                }
            }
        
        }
        public async eliminarprofesion(): Promise<{ success: boolean; message: string; profesion?: Record<string, unknown>}>{
            try {
                if (!this._objProfesion) {
                    throw new Error("No se ha proporcionado un objeto de usuario valido");
                }
    
                const {idprofesion} = this._objProfesion;
    
                if (!idprofesion) {
                    throw new Error("Se requiere el id del usuario para eliminar");
                }
    
                await conexion.execute("START TRANSACTION");
    
                const [existingUser] = await conexion.query(
                    'SELECT * FROM profesion WHERE idprofesion = ?',
                    [idprofesion]
                );
    
                if (!existingUser || existingUser.length === 0) {
                    await conexion.execute("ROLLBACK");
                    return {
                        success: false,
                        message: "No se encontró el usuario especificado"
                    };
                }
    
                const result = await conexion.execute(
                    'DELETE FROM profesion WHERE idprofesion = ?', 
                    [idprofesion]
                );
    
                if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                    await conexion.execute("COMMIT");
                    return {
                        success: true,
                        message:"profesion eliminado correctamente"
                    };
                } else {
                    await conexion.execute("ROLLBACK");
                    return {
                        success: false,
                        message: "No se encontró el usuario o no se realizaron los cambios."
                    };
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
