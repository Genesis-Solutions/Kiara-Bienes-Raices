const db = require('../util/database.js');

module.exports = class Dashboard{

    static fetchAllUsers() {
        return db.execute(
            'SELECT U.idUsuario,U.nombreUsuario,U.apellidosUsuario,R.nombreRol FROM usuario U JOIN rol R ON U.idRol = R.idRol'
        )
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

    static insertDisabledRegister(idCategoria,idUsuario) {
        return db.execute(
            'INSERT INTO inmueble(idAgenteAlta,idAgenteAsignado,idCategoria,idTipoMovimiento,nombreInmueble,descInmueble,precioVentaInmueble,precioRentaInmueble,activoInmueble) VALUES (?,?,?,?,?,?,?,?,?)',
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
            'UPDATE inmueble SET nombreInmueble=?, idAgenteAsignado=?,idTipoMovimiento=?,linkVideoInmueble=?,precioVentaInmueble=?,precioRentaInmueble=?,m2TerrenoInmueble=?,nivelesInmueble=?,mediosBaniosInmueble=?,cuotaMantenimientoInmueble=?,fechaConstruccionInmueble=?,usoSueloInmueble=?,enPrivadaInmueble=?,tipoGasInmueble=?, m2ConstruidosInmueble=?, recamarasInmueble=?, estacionamientosInmueble=?,baniosInmueble=?, descInmueble=?, cocinaInmueble=?, cisternaInmueble=?, cuartoServicioInmueble=?, salaTVInmueble=?, estudioInmueble=?, roofGardenInmueble=?, areaLavadoInmueble=?, vigilanciaInmueble=?,jardinInmueble=?, bodegaInmueble=?, direccionInmueble=?,linkGoogleMaps=?,activoInmueble=1 WHERE idInmueble = ?',
            [   
                titulo,
                id_agente,
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
        idInmueble
    ){
        return db.execute(
            'UPDATE inmueble SET nombreInmueble=?,idTipoMovimiento=?,linkVideoInmueble=?,precioVentaInmueble=?,precioRentaInmueble=?,m2TerrenoInmueble=?,m2ConstruidosInmueble=?,medidaFrenteInmueble=?,medidaFondoInmueble=?,nivelesInmueble=?,cuartosPrivadosInmueble=?,mediosBaniosInmueble=?,estacionamientosInmueble=?,usoSueloInmueble=?,enPrivadaInmueble=?,cuotaMantenimientoInmueble=?,cocinaInmueble=?,cisternaInmueble=?,cuartoServicioInmueble=?,fechaConstruccionInmueble=?,vigilanciaInmueble=?,tipoGasInmueble=?,estacionamientosInmueble=?,baniosInmueble=?,descInmueble=? WHERE idInmueble = ?',
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
                idInmueble
            ]
        );
    }

    static activateInmuebleOtro(
        titulo,
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
        estacionamientos,
        banios,
        desc,
        direccion,
        cocina,
        cisterna,
        vigilancia,
        linkMaps,
        idInmueble
    ){
        return db.execute(
            "UPDATE inmueble SET nombreInmueble=?, linkVideoInmueble=?, idTipoMovimiento=?, precioVentaInmueble=?, precioRentaInmueble=?, m2TerrenoInmueble=?, m2ConstruidosInmueble=?, nivelesInmueble=?, recamarasInmueble=?, cuartosPrivadosInmueble=?, mediosBaniosInmueble=?, usoSueloInmueble=?, enPrivadaInmueble=?, cuotaMantenimientoInmueble=?, cocinaInmueble=?, cisternaInmueble=?, vigilanciaInmueble=?, estacionamientosInmueble=?, baniosInmueble=?, descInmueble=?, direccionInmueble=?, linkGoogleMaps=? WHERE idInmueble=?",
            [   
                titulo,
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
                direccion,
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


}