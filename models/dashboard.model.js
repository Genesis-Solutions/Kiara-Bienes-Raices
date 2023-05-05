const db = require('../util/database.js');
const bcrypt = require("bcryptjs");

/*
* Historia de usuario 2.7 - Ver lista de inmuebles.
* Modelo que contiene todos las consultas a la base de datos necesarias para el despliegue de la lista de inmuebles.
*/

/*
* Historia de usuario 2.1 - Publicar inmueble.
* Modelo que contiene todos las consultas a la base de datos necesarias para publicar nuevos inmuebles de distintas categorias.
*/

module.exports = class Dashboard {

    /*
     * Obtener la lista total de usuarios del sistema para la lista.
     * @return JSON -> Lista de usuarios
     */
    static fetchAllUsers() {
        return db.execute(
            'SELECT U.idUsuario,U.nombreUsuario,U.apellidosUsuario,R.nombreRol FROM usuario U JOIN rol R ON U.idRol = R.idRol WHERE U.activoUsuario=1'
        );
    }

    /*
     * Obtener la lista total de propiedades del sistema para la lista.
     * @return JSON -> Lista de propiedades
     */
    static fetchAllPropiedades() {
            return db.execute(
            'SELECT I.idInmueble,I.nombreInmueble,U.nombreUsuario as nombresAgente,U.apellidosUsuario as apellidosAgente,X.nombreUsuario as nombresArrendador,X.apellidosUsuario as apellidosArrendador,I.idTipoMovimiento,I.activoInmueble FROM inmueble I JOIN usuario U ON U.idUsuario = I.idAgenteAsignado JOIN usuario X ON X.idUsuario = I.idArrendador'
        );
    }

    /*
    * Actualizar rol del usuario en cuestión.
    * @param idUsuario: String -> Concatenación del id del usuario y del rol que este futuramente tendrá
    */
    static updateUserRol(idUsuario,idRol) {
        //Separación del id en dos variables para ejecutar la query.
        return db.execute(
            'UPDATE usuario SET idRol=? WHERE idUsuario=?', 
            [idRol, idUsuario]
        );
    }

    /*
    * Actualizar encargado de la propiedad elegida.
    * @param idAgente: String -> Agente escogido para la propiedad.
    * @param idPropiedad: String -> Propiedad escogida para actualizar su encargado.
    */
    static updateEncargadoPropiedad(idAgente,idPropiedad) {
        return db.execute(
            'UPDATE inmueble SET idAgenteAsignado=? WHERE idInmueble=?',
            [idAgente, idPropiedad]
        );
    }

    /*
     * Borrado del usuario solicitado.
     * @param idUsuario: String -> Id del usuario que será eliminado
     */
    static deleteUser(idUsuario) {
        return db.execute(
            'UPDATE usuario SET activoUsuario=0 WHERE idUsuario=?', 
            [idUsuario]
        );
    }

    /*
    * Obtención de agentes disponibles
    */
    static getAgentes() {
        return db.execute(
            'SELECT U.idUsuario, U.nombreUsuario as nombresAgente, U.apellidosUsuario as apellidosAgente FROM usuario U where U.idRol=1 OR U.idRol=2'
        ).then(([rows, fielData]) => {
            return rows
        });
    }

    /*
    * Obtener la lista total de roles del sistema para la lista.
    * @return JSON -> Lista de roles
    */
    static fetchAllRoles() {
        return db.execute(
            'SELECT * FROM rol'
        );
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
            'SELECT COUNT(idAgenteAsignado) as primera FROM inmueble where activoInmueble=1 AND (idAgenteAsignado=? OR idArrendador=?)', 
            [idUsuario, idUsuario]
        ).then(([rows, fielData]) => {
            return rows[0].primera
        });
    }

    /*
    * Revisión de cantidad de trámites de cliente
    * @param idUsuario: String -> Id del usuario que será revisado
    */
    static checkUser2(idUsuario) {
        return db.execute(
            'SELECT COUNT(idCliente) as segunda FROM tramite where idCliente=? AND activoTramite=1', 
            [idUsuario]
        ).then(([rows, fielData]) => {
            return rows[0].segunda
        });
    }

    /*
    * Revisión de cantidad de trámites de arrendador
    * @param idUsuario: String -> Id del usuario que será revisado
    */
    static checkUser3(idUsuario) {
        return db.execute(
            'SELECT COUNT(idArrendador) as tercera FROM tramite where idArrendador=? AND activoTramite=1', 
            [idUsuario]
        ).then(([rows, fielData]) => {
        return rows[0].tercera
        });
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

    /*
    Retorna todas las categorías registradas en la base de datos
    @returns {Promise} Promesa que resuelve con un arreglo de objetos JSON, donde cada objeto representa una categoría.
    */
    static fetchAllCategories() {
        return db.execute(
            'SELECT * FROM categoria'
        );
    }

    /*
    Retorna todos los agentes y administradores registrados en la base de datos.
    @return {Promise} Promesa que resuelve con un arreglo de objetos JSON, donde cada objeto representa un agente o administrador.
    */
    static fetchAgents() {
        return db.execute(
            'SELECT * FROM usuario WHERE idRol=1 OR idRol=2'
        );
    }

    /*
    Retorna todos los clientes/propietarios registrados en la base de datos.
    @return {Promise} Promesa que resuelve con un arreglo de objetos JSON, donde cada objeto representa un cliente/propietario.
    */
    static fetchClients() {
        return db.execute(
            'SELECT * FROM usuario WHERE idRol=3'
        );
    }

    /*
    Inserta un registro vacío de un inmueble con los valores por defecto.
    @param {number} idCategoria - Identificador de la categoría del inmueble.
    @param {number} idUsuario - Identificador del usuario que realiza el registro.
    @returns {Promise} Promesa que se resuelve con la ejecución de la consulta SQL.
    */
    static insertDisabledRegister(idCategoria,idUsuario) {
        return db.execute(
            'INSERT INTO inmueble(idAgenteAlta,idAgenteAsignado,idCategoria,idTipoMovimiento,nombreInmueble,descInmueble,precioVentaInmueble,precioRentaInmueble,activoInmueble,fechaRegistroInmueble) VALUES (?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP())',
            [idUsuario,idUsuario,idCategoria,1,"Registro vacio","Registro vacio",0,0,0]
        );
    }

    /*
    Devuelve el id del último registro de inmueble desactivado.
    @return {Promise<Array[]>} - Promesa que resuelve en una matriz de un elemento que contiene un objeto con el idInmueble del último registro de inmueble desactivado.
    */
    static getLastDisabledRegisterID(){
        return db.execute(
            'SELECT idInmueble FROM inmueble WHERE activoInmueble = 0 ORDER BY idInmueble DESC LIMIT 1'
        );
    }

    /*
    Retorna una lista con todos los tipos de movimiento disponibles.
    @return {Promise} Promesa que resuelve con un objeto que contiene todos los tipos de movimiento disponibles.
    */
    static fetchAllMovements(){
        return db.execute(
            'SELECT * FROM tipo_movimiento'
        );
    }

    /*
    Registra la imagen de un inmueble en la base de datos.
    @param {number} idInmueble - El ID del inmueble al que se le asociará la imagen.
    @param {string} photoKey - La clave de la imagen que se guardará en Amazon S3.
    @returns {Promise} Promesa que devuelve el resultado de la consulta a la base de datos.
    */
    static registerImage(idInmueble,photoKey){
        const fullImage = "s3://kiarabienesraices/"+photoKey;
        return db.execute(
            'CALL registerImage (?,?)',
            [fullImage,idInmueble]
        );
    }

    /*
    Elimina un registro de inmueble de la base de datos mediante el identificador del inmueble.
    @param {number} idInmueble - El identificador del inmueble que se desea eliminar.
    @returns {Promise} - Retorna una promesa que se resuelve cuando se ha eliminado el registro del inmueble de la base de datos.
    */
    static deleteInmuebleById(idInmueble){
        return db.execute(
            'DELETE FROM inmueble WHERE idInmueble = ?',
            [idInmueble]
        );
    }

    /*
    Actualiza los datos de una casa o departamento en la base de datos y la activa.
    @param {string} titulo - Título de la propiedad.
    @param {number} id_agente - Identificador del agente que da de alta la propiedad.
    @param {number} id_arrendador - Identificador del arrendador de la propiedad.
    @param {number} tipoMovimiento - Identificador del tipo de movimiento de la propiedad.
    @param {string} linkVideo - URL del video de la propiedad.
    @param {number} precioVenta - Precio de venta de la propiedad.
    @param {number} precioRenta - Precio de renta de la propiedad.
    @param {number} m2terreno - Metros cuadrados de terreno de la propiedad.
    @param {number} niveles - Número de niveles de la propiedad.
    @param {number} mediosBanios - Número de medios baños de la propiedad.
    @param {number} cuotaMantenimiento - Cuota de mantenimiento de la propiedad.
    @param {string} fechaConstruccion - Fecha de construcción de la propiedad.
    @param {string} usoSuelo - Uso de suelo de la propiedad.
    @param {number} ubicado - 1 si la propiedad está en privada, 0 si no lo está.
    @param {string} tipoGas - Tipo de gas utilizado en la propiedad.
    @param {number} m2construccion - Metros cuadrados de construcción de la propiedad.
    @param {number} recamaras - Número de recámaras de la propiedad.
    @param {number} estacionamientos - Número de estacionamientos de la propiedad.
    @param {number} banios - Número de baños de la propiedad.
    @param {string} desc - Descripción de la propiedad.
    @param {number} cocina - 1 si la propiedad tiene cocina, 0 si no la tiene.
    @param {number} cisterna - 1 si la propiedad tiene cisterna, 0 si no la tiene.
    @param {number} cuartoServicio - 1 si la propiedad tiene cuarto de servicio, 0 si no lo tiene.
    @param {number} salaTV - 1 si la propiedad tiene sala de TV, 0 si no la tiene.
    @param {number} estudio - 1 si la propiedad tiene estudio, 0 si no lo tiene.
    @param {number} roofGarden - 1 si la propiedad tiene roof garden, 0 si no lo tiene.
    @param {number} areaLavado - 1 si la propiedad tiene área de lavado, 0 si no lo tiene.
    @param {number} vigilancia - 1 si la propiedad tiene vigilancia, 0 si no la tiene.
    @param {number} jardin - 1 si la propiedad tiene jardín, 0 si no lo tiene.
    @param {number} bodega - 1 si la propiedad tiene bodega, 0 si no la tiene.
    @param {string} direccion - Dirección de la propiedad.
    @param {string} linkMaps - URL de Google Maps de la propiedad.
    @param {number} idInmueble - Identificador de la propiedad.
    @returns {Promise} - Promesa que devuelve el resultado de la operación de actualización en la base de datos.
    */
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

    /*
    Actualiza un inmueble local en la base de datos y lo activa para su publicación.
    @param {string} titulo El título del inmueble.
    @param {number} id_agente El identificador del agente asignado al inmueble.
    @param {number} id_arrendador El identificador del arrendador del inmueble.
    @param {number} tipoMovimiento El tipo de movimiento del inmueble (venta o renta).
    @param {string} linkVideo El enlace del video del inmueble.
    @param {number} precioVenta El precio de venta del inmueble.
    @param {number} precioRenta El precio de renta del inmueble.
    @param {number} m2terreno Los metros cuadrados de terreno del inmueble.
    @param {number} m2construccion Los metros cuadrados de construcción del inmueble.
    @param {number} medidaFrente La medida del frente del inmueble.
    @param {number} medidaFondo La medida del fondo del inmueble.
    @param {number} niveles El número de niveles del inmueble.
    @param {number} cuartosPrivadosInmueble El número de cuartos privados del inmueble.
    @param {number} mediosBanios El número de medios baños del inmueble.
    @param {string} usoSuelo El uso de suelo del inmueble.
    @param {number} ubicado La ubicación del inmueble.
    @param {number} cuotaMantenimiento La cuota de mantenimiento del inmueble.
    @param {number} cocina Indica si el inmueble cuenta con cocina.
    @param {number} cisterna Indica si el inmueble cuenta con cisterna.
    @param {number} cuartoServicio Indica si el inmueble cuenta con cuarto de servicio.
    @param {number} fechaConstruccion La fecha de construcción del inmueble.
    @param {number} vigilancia Indica si el inmueble cuenta con servicio de vigilancia.
    @param {string} tipoGas El tipo de gas que utiliza el inmueble.
    @param {number} estacionamientos El número de estacionamientos del inmueble.
    @param {number} banios El número de baños del inmueble.
    @param {string} desc La descripción del inmueble.
    @param {string} direccion La dirección del inmueble.
    @param {string} linkMaps El enlace de Google Maps del inmueble.
    @param {number} idInmueble El identificador del inmueble a actualizar.
    @return El resultado de la ejecución de la consulta SQL.
    */
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

    /*
    Actualiza la información de un inmueble tipo terreno en la base de datos.
    @param {string} titulo El nombre del inmueble.
    @param {number} id_agente El ID del agente asignado al inmueble.
    @param {number} id_arrendador El ID del arrendador del inmueble.
    @param {number} tipoMovimiento El tipo de movimiento (venta o renta) del inmueble.
    @param {string} linkVideo El enlace del video del inmueble.
    @param {number} precioVenta El precio de venta del inmueble.
    @param {number} precioRenta El precio de renta del inmueble.
    @param {number} m2Terreno La cantidad de metros cuadrados de terreno del inmueble.
    @param {number} m2Construccion La cantidad de metros cuadrados de construcción del inmueble.
    @param {number} medidaFrente La medida de frente del terreno.
    @param {number} medidaFondo La medida de fondo del terreno.
    @param {string} usoSuelo El uso del suelo del inmueble.
    @param {number} ubicado La ubicación del inmueble (en privada o no).
    @param {number} servicioAgua Indica si el inmueble tiene servicio de agua.
    @param {number} servicioLuz Indica si el inmueble tiene servicio de luz.
    @param {number} servicioDrenaje Indica si el inmueble tiene servicio de drenaje.
    @param {string} tipoSuelo El tipo de suelo del inmueble.
    @param {number} cuotaMantenimiento La cuota de mantenimiento del inmueble (si aplica).
    @param {number} vigilancia Indica si el inmueble cuenta con servicio de vigilancia.
    @param {string} desc Una descripción del inmueble.
    @param {string} direccion La dirección del inmueble.
    @param {string} linkMaps El enlace de Google Maps de la ubicación del inmueble.
    @param {number} idInmueble El ID del inmueble que se desea actualizar.
    @return El resultado de la ejecución de la consulta SQL en la base de datos.
    */
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

    /*
    Actualiza los datos de un inmueble del tipo Bodega en la base de datos.
    @param {string} titulo Título del inmueble.
    @param {number} id_agente ID del agente asignado al inmueble.
    @param {number} id_arrendador ID del arrendador del inmueble.
    @param {number} tipoMovimiento ID del tipo de movimiento del inmueble (venta, renta, etc).
    @param {string} linkVideo URL del video del inmueble.
    @param {number} precioVenta Precio de venta del inmueble.
    @param {number} precioRenta Precio de renta del inmueble.
    @param {number} m2Terreno Área del terreno en metros cuadrados.
    @param {number} m2Construccion Área construida en metros cuadrados.
    @param {number} medidaFrente Medida del frente del terreno.
    @param {number} medidaFondo Medida del fondo del terreno.
    @param {number} niveles Número de niveles del inmueble.
    @param {number} cuartosPrivadosInmueble Número de cuartos privados en el inmueble.
    @param {number} mediosBanios Número de medios baños en el inmueble.
    @param {number} estacionamientos Número de estacionamientos en el inmueble.
    @param {string} usoSuelo Uso de suelo permitido para el inmueble.
    @param {number} ubicado Ubicación del inmueble.
    @param {number} cuotaMantenimiento Cuota de mantenimiento mensual del inmueble.
    @param {number} cocina Indica si el inmueble cuenta con cocina.
    @param {number} cisterna Indica si el inmueble cuenta con cisterna.
    @param {number} fechaConstruccion Fecha de construcción del inmueble.
    @param {number} vigilancia Indica si el inmueble cuenta con servicio de vigilancia.
    @param {number} generadorElectrico Indica si el inmueble cuenta con generador eléctrico.
    @param {number} andenCarga Indica si el inmueble cuenta con andén de carga.
    @param {number} oficina Indica si el inmueble cuenta con oficina.
    @param {number} patioManiobras Indica si el inmueble cuenta con patio de maniobras.
    @param {number} muros Tipo de muros del inmueble.
    @param {number} altura Altura del inmueble.
    @param {number} tipoPiso Tipo de piso del inmueble.
    @param {string} tipoLuz Tipo de luz del inmueble.
    @param {number} banios Número de baños en el inmueble.
    @param {string} desc Descripción del inmueble.
    @param {string} direccion Dirección del inmueble.
    @param {string} linkMaps URL de Google Maps del inmueble.
    @param {number} idInmueble ID del inmueble a actualizar.
    @return El resultado de la ejecución de la consulta SQL para actualizar el inmueble.
    */
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

    /*
    Actualiza los datos de una oficina en la base de datos
    @param {string} titulo El nombre de la oficina
    @param {number} id_agente El identificador del agente asignado a la oficina
    @param {number} id_arrendador El identificador del arrendador de la oficina
    @param {number} tipoMovimiento El tipo de movimiento que se hará con la oficina (venta o renta)
    @param {string} linkVideo El enlace del video de la oficina
    @param {number} precioVenta El precio de venta de la oficina
    @param {number} precioRenta El precio de renta de la oficina
    @param {number} m2Terreno El área del terreno de la oficina en metros cuadrados
    @param {number} m2Construccion El área construida de la oficina en metros cuadrados
    @param {number} niveles El número de niveles de la oficina
    @param {number} cuartosPrivadosInmueble El número de cuartos privados de la oficina
    @param {number} mediosBanios El número de medios baños de la oficina
    @param {string} usoSuelo El uso de suelo de la oficina
    @param {number} ubicado La ubicación de la oficina
    @param {number} cuotaMantenimiento La cuota de mantenimiento de la oficina
    @param {number} cocina La presencia de una cocina en la oficina (1 si tiene, 0 si no)
    @param {number} cisterna La presencia de una cisterna en la oficina (1 si tiene, 0 si no)
    @param {number} fechaConstruccion Fecha de construcción del inmueble.
    @param {number} vigilancia La presencia de vigilancia en la oficina (1 si tiene, 0 si no)
    @param {number} estacionamientos El número de estacionamientos de la oficina
    @param {number} banios El número de baños de la oficina
    @param {string} desc La descripción de la oficina
    @param {string} direccion La dirección de la oficina
    @param {string} linkMaps El enlace de Google Maps de la ubicación de la oficina
    @param {number} idInmueble El identificador de la oficina que se actualizará
    @return El resultado de la ejecución de la consulta UPDATE en la base de datos
    */
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

    /*
    Actualiza la información de un inmueble tipo "otro" en la base de datos y lo activa.
    @param {string} titulo el título del inmueble
    @param {number} id_agente el ID del agente asignado al inmueble
    @param {number} id_arrendador el ID del arrendador del inmueble
    @param {string} linkVideo el enlace del video del inmueble
    @param {number} tipoMovimiento el tipo de movimiento del inmueble (venta o renta)
    @param {number} precioVenta el precio de venta del inmueble
    @param {number} precioRenta el precio de renta del inmueble
    @param {number} m2terreno los metros cuadrados de terreno del inmueble
    @param {number} m2construccion los metros cuadrados construidos del inmueble
    @param {number} niveles el número de niveles del inmueble
    @param {number} numRecamaras el número de recámaras del inmueble
    @param {number} cuartosPrivados el número de cuartos privados del inmueble
    @param {number} mediosBanios el número de medios baños del inmueble
    @param {string} usoSuelo el uso de suelo del inmueble
    @param {number} ubicado si el inmueble está en una privada o no
    @param {number} cuotaMantenimiento la cuota de mantenimiento del inmueble
    @param {number} cocina si el inmueble tiene cocina o no
    @param {number} cisterna si el inmueble tiene cisterna o no
    @param {number} vigilancia si el inmueble cuenta con vigilancia o no
    @param {number} estacionamientos el número de estacionamientos del inmueble
    @param {number} banios el número de baños completos del inmueble
    @param {string} desc la descripción del inmueble
    @param {string} direccion la dirección del inmueble
    @param {string} linkMaps el enlace de Google Maps del inmueble
    @param {number} idInmueble el ID del inmueble a actualizar
    @return el resultado de la ejecución del comando UPDATE en la base de datos
    */
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
