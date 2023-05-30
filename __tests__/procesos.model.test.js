const Procesos = require('../models/procesos.model');
const db = require('../util/database.util');

// Mock para la función db.execute()
jest.mock('../util/database.util', () => ({
  execute: jest.fn().mockResolvedValue([])
}));

describe('Procesos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNombreAgente', () => {
    it('debería obtener el nombre y ID del agente asociado a un trámite', async () => {
      db.execute.mockResolvedValueOnce([
        [{ idUsuario: 1, nombreUsuario: 'John Doe' }],
        {}
      ]);

      const result = await Procesos.getNombreAgente(1);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT u.idUsuario, u.nombreUsuario FROM usuario u JOIN tramite t ON u.idUsuario = t.idAgente WHERE t.idTramite = ?',
        [1]
      );
      expect(result).toEqual([{ idUsuario: 1, nombreUsuario: 'John Doe' }]);
    });
  });

  describe('getFotoTramite', () => {
    it('debería obtener la foto asociada a un inmueble', async () => {
      db.execute.mockResolvedValueOnce([[{ idFoto: 1 }], {}]);

      const result = await Procesos.getFotoTramite(1);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT idFoto FROM fotoinmueble WHERE idInmueble = ?',
        [1]
      );
      expect(result).toEqual([[{ idFoto: 1 }]]);
    });
  });

  describe('getDescTramite', () => {
    it('debería obtener la información del inmueble asociado al trámite', async () => {
      db.execute.mockResolvedValueOnce([
        [{ idInmueble: 1, nombreInmueble: 'Casa', descInmueble: 'Descripción', direccionInmueble: 'Dirección' }],
        {}
      ]);

      const result = await Procesos.getDescTramite(1);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT I.idInmueble, I.nombreInmueble, I.descInmueble, I.direccionInmueble FROM inmueble I JOIN tramite TR ON I.idInmueble = TR.idInmueble WHERE TR.idTramite = ?',
        [1]
      );
      expect(result).toEqual([{ idInmueble: 1, nombreInmueble: 'Casa', descInmueble: 'Descripción', direccionInmueble: 'Dirección' }]);
    });
  });

  describe('infoTramite', () => {
    it('debería obtener los trámites de un usuario', async () => {
      db.execute.mockResolvedValueOnce([
        [{ idTramite: 1, fechaCreacionTramite: '2023-01-01', activoTramite: true, idInmueble: 1, IdCliente: 1, IdAgente: 2, IdArrendador: 3 }],
        {}
      ]);

      const result = await Procesos.infoTramite(1);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT * FROM tramite WHERE idCliente = ? OR idArrendador = ? OR idAgente = ? AND activoTramite = 1',
        [1, 1, 1]
      );
      expect(result).toEqual([{ idTramite: 1, fechaCreacionTramite: '2023-01-01', activoTramite: true, idInmueble: 1, IdCliente: 1, IdAgente: 2, IdArrendador: 3 }]);
    });
  });
});
