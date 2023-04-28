const SearchPage = require('../models/searchpage.model.js');
const bucket = require("../util/awsBucket.js");

/*
* Mostar el catalogo de inmuebles paginado.
*/
exports.getSearchPage = async( req,res,next ) => {
    //Obtener la cantidad de inmuebles
    const totalInmuebles = await SearchPage.totalInmuebles();
    console.log(totalInmuebles)
    //Cantidad de resultados por pagina
    const resultadosPorPagina = 1;
    //Establecer la cantidad de resultados por pagina
    const numeroResultados = totalInmuebles[0][0].total;
    const numeroPaginas = Math.ceil(numeroResultados/resultadosPorPagina);
    //Solicitar la cantidad de resultados por pagina
    const pagina = req.query.pagina ? Number(req.query.pagina) : 1;
    if (pagina>numeroPaginas) {
        res.redirect('/catalogo?pagina='+encodeURIComponent(numeroPaginas));
    } else if (pagina<1) {
        res.redirect('/catalogo?pagina='+encodeURIComponent('1'));
    }
    //Determinar los limites
    const limiteInferior = (pagina-1)*resultadosPorPagina;
    var limSuperior = resultadosPorPagina.toString();
    var limInferior = limiteInferior.toString();
    //Construir la lista de inmuebles
    const inmuebles = await SearchPage.inmueblesPaginados(limInferior,limSuperior);
    
    for (let i=0; i < inmuebles[0].length; i++) {
        const imgId = await SearchPage.idFotoPortada((inmuebles[0][i].idInmueble.toString()));
        const imgSrc = await SearchPage.srcFotoPortada((imgId[0][0].idFoto).toString());
        const imgSrcFilename = (imgSrc[0][0].archivoFoto).slice(23);
        inmuebles[0][i].img = imgSrcFilename;
    }
    console.log(inmuebles[0]);
    //Obtener la información necesaria de la lista
    if (pagina <= 3) {
        iterador = 1;
    }
    else {
        iterador = pagina-2;
    }
    if(pagina <= numeroPaginas-2) {
        linkFinal = pagina+2;
    }
    else if(pagina <= numeroPaginas-1) {
        linkFinal = pagina+1;
    }
    else { 
        linkFinal = pagina;
    }
    res.render('searchpage', {
        inmuebles: inmuebles[0],
        pagina: pagina,
        iterador: iterador,
        linkFinal: linkFinal,
        numeroPaginas: numeroPaginas,
        isLogged: req.session.isLogged
    }); 
}

/*
* Obtener la imagen del bucket.
*/
exports.getImgFromBucket = ( req,res,next ) => {
    var img = req.query.image;
    const AWS_BUCKET = "kiarabienesraices";
    //console.log('Trying to download file: ' + img);
    var opciones = {
        Bucket: AWS_BUCKET,
        Key: img,
    };
    bucket.getObject(opciones, function(err, data) {
        res.attachment(img);
        res.send(data.Body);
    });
}

exports.getInmueblesFiltrados = async ( req, res, next ) => {
    parameters = req.body;

    function buildConditions(params) {
        var conditions = [];
        var values = [];
        var conditionsStr;

        console.log(parameters.direccionInmueble)
        if (typeof params.direccionInmueble !== 'undefined') {
            conditions.push("direccionInmueble LIKE ?");
            values.push("%" + params.direccionInmueble + "%");
        };

        if (params.idCategoria == "1" || params.idCategoria == "2") {
            var catCasa = "1"
            var catDept = "2"
            conditions.push("idCategoria = ? OR ?")
            values.push(catCasa);
            values.push(catDept);
            if (typeof params.baniosInmueble !== 'undefined') {
                conditions.push("baniosInmueble >= ?");
                values.push(params.baniosInmueble);
            };
    
            if (typeof params.recamarasInmueble !== 'undefined') {
                conditions.push("recamarasInmueble >= ?");
                values.push(params.recamarasInmueble);
            };

            if (typeof params.estacionamientosInmueble !== 'undefined') {
                conditions.push("estacionamientosInmueble LIKE ?");
                values.push("%" + params.estacionamientosInmueble + "%");
            };
        }

        if (params.idCategoria == "3" || params.idCategoria == "4") {
            var catLocal = "3"
            var catTerreno = "4"
            conditions.push("idCategoria = ? OR ?")
            values.push(catLocal);
            values.push(catTerreno);

            if (typeof params.m2ConstruidosInmueble !== 'undefined') {
                conditions.push("m2ConstruidosInmueble >= ?");
                values.push(params.m2ConstruidosInmueble);
            };
        }

        // venta
        if (params.idTipoMovimiento == "1" || params.idTipoMovimiento == "3") {
            if (typeof params.precioLimInf !== 'undefined') {
                conditions.push("precioVenta BETWEEN ? AND ?");
                values.push(params.precioLimInf);
                values.push(params.precioLimSup);
            };
        }

        // renta
        if (params.idTipoMovimiento == "2" || params.idTipoMovimiento == "3") {
            if (typeof params.precioLimInf !== 'undefined') {
                conditions.push("precioVenta BETWEEN ? AND ?");
                values.push(params.precioLimInf);
                values.push(params.precioLimSup);
            };
        }

        return {
            where: conditions.length ?
                    conditions.join(' AND ') : '1',
            values: values
        };
    };

    var conditions = buildConditions(parameters);
    var builtQuery = 'SELECT * FROM inmueble WHERE ' + conditions.where;
    var countQuery = 'SELECT COUNT(idInmueble) as total FROM inmueble WHERE ' + conditions.where;
    console.log(builtQuery);
    console.log(conditions.values)

    console.log("prueba filtrada")
    const filtered = await SearchPage.inmueblesFiltrados(builtQuery, conditions.values);
    const countFiltered = await SearchPage.totalInmueblesFiltrados(countQuery, conditions.values)
    console.log(filtered)
    console.log(countFiltered)

}