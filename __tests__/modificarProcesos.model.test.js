const { updateProcess } = require('../models/procesos2.model.js');
const { getPasos } = require('../models/procesos.model.js');
const db = require('../util/database.util.js'); 

// Mock para db.execute
jest.mock('../util/database.util.js', () => ({
    execute: jest.fn().mockResolvedValue([{ 
        idTramite:2,
        fechaCreacionTramite: '2023-05-29 13:50:22.00',
        activoTramite: 1,
        arregloPasos: '[{"paso": "1", "status": "0", "titulo": "Recepción de apartado", "descPaso": "Día 1", "observacion": "0"}, {"paso": "2", "status": "0", "titulo": "Recepción de documentación", "descPaso": "Día 2 al 6", "observacion": "0"}, {"paso": "3", "status": "0", "titulo": "Inicio de trámite de póliza jurídica", "descPaso": "Día 3 al 7", "observacion": "0"}, {"paso": "4", "status": "0", "titulo": "Resultado de investigación de póliza jurídica", "descPaso": "Día 7 al 11", "observacion": "0"}, {"paso": "5", "status": "0", "titulo": "Revisión de contrato", "descPaso": "Día 8 al 12", "observacion": "0"}, {"paso": "6", "status": "0", "titulo": "Firma de contrato", "descPaso": "Día 10 al 15", "observacion": "0"}]',
        idInmueble: 3,
        IdCliente: 2,
        IdAgente: 1,
        IdArrendador: 7
    }])
}));

// Mock para db.execute
jest.mock('../util/database.util.js', () => ({
    execute: jest.fn().mockResolvedValue([{ 
        idUsuario: 1,
        nombreUsuario: 'Marco',
        apellidosUsuario: 'Antonio',
        passwordUsuario: '$2a$12$a.YlAlfHFmhov/oQW84GX.553FB4jA.HYVmBMKMYH4qRpMzJobmXe',
        telefonoUsuario: '4421548752',
        emailUsuario: 'marco@test',
        estadoCivilUsuario: 'N/A',
        ocupacionUsuario: 'Programador',
        activoUsuario: 1,
        idRol: 1,
        idFoto: 1
    }])
}));

describe('getInfoTramite', () => {
    it('debe ejecutar la consulta SQL correcta y devolver la informacion del tramite', async () => {
        const idTramite = 2;
        const arregloPasos = '[{"paso": "1", "status": "0", "titulo": "Recepción de apartado", "descPaso": "Día 1", "observacion": "0"}, {"paso": "2", "status": "0", "titulo": "Recepción de documentación", "descPaso": "Día 2 al 6", "observacion": "0"}, {"paso": "3", "status": "0", "titulo": "Inicio de trámite de póliza jurídica", "descPaso": "Día 3 al 7", "observacion": "0"}, {"paso": "4", "status": "0", "titulo": "Resultado de investigación de póliza jurídica", "descPaso": "Día 7 al 11", "observacion": "0"}, {"paso": "5", "status": "0", "titulo": "Revisión de contrato", "descPaso": "Día 8 al 12", "observacion": "0"}, {"paso": "6", "status": "0", "titulo": "Firma de contrato", "descPaso": "Día 10 al 15", "observacion": "0"}, {"paso": "7", "status": "0", "titulo": "Paso de Prueba", "descPaso": "Día 15 al 18", "observacion": "Prueba"}]';
        const resultado = await updateProcess(arregloPasos,idTramite);
        return expect(db.execute).toHaveBeenCalledWith('UPDATE tramite SET arregloPasos=? WHERE idTramite=?',[arregloPasos,idTramite]);
    });
});