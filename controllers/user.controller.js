const bcrypt = require('bcryptjs');
const {User, Token} = require('../models/user.model');
const bucket = require("../util/awsBucket.js");
const olvidePassword = require("../util/email.js")
const generarId= require("../util/token.js");
const moment = require("moment-timezone"); // Para fechas
moment.locale('es-mx');
const { storage } = require('../util/awsMediaMulter.util');

// -- LOGIN -- //

// - Getter de la vista Login
/**
 *  Renderiza la vista de inicio de sesión.
  */
exports.getLogin = (req, res, next) => {
  res.render("login", {
    emailUsuario: req.session.emailUsuario ? req.session.emailUsuario : "",
    info: "",
    warning : req.flash('warning'),
    success : req.flash('success')
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
        req.flash('warning', 'Credenciales inválidas');
        return res.render("login", {
          warning : req.flash('warning'),
          success : req.flash('success')
        });
    };

      // Información del usuario:

      req.session.isLoggedIn = true;
      req.session.idUsuario = rows[0].idUsuario;
      req.session.nombreUsuario = rows[0].nombreUsuario;
      req.session.apellidosUsuario = rows[0].apellidosUsuario;
      req.session.emailUsuario = rows[0].emailUsuario;
      req.session.idRol = rows[0].idRol;

      // console.log("en método login " + req.session.nombreUsuario)
      // Contraseña del usuario:

      req.session.passwordUsuario = rows[0].passwordUsuario;
      req.session.activoUsuario = rows[0].activoUsuario;
    
      // Check if user is active:
    if (req.session.activoUsuario == 0) {
      req.flash('warning', 'Credenciales inválidas');
      return res.render("login", {
        warning: req.flash('warning'),
        success: req.flash('success')
      });
    };
    

      // Método de comparación para determinar autenticidad de la contraseña:

      bcrypt.compare(req.body.passwordUsuario, req.session.passwordUsuario).then((doMatch) => {
          if (doMatch) {
            // console.log('success login');
            return res.redirect("./");
          } else {
            req.flash('warning', 'Credenciales inválidas');
            return res.render("login", {
              warning : req.flash('warning'),
              success : req.flash('success')
            });
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
  res.render("register", {
    warning : req.flash('warning'),
    success : req.flash('success')
  });
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
        req.flash('warning', 'El correo electrónico ingresado ya está registrado')
        res.render("register", {
          warning : req.flash('warning'),
          success : req.flash('success')
        });
      } else {
        //Revisar que las contraseñas coincidan
        if (passwordUsuario == passwordUsuarioConfirmar) {
          //console.log("Las contraseñas coinciden.");
          // Revisar que sean 10 digitos exactos para el telefono
          if (telefonoUsuario.length != 10) {
            req.flash('warning', 'El número de teléfono debe contener 10 dígitos')
            res.render("register", {
              warning : req.flash('warning'),
              success : req.flash('success')
            });
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
          req.flash('warning', 'Las contraseñas no coinciden')
          res.render("register", { 
            warning : req.flash('warning'),
            success : req.flash('success') });
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
* @returns: res.render(profile)
*/
exports.getPerfil = async (req, res, next) => {
  const datosUsuario = await User.getUserProfile(req.session.idUsuario);
  const idFoto = datosUsuario[0][0].idFoto;
  const srcPhoto = await User.srcFotoPortada(idFoto);
  const pfp = (srcPhoto[0][0].archivoFoto).slice(23);
  res.render('profile', {
    isLogged: req.session.isLoggedIn,
    idRol: req.session.idRol,
    emailUsuario: req.session.emailUsuario,
    datosUsuario: datosUsuario[0][0],
    profilePhoto: pfp,
    warning : req.flash('warning'),
    success : req.flash('success')
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
};

exports.getOlvidePassword = (req, res) => {
  res.render('olvidePassword', {
    warning : req.flash('warning'),
    success : req.flash('success')
  });
};

exports.resetPassword = ( req, res, next ) => {
  User.findOne(req.body.emailUsuario).then(async ([rows, data]) => {
    //Si no existe el correo, redirige a la pantalla de login
    if (rows.length < 1) {
      req.flash('warning', 'No existe ninguna cuenta con este correo')
      return res.redirect("/olvidePassword");
    };
    const email = req.body.emailUsuario;
    const nombreUsuario = await User.getUserName(email);
    // Generar token y enviar email
    const newToken = generarId.generarId();

    /*
     * Genera el timestamp en formato aaaa-mm-dd : hh:mm:ss, se le
     * suman 10 minutos para dar tiempo de cambio de contraseña.
     * 
     * NOTA: Utiliza la variable de ambiente de timezone porque
     * el servidor puede tener una diferente a la de los usuarios.
     */

    const currentTime = moment().tz(process.env.TIMEZONE).format('YYYY-MM-DD HH:mm:ss');
    const deadline = moment(currentTime).add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss');

    /**
     * Insertar nuevo token en la base de datos con la fecha actual + 10
     * minutos para poder ingresar a la URL.
    */

    Token.insertToken(email, newToken, deadline);

    /*
     * Envía la URL con el token generado al usuario para que pueda
     * ingresar a cambiar su contraseña.
     * 
     * @param: email : String,
     * @param: nombreUsuario : String,
     * @param: token : String
     */

    olvidePassword.olvidePassword({
        email: email,
        nombre: nombreUsuario,
        token: newToken,
    });
    req.flash('success', 'Se ha enviado un enlace para reestablecer su contraseña a su correo')
    return res.redirect("/olvidePassword");
  }).catch((error) => {
    console.log(error);
  });
};

exports.comprobarToken = async(req, res) => {
  //console.log("dentro del GET del token");
  const token = req.params.token;
  const infoToken = await Token.findOne(token);
  var currentTime;
  var timeLimit;
  //console.log("hora actual", currentTime, "hora límite", timeLimit);

  if (infoToken.length >= 1) {
    currentTime = moment().tz(process.env.TIMEZONE).format('YYYY-MM-DD HH:mm:ss');
    timeLimit = moment(infoToken[0].fechaIntento).format('YYYY-MM-DD HH:mm:ss');
  };

  /**
   * La siguiente validación se encarga de tres cosas:
   * 1. Que el token exista y sea un intento verídico.
   * 2. Que el token no haya expirado aún.
   * 3. De enviar al usuario a la vista para reestablecer su contraseña.
   * 
   * Los tokens son eliminados de la base de datos si ya han expirado.
   */

  if (infoToken.length < 1) {
    req.flash('warning', 'Error al validar su token.');
    return res.redirect("/login");
  } else if (currentTime > timeLimit) {
    await Token.deleteToken(token);
    req.flash('warning', 'Su token de verificación ha expirado.');
    return res.redirect("/login");
  } else {
    res.render('nuevaPassword', {
      warning : req.flash('warning'),
      success : req.flash('success')
    });
  };
};

exports.newPassword = async (req, res, next) => {
  const token = req.params.token;
  const infoToken = await Token.findOne(token);
  const emailUsuario = infoToken[0].email;
  //console.log(emailUsuario)

  if (req.body.nuevaContrasenia == req.body.confirmacionContrasenia) {
    await User.resetPassword(req.body.nuevaContrasenia, emailUsuario);
    await Token.deleteToken(token);
    req.flash('success', 'Se ha reestablecido su contraseña.');
    return res.redirect('/login');
  } else {
    req.flash('warning', 'Las contraseñas no coinciden.');
    return res.redirect('/olvidePassword/' + token);
  };
};

/*
* Obtener los datos de un usuario para desplegarlos en su perfil
* @param: req, res, next
* @returns: res.render(procesos)
*/
exports.getMisProcesos = (req, res, next) => {
  res.render('procesosUsuario', {
    isLogged: req.session.isLoggedIn,
    idRol: req.session.idRol
  });
};

/*
* Actualizar la foto de perfil.
* @param: req, res, next
*/
exports.setProfilePhoto = (req,res,next) => {
  var upload = storage.array('profilePhoto',1);
  upload(req, res, function (err) {
      if (err) {
          console.log("Error upload S3: "+err);
      } else {
          req.files.forEach(function (file) {
              const mediaName = file.key;
              const idUsuario = req.session.idUsuario;
              User.registerPFP(mediaName,idUsuario)
                .then(([rows, fieldData]) => {
                  res.status(200).json({ code: 200, msg: "Ok" });
                })
                  .catch(error => { console.log(error) });
                });
      }
  });
};

/**
 * Cambio de contraseña
 * @param: req, res, next
 */

exports.changePassword = async (req, res, next) => {
  bcrypt.compare(req.body.currentPassword, req.session.passwordUsuario).then(async doMatch => {
    if (doMatch){
      if (req.body.newPassword == req.body.confirmPassword) {
        await User.resetPassword(req.body.newPassword, req.body.emailUsuario);
        User.findOne(req.body.emailUsuario).then(async ([rows, data]) => {
          req.session.passwordUsuario = rows[0].passwordUsuario;
          req.flash('success', 'Se ha reestablecido su contraseña.');
          return res.redirect('/perfil');
        });
      } else {
        req.flash('warning', 'Las contraseñas no coinciden.');
        return res.redirect('/perfil');
      };
    } else {
      req.flash('warning', 'Contraseña incorrecta.');
      return res.redirect('/perfil');
    };
  });
};

/*
* Actualizar la información del perfil.
* @param: req, res, next
*/
exports.setNewProfile = (req,res,next) => {
  const nombre = req.body.nombreUsuario;
  const apellidos = req.body.apellidosUsuario;
  const email = req.body.emailUsuario;
  const telefono = req.body.telefonoUsuario;
  let estadoCivilUsuario = req.body.estadoCivilUsuario;
  let ocupacionUsuario = req.body.ocupacionUsuario;
  if(estadoCivilUsuario == "" || estadoCivilUsuario == null) {
    estadoCivilUsuario = "No hay datos"
  } 
  if(ocupacionUsuario == "" || ocupacionUsuario == null) {
    ocupacionUsuario = "No hay datos"
  }
  const idUsuario = req.session.idUsuario;
  User.changeUserInfo(nombre,apellidos,email,telefono,estadoCivilUsuario,ocupacionUsuario,idUsuario)
    .then(([rows, fieldData]) => {
      res.status(200).json({ code: 200, msg: "Ok" });
    })
    .catch(error => { console.log(error) });
};