/**
* Base controlador
*/

const SearchPage = require('../models/searchpage.model.js');
const Inmueble = require('../models/inmueble.model.js');
const bucket = require('../util/awsBucket.js');

exports.root = async(req,res,next) => {
    var isLogged = false;
    const idUsuario = req.session.idUsuario;
    const nombreUsuario = req.session.nombreUsuario;
    const apellidosUsuario = req.session.apellidosUsuario;
    const idRol = req.session.idRol;
    const urlFotoUsuario = req.session.urlFotoUsuario;
    /** 
    * Construye la lista de inmuebles  con sus imágenes respectivas
    */
    const inmuebles = await Inmueble.fetchLastFour();
    for (let i=0; i < inmuebles[0].length; i++) {
        const imgId = await Inmueble.idFotoPortada((inmuebles[0][i].idInmueble.toString()));
        const imgSrc = await Inmueble.srcFotoPortada((imgId[0][0].idFoto).toString());
        const imgSrcFilename = (imgSrc[0][0].archivoFoto).slice(23);
        inmuebles[0][i].img = imgSrcFilename;
    }
    if (req.session.searchParams != null){
        delete req.session.searchParams;
        delete req.session.countParams;
        delete req.session.searchValues;
    }
    if (req.session.isLoggedIn == true) {
        isLogged = true;
        // console.log("logged = true");
        // console.log(nombreUsuario);
        //console.log("Id del rol del usuario en sesión: " + idRol);
        res.render('index', {
            isLogged: req.session.isLoggedIn,
            nombreUsuario: nombreUsuario,
            apellidosUsuario: apellidosUsuario,
            idUsuario: idUsuario,
            idRol: idRol,
            urlFotoUsuario : urlFotoUsuario,
            inmuebles: inmuebles[0]
        });
    } else {
        // console.log("logged = false");
        // console.log(isLogged);
        res.render('index', {
            isLogged: req.session.isLoggedIn,
            inmuebles: inmuebles[0]
        });
    };
}

/*
* Obtiene la imagen del bucket S3
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

/**
* Esta función agrega la funcionalidad de filtros de búsqueda
* mediante la creación de una query dinámica que es enviada al
* modelo inmueblesFiltrados.
*
* @param: req, res, next
* @returns: res.render(searchPageFiltrada)
*/

