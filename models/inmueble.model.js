const db = require("../util/database.util");

/**

Esta clase se encarga de interactuar con la tabla Inmueble en la base de datos.
@class Inmueble
*/

/*

Obtiene la informacion de un inmueble utilizando su id.
@static
@param {number} idInmueble - El id del inmueble a obtener.
@returns {Promise} Una promesa que se resuelve a un objeto que contiene la informacion del inmueble.
*/
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

  /*
  Devuelve el estado del trámite activo para un inmueble determinado.
  @param idInmueble El identificador del inmueble para el cual se quiere consultar el trámite activo.
  @return Un objeto con el estado del trámite activo para el inmueble especificado.
  @throws SQLException Si hay un error al ejecutar la consulta en la base de datos.
  */
  static getActivoTramite(idInmueble) {
    return db
      .execute("SELECT activoTramite FROM tramite WHERE idInmueble=?", [idInmueble])
      .then(([rows, data]) => {
        return rows;
      })
      .catch((error) => {
        console.log(error);
        return 0;
      });
  }

  /*
  Elimina una propiedad de la base de datos.
  @param activoInmueble El estado de la propiedad que se desea eliminar.
  @param idInmueble El identificador de la propiedad que se desea eliminar.
  @throws SQLException Si hay un error al ejecutar la actualización en la base de datos.
  */
  static eliminarPropiedad(activoInmueble, idInmueble) {
    return db
    .execute("UPDATE inmueble SET activoInmueble=? WHERE idInmueble=?", [activoInmueble, idInmueble]);
  }
  /*

Actualiza un inmueble existente en la base de datos.
@static
@param {string} titulo - El titulo del inmueble a actualizar.
@param {string} desc - La descripcion del inmueble a actualizar.
@param {number} tipoMovimiento - El id del tipo de movimiento del inmueble a actualizar.
@param {string} linkVideo - El link al video del inmueble a actualizar.
@param {number} precioRenta - El precio de renta del inmueble a actualizar.
@param {number} precioVenta - El precio de venta del inmueble a actualizar.
@param {number} idInmueble - El id del inmueble a actualizar.
@returns {Promise} Una promesa que se resuelve a un objeto que indica si la actualizacion fue exitosa o no.
*/


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

  /*
Obtiene el id del agente responsable del inmueble.
@static
@param {number} idInmueble - El id del inmueble del que se quiere obtener el id del agente responsable.
@returns {Promise} Una promesa que se resuelve a un objeto que contiene el id del agente responsable.
*/

  static getIdAgente(idInmueble) {
    return db.execute("SELECT idAgente FROM tramite WHERE idInmueble = ?", [
      idInmueble,
    ]);
  }

  /*

Obtiene la información del agente con base en su identificador.
@param idAgente El identificador del agente del que se desea obtener la información.
@return Un objeto que contiene toda la información del agente.
*/

  static getInfoAgente(idAgente) {
    "SELECT * FROM usuario WHERE idUsuario = ?", [idAgente];
  }

  /*
  Obtiene la información del agente asignado a un inmueble con base en el identificador del inmueble.
  @param idInmueble El identificador del inmueble del que se desea obtener la información del agente.
  @return Un objeto que contiene el identificador, nombre, teléfono y correo electrónico del agente.
  */
  static getAgentInfo(idInmueble) {
    return db.execute(
      "SELECT u.idUsuario, u.nombreUsuario, u.telefonoUsuario, u.emailUsuario FROM usuario u JOIN tramite t ON u.idUsuario = t.idAgente WHERE t.idTramite = (SELECT idTramite FROM tramite WHERE idInmueble=?)",
      [idInmueble]
    );
  }

  /*

Obtiene los identificadores de las fotos de un inmueble con base en el identificador del inmueble.
@param idInmueble El identificador del inmueble del que se desea obtener los identificadores de las fotos.
@return Un objeto que contiene los identificadores de las fotos del inmueble.
*/
  static getIdFotosInmueble(idInmueble) {
    return db.execute("SELECT idFoto from fotoInmueble WHERE idInmueble = ?", [
      idInmueble,
    ]);
  }

  /*
Obtiene el archivo de imagen de una foto de un inmueble con base en el identificador de la foto.
@param idFoto El identificador de la foto del que se desea obtener el archivo de imagen.
@return Un objeto que contiene el archivo de imagen de la foto.
*/
  static getSrcFotosInmueble(idFoto) {
    return db.execute("SELECT archivoFoto FROM foto WHERE idFoto = ?", [
      idFoto,
    ]);
  }

  /*

Obtiene la información de los clientes que son propietarios de inmuebles.
@return Un objeto que contiene la información de los clientes que son propietarios de inmuebles.
*/
  static fetchClientes() {
    return db.execute(
      "SELECT * FROM usuario WHERE idRol = 3"
    );
  }

   /*

Obtiene la información de los clientes que son propietarios de inmuebles.
@return Un objeto que contiene la información de los clientes que son propietarios de inmuebles.
*/
static fetchAttritubutesInmueble(idInmueble) {
  return db.execute(
    "SELECT * FROM inmueble WHERE idInmueble=?",
    [idInmueble]	
  );
}

