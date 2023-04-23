// Base controlador
const path = require('path');
const Inmueble = require('../models/inmueble.model');

// exports.getInmueble = (request, response, next) => {
//     response.render('inmueble');
// }

exports.getInmueble = async(req, res, next) => {
    const inmueble = await Inmueble.getInmueble(req.params.idInmueble);
    const agente = await Inmueble.getAgentInfo(inmueble[0][0].idInmueble);
    console.log(agente[0][0].nombreUsuario);
    console.log(inmueble[0][0].nombreInmueble);

    const amenidades = [
        {m2Terreno: inmueble[0][0].m2TerrenoInmueble, name: inmueble[0][0].m2TerrenoInmueble},
        {m2Construidos: inmueble[0][0].m2ConstruidosInmueble, name: inmueble[0][0].m2ConstruidosInmueble },
        {medidasdelacasa: inmueble[0][0].medidasFrenteInmueble, name: inmueble[0][0].medidasFrenteInmueble},
        {medidasFondo: inmueble[0][0].medidasFondoInmueble, name: inmueble[0][0].medidasFondoInmueble},
        {nivelesInmueble: inmueble[0][0].nivelesInmueble, name: inmueble[0][0].nivelesInmueble},
        {recamaras: inmueble[0][0].recamarasInmueble, name: inmueble[0][0].recamarasInmueble},
        {cuartosPrivados: inmueble[0][0].cuartosPrivadosInmueble, name: inmueble[0][0].cuartosPrivadosInmueble},
        {banios: inmueble[0][0].baniosInmueble, name: inmueble[0][0].baniosInmueble},
        {mediosBanios: inmueble[0][0].mediosBaniosInmueble, name: inmueble[0][0].mediosBaniosInmueble},
        {estacionamientos: inmueble[0][0].estacionamientosInmueble, name: inmueble[0][0].estacionamientosInmueble},
        {usoSuelo: inmueble[0][0].usoSueloInmueble, name: inmueble[0][0].usoSueloInmueble},
        {enPrivada: inmueble[0][0].enPrivadaInmueble, name: inmueble[0][0].enPrivadaInmueble},
        {servicioAgua: inmueble[0][0].servicioAguaInmueble, name: inmueble[0][0].servicioAguaInmueble},
        {servicioLuz: inmueble[0][0].servicioLuzInmueble, name: inmueble[0][0].servicioLuzInmueble},
        {servicioDrenaje: inmueble[0][0].servicioDrenajeInmueble, name: inmueble[0][0].servicioDrenajeInmueble}
    ]

    const amenidades2 = [
        {tipoSuelo: inmueble[0][0].tipoSueloInmueble},
        {cuotaMantenimiento: inmueble[0][0].cuotaMantenimientoInmueble},
        {cocina: inmueble[0][0].cocinaInmueble},
        {cisterna: inmueble[0][0].cisternaInmueble},
        {cuartoServicio: inmueble[0][0].cuartoServicioInmueble},
        {salaTV: inmueble[0][0].salaTVInmueble},
        {fechaConstruccion: inmueble[0][0].fechaConstruccionInmueble},
        {estudio: inmueble[0][0].estudioInmueble},
        {roofGarden: inmueble[0][0].roofGardenInmueble},
        {areaLavado: inmueble[0][0].areaLavadoInmueble},
        {vigilancia: inmueble[0][0].vigilanciaInmueble},
        {jardin: inmueble[0][0].jardinInmueble},
        {tipoGas: inmueble[0][0].tipoGasInmueble},
        {bodega: inmueble[0][0].bodegaInmueble}
    ]

    const amenidades3 = [
        {generadorElectrico: inmueble[0][0].generadorElectricoInmueble},
        {tipoPiso: inmueble[0][0].tipoPisoInmueble},
        {andenCarga: inmueble[0][0].andenCargaInmueble},
        {tipoLuz: inmueble[0][0].tipoLuzInmueble},
        {altura: inmueble[0][0].alturaInmueble},
        {oficina: inmueble[0][0].oficinaInmueble},
        {patioManiobras: inmueble[0][0].patioManiobrasInmueble},
        {muros: inmueble[0][0].murosInmueble},
        {coordX: inmueble[0][0].coordXInmueble},
        {coordY: inmueble[0][0].coordYInmueble},
        {fechaRegistro: inmueble[0][0].fechaRegistroInmueble},
        {activo: inmueble[0][0].activoInmueble},
        {direccion: inmueble[0][0].direccionInmueble}
    ]

    const m2Terreno = amenidades.find(item => 'm2Terreno' in item)?.m2Terreno;
    const niveles = amenidades.find(item => 'nivelesInmueble' in item)?.nivelesInmueble;
    console.log("EXISTEE: "+ m2Terreno);
    if(niveles == null){
        console.log("ES NULL");
    } else{
        console.log("Niveles" + niveles);
    }
    var recamarasValue = amenidades.find(item => "recamaras" in item)
    console.log(recamarasValue.recamaras)
   
        
    res.render('inmueble', {
        nombreInmueble: inmueble[0][0].nombreInmueble,
        precioVenta: inmueble[0][0].precioVentaInmueble,
        precioRenta: inmueble[0][0].precioRentaInmueble,
        descripcion: inmueble[0][0].descInmueble,
        linkVideo: inmueble[0][0].linkVideoInmueble,
        idCategoria: inmueble[0][0].idCategoria,
        idTipoMovimiento: inmueble[0][0].idTipoMovimiento,
        amenidades: amenidades,
        amenidades2: amenidades2,
        amenidades3: amenidades3
    });

    












    // else if(inmueble[0][0].idCategoria == 2) {
    //     console.log("Es un Departamento");
    //     res.render('departamento', {
    //         nombreInmueble: inmueble[0][0].nombreInmueble,
    //         precioVenta: inmueble[0][0].precioVentaInmueble,
    //         precioRenta: inmueble[0][0].precioRentaInmueble,
    //         descripcion: inmueble[0][0].descInmueble,
    //         linkVideo: inmueble[0][0].linkVideoInmueble,
    //         idCategoria: inmueble[0][0].idCategoria,
    //         idTipoMovimiento: inmueble[0][0].idTipoMovimiento,
    //         amenidades: amenidades,
    //         amenidades2: amenidades2,
    //         amenidades3: amenidades3
    //     });
    // } else if(inmueble[0][0].idCategoria == 3) {
    //     console.log("Es un Local");
    //     res.render('local', {
    //         nombreInmueble: inmueble[0][0].nombreInmueble,
    //         precioVenta: inmueble[0][0].precioVentaInmueble,
    //         precioRenta: inmueble[0][0].precioRentaInmueble,
    //         descripcion: inmueble[0][0].descInmueble,
    //         linkVideo: inmueble[0][0].linkVideoInmueble,
    //         idCategoria: inmueble[0][0].idCategoria,
    //         idTipoMovimiento: inmueble[0][0].idTipoMovimiento,
    //         amenidades: amenidades,
    //         amenidades2: amenidades2,
    //         amenidades3: amenidades3
    //     });
    // } else if(inmueble[0][0].idCategoria == 4) {
    //     console.log("Es un Terreno");
    //     res.render('terreno', {
    //         nombreInmueble: inmueble[0][0].nombreInmueble,
    //         precioVenta: inmueble[0][0].precioVentaInmueble,
    //         precioRenta: inmueble[0][0].precioRentaInmueble,
    //         descripcion: inmueble[0][0].descInmueble,
    //         linkVideo: inmueble[0][0].linkVideoInmueble,
    //         idCategoria: inmueble[0][0].idCategoria,
    //         idTipoMovimiento: inmueble[0][0].idTipoMovimiento,
    //         amenidades: amenidades,
    //         amenidades2: amenidades2,
    //         amenidades3: amenidades3
    //     });
    // } else if(inmueble[0][0].idCategoria == 5) {
    //     console.log("Es una Bodega");
    //     res.render('bodega', {
    //         nombreInmueble: inmueble[0][0].nombreInmueble,
    //         precioVenta: inmueble[0][0].precioVentaInmueble,
    //         precioRenta: inmueble[0][0].precioRentaInmueble,
    //         descripcion: inmueble[0][0].descInmueble,
    //         linkVideo: inmueble[0][0].linkVideoInmueble,
    //         idCategoria: inmueble[0][0].idCategoria,
    //         idTipoMovimiento: inmueble[0][0].idTipoMovimiento,
    //         amenidades: amenidades,
    //         amenidades2: amenidades2,
    //         amenidades3: amenidades3
    //     });
    // } else if(inmueble[0][0].idCategoria == 6) {
    //     console.log("Es una Oficina");
    //     res.render('oficina', {
    //         nombreInmueble: inmueble[0][0].nombreInmueble,
    //         precioVenta: inmueble[0][0].precioVentaInmueble,
    //         precioRenta: inmueble[0][0].precioRentaInmueble,
    //         descripcion: inmueble[0][0].descInmueble,
    //         linkVideo: inmueble[0][0].linkVideoInmueble,
    //         idCategoria: inmueble[0][0].idCategoria,
    //         idTipoMovimiento: inmueble[0][0].idTipoMovimiento,
    //         amenidades: amenidades,
    //         amenidades2: amenidades2,
    //         amenidades3: amenidades3
    //     });
    // } else if(inmueble[0][0].idCategoria == 7) {
    //     console.log("Es un Otro");
    //     res.render('otro', {
    //         nombreInmueble: inmueble[0][0].nombreInmueble,
    //         precioVenta: inmueble[0][0].precioVentaInmueble,
    //         precioRenta: inmueble[0][0].precioRentaInmueble,
    //         descripcion: inmueble[0][0].descInmueble,
    //         linkVideo: inmueble[0][0].linkVideoInmueble,
    //         idCategoria: inmueble[0][0].idCategoria,
    //         idTipoMovimiento: inmueble[0][0].idTipoMovimiento,
    //         amenidades: amenidades,
    //         amenidades2: amenidades2,
    //         amenidades3: amenidades3
    //     });
    // }




    // // Obtener la informacion del inmueble
    // const inmueble = await Inmueble.getInmueble(req.params.idInmueble);

    // // Obtener arreglo de los id de las fotos del inmueble
    // const idFotosInmueble = await Inmueble.getIdFotosInmueble(req.params.idInmueble);

    // // Obtener arreglo de los src de las fotos del inmueble
    // const srcFotosInmueble = []
    
    // for(let i = 0; i < idFotosInmueble.length; i++) {
    //     const src = await Inmueble.getSrcFotosInmueble(idFotosInmueble[i]);
    //     srcFotosInmueble.push(src);
    // }






    // Inmueble.getInmueble(request.params.idInmueble).then(([rows, data]) => {
    //     if(rows.length < 1){
    //         console.log(rows);
    //         console.log('No hay Nada');
    //         return response.redirect('/');
    //     } else {
    //         console.log(rows);
    //         console.log('Ya hay una casa')
    //         return response.redirect('/');
    //         // AQUI TENGO QUE SACAR LO QUE HAY EN ROWS
    //         // Y PASARSELO AL RENDER DE LA VISTA DETALLADA 
    //         // DEL INMUEBLE PARA QUE LA PUEDA RENDERIZAR CON
    //         // SUS DATOS CORRESPONDIENTES
    //     }
    // }).catch((error) => {
    //     console.log(error);
    // });

    // response.render('inmueble');
};