import { conexion } from "./conexion.ts";
import { z } from "../Dependencies/dependencias.ts";

interface FichaHasAprendizData {
    ficha_idficha: number;
    aprendiz_idaprendiz: number;
    instructor_idinstructor: number;
}

// Interfaz extendida para los resultados con detalles de ficha, aprendiz e instructor
interface FichaHasAprendizExtendido extends FichaHasAprendizData {
    ficha_codigo: string;
    aprendiz_nombre: string;
    aprendiz_apellido: string;
    instructor_nombre: string;
    instructor_apellido: string;
    [key: string]: unknown; // Para permitir otros campos adicionales
}

// Interfaz para los resultados de aprendices con instructor
interface AprendizConInstructor {
    idaprendiz: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    instructor_nombre: string;
    instructor_apellido: string;
    [key: string]: unknown;
}

// Interfaz para los resultados de fichas con instructor
interface FichaConInstructor {
    idficha: number;
    codigo: string;
    fecha_inicio_lectiva: Date | string;
    fecha_fin_lectiva: Date | string;
    fecha_fin_practica: Date | string;
    programa_idprograma: number;
    instructor_nombre: string;
    instructor_apellido: string;
    [key: string]: unknown;
}

export class FichaHasAprendiz {
    public _objFichaHasAprendiz: FichaHasAprendizData | null;

    constructor(objFichaHasAprendiz: FichaHasAprendizData | null = null) {
        this._objFichaHasAprendiz = objFichaHasAprendiz;
    }

    public async SeleccionarFichaHasAprendiz(): Promise<FichaHasAprendizExtendido[]> {
        const { rows: fichasAprendices } = await conexion.execute(`
            SELECT fha.*,
                   f.codigo as ficha_codigo,
                   a.nombre as aprendiz_nombre,
                   a.apellido as aprendiz_apellido,
                   i.nombre as instructor_nombre, 
                   i.apellido as instructor_apellido
            FROM ficha_has_aprendiz fha
            JOIN ficha f ON fha.ficha_idficha = f.idficha
            JOIN aprendiz a ON fha.aprendiz_idaprendiz = a.idaprendiz
            JOIN instructor i ON fha.instructor_idinstructor = i.idinstructor
        `);
        return fichasAprendices as FichaHasAprendizExtendido[];
    }

    public async SeleccionarAprendicesPorFicha(idficha: number): Promise<AprendizConInstructor[]> {
        const { rows: aprendices } = await conexion.execute(`
            SELECT a.*, i.nombre as instructor_nombre, i.apellido as instructor_apellido
            FROM ficha_has_aprendiz fha
            JOIN aprendiz a ON fha.aprendiz_idaprendiz = a.idaprendiz
            JOIN instructor i ON fha.instructor_idinstructor = i.idinstructor
            WHERE fha.ficha_idficha = ?
        `, [idficha]);
        return aprendices as AprendizConInstructor[];
    }
    
    public async SeleccionarFichasPorAprendiz(idaprendiz: number): Promise<FichaConInstructor[]> {
        const { rows: fichas } = await conexion.execute(`
            SELECT f.*, i.nombre as instructor_nombre, i.apellido as instructor_apellido
            FROM ficha_has_aprendiz fha
            JOIN ficha f ON fha.ficha_idficha = f.idficha
            JOIN instructor i ON fha.instructor_idinstructor = i.idinstructor
            WHERE fha.aprendiz_idaprendiz = ?
        `, [idaprendiz]);
        return fichas as FichaConInstructor[];
    }

