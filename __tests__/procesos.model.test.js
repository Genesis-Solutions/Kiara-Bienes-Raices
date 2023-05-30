const Procesos = require('../models/procesos.model');
const db = require('../util/database.util');

// Mockear la función de base de datos execute para simular su comportamiento
jest.mock('../util/database.util', () => ({
  execute: jest.fn(),
}));

describe('Procesos', () => {
  describe('getAgentInfo', () => {
    it('debería devolver la información del agente', async () => {
      const idInmueble = 1;
      const mockResult = [
        { idUsuario: 1, nombreUsuario: 'John Doe', telefonoUsuario: '123456789', emailUsuario: 'johndoe@example.com' },
      ];
      db.execute.mockResolvedValueOnce(mockResult);

      const resultado = await Procesos.getAgentInfo(idInmueble);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT u.idUsuario, u.nombreUsuario, u.telefonoUsuario, u.emailUsuario FROM usuario u JOIN tramite t ON u.idUsuario = t.idAgente WHERE t.idTramite = (SELECT idTramite FROM tramite WHERE idInmueble=?)',
        [idInmueble]
      );
      expect(resultado).toEqual(mockResult);
    });
  });

  describe('getNombreAgente', () => {
    it('debería devolver el nombre y el ID del agente', async () => {
      const idTramite = 1;
      const mockResult = [
        { idUsuario: 1, nombreUsuario: 'John Doe' },
      ];
      db.execute.mockResolvedValueOnce(mockResult);

      const resultado = await Procesos.getNombreAgente(idTramite);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT u.idUsuario, u.nombreUsuario FROM usuario u JOIN tramite t ON u.idUsuario = t.idAgente WHERE t.idTramite = ?',
        [idTramite]
      );
      expect(resultado).toEqual(mockResult);
    });
  });

  describe('getFotoTramite', () => {
    it('debería devolver la foto del inmueble', async () => {
      const idInmueble = 1;
      const mockResult = [
        { idFoto: 1 },
      ];
      db.execute.mockResolvedValueOnce(mockResult);

      const resultado = await Procesos.getFotoTramite(idInmueble);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT idFoto FROM fotoinmueble WHERE idInmueble = ?',
        [idInmueble]
      );
      expect(resultado).toEqual(mockResult);
    });
  });

  describe('getInfoInmuebleTramiteAgente', () => {
    it('debería devolver la información del inmueble asociado al trámite del agente', async () => {
      const idAgente = 1;
      const mockResult = [
        { idInmueble: 1, nombreInmueble: 'Inmueble 1', descInmueble: 'Descripción del inmueble', direccionInmueble: 'Dirección del inmueble' },
      ];
      db.execute.mockResolvedValueOnce(mockResult);

      const resultado = await Procesos.getInfoInmuebleTramiteAgente(idAgente);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT I.idInmueble, I.nombreInmueble, I.descInmueble, I.direccionInmueble FROM inmueble I JOIN tramite TR ON I.idInmueble = TR.idInmueble WHERE TR.idAgente = ?',
        [idAgente]
      );
      expect(resultado).toEqual(mockResult);
    });
  });

  describe('getDescTramite', () => {
    it('debería devolver la información del inmueble asociado al trámite del usuario', async () => {
      const idTramite = 1;
      const mockResult = [ 
        { idInmueble: 1, nombreInmueble: 'Inmueble 1', descInmueble: 'Descripción del inmueble', direccionInmueble: 'Dirección del inmueble' }
      ];
      db.execute.mockResolvedValueOnce(mockResult);

      const resultado = [await Procesos.getDescTramite(idTramite)];

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT I.idInmueble, I.nombreInmueble, I.descInmueble, I.direccionInmueble FROM inmueble I JOIN tramite TR ON I.idInmueble = TR.idInmueble WHERE TR.idTramite = ?',
        [idTramite]
      );
      expect(resultado).toEqual(mockResult);
    });
  });

  describe('infoTramite', () => {
    it('debería devolver la información del trámite del usuario', async () => {
      const idUsuario = 1;
      const mockResult = [ 
        { idTramite: 1, idCliente: 1, idAgente: 2, idArrendador: 3, activoTramite: 1 }
      ];
      db.execute.mockResolvedValueOnce(mockResult);

      const resultado = [await Procesos.infoTramite(idUsuario)];

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT * FROM tramite WHERE idCliente = ? OR idArrendador = ? OR idAgente = ? AND activoTramite = 1',
        [idUsuario, idUsuario, idUsuario]
      );
      expect(resultado).toEqual(mockResult);
    });
  });
});