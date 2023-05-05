const db = require('../util/database.js');
const bcrypt = require("bcryptjs");

/*
* Historia de usuario 2.7 - Ver lista de inmuebles.
* Modelo que contiene todos las consultas a la base de datos necesarias para el despliegue de la lista de inmuebles.
*/
module.exports = class Dashboard {

    /*
     * Obtener la lista total de usuarios del sistema para la lista.
     * @return JSON -> Lista de usuarios
     */
    static fetchAllUsers() {
        return db.execute(
            'SELECT U.idUsuario,U.nombreUsuario,U.apellidosUsuario,R.nombreRol FROM usuario U JOIN rol R ON U.idRol = R.idRol WHERE U.activoUsuario=1'
        )
    }
     /*
     * Obtener la lista total de propiedades del sistema para la lista.
     * @return JSON -> Lista de propiedades
     */
        static fetchAllPropiedades() {
          return db.execute(
              'SELECT I.idInmueble,I.nombreInmueble,U.nombreUsuario as nombresAgente,U.apellidosUsuario as apellidosAgente,X.nombreUsuario as nombresArrendador,X.apellidosUsuario as apellidosArrendador,I.idTipoMovimiento,I.activoInmueble FROM inmueble I JOIN usuario U ON U.idUsuario = I.idAgenteAsignado JOIN usuario X ON X.idUsuario = I.idArrendador'
          )
      }
    
 /*
 * Actualizar rol del usuario en cuestión.
 * @param idUsuario: String -> Concatenación del id del usuario y del rol que este futuramente tendrá
 */
    static updateUserRol(idUsuario,idRol) {
        //Separación del id en dos variables para ejecutar la query.
        return db.execute(
            'UPDATE usuario SET idRol=? WHERE idUsuario=?', [idRol, idUsuario]
        );
    }
    /*
 * Actualizar encargado de la propiedad elegida.
 * @param idAgente: String -> Agente escogido para la propiedad.
 * @param idPropiedad: String -> Propiedad escogida para actualizar su encargado.
 */
    static updateEncargadoPropiedad(idAgente, idPropiedad) {
      return db.execute(
          'UPDATE inmueble SET idAgenteAsignado=? WHERE idInmueble=?', [idAgente, idPropiedad]
      );
  }
    
    /*
     * Borrado del usuario solicitado.
     * @param idUsuario: String -> Id del usuario que será eliminado
     */
    static deleteUser(idUsuario) {
        return db.execute(
            'UPDATE usuario SET activoUsuario=0 WHERE idUsuario=?', [idUsuario]
        )
    }

 /**
 * Obtención de agentes disponibles
 */
    static getAgentes(){
      return db.execute(
          'SELECT U.idUsuario, U.nombreUsuario as nombresAgente, U.apellidosUsuario as apellidosAgente FROM usuario U where U.idRol=1 OR U.idRol=2'
      ).then(([rows, fielData]) => {
          return rows
      })
  }
  
  /*
   * Obtener la lista total de roles del sistema para la lista.
   * @return JSON -> Lista de roles
   */
  static fetchAllRoles() {
    return db.execute(
      'SELECT * FROM rol'
    )
  }
 /*
   * Encontrar un correo de usuario en la base de datos.
   * @param emailUsuario: String -> Correo del usuario que se desea encontrar
   */
  static findOne(emailUsuario) {
    return db.execute("SELECT * FROM usuario WHERE emailUsuario=?", [
      emailUsuario,
    ]);
  }

  /*
   * Revisión de cantidad de inmuebles asignados 
   * @param idUsuario: String -> Id del usuario que será revisado
   */
  static checkUser(idUsuario) {
    return db.execute(
      'SELECT COUNT(idAgenteAsignado) as primera FROM inmueble where activoInmueble=1 AND (idAgenteAsignado=? OR idArrendador=?)', [idUsuario, idUsuario]
    ).then(([rows, fielData]) => {
      return rows[0].primera
    })
  }
  /*
* Revisión de cantidad de trámites de cliente
* @param idUsuario: String -> Id del usuario que será revisado
*/
  static checkUser2(idUsuario) {
    return db.execute(
      'SELECT COUNT(idCliente) as segunda FROM tramite where idCliente=? AND activoTramite=1', [idUsuario]
    ).then(([rows, fielData]) => {
      return rows[0].segunda
    })
  }
  /*
* Revisión de cantidad de trámites de arrendador
* @param idUsuario: String -> Id del usuario que será revisado
*/
  static checkUser3(idUsuario) {
    return db.execute(
      'SELECT COUNT(idArrendador) as tercera FROM tramite where idArrendador=? AND activoTramite=1', [idUsuario]
    ).then(([rows, fielData]) => {
      return rows[0].tercera
    })
  }

   /*
* Registrar un nuevo usuario en el sistema por parte del administrador.
* @param nombreUsuario: String -> Nombre del usuario
* @param apellidosUsuario: String -> Apellidos del usuario
* @param passwordUsuario: String -> Contraseña del usuario
* @param telefonoUsuarioString: String -> Teléfono del usuario
* @param emailUsuario: String -> Correo electrónico del usuario
* @param estadoCivilUsuario: String -> Estado civil del usuario
* @param ocupacionUsuario: String -> Ocupación del usuario
* @param activoUsuarioString: String -> Estado de activo del usuario
* @param idRolString: String -> Id del rol del usuario
* @param idFotoString: String -> Id de la foto del usuario
*/


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

    static fetchAllCategories() {
        return db.execute(
            'SELECT * FROM categoria'
        )
    }

    static fetchAgents() {
        return db.execute(
            'SELECT * FROM usuario WHERE idRol=1 OR idROL=2'
        )
    }

    static fetchClients() {
        return db.execute(
            'SELECT * FROM usuario WHERE idRol=3'
        )
    }

    static insertDisabledRegister(idCategoria,idUsuario) {
        return db.execute(
            'INSERT INTO inmueble(idAgenteAlta,idAgenteAsignado,idCategoria,idTipoMovimiento,nombreInmueble,descInmueble,precioVentaInmueble,precioRentaInmueble,activoInmueble,fechaRegistroInmueble) VALUES (?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP())',
            [idUsuario,idUsuario,idCategoria,1,"Registro vacio","Registro vacio",0,0,0]
        )
    }

    static getLastDisabledRegisterID(){
        return db.execute(
            'SELECT idInmueble FROM inmueble WHERE activoInmueble = 0 ORDER BY idInmueble DESC LIMIT 1'
        );
    }

    static fetchAllMovements(){
        return db.execute(
            'SELECT * FROM tipo_movimiento'
        );
    }

    static registerImage(idInmueble,photoKey){
        const fullImage = "s3://kiarabienesraices/"+photoKey;
        return db.execute(
            'CALL registerImage (?,?)',
            [fullImage,idInmueble]
        );
    }

    static deleteInmuebleById(idInmueble){
        return db.execute(
            'DELETE FROM inmueble WHERE idInmueble = ?',
            [idInmueble]
        );
    }

    static activateInmuebleCasa(
        titulo,
        id_agente,
        id_arrendador,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2terreno,
        niveles,
        mediosBanios,
        cuotaMantenimiento,
        fechaConstruccion,
        usoSuelo,
        ubicado,
        tipoGas,
        m2construccion,
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
        idInmueble
    ){
        return db.execute(
            'UPDATE inmueble SET nombreInmueble=?,idAgenteAsignado=?,idArrendador=?, idTipoMovimiento=?,linkVideoInmueble=?,precioVentaInmueble=?,precioRentaInmueble=?,m2TerrenoInmueble=?,nivelesInmueble=?,mediosBaniosInmueble=?,cuotaMantenimientoInmueble=?,fechaConstruccionInmueble=?,usoSueloInmueble=?,enPrivadaInmueble=?,tipoGasInmueble=?, m2ConstruidosInmueble=?, recamarasInmueble=?, estacionamientosInmueble=?,baniosInmueble=?, descInmueble=?, cocinaInmueble=?, cisternaInmueble=?, cuartoServicioInmueble=?, salaTVInmueble=?, estudioInmueble=?, roofGardenInmueble=?, areaLavadoInmueble=?, vigilanciaInmueble=?,jardinInmueble=?, bodegaInmueble=?, direccionInmueble=?,linkGoogleMaps=?, activoInmueble=1 WHERE idInmueble = ?',
            [   
                titulo,
                id_agente,
                id_arrendador,
                tipoMovimiento,
                linkVideo,
                precioVenta,
                precioRenta,
                m2terreno,
                niveles,
                mediosBanios,
                cuotaMantenimiento,
                fechaConstruccion,
                usoSuelo,
                ubicado,
                tipoGas,
                m2construccion,
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
                idInmueble
            ]
        );
    }

    static activateInmuebleLocal(
        titulo,
        id_agente,
        id_arrendador,
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
    ){
        return db.execute(
            'UPDATE inmueble SET nombreInmueble=?, idAgenteAsignado=?,idArrendador=?, idTipoMovimiento=?,linkVideoInmueble=?,precioVentaInmueble=?,precioRentaInmueble=?,m2TerrenoInmueble=?,m2ConstruidosInmueble=?,medidaFrenteInmueble=?,medidaFondoInmueble=?,nivelesInmueble=?,cuartosPrivadosInmueble=?,mediosBaniosInmueble=?,usoSueloInmueble=?,enPrivadaInmueble=?,cuotaMantenimientoInmueble=?,cocinaInmueble=?,cisternaInmueble=?,cuartoServicioInmueble=?,fechaConstruccionInmueble=?,vigilanciaInmueble=?,tipoGasInmueble=?,estacionamientosInmueble=?,estacionamientosInmueble=?,baniosInmueble=?,descInmueble=?, direccionInmueble=?, linkGoogleMaps=?, activoInmueble=1 WHERE idInmueble = ?',
            [   
                titulo,
                id_agente,
                id_arrendador,
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
            ]
        );
    }

    static changeInmuebleTerreno(
        titulo,
        id_agente,
        id_arrendador,
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
            "UPDATE inmueble SET nombreInmueble=?,idAgenteAsignado=?,idArrendador=?,idTipoMovimiento=?, linkVideoInmueble=?, precioVentaInmueble=?, precioRentaInmueble=?, m2TerrenoInmueble=?, m2ConstruidosInmueble=?, medidasFrenteInmueble=?, medidasFondoInmueble=?, usoSueloInmueble=?, enPrivadaInmueble=?, servicioAguaInmueble=?, servicioLuzInmueble=?, servicioDrenajeInmueble=?, tipoSueloInmueble=?, cuotaMantenimientoInmueble=?, vigilanciaInmueble=?, descInmueble=?, direccionInmueble=?, linkGoogleMaps=? WHERE idInmueble = ?",
            [
            titulo,
            id_agente,
            id_arrendador,
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
        ]
        );
    }

    static changeInmuebleBodega(
        titulo,
        id_agente,
        id_arrendador,
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
        ){
        return db.execute(
            "UPDATE inmueble SET nombreInmueble=?,idAgenteAsignado=?, idArrendador=?,idTipoMovimiento=?, linkVideoInmueble=?, precioVentaInmueble=?, precioRentaInmueble=?, m2TerrenoInmueble=?, m2ConstruidosInmueble=?, medidasFrenteInmueble=?, medidasFondoInmueble=?, nivelesInmueble=?, cuartosPrivadosInmueble=?, mediosBaniosInmueble=?, estacionamientosInmueble=?, usoSueloInmueble=?, enPrivadaInmueble=?, cuotaMantenimientoInmueble=?, cocinaInmueble=?, cisternaInmueble=?, fechaConstruccionInmueble=?, vigilanciaInmueble=?, generadorElectricoInmueble=?, andenCargaInmueble=?, oficinaInmueble=?, patioManiobrasInmueble=?, murosInmueble=?, alturaInmueble=?, tipoPisoInmueble=?, tipoLuzInmueble=?, baniosInmueble=?, descInmueble=?, direccionInmueble=?, linkGoogleMaps=?, activoInmueble=1 WHERE idInmueble=?",
            [
            titulo,
            id_agente,
            id_arrendador,
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
        ]
        );
    }

    static changeInmuebleOficina(
        titulo,
        id_agente,
        id_arrendador,
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
        desc,
        direccion,
        linkMaps,
        idInmueble
        ) {
        return db.execute(
            "UPDATE inmueble SET nombreInmueble=?,  idAgenteAsignado=?,idArrendador=?,idTipoMovimiento=?, linkVideoInmueble=?, precioVentaInmueble=?, precioRentaInmueble=?, m2TerrenoInmueble=?, m2ConstruidosInmueble=?, nivelesInmueble=?, cuartosPrivadosInmueble=?, mediosBaniosInmueble=?, usoSueloInmueble=?, enPrivadaInmueble=?, cuotaMantenimientoInmueble=?, cocinaInmueble=?, cisternaInmueble=?, fechaConstruccionInmueble=?, vigilanciaInmueble=?, estacionamientosInmueble=?, baniosInmueble=?, descInmueble=?, direccionInmueble=?,  linkGoogleMaps=?, activoInmueble=1 WHERE idInmueble=?",
        [
            titulo,
            id_agente,
            id_arrendador,
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
            desc,
            direccion,
            linkMaps,
            idInmueble,
        ]
        );
    }
    

    static activateInmuebleOtro(
        titulo,
        id_agente,
        id_arrendador,
        linkVideo,
        tipoMovimiento,
        precioVenta,
        precioRenta,
        m2terreno,
        m2construccion,
        niveles,
        numRecamaras,
        cuartosPrivados,
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
    ){
        return db.execute(
            "UPDATE inmueble SET nombreInmueble=?,  idAgenteAsignado=?,idArrendador=?,linkVideoInmueble=?, idTipoMovimiento=?, precioVentaInmueble=?, precioRentaInmueble=?, m2TerrenoInmueble=?, m2ConstruidosInmueble=?, nivelesInmueble=?, recamarasInmueble=?, cuartosPrivadosInmueble=?, mediosBaniosInmueble=?, usoSueloInmueble=?, enPrivadaInmueble=?, cuotaMantenimientoInmueble=?, cocinaInmueble=?, cisternaInmueble=?, vigilanciaInmueble=?, estacionamientosInmueble=?, baniosInmueble=?, descInmueble=?, direccionInmueble=?, linkGoogleMaps=? WHERE idInmueble=?",
            [   
                titulo,
                id_agente,
                id_arrendador,
                linkVideo,
                tipoMovimiento,
                precioVenta,
                precioRenta,
                m2terreno,
                m2construccion,
                niveles,
                numRecamaras,
                cuartosPrivados,
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
