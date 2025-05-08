import { conexion } from "./conexion.ts";
import { z } from "../Dependencies/dependencias.ts";

interface FichaData {
    idficha: number | null;
    codigo: string;
    fecha_inicio_lectiva: Date | string;
    fecha_fin_lectiva: Date | string;
    fecha_fin_practica: Date | string;
    programa_idprograma: number;
}

export class Ficha {
    public _objFicha: FichaData | null;
    public _idFicha: number | null;

    constructor(objFicha: FichaData | null = null, idFicha: number | null = null) {
        this._objFicha = objFicha;
        this._idFicha = idFicha;
    }

    public async SeleccionarFichas(): Promise<FichaData[]> {
        const { rows: fichas } = await conexion.execute(`
            SELECT f.*, p.nombre_programa 
            FROM ficha f
            JOIN programa p ON f.programa_idprograma = p.idprograma
        `);
        return fichas as FichaData[];
    }

    public async SeleccionarFichaPorId(idficha: number): Promise<FichaData | null> {
        const { rows: fichas } = await conexion.execute(
            `SELECT f.*, p.nombre_programa 
             FROM ficha f
             JOIN programa p ON f.programa_idprograma = p.idprograma
             WHERE f.idficha = ?`,
            [idficha]
        );
        
        if (fichas && fichas.length > 0) {
            return fichas[0] as FichaData;
        }
        return null;
    }
    public async SeleccionarFichasPorPrograma(idprograma: number): Promise<FichaData[]> {
    const { rows: fichas } = await conexion.execute(
        `SELECT f.*, p.nombre_programa 
         FROM ficha f
         JOIN programa p ON f.programa_idprograma = p.idprograma
         WHERE f.programa_idprograma = ?`,
        [idprograma]
    );
    return fichas as FichaData[];
}

public async InsertarFicha(): Promise<{ success: boolean; message: string; ficha?: Record<string, unknown> }> {
    try {
        if (!this._objFicha) {
            throw new Error("No se ha proporcionado un objeto de Ficha válido");
        }

        const { codigo, fecha_inicio_lectiva, fecha_fin_lectiva, fecha_fin_practica, programa_idprograma } = this._objFicha;

        if (!codigo || !fecha_inicio_lectiva || !fecha_fin_lectiva || !fecha_fin_practica || !programa_idprograma) {
            throw new Error("Faltan campos requeridos para insertar la ficha");
        }

        await conexion.execute("START TRANSACTION");

        // Verificar que el código de ficha no exista
        const { rows: existeCodigo } = await conexion.execute(
            "SELECT * FROM ficha WHERE codigo = ?",
            [codigo]
        );

        if (existeCodigo && existeCodigo.length > 0) {
            await conexion.execute("ROLLBACK");
            return { success: false, message: "Ya existe una ficha con este código" };
        }

        // Verificar que exista el programa
        const { rows: programas } = await conexion.execute(
            "SELECT * FROM programa WHERE idprograma = ?",
            [programa_idprograma]
        );

        if (!programas || programas.length === 0) {
            await conexion.execute("ROLLBACK");
            return { success: false, message: "El programa especificado no existe" };
        }

        const result = await conexion.execute(
            `INSERT INTO ficha(codigo, fecha_inicio_lectiva, fecha_fin_lectiva, 
                              fecha_fin_practica, programa_idprograma) 
             VALUES(?, ?, ?, ?, ?)`,
            [codigo, fecha_inicio_lectiva, fecha_fin_lectiva, fecha_fin_practica, programa_idprograma]
        );

        if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
            const [ficha] = await conexion.query(
                `SELECT f.*, p.nombre_programa 
                 FROM ficha f
                 JOIN programa p ON f.programa_idprograma = p.idprograma
                 WHERE f.idficha = LAST_INSERT_ID()`
            );

            await conexion.execute("COMMIT");
            return { success: true, message: "Ficha registrada correctamente", ficha: ficha };
        } else {
            throw new Error("No fue posible registrar la ficha");
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

public async ActualizarFicha(): Promise<{ success: boolean; message: string; ficha?: Record<string, unknown> }> {
    try {
        if (!this._objFicha) {
            throw new Error("No se ha proporcionado un objeto de Ficha válido");
        }

        const { idficha, codigo, fecha_inicio_lectiva, fecha_fin_lectiva, fecha_fin_practica, programa_idprograma } = this._objFicha;

        if (!idficha) {
            throw new Error("Se requiere el ID de la ficha para actualizarla");
        }

        if (!codigo || !fecha_inicio_lectiva || !fecha_fin_lectiva || !fecha_fin_practica || !programa_idprograma) {
            throw new Error("Faltan campos requeridos para actualizar la ficha");
        }

        await conexion.execute("START TRANSACTION");

        // Verificar que la ficha exista
const { rows: existeFicha } = await conexion.execute(
    "SELECT * FROM ficha WHERE idficha = ?",
    [idficha]
);

if (!existeFicha || existeFicha.length === 0) {
    await conexion.execute("ROLLBACK");
    return { success: false, message: "La ficha no existe" };
}

// Verificar que no exista otra ficha con el mismo código
const { rows: existeCodigo } = await conexion.execute(
    "SELECT * FROM ficha WHERE codigo = ? AND idficha != ?",
    [codigo, idficha]
);

if (existeCodigo && existeCodigo.length > 0) {
    await conexion.execute("ROLLBACK");
    return { success: false, message: "Ya existe otra ficha con este código" };
}

// Verificar que exista el programa
const { rows: programas } = await conexion.execute(
    "SELECT * FROM programa WHERE idprograma = ?",
    [programa_idprograma]
);

if (!programas || programas.length === 0) {
    await conexion.execute("ROLLBACK");
    return { success: false, message: "El programa especificado no existe" };
}

        const result = await conexion.execute(
            `UPDATE ficha SET codigo = ?, fecha_inicio_lectiva = ?, fecha_fin_lectiva = ?, 
                           fecha_fin_practica = ?, programa_idprograma = ? 
             WHERE idficha = ?`,
            [codigo, fecha_inicio_lectiva, fecha_fin_lectiva, fecha_fin_practica, programa_idprograma, idficha]
        );

        if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
            const [ficha] = await conexion.query(
                `SELECT f.*, p.nombre_programa 
                 FROM ficha f
                 JOIN programa p ON f.programa_idprograma = p.idprograma
                 WHERE f.idficha = ?`,
                [idficha]
            );

            await conexion.execute("COMMIT");
            return { success: true, message: "Ficha actualizada correctamente", ficha: ficha };
        } else {
            throw new Error("No fue posible actualizar la ficha");
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

public async EliminarFicha(): Promise<{ success: boolean; message: string }> {
    try {
        if (!this._idFicha) {
            throw new Error("Se requiere el ID de la ficha para eliminarla");
        }

        await conexion.execute("START TRANSACTION");

        // Verificar que la ficha exista
        const { rows: existeFicha } = await conexion.execute(
            "SELECT * FROM ficha WHERE idficha = ?",
            [this._idFicha]
        );
        
        if (!existeFicha || existeFicha.length === 0) {
            await conexion.execute("ROLLBACK");
            return { success: false, message: "La ficha no existe" };
        }
        
        // Verificar si hay aprendices asignados a esta ficha
        const { rows: existeRelacionAprendiz } = await conexion.execute(
            "SELECT * FROM ficha_has_aprendiz WHERE ficha_idficha = ?",
            [this._idFicha]
        );
        
        if (existeRelacionAprendiz && existeRelacionAprendiz.length > 0) {
            await conexion.execute("ROLLBACK");
            return { 
                success: false, 
                message: "No se puede eliminar la ficha porque tiene aprendices asignados" 
            };
        }
        const result = await conexion.execute(
            "DELETE FROM ficha WHERE idficha = ?",
            [this._idFicha]
        );

        if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
            await conexion.execute("COMMIT");
            return { success: true, message: "Ficha eliminada correctamente" };
        } else {
            throw new Error("No fue posible eliminar la ficha");
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