exports.getInmueblesFiltradosIndex = async ( req, res, next ) => {
    if (req.body.newSearch == 1){
        delete req.session.searchParams;
        delete req.session.countParams;
        delete req.session.searchValues;
    }
    
    parameters = req.body;

    /**
    * Esta función construye la query dinámica dependiendo de los
    * filtros que fueron seleccionados en la vista searchpage.ejs
    * 
    * @param: params (req.body)
    * @returns: {where: conditions.length ? conditions.join(' AND ') : '1', 
    * values: values}
    */

    function buildConditions(params) {
        var conditions = [];
        var values = [];
        var conditionsStr;

        /**
        * Aquí se hace la construcción de la query dinámica con los
        * parámetros de la vista searchpage.ejs para filtrar
        */

        /**
        * En caso de buscar inmuebles en venta y seleccionar un rango de
        * precio, utiliza precioVentaInmueble para generar la query
        * 
        * En caso de buscar inmuebles en renta y seleccionar un rango de
        * precio, utiliza precioRentaInmueble para generar la query
        */

        if (params.idTipoMovimiento == "3") {
            conditions.push("(idTipoMovimiento = 1 OR idTipoMovimiento = 2 OR idTipoMovimiento = 3)")
        } else if (params.idTipoMovimiento == "1" || params.idTipoMovimiento == "3") {
            //console.log("dentro del precio equisde")
            conditions.push("(idTipoMovimiento = 1 OR idTipoMovimiento = 3)")
        } else if (params.idTipoMovimiento == "2" || params.idTipoMovimiento == "3") {
            conditions.push("(idTipoMovimiento = 2 OR idTipoMovimiento = 3)")
        };

        /** 
        * En caso de buscar por dirección agrega el filtro de LIKE a la query,
        * al ser una expresión regular, permite buscar por texto aquellas
        * propiedades que coincidan o se aproximen a la búsqueda
        * (nombre y desc.)
        */

        //console.log(params.direccionInmueble)
        if (typeof params.direccionInmueble !== 'undefined') {
            conditions.push("(nombreInmueble LIKE ? OR descInmueble LIKE ?)");
            values.push("%" + params.direccionInmueble + "%");
            values.push("%" + params.direccionInmueble + "%");
        };

        /** 
        * Agrega a la query la opción de tener baños, recámaras,
        * estacionamientos y metros cuadrados construídos a casa.
        */

        if (params.idCategoria == "1") {
            //console.log(params.idCategoria)
            var catCasa = "1"
            conditions.push("idCategoria = ?")
            values.push(catCasa);
        }

        /** 
        * Agrega a la query la opción de tener baños, recámaras,
        * estacionamientos y metros cuadrados construídos a departamento.
        */

        if (params.idCategoria == "2") {
            //console.log(params.idCategoria)
            var catDept = "2"
            conditions.push("idCategoria = ?")
            values.push(catDept);
        }

        /**
        * En caso de ser un local, únicamente agrega a la query el parámetro de
        * metros cuadrados construídos
        */

        if (params.idCategoria == "3") {
            var catLocal = "3"
            conditions.push("idCategoria = ?")
            values.push(catLocal);
        }

        /**
        * En caso de ser un terreno, únicamente agrega a la query el parámetro de
        * metros cuadrados construídos
        */

        if (params.idCategoria == "4") {
            var catTerreno = "4"
            conditions.push("idCategoria = ?")
            values.push(catTerreno);
        }

        /**
        * En caso de ser una bodega, únicamente agrega a la query el parámetro
        * de metros cuadrados construídos
        */

        if (params.idCategoria == "5") {
            var catBodega = "5"
            conditions.push("idCategoria = ?")
            values.push(catBodega);
        }

        /**
        * En caso de ser una oficina, únicamente agrega a la query el parámetro
        * de metros cuadrados construídos
        */

        if (params.idCategoria == "6") {
            var catOficina = "6"
            conditions.push("idCategoria = ?")
            values.push(catOficina);
        }

        /**
        * En caso de ser categoría "otro", únicamente agrega a la query el 
        * parámetroc de metros cuadrados construídos
        */

        if (params.idCategoria == "7") {
            var catOtro = "7"
            conditions.push("idCategoria = ?")
            values.push(catOtro);
        }

        return {
            where: conditions.length ?
                    conditions.join(' AND ') : '1',
            values: values
        };
    };

    /**
    * Valida que sólo esté buscando inmuebles activos en la base de datos
    */

    var statusActive = 1
    var isActive = ' AND activoInmueble = ' + statusActive.toString();

    if (req.session.searchValues != null){
        var conditions = req.session.searchValues;
        //console.log("condiciones en cookie: " + conditions);
    } else {
        var conditions = buildConditions(parameters);
        //console.log("condiciones sin cookie: " + conditions);
    }
    
    if (req.session.countParams != null) {
        var countQuery = req.session.countParams;
    } else {
        var countQuery = 'SELECT COUNT(idInmueble) as total FROM inmueble WHERE ' + conditions.where + isActive;
    }
    // console.log(req.session.searchParams)
    // console.log(parameters)
    // console.log(countQuery)

    /**
    * Obtiene la cantidad de inmuebles filtrados
    */
    
    const countFiltered = await SearchPage.totalInmueblesFiltrados(countQuery, conditions.values);

    /**
    * Dado a que necesitamos revisar que existan inmuebles que cumplan
    * con los filtros seleccionados, debemos crear éstas variables para que
    * puedan ser usadas después de la verificación 
    */

    var resultsExist = false;
    var resultadosPorPagina;
    var numeroResultados;
    var numeroPaginas;
    var builtQueryLimits

    /**
    * Revisa si hay inmuebles existentes que cumplan con los filtros que el
    * usuario seleccionó 
    */

    if (countFiltered[0][0].total > 0) {
        resultsExist = true;
    };

    const pagina = req.query.pagina ? Number(req.query.pagina) : 1;

    /**
    * Si existen inmuebles que cumplen con los filtros, genera la paginación
    * correspondiente y construye los límites en la query para iterar entre
    * páginas
    */

    if (resultsExist == true) {
        /**
        * Obtiene la cantidad de resultados por página, en este caso es
        * de 1 para probar la paginación 
        */

        resultadosPorPagina = 4;

        /** 
        * Establece la cantidad de resultados por pagina
        */
        
        numeroResultados = countFiltered[0][0].total;
        //console.log("numero de pags" + numeroResultados)
        numeroPaginas = Math.ceil(numeroResultados/resultadosPorPagina);

        /** 
        * Solicita la cantidad de resultados por pagina 
        */
        
        if (pagina > numeroPaginas) {
            res.redirect('/catalogo/search?pagina='+encodeURIComponent(numeroPaginas));
        } else if (pagina < 1) {
            res.redirect('/catalogo/search?pagina='+encodeURIComponent('1'));
        };

        /** 
        * Determina los límites para saber qué mostrar por página
        */
    
        const limiteInferior = (pagina-1)*resultadosPorPagina;
        var limSuperior = resultadosPorPagina.toString();
        var limInferior = limiteInferior.toString();
        var limits = ' LIMIT ' + limInferior + ',' + limSuperior;
        
        /** 
        * Si hay parámetros de búsqueda existentes, sigue utilizándolos en las
        * páginas 
        */

        if (req.session.searchParams != null) {
            //console.log("parametros de búsqueda: " + req.session.searchParams)
            //console.log(req.session.searchValues)
            var builtQuery = req.session.searchParams;
        } else {
            var builtQuery = 'SELECT * FROM inmueble WHERE ' + conditions.where + isActive;
        }

        builtQueryLimits = builtQuery + limits;

        //console.log(builtQuery);
        //console.log(conditions.values)
        //console.log(countFiltered[0][0].total)
    };

    /** 
    * Construye la lista de inmuebles filtrados con sus imágenes
    * respectivas sí y sólo sí hay inmuebles existentes
    */

    var inmuebles;
    if (resultsExist == true) {
        inmuebles = await SearchPage.inmueblesFiltrados(builtQueryLimits, conditions.values);
        for (let i=0; i < inmuebles.length; i++) {
            const imgId = await SearchPage.idFotoPortada((inmuebles[i].idInmueble.toString()));
            const imgSrc = await SearchPage.srcFotoPortada((imgId[0][0].idFoto).toString());
            const imgSrcFilename = (imgSrc[0][0].archivoFoto).slice(23);
            inmuebles[i].img = imgSrcFilename;
        }
    };

    /**
    * Construye la paginación para la vista searchPageFiltrada.ejs 
    */

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

    /**
    * Almacena los parámetros de búsqueda en variables de sesión para
    * que durante la paginación no se reestablezca la búsqueda 
    */

    /** 
    * Mustra la vista searchPageFiltrada.ejs con la información respectiva
    * para mostrar los inmuebles que cumplen con la búsqueda, los datos para
    * la paginación y las variables de sesión de isLogged y el idRol, en caso
    * de que no existan inmuebles con las características que se buscaron,
    * muestra la vista searchPageVacia.ejs
    */

    //console.log(builtQuery)
    //console.log(resultsExist)
    if (resultsExist == true) {
        req.session.countParams = countQuery;
        req.session.searchParams = builtQuery;
        req.session.searchValues = conditions;
        //console.log(builtQuery);
        res.render('searchPageFiltrada', {
            inmuebles: inmuebles,
            pagina: pagina,
            resultsExist: resultsExist,
            iterador: iterador,
            linkFinal: linkFinal,
            numeroPaginas: numeroPaginas,
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol,
            urlFotoUsuario : req.session.urlFotoUsuario
        }); 
    } else {
        res.render('searchPageVacia', {
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol,
            urlFotoUsuario: req.session.urlFotoUsuario
        })
    };
    
}

exports.getOlvideContrasenia = ( req,res,next ) => {
    res.render('olvideContraseña');
}