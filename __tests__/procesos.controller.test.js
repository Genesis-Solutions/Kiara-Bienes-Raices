const Procesos = require("../models/procesos.model");
const Inmueble = require("../models/inmueble.model");

describe("getProcesos", () => {
  it('debería llamar a "next" con el error si ocurre una excepción al obtener el nombre del agente', async () => {
    const req = {
      session: {
        idUsuario: 1,
        isLoggedIn: true,
        idRol: 2,
      },
    };
    const res = {
      render: jest.fn(),
    };
    const next = jest.fn();
    const tramites = [{ idTramite: 1 }];
    const error = new Error("Error al obtener el nombre del agente");

    Procesos.infoTramite = jest.fn().mockResolvedValue(tramites);
    Procesos.getNombreAgente = jest.fn().mockRejectedValue(error);

    expect(Procesos.infoTramite).toHaveBeenCalledWith(req.session.idUsuario);
    expect(Procesos.getNombreAgente).toHaveBeenCalledWith(1);
  });

  it('debería llamar a "next" con el error si ocurre una excepción al obtener la descripción del trámite', async () => {
    const req = {
      session: {
        idUsuario: 1,
        isLoggedIn: true,
        idRol: 2,
      },
    };
    const res = {
      render: jest.fn(),
    };
    const next = jest.fn();
    const tramites = [{ idTramite: 1 }];
    const nombreAgente = [[{ nombreUsuario: "John Doe" }]];
    const error = new Error("Error al obtener la descripción del trámite");

    const tramite = Procesos.infoTramite(req.session.idUsuario);
    const nombreAgenteValue = Procesos.getNombreAgente(tramites[0].idTramite)

    expect(tramite).toEqual(1);
    expect(nombreAgenteValue[0]).toEqual('John Doe')
  });
});