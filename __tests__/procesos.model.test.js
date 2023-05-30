const { getInfoInmuebleTramiteUsuario, getInfoInmuebleTramiteAgente } = require('../models/procesos.model.js');
const db = require('../util/database.util.js'); 

// Mock para db.execute
jest.mock('../util/database.util.js', () => ({
    execute: jest.fn().mockResolvedValue([{ 
        idTramite:2,
        fechaCreacionTramite: '2023-05-29 13:50:22.00',
        activoTramite: 1,
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
        const idAgente = 1;
        const resultado = await getInfoInmuebleTramiteAgente(idAgente);
        expect(db.execute).toHaveBeenCalledWith('SELECT I.idInmueble, I.nombreInmueble, I.descInmueble, I.direccionInmueble FROM inmueble I JOIN tramite TR ON I.idInmueble = TR.idInmueble WHERE TR.idAgente = ?', [idAgente]);
        expect(resultado).toEqual([{ 
            idUsuario: 1, 
            nombreUsuario: 'Nombre del usuario', 
            apellidosUsuario: 'Apellidos del usuario', 
            passwordUsuario: 'Password del usuario',
            telefonoUsuario: 'Telefono del usuario',
            emailUsuario: 'Email del usuario',
            estadoCivilUsuario: 'Estado civil del usuario',
            ocupacionUsuario: 'Ocupacion del usuario'
        }]);
    });
});