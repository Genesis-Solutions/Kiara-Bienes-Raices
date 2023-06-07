const sgMail = require('@sendgrid/mail')

exports.olvidePassword = (datos) => {
    const {nombre, email, token} = datos
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: email, // Change to your recipient
        from: 'soporte.kiarainmuebles@gmail.com', // Change to your verified sender
        subject: 'Recupera tu contraseña',
        text: 'Recupera tu contraseña para Kiara Bienes Raíces',
        html: `
                <h1> Hola! ${nombre}, solicitaste cambiar tu contraseña <h1>

                <p>Sigue el siguiente enlace para reestablercer tu contraseña:
                <a href="${process.env.BACKEND_URL}/olvidePassword/${token}">Reestablece la contraseña</a> </p>

                <p>Si tú no solicitaste el cambio, descarta este email</p>
    `
    }
    sgMail
    .send(msg)
    .then(() => {
      //console.log('Email sent')
    })
}

exports.notificacionPaso = (datos) => {
  const {nombre, email, idTramite, nombreInmueble} = datos
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
      to: email, // Change to your recipient
      from: 'soporte.kiarainmuebles@gmail.com', // Change to your verified sender
      subject: 'Cambio en tu proceso',
      text: 'Hubo un cambio en tu proceso con KIARA bienes raíces',
      html: `
              <h1> Hola! ${nombre}, hubo un cambio en tu proceso de la propiedad ${nombreInmueble} con KIARA Bienes Raíces <h1>

              <p>Para ver los cambios en tu proceso, accede al siguiente enlace:
              <a href="${process.env.BACKEND_URL}/dashboard/proceso/${idTramite}">Cambio en el proceso</a> </p>
  `
  }
  sgMail
  .send(msg)
  .then(() => {
    //console.log('Email sent')
  })
}

exports.cancelacionTramite = (datos) => {
  const {nombre, email, nombreInmueble} = datos
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
      to: email, // Change to your recipient
      from: 'soporte.kiarainmuebles@gmail.com', // Change to your verified sender
      subject: 'Cancelación de Proceso',
      text: 'Tu proceso ha sido cancelado',
      html: `
              <h1> Hola! ${nombre}, tu proceso asociado a la propiedad ${nombreInmueble} con KIARA Bienes Raíces ha sido cancelado.<h1>
  `
  }
  sgMail
  .send(msg)
  .then(() => {
    //console.log('Email sent')
  })
}  