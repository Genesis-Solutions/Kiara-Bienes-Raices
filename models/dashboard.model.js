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
            'INSERT INTO inmueble(idAgenteAlta,idAgenteAsignado,idCategoria,idTipoMovimiento,nombreInmueble,descInmueble,precioVentaInmueble,precioRentaInmueble,coordXInmueble,coordYInmueble,activoInmueble) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
            [idUsuario,idUsuario,idCategoria,1,"Registro vacio","Registro vacio",0,0,0,0,0]
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

    static insertPhoto(photoKey){
        return db.execute(
            'INSERT INTO foto(archivoFoto) VALUES (?)',
            [photoKey]
        );
    }

    static getLastPhotoId(){
        return db.execute(
            'SELECT idFoto FROM foto ORDER BY idInmueble DESC LIMIT 1'
        );
    }

    static insertFotoInmueble(idInmueble,idFoto){
        return db.execute(
            'INSERT INTO inmueble(idFoto,idInmueble) VALUES (?,?)',
            [idInmueble,idFoto]
        );
    }

    static activateInmuebleCasa(
        titulo,
        tipoMovimiento,
        linkVideo,
        precio,
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
        idInmueble
    ){
        console.log("precio",precio);
        return db.execute(
            'UPDATE inmueble SET nombreInmueble=?,idTipoMovimiento=?,linkVideoInmueble=?,precioVentaInmueble=?,precioRentaInmueble=?,m2TerrenoInmueble=?,nivelesInmueble=?,mediosBaniosInmueble=?,cuotaMantenimientoInmueble=?,fechaConstruccionInmueble=?,usoSueloInmueble=?,enPrivadaInmueble=?,tipoGasInmueble=?, m2ConstruidosInmueble=?, recamarasInmueble=?, estacionamientosInmueble=?,baniosInmueble=?, descInmueble=?, cocinaInmueble=?, cisternaInmueble=?, cuartoServicioInmueble=?, salaTVInmueble=?, estudioInmueble=?, roofGardenInmueble=?, areaLavadoInmueble=?, vigilanciaInmueble=?,jardinInmueble=?, bodegaInmueble=? WHERE idInmueble = ?',
            [   
                titulo,
                tipoMovimiento,
                linkVideo,
                precio,
                precio,
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
                idInmueble
            ]
        );
    }

}