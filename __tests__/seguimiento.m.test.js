const { insertProcess } = require('../models/procesos2.model.js');
const { infoTramite } = require('../models/procesos.model.js');
const db = require('../util/database.util.js'); 

jest.mock('../util/database.util.js', () => ({
    execute: jest.fn()
}));

describe('insertProcess', () => {
    it('debe ejecutar la consulta SQL correcta para insertar un proceso', async () => {
        const arregloPasos = [{"paso": "1", "status": "0", "titulo": "Recepción de apartado", "descPaso": "Día 1", "observacion": "0"}, {"paso": "2", "status": "0", "titulo": "Recepción de documentación", "descPaso": "Día 2 al 6", "observacion": "0"}, {"paso": "3", "status": "0", "titulo": "Inicio de trámite de póliza jurídica", "descPaso": "Día 3 al 7", "observacion": "0"}, {"paso": "4", "status": "0", "titulo": "Resultado de investigación de póliza jurídica", "descPaso": "Día 7 al 11", "observacion": "0"}, {"paso": "5", "status": "0", "titulo": "Revisión de contrato", "descPaso": "Día 8 al 12", "observacion": "0"}, {"paso": "6", "status": "0", "titulo": "Firma de contrato", "descPaso": "Día 10 al 15", "observacion": "0"}]
        const idInmueble = 1;
        const idCliente = 2;
        const idAgente = 3;
        const idArrendador = 4;
        await insertProcess(arregloPasos, idInmueble, idCliente, idAgente, idArrendador);
        expect(db.execute).toHaveBeenCalledWith(
            'INSERT INTO tramite(fechaCreacionTramite, activoTramite, arregloPasos, idInmueble, idCliente, idAgente, idArrendador) VALUES(CURRENT_TIMESTAMP(),1,?,?,?,?,?)',
            [arregloPasos, idInmueble, idCliente, idAgente, idArrendador]
        );
    });
});


describe('infoTramite', () => {
    it('debe ejecutar la consulta SQL correcta y devolver los datos del trámite', async () => {
        const idUsuario = 1;
        // Configurar el mock de db.execute para que devuelva un resultado simulado
        const expectedData = [/* Datos simulados del trámite */];
        db.execute.mockResolvedValue([expectedData]);
        const result = await infoTramite(idUsuario);
        expect(db.execute).toHaveBeenCalledWith(
            'SELECT * FROM tramite WHERE idCliente = ? OR idArrendador = ? OR idAgente = ? AND activoTramite = 1',
            [idUsuario, idUsuario, idUsuario]
        );
        expect(result).toEqual(expectedData);
    });
});