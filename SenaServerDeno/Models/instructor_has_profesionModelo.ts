import { conexion } from "./conexion.ts";
import { z } from "../Dependencies/dependencias.ts";

interface InstructorHasProfesionData {
    instructor_idinstructor: number;
    profesion_idprofesion: number;
}

//interfaz extendida para que me permite ver los resultado con detalles de instructor y profesion
interface InstructorHasInstructorExtendido extends InstructorHasProfesionData{
    nombre:string;
    apellido:string;
    email:string;
    telefono:string;
    nombre_profesion:string;
    [key: string ]: unknown;
}


export class InstructorHasProfesion {

    public _objInstructorHasProfesion : InstructorHasProfesionData | null;
    
    constructor(objInstructorHasProfesion: InstructorHasProfesionData | null = null){
        this._objInstructorHasProfesion = objInstructorHasProfesion;

    }

public async SeleccionarInstructorHasProfesion(): Promise<InstructorHasInstructorExtendido[]>{

    const {rows: instructorProfesiones} = await conexion.execute(`
        SELECT i.*,
        i.nombre,
        i.apellido,
        i.email,
        i.telefono ,
        p.nombre_profesion
        FROM instructor_has_profesion ihp
        JOIN instructor i ON ihp.instructor_idinstructor = i.idinstructor
        JOIN profesion p ON ihp.profesion_idprofesion = p.idprofesion`);

        return instructorProfesiones as InstructorHasInstructorExtendido[];
}

public async InsertarInstructorHasProfesion(): Promise<{ success: boolean; message: string; registro?: Record<string, unknown>}>{

    try {
        if (!this._objInstructorHasProfesion) {
            throw new Error("No se ha proporcionado un objeto de relación válido");
        }
        
        const { instructor_idinstructor, profesion_idprofesion } = this._objInstructorHasProfesion;

        if (!instructor_idinstructor || !profesion_idprofesion) {
            throw new Error("Faltan campos requeridos para la relación");
        }

        await conexion.execute("START TRANSACTION");

        // Verificar que existe el instructor
        const { rows: instructores } = await conexion.execute(
            "SELECT * FROM instructor WHERE idinstructor = ?",
            [instructor_idinstructor]
        );

        if (!instructores || instructores.length === 0) {
            await conexion.execute("ROLLBACK");
            return { success: false, message: "El instructor especificado no existe" };
        }

        // Verificar que exista la profesión
        const { rows: profesiones } = await conexion.execute(
            "SELECT * FROM profesion WHERE idprofesion = ?",
            [profesion_idprofesion]
        );

        if (!profesiones || profesiones.length === 0) {
            await conexion.execute("ROLLBACK");
            return { success: false, message: "La profesión especificada no existe" }; // Corregido
        }

        // Verificar si la relación ya existe
        const { rows: existeRelacion } = await conexion.execute(
            "SELECT * FROM instructor_has_profesion WHERE instructor_idinstructor = ? AND profesion_idprofesion = ?",
            [instructor_idinstructor, profesion_idprofesion]
        );

        if (existeRelacion && existeRelacion.length > 0) {
            await conexion.execute("ROLLBACK");
            return { success: false, message: "El instructor ya tiene asignada esta profesión" };
        }

        // Continuar con la inserción...
        const result = await conexion.execute(
            `INSERT INTO instructor_has_profesion (instructor_idinstructor, profesion_idprofesion) 
             VALUES (?, ?)`,
            [instructor_idinstructor, profesion_idprofesion]
        );

        if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
            // Obtener el registro insertado con sus detalles
            const [registro] = await conexion.query(
                `SELECT ihp.instructor_idinstructor, ihp.profesion_idprofesion,
                        i.nombre, i.apellido, i.email, i.telefono,
                        p.nombre_profesion
                 FROM instructor_has_profesion ihp
                 JOIN instructor i ON ihp.instructor_idinstructor = i.idinstructor
                 JOIN profesion p ON ihp.profesion_idprofesion = p.idprofesion
                 WHERE ihp.instructor_idinstructor = ? AND ihp.profesion_idprofesion = ?`,
                [instructor_idinstructor, profesion_idprofesion]
            );

            await conexion.execute("COMMIT");
            return { 
                success: true, 
                message: "Profesión asignada correctamente al instructor", 
                registro: registro 
            };
        } else {
            throw new Error("No fue posible registrar la relación");
        }
    } catch (error) {
        await conexion.execute("ROLLBACK");
        
        if (error instanceof z.ZodError) {
            return { success: false, message: error.message };
        } else {
            return { success: false, message: "Error interno del servidor" };
        }
    }
}