/*
Actualiza un inmueble de tipo Casa en la base de datos
@param titulo el título del inmueble
@param desc la descripción del inmueble
@param tipoMovimiento el tipo de movimiento del inmueble (venta o renta)
@param linkVideo el enlace del video del inmueble
@param precioVenta el precio de venta del inmueble
@param precioRenta el precio de renta del inmueble
@param m2Terreno los metros cuadrados de terreno del inmueble
@param m2Construccion los metros cuadrados construidos del inmueble
@param niveles el número de niveles del inmueble
@param mediosBanios el número de medios baños del inmueble
@param cuotaMantenimiento la cuota de mantenimiento del inmueble
@param fechaConstruccion la fecha de construcción del inmueble
@param usoSuelo el uso del suelo del inmueble
@param ubicado la ubicación del inmueble
@param tipoGas el tipo de gas del inmueble
@param recamaras el número de recámaras del inmueble
@param estacionamientos el número de estacionamientos del inmueble
@param banios el número de baños del inmueble
@param cocina la existencia de cocina en el inmueble
@param cisterna la existencia de cisterna en el inmueble
@param cuartoServicio la existencia de cuarto de servicio en el inmueble
@param salaTV la existencia de sala de TV en el inmueble
@param estudio la existencia de estudio en el inmueble
@param roofGarden la existencia de roof garden en el inmueble
@param areaLavado la existencia de área de lavado en el inmueble
@param vigilancia la existencia de vigilancia en el inmueble
@param jardin la existencia de jardín en el inmueble
@param bodega la existencia de bodega en el inmueble
@param direccion la dirección del inmueble
@param linkMaps el enlace de Google Maps del inmueble
@param idPropietario el ID del propietario del inmueble
@param idInmueble el ID del inmueble a actualizar
@return el resultado de la ejecución de la consulta a la base de datos
*/

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
    idPropietario,
    activoInmueble,
    idInmueble
  ) {
    return db.execute(
      "UPDATE inmueble SET nombreInmueble=?,descInmueble=?, idTipoMovimiento=?, linkVideoInmueble=?, precioVentaInmueble=?,precioRentaInmueble=?, m2TerrenoInmueble=?,m2ConstruidosInmueble=?, nivelesInmueble=?, mediosBaniosInmueble=?, cuotaMantenimientoInmueble=?, fechaConstruccionInmueble=?, usoSueloInmueble=?, enPrivadaInmueble=?, tipoGasInmueble=?, recamarasInmueble=?, estacionamientosInmueble=?, baniosInmueble=?, cocinaInmueble=?, cisternaInmueble=?, cuartoServicioInmueble=?, salaTVInmueble=?, estudioInmueble=?, roofGardenInmueble=?, areaLavadoInmueble=?, vigilanciaInmueble=?, jardinInmueble=?, bodegaInmueble=?, direccionInmueble=?, linkGoogleMaps=?, idArrendador=?, activoInmueble=? WHERE idInmueble = ?",
      [
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
        idPropietario,
        activoInmueble,
        idInmueble
      ]
    );
  }

  /*
Actualiza un inmueble de tipo Local en la base de datos
@param titulo el título del inmueble
@param desc la descripción del inmueble
@param tipoMovimiento el tipo de movimiento del inmueble (venta o renta)
@param linkVideo el enlace del video del inmueble
@param precioVenta el precio de venta del inmueble
@param precioRenta el precio de renta del inmueble
@param m2Terreno los metros cuadrados de terreno del inmueble
@param m2Construccion los metros cuadrados construidos del inmueble
@param medidaFrente la medida de frente del inmueble
@param medidaFondo la medida de fondo del inmueble
@param niveles el número de niveles del inmueble
@param cuartosPrivadosInmueble el número de cuartos privados del inmueble
@param mediosBanios el número de medios baños del inmueble
@param usoSuelo el uso del suelo del inmueble
@param ubicado la ubicación del inmueble
@param cuotaMantenimiento la cuota de mantenimiento del inmueble
@param cocina la existencia de cocina en el inmueble
@param cisterna la existencia de cisterna en el inmueble
@param cuartoServicio la existencia de cuarto de servicio en el inmueble
@param fechaConstruccion la fecha de construcción del inmueble
@param vigilancia la existencia de vigilancia en el inmueble
@param tipoGas el tipo de gas del inmueble
@param estacionamientos el número de estacionamientos del inmueble
@param banios el número de baños del inmueble
@param desc la descripción del inmueble
@param direccion la dirección del inmueble
@param linkMaps el enlace de Google Maps del inmueble
@param idPropietario el ID del propietario del inmueble
@param idInmueble el ID del inmueble a actualizar
@return el resultado de la ejecución de la consulta a la base de datos
*/

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
    idPropietario,
    activoInmueble,
    idInmueble
  ) {
    return db.execute(
      "UPDATE inmueble SET nombreInmueble=?, idTipoMovimiento=?, linkVideoInmueble=?, precioVentaInmueble=?, precioRentaInmueble=?,m2TerrenoInmueble=?, m2ConstruidosInmueble=?,medidasFrenteInmueble=?,medidasFondoInmueble=?,nivelesInmueble=?, cuartosPrivadosInmueble=?, mediosBaniosInmueble=?,usoSueloInmueble=?,enPrivadaInmueble=?,cuotaMantenimientoInmueble=?,cocinaInmueble=?,cisternaInmueble=?,cuartoServicioInmueble=?,fechaConstruccionInmueble=?,vigilanciaInmueble=?,tipoGasInmueble=?,estacionamientosInmueble=?,baniosInmueble=?,descInmueble=?,direccionInmueble=?,linkGoogleMaps=?, idArrendador=?, activoInmueble=? WHERE idInmueble = ?",
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
        idPropietario,
        activoInmueble,
        idInmueble
      ]
    );
  }


   /*
Actualiza un inmueble de tipo Terreno en la base de datos
@param titulo el título del inmueble
@param desc la descripción del inmueble
@param tipoMovimiento el tipo de movimiento del inmueble (venta o renta)
@param linkVideo el enlace del video del inmueble
@param precioVenta el precio de venta del inmueble
@param precioRenta el precio de renta del inmueble
@param m2Terreno los metros cuadrados de terreno del inmueble
@param m2Construccion los metros cuadrados construidos del inmueble
@param medidaFrente la medida de frente del inmueble
@param medidaFondo la medida de fondo del inmueble
@param usoSuelo el uso del suelo del inmueble
@param ubicado la ubicación del inmueble
@param servicioAgua la existencia de servicio de agua en el inmueble
@param servicioLuz la existencia de servicio de luz en el inmueble
@param servicioDrenaje la existencia de servicio de drenaje en el inmueble
@param tipoSuelo el tipo de suelo del inmueble
@param cuotaMantenimiento la cuota de mantenimiento del inmueble
@param vigilancia la existencia de vigilancia en el inmueble
@param desc la descripción del inmueble
@param direccion la dirección del inmueble
@param linkMaps el enlace de Google Maps del inmueble
@param idPropietario el ID del propietario del inmueble
@param idInmueble el ID del inmueble a actualizar
@return el resultado de la ejecución de la consulta a la base de datos
*/

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
    idPropietario,
    activoInmueble,
    idInmueble
  ) {
    return db.execute(
      "UPDATE inmueble SET nombreInmueble=?, idTipoMovimiento=?, linkVideoInmueble=?, precioVentaInmueble=?, precioRentaInmueble=?, m2TerrenoInmueble=?, m2ConstruidosInmueble=?, medidasFrenteInmueble=?, medidasFondoInmueble=?, usoSueloInmueble=?, enPrivadaInmueble=?, servicioAguaInmueble=?, servicioLuzInmueble=?, servicioDrenajeInmueble=?, tipoSueloInmueble=?, cuotaMantenimientoInmueble=?, vigilanciaInmueble=?, descInmueble=?, direccionInmueble=?, linkGoogleMaps=? ,idArrendador=?, activoInmueble=? WHERE idInmueble = ?",
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
        idPropietario,
        activoInmueble,
        idInmueble
      ]
    );
  }

     /*
Actualiza un inmueble de tipo Bodega en la base de datos
@param titulo el título del inmueble
@param desc la descripción del inmueble
@param tipoMovimiento el tipo de movimiento del inmueble (venta o renta)
@param linkVideo el enlace del video del inmueble
@param precioVenta el precio de venta del inmueble
@param precioRenta el precio de renta del inmueble
@param m2Terreno los metros cuadrados de terreno del inmueble
@param m2Construccion los metros cuadrados construidos del inmueble
@param medidaFrente la medida de frente del inmueble
@param medidaFondo la medida de fondo del inmueble
@param niveles el número de niveles del inmueble
@param cuartosPrivadosInmueble el número de cuartos privados del inmueble
@param mediosBanios el número de medios baños del inmueble
@param estacionamientos el número de estacionamientos del inmueble
@param usoSuelo el uso del suelo del inmueble
@param ubicado la ubicación del inmueble
@param cuotaMantenimiento la cuota de mantenimiento del inmueble
@param cocina la existencia de cocina en el inmueble
@param cisterna la existencia de cisterna en el inmueble
@param fechaConstruccion la fecha de construcción del inmueble
@param vigilancia la existencia de vigilancia en el inmueble
@param generadorElectrico la existencia de generador eléctrico en el inmueble
@param andenCarga la existencia de andén de carga en el inmueble
@param oficina la existencia de oficina en el inmueble
@param patioManiobras la existencia de patio de maniobras en el inmueble
@param muros el tipo de muros del inmueble
@param altura la altura del inmueble
@param tipoPiso el tipo de piso del inmueble
@param tipoLuz el tipo de luz del inmueble
@param banios el número de baños del inmueble
@param desc la descripción del inmueble
@param direccion la dirección del inmueble
@param linkMaps el enlace de Google Maps del inmueble
@param idPropietario el ID del propietario del inmueble
@param idInmueble el ID del inmueble a actualizar
@return el resultado de la ejecución de la consulta a la base de datos
*/

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
    idPropietario,
    activoInmueble,
    idInmueble
  ) {
    return db.execute(
      "UPDATE inmueble SET nombreInmueble=?, idTipoMovimiento=?, linkVideoInmueble=?, precioVentaInmueble=?, precioRentaInmueble=?, m2TerrenoInmueble=?, m2ConstruidosInmueble=?, medidasFrenteInmueble=?, medidasFondoInmueble=?, nivelesInmueble=?, cuartosPrivadosInmueble=?, mediosBaniosInmueble=?, estacionamientosInmueble=?, usoSueloInmueble=?, enPrivadaInmueble=?, cuotaMantenimientoInmueble=?, cocinaInmueble=?, cisternaInmueble=?, fechaConstruccionInmueble=?, vigilanciaInmueble=?, generadorElectricoInmueble=?, andenCargaInmueble=?, oficinaInmueble=?, patioManiobrasInmueble=?, murosInmueble=?, alturaInmueble=?, tipoPisoInmueble=?, tipoLuzInmueble=?, baniosInmueble=?, descInmueble=?, direccionInmueble=?, linkGoogleMaps=?, idArrendador=?, activoInmueble=? WHERE idInmueble=?",
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
        idPropietario,
        activoInmueble,
        idInmueble
      ]
    );
  }

   /*
Actualiza un inmueble de tipo Oficina en la base de datos
@param titulo el título del inmueble
@param desc la descripción del inmueble
@param tipoMovimiento el tipo de movimiento del inmueble (venta o renta)
@param linkVideo el enlace del video del inmueble
@param precioVenta el precio de venta del inmueble
@param precioRenta el precio de renta del inmueble
@param m2Terreno los metros cuadrados de terreno del inmueble
@param m2Construccion los metros cuadrados construidos del inmueble
@param niveles el número de niveles del inmueble
@param cuartosPrivadosInmueble el número de cuartos privados del inmueble
@param mediosBanios el número de medios baños del inmueble
@param usoSuelo el uso del suelo del inmueble
@param ubicado la ubicación del inmueble
@param cuotaMantenimiento la cuota de mantenimiento del inmueble
@param cocina la existencia de cocina en el inmueble
@param cisterna la existencia de cisterna en el inmueble
@param fechaConstruccion la fecha de construcción del inmueble
@param vigilancia la existencia de vigilancia en el inmueble
@param estacionamientos el número de estacionamientos del inmueble
@param banios el número de baños del inmueble
@param direccion la dirección del inmueble
@param desc la descripción del inmueble
@param linkMaps el enlace de Google Maps del inmueble
@param idPropietario el ID del propietario del inmueble
@param idInmueble el ID del inmueble a actualizar
@return el resultado de la ejecución de la consulta a la base de datos

*/

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
    idPropietario,
    activoInmueble,
    idInmueble
  ) {
    return db.execute(
      "UPDATE inmueble SET nombreInmueble=?, idTipoMovimiento=?, linkVideoInmueble=?, precioVentaInmueble=?, precioRentaInmueble=?, m2TerrenoInmueble=?, m2ConstruidosInmueble=?, nivelesInmueble=?, cuartosPrivadosInmueble=?, mediosBaniosInmueble=?, usoSueloInmueble=?, enPrivadaInmueble=?, cuotaMantenimientoInmueble=?, cocinaInmueble=?, cisternaInmueble=?, fechaConstruccionInmueble=?, vigilanciaInmueble=?, estacionamientosInmueble=?, baniosInmueble=?, direccionInmueble=?, descInmueble=?, linkGoogleMaps=?, idArrendador=?, activoInmueble=? WHERE idInmueble=?",
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
        idPropietario,
        activoInmueble,
        idInmueble
      ]
    );
  }


    /*
Actualiza un inmueble de tipo Otro en la base de datos
@param titulo el título del inmueble
@param desc la descripción del inmueble
@param tipoMovimiento el tipo de movimiento del inmueble (venta o renta)
@param linkVideo el enlace del video del inmueble
@param precioVenta el precio de venta del inmueble
@param precioRenta el precio de renta del inmueble
@param m2Terreno los metros cuadrados de terreno del inmueble
@param m2Construccion los metros cuadrados construidos del inmueble
@param niveles el número de niveles del inmueble
@param recamaras el número de recámaras del inmueble
@param cuartosPrivadosInmueble el número de cuartos privados del inmueble
@param mediosBanios el número de medios baños del inmueble
@param usoSuelo el uso del suelo del inmueble
@param ubicado la ubicación del inmueble
@param cuotaMantenimiento la cuota de mantenimiento del inmueble
@param cocina la existencia de cocina en el inmueble
@param cisterna la existencia de cisterna en el inmueble
@param vigilancia la existencia de vigilancia en el inmueble
@param estacionamientos el número de estacionamientos del inmueble
@param banios el número de baños del inmueble
@param desc la descripción del inmueble
@param direccion la dirección del inmueble
@param linkMaps el enlace de Google Maps del inmueble
@param idPropietario el ID del propietario del inmueble
@param idInmueble el ID del inmueble a actualizar
@return el resultado de la ejecución de la consulta a la base de datos
*/


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
    idPropietario,
    activoInmueble,
    idInmueble
  ) {
    return db.execute(
      "UPDATE inmueble SET nombreInmueble=?, idTipoMovimiento=?, linkVideoInmueble=?, precioVentaInmueble=?, precioRentaInmueble=?, m2TerrenoInmueble=?, m2ConstruidosInmueble=?, nivelesInmueble=?, recamarasInmueble=?, cuartosPrivadosInmueble=?, mediosBaniosInmueble=?, usoSueloInmueble=?, enPrivadaInmueble=?, cuotaMantenimientoInmueble=?, cocinaInmueble=?, cisternaInmueble=?, vigilanciaInmueble=?, estacionamientosInmueble=?, baniosInmueble=?, descInmueble=?, direccionInmueble=?, linkGoogleMaps=?, idArrendador=?, activoInmueble=? WHERE idInmueble=?",
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
        idPropietario,
        activoInmueble,
        idInmueble
      ]
    );
  }

  /*
  Se obtienen los ultimos 4 inmuebles dentro de la base de datos.
  @return -> JSON Lista con toda la información de los ultimos 4 inmuebles dentro de la base de datos.
  */
  static fetchLastFour() {
    return db.execute("SELECT * from inmueble WHERE activoInmueble=1 ORDER BY idInmueble DESC LIMIT 4");
  }

  /*
  * Obtener el id de la foto portada del inmueble (primer registro en la entidad fotoInmueble).
  * @param id: String -> Id de un inmueble. 
  * @return JSON -> Id del primer registro dentro de la entidad fotoInmueble donde este el id del inmueble.
  */
  static idFotoPortada(id) {
    return db.execute(
      'SELECT idFoto FROM fotoInmueble WHERE idInmueble = ? ORDER BY idFoto ASC LIMIT 1',
      [id]
    );
  }

  /*
  * Obtener el nombre del archivo dentro del S3 de la foto portada del inmueble por su id.
  * @param id: String -> Id de una foto. 
  * @return JSON -> Nombre del archivo dentro del S3.
  */
  static srcFotoPortada(id) {
      return db.execute(
        'SELECT archivoFoto FROM foto WHERE idFoto = ?',
        [id]
      );
  }

};
