const bcrypt = require('bcrypt');
const db = require('../util/database.util');
const { resetPassword } = require('../models/usuario.model');

// Mock para la función bcrypt.hash()
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation((data, salt) => Promise.resolve(`hashed:${data}:${salt}`)),
}));

// Mock para la función db.execute()
jest.mock('../util/database.util', () => ({
  execute: jest.fn().mockResolvedValue([]),
}));

describe('resetPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería restablecer la contraseña y actualizarla en la base de datos', async () => {
    const newPassword = 'newPassword123';
    const emailUsuario = 'user@example.com';
    const hashedPassword = 'hashed:newPassword123:12';

    bcrypt.hash.mockResolvedValueOnce(hashedPassword);
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const result = await resetPassword(newPassword, emailUsuario);

    expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 12);
    expect(db.execute).toHaveBeenCalledWith(
      'UPDATE usuario SET passwordUsuario = ? WHERE emailUsuario = ?',
      [hashedPassword, emailUsuario]
    );
    expect(result).toEqual([{ affectedRows: 1 }]);
  });

  it('debería manejar errores al restablecer la contraseña', async () => {
    const newPassword = 'newPassword123';
    const emailUsuario = 'user@example.com';

    const error = new Error('Error al restablecer la contraseña');
    bcrypt.hash.mockRejectedValueOnce(error);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const result = await resetPassword(newPassword, emailUsuario);

    expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 12);
    expect(db.execute).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(error);
    expect(result).toBeUndefined();

    consoleSpy.mockRestore();
  });
});
