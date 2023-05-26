const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const bucket = require("../util/awsBucket.js");

// -- LOGIN -- //

// - Getter de la vista Login
/**
 *  Renderiza la vista de inicio de sesión.
  */
exports.getLogin = (req, res, next) => {
  res.render("login", {
    emailUsuario: req.session.emailUsuario ? req.session.emailUsuario : "",
    info: "",
  });
};

exports.logOut = (req, res, next) => {
  req.session.destroy (() => {
      res.redirect('/')
  })
}

exports.login = (req, res, next) => {
  User.findOne(req.body.emailUsuario).then(async ([rows, data]) => {

      //Si no existe el correo, redirige a la pantalla de login
      if (rows.length < 1) {
        const errorLogin = "Credenciales inválidas";
        return res.render("login", { errorLogin });
    };

      // Información del usuario:

      req.session.isLoggedIn = true;
      req.session.idUsuario = rows[0].idUsuario;
      req.session.nombreUsuario = rows[0].nombreUsuario;
      req.session.apellidosUsuario = rows[0].apellidosUsuario;
      req.session.emailUsuario = rows[0].emailUsuario;
      req.session.idUsuario = rows[0].idUsuario;
      req.session.idRol = rows[0].idRol;

      // console.log("en método login " + req.session.nombreUsuario)
      // Contraseña del usuario:

      req.session.passwordUsuario = rows[0].passwordUsuario;

      // Método de comparación para determinar autenticidad de la contraseña:

      bcrypt.compare(req.body.passwordUsuario, req.session.passwordUsuario).then((doMatch) => {
          if (doMatch) {
            // console.log('success login');
            return res.redirect("./");
          } else {
            const errorLoginPassword = "Credenciales inválidas";
            return res.render("login", { errorLoginPassword });
          }
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

// -- REGISTER -- //

// - Getter de la vista Register
exports.getRegister = (req, res, next) => {
  res.render("register");
};

// - Método de registro
exports.register = (req, res, next) => {
  const {
    nombreUsuario,
    apellidosUsuario,
    emailUsuario,
    telefonoUsuario,
    passwordUsuario,
    passwordUsuarioConfirmar,
    estadoCivilUsuario,
    ocupacionUsuario,
  } = req.body;
  const activoUsuario = 1;
  const idRol = 3;
  const idFoto = 1;
  // telefonoUsuarioString = telefonoUsuario.toString();
  activoUsuarioString = activoUsuario.toString();
  idRolString = idRol.toString();
  idFotoString = idFoto.toString();

  //  Realiza la validación y el procesamiento de los datos del formulario de registro 
  //y crea un nuevo usuario si la validación es correcta.
  User.findOne(emailUsuario)
    .then(async ([rows, data]) => {
      if (rows.length >= 1) {
        //console.log("El correo electrónico ingresado ya está registrado.");
        const errorEmail = "El correo electrónico ingresado ya está registrado";
        res.render("register", { errorEmail });
      } else {
        //Revisar que las contraseñas coincidan
        if (passwordUsuario == passwordUsuarioConfirmar) {
          //console.log("Las contraseñas coinciden.");
          // Revisar que sean 10 digitos exactos para el telefono
          if (telefonoUsuario.length != 10) {
            const errorTelefono = "El número de teléfono debe contener 10 dígitos";
            res.render("register", { errorTelefono });
          }
          // console.log("Las contraseñas coinciden.");
          // Si todo fue validado correctamente, se inserta el usuario en la base de datos
          User.insertUser(
            nombreUsuario,
            apellidosUsuario,
            passwordUsuario,
            telefonoUsuario,
            emailUsuario,
            estadoCivilUsuario,
            ocupacionUsuario,
            activoUsuarioString,
            idRolString,
            idFotoString
          )
            .then(() => {
              res.redirect("/login");
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          //console.log("Las contraseñas no coinciden");
          const errorPassword = "Las contraseñas no coinciden";
          res.render("register", { errorPassword });
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};


// -- CONTACTO -- //
// - Getter de la vista Contacto
exports.getContacto = (req, res, next) => {
  res.render('contacto', {
    isLogged: req.session.isLoggedIn,
    idRol: req.session.idRol
  });
};

// -- POLITICAS -- //
// - Getter de la vista Politicas
exports.getPoliticas = (req, res, next) => {
  res.render('politicas', {
    isLogged: req.session.isLoggedIn,
    idRol: req.session.idRol
  });
};

// -- NOSOTROS -- //
// - Getter de la vista Nosotros
exports.getNosotros = (req, res, next) => {
  res.render('nosotros', {
    isLogged: req.session.isLoggedIn,
    idRol: req.session.idRol
  });
};

// -- SERVICIOS -- //
// - Getter de la vista Servicios
exports.getServicios = (req, res, next) => {
  res.render('servicios', {
    isLogged: req.session.isLoggedIn,
    idRol: req.session.idRol
  });
};

/*
* Obtener los datos de un usuario para desplegarlos en su perfil
* @param: req, res, next
* @returns: res.render(perfil)
*/
exports.getPerfil = (req, res, next) => {
  res.render('perfil', {
    isLogged: req.session.isLoggedIn,
    idRol: req.session.idRol
  });
};

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