    public async InsertarFichaHasAprendiz(): Promise<{ success: boolean; message: string; registro?: Record<string, unknown> }> {
        try {
            if (!this._objFichaHasAprendiz) {
                throw new Error("No se ha proporcionado un objeto de relación válido");
            }

            const { ficha_idficha, aprendiz_idaprendiz, instructor_idinstructor } = this._objFichaHasAprendiz;

            if (!ficha_idficha || !aprendiz_idaprendiz || !instructor_idinstructor) {
                throw new Error("Faltan campos requeridos para la relación");
            }

            await conexion.execute("START TRANSACTION");

            // Verificar que exista la ficha
            const { rows: fichas } = await conexion.execute(
                "SELECT * FROM ficha WHERE idficha = ?",
                [ficha_idficha]
            );

            if (!fichas || fichas.length === 0) {
                await conexion.execute("ROLLBACK");
                return { success: false, message: "La ficha especificada no existe" };
            }

            // Verificar que exista el aprendiz
            const { rows: aprendices } = await conexion.execute(
                "SELECT * FROM aprendiz WHERE idaprendiz = ?",
                [aprendiz_idaprendiz]
            );

            if (!aprendices || aprendices.length === 0) {
                await conexion.execute("ROLLBACK");
                return { success: false, message: "El aprendiz especificado no existe" };
            }

            // Verificar que exista el instructor
            const { rows: instructores } = await conexion.execute(
                "SELECT * FROM instructor WHERE idinstructor = ?",
                [instructor_idinstructor]
            );

            if (!instructores || instructores.length === 0) {
                await conexion.execute("ROLLBACK");
                return { success: false, message: "El instructor especificado no existe" };
            }

            // Verificar si la relación ya existe
            const { rows: existeRelacion } = await conexion.execute(
                "SELECT * FROM ficha_has_aprendiz WHERE ficha_idficha = ? AND aprendiz_idaprendiz = ?",
                [ficha_idficha, aprendiz_idaprendiz]
            );

            if (existeRelacion && existeRelacion.length > 0) {
                await conexion.execute("ROLLBACK");
                return { success: false, message: "El aprendiz ya está asignado a esta ficha" };
            }

            const result = await conexion.execute(
                `INSERT INTO ficha_has_aprendiz(ficha_idficha, aprendiz_idaprendiz, instructor_idinstructor) 
                 VALUES(?, ?, ?)`,
                [ficha_idficha, aprendiz_idaprendiz, instructor_idinstructor]
            );

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [registro] = await conexion.query(
                    `SELECT fha.*, 
                            f.codigo as ficha_codigo,
                            a.nombre as aprendiz_nombre, 
                            a.apellido as aprendiz_apellido,
                            i.nombre as instructor_nombre, 
                            i.apellido as instructor_apellido
                     FROM ficha_has_aprendiz fha
                     JOIN ficha f ON fha.ficha_idficha = f.idficha
                     JOIN aprendiz a ON fha.aprendiz_idaprendiz = a.idaprendiz
                     JOIN instructor i ON fha.instructor_idinstructor = i.idinstructor
                     WHERE fha.ficha_idficha = ? AND fha.aprendiz_idaprendiz = ?`,
                    [ficha_idficha, aprendiz_idaprendiz]
                );

                await conexion.execute("COMMIT");
                return { 
                    success: true, 
                    message: "Aprendiz asignado correctamente a la ficha con el instructor", 
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

    public async ActualizarFichaHasAprendiz(): Promise<{ success: boolean; message: string; registro?: Record<string, unknown> }> {
        try {
            if (!this._objFichaHasAprendiz) {
                throw new Error("No se ha proporcionado un objeto de relación válido");
            }

            const { ficha_idficha, aprendiz_idaprendiz, instructor_idinstructor } = this._objFichaHasAprendiz;

            if (!ficha_idficha || !aprendiz_idaprendiz || !instructor_idinstructor) {
                throw new Error("Faltan campos requeridos para la relación");
            }

            await conexion.execute("START TRANSACTION");

            // Verificar que la relación exista
            const { rows: existeRelacion } = await conexion.execute(
                "SELECT * FROM ficha_has_aprendiz WHERE ficha_idficha = ? AND aprendiz_idaprendiz = ?",
                [ficha_idficha, aprendiz_idaprendiz]
            );

            if (!existeRelacion || existeRelacion.length === 0) {
                await conexion.execute("ROLLBACK");
                return { success: false, message: "La relación no existe" };
            }

            // Verificar que exista el instructor
            const { rows: instructores } = await conexion.execute(
                "SELECT * FROM instructor WHERE idinstructor = ?",
                [instructor_idinstructor]
            );

            if (!instructores || instructores.length === 0) {
                await conexion.execute("ROLLBACK");
                return { success: false, message: "El instructor especificado no existe" };
            }

            const result = await conexion.execute(
                `UPDATE ficha_has_aprendiz SET instructor_idinstructor = ? 
                 WHERE ficha_idficha = ? AND aprendiz_idaprendiz = ?`,
                [instructor_idinstructor, ficha_idficha, aprendiz_idaprendiz]
            );

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [registro] = await conexion.query(
                    `SELECT fha.*, 
                            f.codigo as ficha_codigo,
                            a.nombre as aprendiz_nombre, 
                            a.apellido as aprendiz_apellido,
                            i.nombre as instructor_nombre, 
                            i.apellido as instructor_apellido
                     FROM ficha_has_aprendiz fha
                     JOIN ficha f ON fha.ficha_idficha = f.idficha
                     JOIN aprendiz a ON fha.aprendiz_idaprendiz = a.idaprendiz
                     JOIN instructor i ON fha.instructor_idinstructor = i.idinstructor
                     WHERE fha.ficha_idficha = ? AND fha.aprendiz_idaprendiz = ?`,
                    [ficha_idficha, aprendiz_idaprendiz]
                );

                await conexion.execute("COMMIT");
                return { 
                    success: true, 
                    message: "Relación actualizada correctamente", 
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

    public async EliminarFichaHasAprendiz(): Promise<{ success: boolean; message: string }> {
        try {
            if (!this._objFichaHasAprendiz) {
                throw new Error("No se ha proporcionado un objeto de relación válido");
            }

            const { ficha_idficha, aprendiz_idaprendiz } = this._objFichaHasAprendiz;

            if (!ficha_idficha || !aprendiz_idaprendiz) {
                throw new Error("Faltan campos requeridos para eliminar la relación");
            }

            await conexion.execute("START TRANSACTION");

            // Verificar si la relación existe
            const { rows: existeRelacion } = await conexion.execute(
                "SELECT * FROM ficha_has_aprendiz WHERE ficha_idficha = ? AND aprendiz_idaprendiz = ?",
                [ficha_idficha, aprendiz_idaprendiz]
            );

            if (!existeRelacion || existeRelacion.length === 0) {
                await conexion.execute("ROLLBACK");
                return { success: false, message: "La relación no existe" };
            }

            const result = await conexion.execute(
                "DELETE FROM ficha_has_aprendiz WHERE ficha_idficha = ? AND aprendiz_idaprendiz = ?",
                [ficha_idficha, aprendiz_idaprendiz]
            );

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                await conexion.execute("COMMIT");
                return { success: true, message: "Aprendiz eliminado de la ficha correctamente" };
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
}