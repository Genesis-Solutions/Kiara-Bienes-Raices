const db = require("../util/database.util");

module.exports = class Inmueble {
  // Obtener la informacion de un inmueble utilizando su id
  static getInmueble(idInmueble) {
    return db
      .execute("SELECT * FROM inmueble WHERE idInmueble=?", [idInmueble])
      .then(([rows, data]) => {
        //console.log(rows)
        return rows;
      })
      .catch((error) => {
        console.log(error);
        return 0;
      });
  }

  static updateOne(
    titulo,
    desc,
    tipoMovimiento,
    linkVideo,
    precioRenta,
    precioVenta,
    idInmueble
  ) {
    return db.execute(
      "UPDATE inmueble SET nombreInmueble=?, descInmueble=?, idTipoMovimiento=?, linkVideoInmueble=?,  precioRentaInmueble=?, precioVentaInmueble=? WHERE idInmueble=?",
      [
        titulo,
        desc,
        tipoMovimiento,
        linkVideo,
        precioRenta,
        precioVenta,
        idInmueble,
      ]
    );
  }

  static getIdAgente(idInmueble) {
    return db.execute("SELECT idAgente FROM tramite WHERE idInmueble = ?", [
      idInmueble,
    ]);
  }

  static getInfoAgente(idAgente) {
    "SELECT * FROM usuario WHERE idUsuario = ?", [idAgente];
  }

  // //Obtener la informacion del Agente asignado a la propiedad con base al id del tramite
  static getAgentInfo(idInmueble) {
    return db.execute(
      "SELECT u.idUsuario, u.nombreUsuario, u.telefonoUsuario, u.emailUsuario FROM usuario u JOIN tramite t ON u.idUsuario = t.idAgente WHERE t.idTramite = (SELECT idTramite FROM tramite WHERE idInmueble=?)",
      [idInmueble]
    );
  }

  // Obtener el id de las fotos del inmueble
  static getIdFotosInmueble(idInmueble) {
    return db.execute("SELECT idFoto from fotoInmueble WHERE idInmueble = ?", [
      idInmueble,
    ]);
  }

  // Obtener el src de las fotos del inmueble
  static getSrcFotosInmueble(idFoto) {
    return db.execute("SELECT archivoFoto FROM foto WHERE idFoto = ?", [
      idFoto,
    ]);
  }

  static changeInmuebleCasa(
    titulo,
    desc,
    tipoMovimiento,
    linkVideo,
    precioVenta,
    precioRenta,
    m2Terreno,
    m2Construccion,
    niveles,
    mediosBanios,
    cuotaMantenimiento,
    fechaConstruccion,
    usoSuelo,
    ubicado,
    tipoGas,
    recamaras,
    estacionamientos,
    banios,
    cocina,
    cisterna,
    cuartoServicio,
    salaTV,
    estudio,
    roofGarden,
    areaLavado,
    vigilancia,
    jardin,
    bodega,
    direccion,
    linkMaps,
    idInmueble
  ) {
    return db.execute(
      "UPDATE inmueble SET nombreInmueble=?, idTipoMovimiento=?, linkVideoInmueble=?, precioVentaInmueble=?,precioRentaInmueble, m2TerrenoInmueble=?,m2ConstruidosInmueble, nivelesInmueble=?, mediosBaniosInmueble=?, cuotaMantenimientoInmueble=?, fechaConstruccionInmueble=?, usoSueloInmueble=?, ubicadoInmueble=?, tipoGasInmueble=?, recamarasInmueble=?, estacionamientosInmueble=?, baniosInmueble=?, descInmueble=?, cocinaInmueble=?, cisternaInmueble=?, cuartoServicioInmueble=?, salaTVInmueble=?, estudioInmueble=?, roofGardenInmueble=?, areaLavadoInmueble=?, vigilanciaInmueble=?, jardinInmueble=?, bodegaInmueble=?, direccionInmueble=?, linkGoogleMaps=? WHERE idInmueble = ?",
      [
        titulo,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2Terreno,
        m2Construccion,
        niveles,
        mediosBanios,
        cuotaMantenimiento,
        fechaConstruccion,
        usoSuelo,
        ubicado,
        tipoGas,
        recamaras,
        estacionamientos,
        banios,
        desc,
        cocina,
        cisterna,
        cuartoServicio,
        salaTV,
        estudio,
        roofGarden,
        areaLavado,
        vigilancia,
        jardin,
        bodega,
        direccion,
        linkMaps,
        idInmueble,
      ]
    );
  }

  static changeInmuebleLocal(
    titulo,
    tipoMovimiento,
    linkVideo,
    precioVenta,
    precioRenta,
    m2Terreno,
    m2Construccion,
    medidaFrente,
    medidaFondo,
    niveles,
    cuartosPrivadosInmueble,
    mediosBanios,
    usoSuelo,
    ubicado,
    cuotaMantenimiento,
    cocina,
    cisterna,
    cuartoServicio,
    fechaConstruccion,
    vigilancia,
    tipoGas,
    estacionamientos,
    banios,
    desc,
    direccion,
    linkMaps,
    idInmueble
  ) {
    return db.execute(
      // "UPDATE inmueble SET nombreInmueble=?, idTipoMovimiento=?, linkVideoInmueble=?, precioVentaInmueble=?,precioRentaInmueble, m2TerrenoInmueble=?,m2ConstruidosInmueble, nivelesInmueble=?, mediosBaniosInmueble=?, cuotaMantenimientoInmueble=?, fechaConstruccionInmueble=?, usoSueloInmueble=?, ubicadoInmueble=?, tipoGasInmueble=?, recamarasInmueble=?, estacionamientosInmueble=?, baniosInmueble=?, descInmueble=?, cocinaInmueble=?, cisternaInmueble=?, cuartoServicioInmueble=?, salaTVInmueble=?, estudioInmueble=?, roofGardenInmueble=?, areaLavadoInmueble=?, vigilanciaInmueble=?, jardinInmueble=?, bodegaInmueble=?, direccionInmueble=?, linkMapsInmueble=? WHERE idInmueble = ?",
      "UPDATE inmueble SET nombreInmueble=?, idTipoMovimiento=?, linkVideoInmueble=?, precioVentaInmueble=?, precioRentaInmueble=?,m2TerrenoInmueble=?, m2ConstruidosInmueble=?,medidasFrenteInmueble=?,medidasFondoInmueble=?,nivelesInmueble=?, cuartosPrivadosInmueble=?, mediosBaniosInmueble=?,usoSueloInmueble=?,enPrivadaInmueble=?,cuotaMantenimientoInmueble=?,cocinaInmueble=?,cisternaInmueble=?,cuartoServicioInmueble=?,fechaConstruccionInmueble=?,vigilanciaInmueble=?,tipoGasInmueble=?,estacionamientosInmueble=?,baniosInmueble=?,descInmueble=?,direccionInmueble=?,linkGoogleMaps=? WHERE idInmueble = ?",
      [
        titulo,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2Terreno,
        m2Construccion,
        medidaFrente,
        medidaFondo,
        niveles,
        cuartosPrivadosInmueble,
        mediosBanios,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        cocina,
        cisterna,
        cuartoServicio,
        fechaConstruccion,
        vigilancia,
        tipoGas,
        estacionamientos,
        banios,
        desc,
        direccion,
        linkMaps,
        idInmueble,
      ]
    );
  }

  static changeInmuebleTerreno(
    titulo,
    tipoMovimiento,
    linkVideo,
    precioVenta,
    precioRenta,
    m2Terreno,
    m2Construccion,
    medidaFrente,
    medidaFondo,
    usoSuelo,
    ubicado,
    servicioAgua,
    servicioLuz,
    servicioDrenaje,
    tipoSuelo,
    cuotaMantenimiento,
    vigilancia,
    desc,
    direccion,
    linkMaps,
    idInmueble
  ) {
    return db.execute(
      "UPDATE inmueble SET nombreInmueble=?, idTipoMovimiento=?, linkVideoInmueble=?, precioVentaInmueble=?, precioRentaInmueble=?, m2TerrenoInmueble=?, m2ConstruidosInmueble=?, medidasFrenteInmueble=?, medidasFondoInmueble=?, usoSueloInmueble=?, enPrivadaInmueble=?, servicioAguaInmueble=?, servicioLuzInmueble=?, servicioDrenajeInmueble=?, tipoSueloInmueble=?, cuotaMantenimientoInmueble=?, vigilanciaInmueble=?, descInmueble=?, direccionInmueble=?, linkGoogleMaps=? WHERE idInmueble = ?",
      [
        titulo,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2Terreno,
        m2Construccion,
        medidaFrente,
        medidaFondo,
        usoSuelo,
        ubicado,
        servicioAgua,
        servicioLuz,
        servicioDrenaje,
        tipoSuelo,
        cuotaMantenimiento,
        vigilancia,
        desc,
        direccion,
        linkMaps,
        idInmueble,
      ]
    );
  }

  static changeInmuebleBodega(
    titulo,
    tipoMovimiento,
    linkVideo,
    precioVenta,
    precioRenta,
    m2Terreno,
    m2Construccion,
    medidaFrente,
    medidaFondo,
    niveles,
    cuartosPrivadosInmueble,
    mediosBanios,
    estacionamientos,
    usoSuelo,
    ubicado,
    cuotaMantenimiento,
    cocina,
    cisterna,
    fechaConstruccion,
    vigilancia,
    generadorElectrico,
    andenCarga,
    oficina,
    patioManiobras,
    muros,
    altura,
    tipoPiso,
    tipoLuz,
    banios,
    desc,
    direccion,
    linkMaps,
    idInmueble
  ) {
    return db.execute(
      "UPDATE inmueble SET nombreInmueble=?, idTipoMovimiento=?, linkVideoInmueble=?, precioVentaInmueble=?, precioRentaInmueble=?, m2TerrenoInmueble=?, m2ConstruidosInmueble=?, medidasFrenteInmueble=?, medidasFondoInmueble=?, nivlesInmueble=?, cuartosPrivadosInmueble=?, mediosBaniosInmueble=?, estacionamientosInmueble=?, usoSueloInmueble=?, enPrivadaInmueble=?, cuotaMantenimientoInmueble=?, cocinaInmueble=?, cisternaInmueble=?, fechaConstruccionInmueble=?, vigilanciaInmueble=?, generadorElectricoInmueble=?, andenCargaInmueble=?, oficinaInmueble=?, patioManiobrasInmueble=?, murosInmueble=?, alturaInmueble=?, tipoPisoInmueble=?, tipoLuzInmueble=?, baniosInmueble=?, descInmueble=?, direccionInmueble=?, linkGoogleMaps=? WHERE idInmueble=?",
      [
        titulo,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2Terreno,
        m2Construccion,
        medidaFrente,
        medidaFondo,
        niveles,
        cuartosPrivadosInmueble,
        mediosBanios,
        estacionamientos,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        cocina,
        cisterna,
        fechaConstruccion,
        vigilancia,
        generadorElectrico,
        andenCarga,
        oficina,
        patioManiobras,
        muros,
        altura,
        tipoPiso,
        tipoLuz,
        banios,
        desc,
        direccion,
        linkMaps,
        idInmueble,
      ]
    );
  }

  static changeInmuebleOficina(
    titulo,
    tipoMovimiento,
    linkVideo,
    precioVenta,
    precioRenta,
    m2Terreno,
    m2Construccion,
    niveles,
    cuartosPrivadosInmueble,
    mediosBanios,
    usoSuelo,
    ubicado,
    cuotaMantenimiento,
    cocina,
    cisterna,
    fechaConstruccion,
    vigilancia,
    estacionamientos,
    banios,
    direccion,
    desc,
    linkMaps,
    idInmueble
  ) {
    return db.execute(
      "UPDATE inmueble SET nombreInmueble=?, idTipoMovimiento=?, linkVideoInmueble=?, precioVentaInmueble=?, precioRentaInmueble=?, m2TerrenoInmueble=?, m2ConstruidosInmueble=?, nivelesInmueble=?, cuartosPrivadosInmueble=?, mediosBaniosInmueble=?, usoSueloInmueble=?, enPrivadaInmueble=?, cuotaMantenimientoInmueble=?, cocinaInmueble=?, cisternaInmueble=?, fechaConstruccionInmueble=?, vigilanciaInmueble=?, estacionamientosInmueble=?, baniosInmueble=?, direccionInmueble=?, descInmueble=?, linkGoogleMaps=? WHERE idInmueble=?",
      [
        titulo,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2Terreno,
        m2Construccion,
        niveles,
        cuartosPrivadosInmueble,
        mediosBanios,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        cocina,
        cisterna,
        fechaConstruccion,
        vigilancia,
        estacionamientos,
        banios,
        direccion,
        desc,
        linkMaps,
        idInmueble,
      ]
    );
  }

  static changeInmuebleOtra(
    titulo,
    tipoMovimiento,
    linkVideo,
    precioVenta,
    precioRenta,
    m2Terreno,
    m2Construccion,
    niveles,
    recamaras,
    cuartosPrivadosInmueble,
    mediosBanios,
    usoSuelo,
    ubicado,
    cuotaMantenimiento,
    cocina,
    cisterna,
    vigilancia,
    estacionamientos,
    banios,
    desc,
    direccion,
    linkMaps,
    idInmueble
  ) {
    return db.execute(
      "UPDATE inmueble SET nombreInmueble=?, idTipoMovimiento=?, linkVideoInmueble=?, precioVentaInmueble=?, precioRentaInmueble=?, m2TerrenoInmueble=?, m2ConstruidosInmueble=?, nivelesInmueble=?, recamarasInmueble=?, cuartosPrivadosInmueble=?, mediosBaniosInmueble=?, usoSueloInmueble=?, enPrivadaInmueble=?, cuotaMantenimientoInmueble=?, cocinaInmueble=?, cisternaInmueble=?, vigilanciaInmueble=?, estacionamientosInmueble=?, baniosInmueble=?, descInmueble=?, direccionInmueble=?, linkGoogleMaps=? WHERE idInmueble=?",
      [
        titulo,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2Terreno,
        m2Construccion,
        niveles,
        recamaras,
        cuartosPrivadosInmueble,
        mediosBanios,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        cocina,
        cisterna,
        vigilancia,
        estacionamientos,
        banios,
        desc,
        direccion,
        linkMaps,
        idInmueble,
      ]
    );
  }
};
