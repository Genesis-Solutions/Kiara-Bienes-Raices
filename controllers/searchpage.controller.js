const SearchPage = require('../models/searchpage.model.js');
const bucket = require("../util/awsBucket.js");

/**
* Esta función agrega la funcionalidad de mostrar los inmuebles que
* se encuentren activos al momento de ingresar en la vista searchpage.ejs
* paginados
*
* @param: req, res, next
* @returns: res.render(searchpage)
*/

exports.getSearchPage = async( req,res,next ) => {
    /**
    * Obtiene la cantidad de inmuebles
    */

    const totalInmuebles = await SearchPage.totalInmuebles();

    /**
    * Obtiene la cantidad de resultados por página, en este caso es
    * de 1 para probar la paginación 
    */
    
    const resultadosPorPagina = 1;
    
    /** 
    * Establece la cantidad de resultados por pagina
    */ 

    const numeroResultados = totalInmuebles[0][0].total;
    const numeroPaginas = Math.ceil(numeroResultados/resultadosPorPagina);
    
    /** 
    * Solicita la cantidad de resultados por pagina 
    */

    const pagina = req.query.pagina ? Number(req.query.pagina) : 1;
    if (pagina>numeroPaginas) {
        res.redirect('/catalogo?pagina='+encodeURIComponent(numeroPaginas));
    } else if (pagina<1) {
        res.redirect('/catalogo?pagina='+encodeURIComponent('1'));
    }
    
    /** 
    * Determina los límites para saber qué mostrar por página
    */

    const limiteInferior = (pagina-1)*resultadosPorPagina;
    var limSuperior = resultadosPorPagina.toString();
    var limInferior = limiteInferior.toString();
    
    /** 
    * Construye la lista de inmuebles filtrados con sus imágenes
    * respectivas
    */

    const inmuebles = await SearchPage.inmueblesPaginados(limInferior,limSuperior);
    for (let i=0; i < inmuebles[0].length; i++) {
        const imgId = await SearchPage.idFotoPortada((inmuebles[0][i].idInmueble.toString()));
        const imgSrc = await SearchPage.srcFotoPortada((imgId[0][0].idFoto).toString());
        const imgSrcFilename = (imgSrc[0][0].archivoFoto).slice(23);
        inmuebles[0][i].img = imgSrcFilename;
    }
    
    /**
    * Construye la paginación para la vista searchpage.ejs 
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
    * Si las variables de sesión de filtros son diferente a null, es decir,
    * contienen parámetros de una búsqueda anterior, éstos se eliminan al
    * volver a ingresar a searchpage.ejs 
    */

    if (req.session.searchParams != null){
        delete req.session.searchParams;
        delete req.session.countParams;
        delete req.session.searchValues;
    }

    /** 
    * Mustra la vista searchpage.ejs con la información respectiva
    * para mostrar los inmuebles que están activos, los datos para
    * la paginación y las variables de sesión de isLogged y el idRol
    */

    res.render('searchpage', {
        inmuebles: inmuebles[0],
        pagina: pagina,
        iterador: iterador,
        linkFinal: linkFinal,
        numeroPaginas: numeroPaginas,
        isLogged: req.session.isLoggedIn,
        idRol: req.session.idRol
    }); 
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

exports.getInmueblesFiltrados = async ( req, res, next ) => {
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

        //console.log(params.direccionInmueble)
        if (typeof params.direccionInmueble !== 'undefined') {
            conditions.push("direccionInmueble LIKE ?");
            values.push("%" + params.direccionInmueble + "%");
        };

        if (params.idCategoria == "1" || params.idCategoria == "2") {
            //console.log(params.idCategoria)
            var catCasa = "1"
            var catDept = "2"
            conditions.push("idCategoria = ? OR idCategoria = ?")
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
                conditions.push("estacionamientosInmueble >= ?");
                values.push(params.estacionamientosInmueble);
            };
        }

        if (params.idCategoria == "3" || params.idCategoria == "4") {
            var catLocal = "3"
            var catTerreno = "4"
            conditions.push("idCategoria = ? OR idCategoria = ?")
            values.push(catLocal);
            values.push(catTerreno);

            if (typeof params.m2ConstruidosInmueble !== 'undefined') {
                conditions.push("m2ConstruidosInmueble >= ?");
                values.push(params.m2ConstruidosInmueble);
            };
        }

        //console.log(params.idTipoMovimiento)
        // venta

        /**
        * En caso de buscar inmuebles en venta y seleccionar un rango de
        * precio, utiliza precioVentaInmueble para generar la query
        */

        if (params.idTipoMovimiento == "1" || params.idTipoMovimiento == "3") {
            //console.log("dentro del precio equisde")
            conditions.push("idTipoMovimiento = 1 OR idTipoMovimiento = 3")
            if (typeof params.precioMinimo !== 'undefined') {

                if (params.precioMaximo != ''){
                    conditions.push("precioVentaInmueble BETWEEN ? AND ?");
                    values.push(params.precioMinimo);
                    values.push(params.precioMaximo);
                }
                
            };
        }

        /**
        * En caso de buscar inmuebles en renta y seleccionar un rango de
        * precio, utiliza precioRentaInmueble para generar la query
        */
        
        if (params.idTipoMovimiento == "2" || params.idTipoMovimiento == "3") {
            if (typeof params.precioMinimo !== 'undefined') {
                conditions.push("idTipoMovimiento = 2 OR idTipoMovimiento = 3")
                //console.log("dentro del precio equisde")
                if (params.precioMaximo != '') {
                    conditions.push("precioRentaInmueble BETWEEN ? AND ?");
                    values.push(params.precioMinimo);
                    values.push(params.precioMaximo);
                }
            };
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

    /**
    * Obtiene la cantidad de inmuebles filtrados
    */
    
    const countFiltered = await SearchPage.totalInmueblesFiltrados(countQuery, conditions.values);
    
    /**
    * Obtiene la cantidad de resultados por página, en este caso es
    * de 1 para probar la paginación 
    */

    const resultadosPorPagina = 1;

    /** 
    * Establece la cantidad de resultados por pagina
    */ 
    
    const numeroResultados = countFiltered[0][0].total;
    const numeroPaginas = Math.ceil(numeroResultados/resultadosPorPagina);

    /** 
    * Solicita la cantidad de resultados por pagina 
    */

    const pagina = req.query.pagina ? Number(req.query.pagina) : 1;
    if (pagina>numeroPaginas && numeroPaginas != 0) {
        res.redirect('/catalogo/search?pagina='+encodeURIComponent(numeroPaginas));
    } else if (pagina<1) {
        res.redirect('/catalogo/search?pagina='+encodeURIComponent('1'));
    } else if (numeroPaginas == 0){
        res.redirect('/catalogo/search?pagina='+encodeURIComponent('1'));
    }

    /** 
    * Determina los límites para saber qué mostrar por página
    */
    
    const limiteInferior = (pagina-1)*resultadosPorPagina;
    var limSuperior = resultadosPorPagina.toString();
    var limInferior = limiteInferior.toString();
    var limits = ' LIMIT ' + limInferior + ',' + limSuperior;
    //console.log("límites " + limits)

    if (req.session.searchParams != null) {
        //console.log("parametros de búsqueda: " + req.session.searchParams)
        //console.log(req.session.searchValues)
        var builtQuery = req.session.searchParams;
    } else {
        var builtQuery = 'SELECT * FROM inmueble WHERE ' + conditions.where + isActive;
    }

    var builtQueryLimits = builtQuery + limits;

    console.log(builtQuery);
    console.log(conditions.values)
    //console.log(countFiltered[0][0].total)

    /** 
    * Construye la lista de inmuebles filtrados con sus imágenes
    * respectivas
    */

    const inmuebles = await SearchPage.inmueblesFiltrados(builtQueryLimits, conditions.values);
    //console.log(inmuebles)
    for (let i=0; i < inmuebles.length; i++) {
        const imgId = await SearchPage.idFotoPortada((inmuebles[i].idInmueble.toString()));
        const imgSrc = await SearchPage.srcFotoPortada((imgId[0][0].idFoto).toString());
        const imgSrcFilename = (imgSrc[0][0].archivoFoto).slice(23);
        inmuebles[i].img = imgSrcFilename;
    }

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

    req.session.countParams = countQuery;
    req.session.searchParams = builtQuery;
    req.session.searchValues = conditions;

    /** 
    * Mustra la vista searchPageFiltrada.ejs con la información respectiva
    * para mostrar los inmuebles que cumplen con la búsqueda, los datos para
    * la paginación y las variables de sesión de isLogged y el idRol
    */

    res.render('searchPageFiltrada', {
        inmuebles: inmuebles,
        pagina: pagina,
        iterador: iterador,
        linkFinal: linkFinal,
        numeroPaginas: numeroPaginas,
        isLogged: req.session.isLoggedIn,
        idRol: req.session.idRol
    }); 
}