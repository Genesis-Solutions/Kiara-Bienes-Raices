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