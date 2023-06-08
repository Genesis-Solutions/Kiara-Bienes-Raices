const bcrypt = require('bcryptjs');
const db = require('../util/database.util.js'); 
const {User, Token} = require('../models/user.model');

// Mock para db.execute
jest.mock('../util/database.util.js', () => ({
    execute: jest.fn().mockResolvedValue([{ 
        idUsuario: 1,
        nombreUsuario: 'Marco',
        apellidosUsuario: 'Antonio',
        passwordUsuario: 'passwordOriginal',
        telefonoUsuario: '4421548752',
        emailUsuario: 'marco@test',
        estadoCivilUsuario: 'N/A',
        ocupacionUsuario: 'Programador',
        activoUsuario: 1,
        idRol: 1,
        idFoto: 1
    }])
}));

describe('Prueba de cambio de contraseña', () => {
    it('debe cambiar la contraseña del usuario', async () => {
        const newPassword = "nuevoPassword";
        const emailUsuario = "marco@test"
        const result = await User.resetPassword(newPassword, emailUsuario);

        bcrypt.hash(newPassword, 12).then((passwordCifrado) => {
            return expect(db.execute).toHaveBeenCalledWith('UPDATE usuario SET passwordUsuario = ? WHERE emailUsuario = ?', [passwordCifrado, emailUsuario])
        })
    })
})


