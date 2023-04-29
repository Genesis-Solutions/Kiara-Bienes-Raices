const db = require("../util/database.js");
const bcrypt = require("bcryptjs");

module.exports = class Dashboard {
  static fetchAllUsers() {
    return db.execute(
      "SELECT U.idUsuario,U.nombreUsuario,U.apellidosUsuario,R.nombreRol FROM usuario U JOIN rol R ON U.idRol = R.idRol"
    );
  }

  static findOne(emailUsuario) {
    return db.execute("SELECT * FROM usuario WHERE emailUsuario=?", [
      emailUsuario,
    ]);
  }

  static adminInsertUser(
    nombreUsuario,
    apellidosUsuario,
    passwordUsuario,
    telefonoUsuarioString,
    emailUsuario,
    estadoCivilUsuario,
    ocupacionUsuario,
    activoUsuarioString,
    idRolString,
    idFotoString
  ) {
    return bcrypt.hash(passwordUsuario, 12).then((passwordCifrado) => {
      return db
        .execute(
          "INSERT INTO usuario(nombreUsuario, apellidosUsuario,passwordUsuario,telefonoUsuario, emailUsuario,estadoCivilUsuario, ocupacionUsuario,activoUsuario ,idRol, idFoto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            nombreUsuario,
            apellidosUsuario,
            passwordCifrado,
            telefonoUsuarioString,
            emailUsuario,
            estadoCivilUsuario,
            ocupacionUsuario,
            activoUsuarioString,
            idRolString,
            idFotoString,
          ]
        )
        .catch((error) => {
          console.log(error);
        });
    });
  }

  static changeInmuebleCasa(
    titulo,
    desc,
    tipoMovimiento,
    linkVideo,
    precioVenta,
    precioRenta,
    m2terreno,
    m2construccion,
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
        m2terreno,
        m2construccion,
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
    m2terreno,
    m2construccion,
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
      "UPDATE inmueble SET nombreInmueble=?, idTipoMovimiento=?, linkVideoInmueble=?, precioVentaInmueble=?, precioRentaInmueble=?,m2TerrenoInmueble=?, m2ConstruidosInmueble=?,medidasFrenteInmueble=?,medidasFondoInmueble=?,nivelesInmueble=?, cuartosPrivadosInmueble=?, mediosBaniosInmueble=?, estacionamientosInmueble=?,usoSueloInmueble=?,enPrivadaInmueble=?,cuotaMantenimientoInmueble=?,cocinaInmueble=?,cisternaInmueble=?,cuartoServicioInmueble=?,fechaConstruccionInmueble=?,vigilanciaInmueble=?,tipoGasInmueble=?,estacionamientosInmueble=?,baniosInmueble=?,descInmueble=?,direccionInmueble=?,linkGoogleMaps=? WHERE idInmueble = ?",
      [
        titulo,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2terreno,
        m2construccion,
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
    m2terreno,
    m2construccion,
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
        m2terreno,
        m2construccion,
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
    m2terreno,
    m2construccion,
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
            m2terreno,
            m2construccion,
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
        ]
    );
  }

  static changeInmuebleOficina(
    titulo,
    tipoMovimiento,
    linkVideo,
    precioVenta,
    precioRenta,
    m2terreno,
    m2construccion,
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
            m2terreno,
            m2construccion,
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
        ]
    );
  }

  static changeInmuebleOtra(
    titulo,
    tipoMovimiento,
    linkVideo,
    precioVenta,
    precioRenta,
    m2terreno,
    m2construccion,
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
            m2terreno,
            m2construccion,
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
        ]
    );
  }
};
