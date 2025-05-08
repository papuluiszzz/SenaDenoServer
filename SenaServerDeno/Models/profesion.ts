import { conexion } from "./conexion.ts";
import { z } from "../Dependencies/dependencias.ts";
import { error } from "node:console";

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

    public async InsertarProfesion():Promise<{success:boolean;message:string;profesion?:Record<string,unknown>}>{
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
                `UPDATE profesion SET nombre_profesion = ?`,[nombre_profesion,idprofesion

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
    }
