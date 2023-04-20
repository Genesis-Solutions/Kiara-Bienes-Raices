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
    console.log(numeroResultados);
    //Solicitar la cantidad de resultados por pagina
    const pagina = req.query.pagina ? Number(req.query.pagina) : 1;
    if (pagina>numeroPaginas) {
        res.redirect('/?pagina='+encodeURIComponent(numeroPaginas));
    } else if (pagina<1) {
        res.redirect('/?pagina='+encodeURIComponent('1'));
    }
    //Determinar los limites
    const limiteInferior = (pagina-1)*resultadosPorPagina;
    //Construir la lista de inmuebles
    const inmuebles = await SearchPage.inmueblesPaginados(limiteInferior,resultadosPorPagina);
    for (let i=0; i < inmuebles[0].length; i++) {
        const imgId = await SearchPage.idFotoPortada([0][i].idInmueble);
        const imgSrc = await SearchPage.srcFotoPortada(imgId[0][0].archivoFoto);
        inmuebles[0][i].img = imgSrc[0][0].archivoFoto
    }
    res.status(200).json({code: 200, msg:"Ok", data:inmuebles[0]})
}