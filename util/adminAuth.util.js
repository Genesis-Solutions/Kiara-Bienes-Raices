/**
* Este middleware tiene como objetivo el detectar si el usuario en sesión
* tiene los permisos necesarios para acceder a la ruta.
* 
* Dentro del proyecto hay algunas funcionalidades que sólo un usuario que
* cuente con ciertos permisos puede acceder, éste middleware se utiliza
* para aquellos privilegios compartidos por los roles de administrador
* y agente.
*
* param: req.session.idRol
* returns: res.status(403).redirect('/')
*/

module.exports = (req, res, next) => {
    let rolJer;
    if (req.session.idRol == 1) {
        rolJer = true;
    }
    
    if (!rolJer) {
        console.log('rol != 1'  + req.session.idRol);
        return res.status(403).redirect('/');
    }
    next();
};