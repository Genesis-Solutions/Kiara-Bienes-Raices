## Release v2.0.0
### Novedades:
- Agrega módulo de perfil:
  - Permite que los usuarios pueden modificar su información personal y su foto de perfil
  - Permite que los usuarios pueden cambiar su contraseña si lo desean o dar de baja su cuenta
  - Permite a un usuario recuperar su contraseña mediante un correo electrónico
- Agrega módulo de tracking:
  - Permite a las agentes inicializar procesos con sus clientes y estos pueden darle seguimiento desde su perfil
### Notas del release:
- Arregla bug de subida de imágenes (ahora hay un mínimo de 5 imágenes)
- Arregla bug de que las imágenes se veían del mismo tamaño
- Elimina el atributo `required` de ciertos campos al dar de alta un inmueble
- Elimina la asignación de dueño de la propiedad en el momento de dar de alta un inmueble
- Agrega verificación de archivos de foto (ahora sólo acepta `.jpg`, `.png` y `.webp`)
- Cambia el campo de descripción de una propiedad de `VARCHAR(3000)` a `TEXT`
- Arregla bug de valores negativos en precios de inmueble
- Arregla bug de checkboxes en dar de alta inmueble
- Incrementa los requisitos para generar una contraseña
- Agrega `connect-flash` para manejo de mensajes de error o éxito
- Se redirecciona en vez de volver a renderizar una página para mostrar mensajes al usuario
- Cambia los textos de _Kiara_ a _KIARA_
### Nuevas dependencias:
_NOTA: Ejecutar el comando npm i antes de probar siempre_

- `connect-flash`
- `moment-timezone`
- `nodemailer-sendgrid`
### Notas adicionales:
- En el servidor se incrementó el tamaño de subida a 200 MB
- Hay tres nuevas variables de entorno las cuales estarán en el documento de claves