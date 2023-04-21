const SearchPage = require('../models/searchpage.model.js');

//Mostar el catalogo de inmuebles paginado
exports.getSearchPage = async( req,res,next ) => {
    //Obtener la cantidad de inmuebles
    const totalInmuebles = await SearchPage.totalInmuebles();
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
        inmuebles[0][i].img = imgSrc[0][0].archivoFoto
    }
    //Obtener la información necesaria de la lista
    if (pagina<=3){
        iterador=1;
    }
    else{
        iterador = pagina - 2;
    }

    if(pagina<=numeroPaginas-2){
        linkFinal=pagina+2;
    }
    else if(pagina<=numeroPaginas-1){
        linkFinal=pagina+1;
    }
    else{
        linkFinal=pagina
    }
    res.render('searchpage', {
        inmuebles: inmuebles[0],
        pagina: pagina,
        iterador: iterador,
        linkFinal: linkFinal,
        numeroPaginas: numeroPaginas
    });
    //res.status(200).json({code: 200, msg:"Ok", data:inmuebles[0]})
}