public async EliminarInstructorHasProfesion(): Promise<{ success: boolean; message: string }> {
    try {
        if (!this._objInstructorHasProfesion) {
            throw new Error("No se ha proporcionado un objeto de relación válido");
        }

        const { instructor_idinstructor, profesion_idprofesion } = this._objInstructorHasProfesion;

        if (!instructor_idinstructor || !profesion_idprofesion) {
            throw new Error("Faltan campos requeridos para eliminar la relación");
        }

        await conexion.execute("START TRANSACTION");

        // Verificar si la relación existe
        const { rows: existeRelacion } = await conexion.execute(
            "SELECT * FROM instructor_has_profesion WHERE instructor_idinstructor = ? AND profesion_idprofesion = ?",
            [instructor_idinstructor, profesion_idprofesion]
        );

        if (!existeRelacion || existeRelacion.length === 0) {
            await conexion.execute("ROLLBACK");
            return { success: false, message: "La relación no existe" };
        }

        // Ejecutar la eliminación
        const result = await conexion.execute(
            "DELETE FROM instructor_has_profesion WHERE instructor_idinstructor = ? AND profesion_idprofesion = ?",
            [instructor_idinstructor, profesion_idprofesion]
        );

        if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
            await conexion.execute("COMMIT");
            return { 
                success: true, 
                message: "Profesión desasignada correctamente del instructor" 
            };
        } else {
            throw new Error("No fue posible eliminar la relación");
        }

    } catch (error) {
        await conexion.execute("ROLLBACK");
        
        if (error instanceof z.ZodError) {
            return { success: false, message: error.message };
        } else {
            return { success: false, message: "Error interno del servidor" };
        }
    }
}

public async ActualizarInstructorHasProfesion(nuevaProfesionId: number): Promise<{ success: boolean; message: string; registro?: Record<string, unknown> }> {
    try {
        if (!this._objInstructorHasProfesion) {
            throw new Error("No se ha proporcionado un objeto de relación válido");
        }

        const { instructor_idinstructor, profesion_idprofesion } = this._objInstructorHasProfesion;

        // Verificar que todos los campos necesarios estén presentes
        if (!instructor_idinstructor || !profesion_idprofesion || !nuevaProfesionId) {
            throw new Error("Faltan campos requeridos para actualizar la relación");
        }

        // Si la profesión nueva es igual a la actual, no hay cambios que hacer
        if (profesion_idprofesion === nuevaProfesionId) {
            return { success: false, message: "La nueva profesión es igual a la actual" };
        }

        await conexion.execute("START TRANSACTION");

        // Verificar que exista el instructor
        const { rows: instructores } = await conexion.execute(
            "SELECT * FROM instructor WHERE idinstructor = ?",
            [instructor_idinstructor]
        );

        if (!instructores || instructores.length === 0) {
            await conexion.execute("ROLLBACK");
            return { success: false, message: "El instructor especificado no existe" };
        }

        // Verificar que exista la nueva profesión
        const { rows: nuevaProfesion } = await conexion.execute(
            "SELECT * FROM profesion WHERE idprofesion = ?",
            [nuevaProfesionId]
        );

        if (!nuevaProfesion || nuevaProfesion.length === 0) {
            await conexion.execute("ROLLBACK");
            return { success: false, message: "La nueva profesión especificada no existe" };
        }

        // Verificar que exista la relación actual
        const { rows: relacionActual } = await conexion.execute(
            "SELECT * FROM instructor_has_profesion WHERE instructor_idinstructor = ? AND profesion_idprofesion = ?",
            [instructor_idinstructor, profesion_idprofesion]
        );

        if (!relacionActual || relacionActual.length === 0) {
            await conexion.execute("ROLLBACK");
            return { success: false, message: "La relación que desea actualizar no existe" };
        }

        // Verificar que no exista ya una relación con la nueva profesión
        const { rows: relacionNueva } = await conexion.execute(
            "SELECT * FROM instructor_has_profesion WHERE instructor_idinstructor = ? AND profesion_idprofesion = ?",
            [instructor_idinstructor, nuevaProfesionId]
        );

        if (relacionNueva && relacionNueva.length > 0) {
            await conexion.execute("ROLLBACK");
            return { success: false, message: "El instructor ya tiene asignada la nueva profesión" };
        }

        // Actualizar directamente la relación usando UPDATE
        const result = await conexion.execute(
            "UPDATE instructor_has_profesion SET profesion_idprofesion = ? WHERE instructor_idinstructor = ? AND profesion_idprofesion = ?",
            [nuevaProfesionId, instructor_idinstructor, profesion_idprofesion]
        );

        if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
            // Obtener la información completa de la nueva relación
            const [registro] = await conexion.query(
                `SELECT ihp.instructor_idinstructor, ihp.profesion_idprofesion,
                        i.nombre, i.apellido, i.email, i.telefono,
                        p.nombre_profesion
                 FROM instructor_has_profesion ihp
                 JOIN instructor i ON ihp.instructor_idinstructor = i.idinstructor
                 JOIN profesion p ON ihp.profesion_idprofesion = p.idprofesion
                 WHERE ihp.instructor_idinstructor = ? AND ihp.profesion_idprofesion = ?`,
                [instructor_idinstructor, nuevaProfesionId]
            );

            await conexion.execute("COMMIT");
            return { 
                success: true, 
                message: "Profesión del instructor actualizada correctamente", 
                registro: registro 
            };
        } else {
            throw new Error("No fue posible actualizar la relación");
        }
    } catch (error) {
        await conexion.execute("ROLLBACK");
        
        if (error instanceof z.ZodError) {
            return { success: false, message: error.message };
        } else {
            return { success: false, message: "Error interno del servidor" };
        }
    }
}

}
