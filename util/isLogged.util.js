/**
* Este middleware tiene como objetivo el detectar si hay un usuario en sesión.
* 
* Para ciertas funcionalidades dentro del proyecto, se necesita que el usuario
* tenga su sesión iniciada, por lo que es necesario hacer esa validación
* en la ruta que se desee acceder. En caso de no tener la sesión iniciada
* se hace una redirección a la pantalla de /login.
*
* param: req.session.isLoggedIn
* returns: res.status(403).redirect('/login')
*/

module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.status(403).redirect('/login');
    }
    next();
}