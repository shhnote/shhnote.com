---
title: "Preguntas y respuestas"
description: "Preguntas frecuentes sobre shhnote: cuentas, enlaces, frases de contraseña, caducidad y los detalles técnicos para quienes se preocupan por la seguridad."
eyebrow: "Preguntas frecuentes"
intro: "Primero las respuestas cortas y después las técnicas. Si no encuentras la tuya, las páginas de cómo funciona y de seguridad profundizan más, y siempre puedes preguntarnos."
wide: true
---

<section class="section">
<div class="container">
<div class="faq">
  <details open>
    <summary>¿Necesito una cuenta?</summary>
    <p>No. No hay que registrarse ni instalar nada. Abre shhnote, escribe tu secreto y comparte el enlace. Así de fácil.</p>
  </details>
  <details>
    <summary>¿Y si el enlace lo ve la persona equivocada?</summary>
    <p>Un secreto de un solo uso solo puede leerlo la primera persona que lo abra; después se destruye, y sabrás que alguien lo leyó porque el destinatario previsto no encontrará nada. Para más seguridad, puedes añadir una frase de contraseña y compartirla por separado, de modo que el enlace por sí solo no baste. Y si cambias de opinión, puedes destruir el secreto tú mismo con tu enlace de destrucción privado.</p>
  </details>
  <details>
    <summary>¿Puede shhnote leer mi secreto?</summary>
    <p>No. La clave que lo abre nunca nos llega: se queda guardada dentro de tu enlace, de tu lado. Nosotros solo tenemos una versión cifrada que no tenemos forma de abrir.</p>
  </details>
  <details>
    <summary>¿Qué pasa si nadie lo abre?</summary>
    <p>Tú eliges la caducidad, desde 15 minutos hasta 14 días. Cuando se acaba el tiempo, el secreto se borra automáticamente, se haya abierto o no.</p>
  </details>
  <details>
    <summary>¿Qué diferencia hay entre un secreto de un solo uso y uno con tiempo limitado?</summary>
    <p>Un secreto de un solo uso se destruye en el momento en que se abre. Un secreto con tiempo limitado puede volver a abrirse hasta que caduque, pero la página nunca dice cuánto tiempo queda, así que trata cada secreto como algo que hay que guardar en la primera lectura.</p>
  </details>
  <details>
    <summary>¿Qué es el enlace de destrucción?</summary>
    <p>Un segundo enlace privado que recibes al crear un secreto. Al abrirlo aparece una confirmación; si confirmas, el secreto se destruye de inmediato, antes de que nadie pueda leerlo. Guárdalo para ti.</p>
  </details>
  <details>
    <summary>¿Puedo enviar archivos?</summary>
    <p>Sí. Los archivos se cifran en tu navegador igual que el texto y viajan dentro del mismo bloque sellado. Todo se rellena hasta tamaños estándar, así que ni siquiera nosotros podemos distinguir una nota corta de un archivo pequeño.</p>
  </details>
  <details>
    <summary>¿Funciona en Tor Browser o con JavaScript desactivado?</summary>
    <p>Para crear y mostrar un secreto se necesita JavaScript, porque el cifrado ocurre en tu navegador. Funciona en Tor Browser con el nivel “Más seguro”; con “El más seguro”, WebAssembly está desactivado, así que los secretos protegidos con frase de contraseña no se pueden abrir, y la página lo indica. Todas las demás páginas funcionan sin JavaScript.</p>
  </details>
  <details>
    <summary>¿Cómo se garantiza el uso único frente a condiciones de carrera?</summary>
    <p>Al mostrar el secreto se ejecuta una única actualización condicional que pasa la fila de “activo” a “reclamado”. Dos solicitudes simultáneas no pueden tener éxito a la vez: la segunda encuentra un registro ya reclamado y recibe la misma respuesta de “no se encontró ningún secreto” que cualquier otra persona. La reclamación nunca se revierte: si la descarga se pierde, quien tiene el token de reclamación vuelve a descargarlo dentro del plazo; de lo contrario, el secreto se destruye sin leerse.</p>
  </details>
  <details>
    <summary>¿Por qué el fragmento de la URL y no un parámetro de consulta?</summary>
    <p>Los parámetros de consulta se envían al servidor y acaban en registros de acceso, proxies y herramientas de analítica. La especificación de URL define que el fragmento (lo que va después de <span class="color-accent">#</span>) se quede en el cliente: el navegador nunca lo incluye en la solicitud HTTP. Esa propiedad es la base de todo el diseño de conocimiento cero. Después de mostrar el secreto, la página también elimina el fragmento de la barra de direcciones y del historial.</p>
  </details>
  <details>
    <summary>¿Qué impide que los escáneres de enlaces destruyan antes de tiempo los secretos de un solo uso?</summary>
    <p>La página de visualización es el mismo documento estático para todos los secretos y no descarga nada al cargarse. La solicitud solo se envía con un clic o una pulsación de tecla de confianza: un <code>click()</code> desde un script o el envío de un formulario no cuentan. Los escáneres automáticos (seguridad del correo, vistas previas de chats, antivirus) solo llegan a cargar esa página estática.</p>
  </details>
  <details>
    <summary>¿Puedo verificarlo o alojarlo yo mismo?</summary>
    <p>Sí. Todo el código fuente es público bajo AGPLv3, el protocolo está documentado en una especificación con vectores de conformidad con los que cualquier implementación puede comprobarse, y hay una guía de autoalojamiento. Puedes auditar la criptografía del lado del cliente y tener tu propia instancia, de modo que el límite de confianza sea completamente tuyo.</p>
  </details>
  <details>
    <summary>¿Se registra algo para prevenir abusos?</summary>
    <p>No guardamos registros de acceso por secreto ni historial de IP. La limitación de frecuencia usa un hash con clave de la dirección, con una sal que rota y que, al rotar, borra todos los contadores. Las denuncias de abuso se cuentan por día; no queda constancia de qué secreto se denunció.</p>
  </details>
  <details>
    <summary>¿Hay una API?</summary>
    <p>Sí, la misma que usa este sitio. La <a href="/en/docs/">documentación</a> la describe, y el paquete de cliente de código abierto implementa el protocolo para tus propias herramientas.</p>
  </details>
</div>

<p class="prose-note">¿Te queda alguna duda? Lee <a href="/es/how-it-works/">cómo funciona</a>, los <a href="/es/security/">detalles de seguridad</a> o <a href="/es/contact/">pregúntanos</a>.</p>
</div>
</section>
