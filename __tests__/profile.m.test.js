const { User } = require('../models/user.model.js');
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

/*
* Obtener la información del perfil del usuario.
*/
describe('getUserProfile', () => {
    it('debe ejecutar la consulta SQL correcta y devolver el perfil de usuario correspondiente', async () => {
        const idUsuario = 1;
        const resultado = await User.getUserProfile(idUsuario);
        /*
        * Obtener toda la información de un usuario.
        * @param idUsuario: Int -> Id del usuario.
        * @return JSON -> Datos completos del usuario.
        */
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

/*
* Actualizar la información del perfil del usuario.
*/
describe('changeUserInfo', () => {
    it('debe ejecutar la consulta SQL correcta para actualizar la información del usuario', async () => {
        const nombre = 'Nombre del usuario';
        const apellidos = 'Apellidos del usuario';
        const email = 'Email del usuario';
        const telefono = 'Telefono del usuario';
        const estadoCivilUsuario = 'Estado civil del usuario';
        const ocupacionUsuario = 'Ocupacion del usuario';
        const idUsuario = 1;
        await User.changeUserInfo(nombre, apellidos, email, telefono, estadoCivilUsuario, ocupacionUsuario, idUsuario);
        /*
        Actualiza la información del usuario en la base de datos.
        @param nombre el nombre del usuario
        @param apellidos los apellidos del usuario
        @param email el correo electrónico del usuario
        @param telefono el número de teléfono del usuario
        @param estadoCivilUsuario el estado civil del usuario
        @param ocupacionUsuario la ocupación del usuario
        @param idUsuario el ID del usuario a actualizar
        @return el resultado de la ejecución del comando UPDATE en la base de datos
        */
        expect(db.execute).toHaveBeenCalledWith(
            'UPDATE usuario SET nombreUsuario=?, apellidosUsuario=?, emailUsuario=?, telefonoUsuario=?, estadoCivilUsuario=?, ocupacionUsuario=? WHERE idUsuario=?',
            [nombre, apellidos, email, telefono, estadoCivilUsuario, ocupacionUsuario, idUsuario]
        );
    });
});