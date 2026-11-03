---
title: "Política de privacidad"
description: "Qué almacena shhnote.com, durante cuánto tiempo y qué no hace nunca. No podemos leer tus secretos y guardamos lo mínimo posible de todo lo demás."
eyebrow: "Legal"
updated: "[date]"
---

> **Borrador.** Esta política es un punto de partida y no la ha revisado ningún abogado.

## En resumen

shhnote.com (“este sitio”) no puede leer tus secretos. Se cifran en tu dispositivo y la clave nunca nos llega. De todo lo demás guardamos lo mínimo posible, y lo borramos en cuanto podemos.

## Qué almacenamos

Cuando creas un secreto, almacenamos:

- **El secreto cifrado.** Sin la clave de tu enlace es ilegible, también para nosotros.
- **Sus ajustes:** cuándo caduca y si se borra tras una sola visualización.
- **Credenciales con hash:** hashes unidireccionales de los valores que usa tu navegador para encontrarlo o destruirlo, que no pueden convertirse de nuevo en nada útil.

No almacenamos tu frase de contraseña, la clave de tu enlace, cuándo se creó el secreto ni si se puso una frase de contraseña. La hora de caducidad se redondea, así que no puede usarse para deducir la hora de creación. Los datos cifrados llevan relleno, así que solo conocemos su categoría de tamaño aproximada.

Los secretos grandes pueden guardarse fuera de la base de datos, en disco o en un almacenamiento de objetos. Ese almacenamiento registra cuándo se escribió cada archivo, y ese es el único lugar donde existe una hora de creación. Va asociada a un archivo cifrado que no podemos abrir y desaparece cuando desaparece el archivo.

Si alguien denuncia un enlace, contamos la denuncia en el total de ese día. No guardamos constancia de qué secreto se denunció.

## Cuándo lo borramos

Un secreto se borra cuando caduca o, si es un secreto de un solo uso, justo después de abrirse. Los secretos borrados no se pueden recuperar.

El borrado elimina el registro. Como en cualquier ordenador, pueden quedar restos cifrados en los diarios de la base de datos, en el espacio libre del disco o en copias de seguridad hasta que se sobrescriban. Son texto cifrado sin clave, y tratamos las copias de seguridad en consecuencia.

## Lo que no hacemos

- No usamos cookies ni rastreo, y no mostramos anuncios.
- No cargamos nada de otros sitios: ni fuentes, ni scripts, ni imágenes externas, así que ningún tercero ve tu visita.
- No te pedimos que crees una cuenta.
- No vendemos ni compartimos tus datos.

Tu elección de tema (claro u oscuro) se recuerda en el almacenamiento local de tu navegador y nunca se envía a ninguna parte.

## Registros del servidor

Como la mayoría de los sitios web, nuestro servidor puede registrar brevemente datos técnicos de cada solicitud, como tu dirección IP y la hora, para mantener el servicio seguro y en funcionamiento. [Describe how long logs are kept, or state that they are not kept.] Los registros nunca contienen claves de secretos, porque los navegadores no envían la parte del enlace que contiene la clave.

## Tus derechos

Según dónde vivas, puedes tener derecho a preguntar qué datos tenemos sobre ti y a que se corrijan o se borren. Como no guardamos casi nada que te identifique, normalmente hay poco que compartir. Escríbenos a [contact@shhnote.com](mailto:contact@shhnote.com).

## Contacto

Preguntas sobre esta política: [contact@shhnote.com](mailto:contact@shhnote.com).
