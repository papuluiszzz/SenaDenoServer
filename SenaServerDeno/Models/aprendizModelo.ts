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

    

}