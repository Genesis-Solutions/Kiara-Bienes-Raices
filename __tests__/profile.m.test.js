const { getUserProfile } = require('../models/user.model.js');
const db = require('../util/database.util.js'); 

// Mock para db.execute
jest.mock('../util/database.util.js', () => ({
    execute: jest.fn().mockResolvedValue([{ 
        idUsuario: 1, 
        nombreUsuario: 'Nombre del usuario', 
        apellidosUsuario: 'Apellidos del usuario', 
        passwordUsuario: 'Password del usuario',
        telefonoUsuario: 'Telefono del usuario',
        emailUsuario: 'Email del usuario',
        estadoCivilUsuario: 'Estado civil del usuario',
        ocupacionUsuario: 'Ocupacion del usuario'
    }])
}));

describe('getUserProfile', () => {
    it('debe ejecutar la consulta SQL correcta y devolver el perfil de usuario correspondiente', async () => {
        const idUsuario = 1;
        const resultado = await getUserProfile(idUsuario);
        expect(db.execute).toHaveBeenCalledWith('SELECT * FROM usuario WHERE idUsuario=?', [idUsuario]);
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