---
title: "El ciclo de vida criptográfico completo"
description: "Qué pasa con tus datos en cada paso en shhnote: las primitivas, los parámetros y los límites de confianza, explicados con sus advertencias honestas."
eyebrow: "Seguridad · En detalle"
intro: "Un recorrido preciso por lo que ocurre con tus datos en cada paso, con las primitivas, los parámetros y los límites de confianza explicados. Cada paso empieza con un resumen en lenguaje sencillo, para que leas con el nivel de detalle que prefieras."
wide: true
depth: detailed
---

<section class="section">
<div class="container">
<div class="explainer">
  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Paso 01 · Cifrado</p>
      <h3>Tu secreto se sella en tu dispositivo</h3>
      <p class="plain"><b>En pocas palabras:</b> el cifrado ocurre en tu navegador, antes de subir nada. Lo que recibimos ya es ilegible.</p>
    </div>
    <div class="explainer__detail">
      <p>Cuando pulsas <b>Cifrar</b>, el navegador obtiene una nueva clave de contenido de 256 bits del WebCrypto CSPRNG y cifra tus datos con <b>AES-256-GCM</b>. GCM es autenticado: cada fragmento lleva una etiqueta de 128 bits, así que cualquier manipulación posterior se detecta en lugar de descifrarse sin avisar.</p>
      <p>El texto y los archivos se tratan igual: ambos se convierten en un único bloque binario opaco, rellenado hasta un tamaño estándar para que una contraseña corta y un archivo pequeño parezcan iguales. El texto sin cifrar nunca toca la red ni sale de la memoria de la pestaña.</p>
      <div class="spec-list">
        <div><span class="k">Algoritmo</span><span class="v">AES-256-GCM, fragmentos de 64 KiB</span></div>
        <div><span class="k">Clave de contenido</span><span class="v">256 bits, nueva para cada secreto</span></div>
        <div><span class="k">Nonce</span><span class="v">prefijo aleatorio de 7 bytes + contador</span></div>
        <div><span class="k">Etiqueta de autenticación</span><span class="v">128 bits por fragmento</span></div>
        <div><span class="k">Relleno</span><span class="v">Padmé, mínimo 64 KiB</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Paso 02 · Custodia de la clave</p>
      <h3>La clave se esconde en el enlace, no en nuestros servidores</h3>
      <p class="plain"><b>En pocas palabras:</b> la parte del enlace que sigue al <span class="color-accent">#</span> contiene la clave, y los navegadores nunca envían esa parte a ningún servidor.</p>
    </div>
    <div class="explainer__detail">
      <p>Tu enlace lleva una <b>semilla</b> aleatoria de 256 bits en el <b>fragmento</b> de la URL, es decir, todo lo que va después del <span class="color-accent">#</span>. Según la especificación de URL, el navegador elimina el fragmento y <b>nunca lo incluye en la solicitud</b> que envía a nuestros servidores. A partir de esa semilla, el navegador deriva con HKDF un valor de búsqueda para encontrar el secreto y la clave que desenvuelve la clave de contenido. El servidor solo llega a ver un hash del valor de búsqueda.</p>
      <p>El navegador del destinatario lee la semilla del fragmento y hace la misma derivación en local. Esto es lo que significa aquí “conocimiento cero”: tener el texto cifrado no sirve de nada sin el enlace.</p>
      <div class="spec-list">
        <div><span class="k">Ubicación de la clave</span><span class="v">fragmento de URL #</span></div>
        <div><span class="k">¿Se envía al servidor?</span><span class="v">nunca</span></div>
        <div><span class="k">Semilla</span><span class="v">32 bytes aleatorios, base64url</span></div>
        <div><span class="k">Derivación</span><span class="v">HKDF-SHA-256</span></div>
        <div><span class="k">El servidor guarda</span><span class="v">solo SHA-256(búsqueda)</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Paso 03 · Frase de contraseña opcional</p>
      <h3>Un segundo candado que solo tienen las personas</h3>
      <p class="plain"><b>En pocas palabras:</b> si añades una frase de contraseña, ni siquiera alguien con el enlace completo puede abrir el secreto sin ella.</p>
    </div>
    <div class="explainer__detail">
      <p>Si pones una frase de contraseña, se refuerza con <b>Argon2id</b>, una función de derivación de claves de uso intensivo de memoria, y se combina con la semilla para obtener la clave que envuelve la clave de contenido. La frase de contraseña en sí nunca se transmite ni se almacena; solo la conocen tú y el destinatario. Los intentos fallidos se repiten en el navegador del destinatario con datos que ya tiene, así que el servidor no puede contarlos.</p>
      <p>El uso intensivo de memoria encarece los intentos masivos sin conexión, incluso con GPU y ASIC. Comparte la frase de contraseña por un <b>canal distinto</b> al del enlace y los dos factores nunca coincidirán en un mismo lugar. El módulo Argon2 se descarga en cada creación y en cada visualización, así que la red no puede saber qué secretos usan una.</p>
      <div class="spec-list">
        <div><span class="k">KDF</span><span class="v">Argon2id</span></div>
        <div><span class="k">Sal</span><span class="v">128 bits aleatorios</span></div>
        <div><span class="k">Envoltura</span><span class="v">AES-256-GCM, IV de 96 bits</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Paso 04 · Tránsito y almacenamiento</p>
      <h3>Solo el texto cifrado sale de tu dispositivo</h3>
      <p class="plain"><b>En pocas palabras:</b> guardamos una caja cerrada y una hora de caducidad. Nada más: ni texto sin cifrar, ni clave, ni registros sobre ti.</p>
    </div>
    <div class="explainer__detail">
      <p>El bloque se sube a través de <b>TLS</b> y se almacena en reposo como texto cifrado, junto con credenciales con hash, su duración y una hora de caducidad redondeada. A propósito, <b>no</b> guardamos la identidad del remitente, el destinatario, registros de IP, la hora de creación ni el historial de accesos. No hay un sistema de cuentas que vincule un secreto a una persona. La limitación de frecuencia funciona con un HMAC de la dirección y una sal que rota, así que nada de antes de una rotación puede vincularse con nada de después.</p>
      <p>Como el objeto almacenado no significa nada sin la semilla del fragmento, si el servidor se ve comprometido o recibe una orden judicial, solo se obtienen bytes opacos y hashes que no pueden convertirse de nuevo en nada.</p>
      <div class="spec-list">
        <div><span class="k">En tránsito</span><span class="v">TLS</span></div>
        <div><span class="k">En reposo</span><span class="v">texto cifrado + claves con hash + caducidad</span></div>
        <div><span class="k">Registros</span><span class="v">ninguno por secreto</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Paso 05 · Recuperación y destrucción</p>
      <h3>La primera lectura gana y después se borra</h3>
      <p class="plain"><b>En pocas palabras:</b> abrir un enlace de un solo uso entrega la caja una vez y borra la copia del servidor. O destrúyelo tú mismo cuando quieras.</p>
    </div>
    <div class="explainer__detail">
      <p>No se descarga nada al cargar la página para mostrar el secreto: la solicitud solo sale con un clic o una pulsación de tecla reales, así que los escáneres de enlaces y las vistas previas de los chats no pueden consumir un secreto. En un secreto de un solo uso, el servidor <b>reclama</b> la fila con una única actualización condicional (exactamente una solicitud gana) y el secreto cuenta como consumido desde ese momento. El mismo navegador puede volver a descargarlo durante 15 minutos si se corta la conexión; nadie más puede, y una reclamación sin confirmar se destruye, nunca se revierte. Los secretos con tiempo limitado son una lectura normal hasta que caducan.</p>
      <p>Cada secreto tiene además un <b>enlace de destrucción</b> privado. Abrirlo no destruye nada por sí solo; al confirmar, el texto cifrado se borra de inmediato, antes de que ningún destinatario pueda leerlo.</p>
      <div class="spec-list">
        <div><span class="k">Un solo uso</span><span class="v">reclamación atómica y después destrucción</span></div>
        <div><span class="k">Plazo para volver a descargar</span><span class="v">15 min, solo el mismo cliente</span></div>
        <div><span class="k">Caducidad</span><span class="v">de 15 min a 14 días</span></div>
        <div><span class="k">Control del propietario</span><span class="v">enlace de destrucción</span></div>
      </div>
    </div>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Modelo de amenazas</p>
  <h2 class="section__heading">Qué puede y qué no puede ver shhnote</h2>
  <p class="section__intro">La versión honesta. Aquí está exactamente el límite de confianza.</p>
</header>

<div class="bordered-cells bordered-cells--stack">
  <div class="cell">
    <p class="eyebrow eyebrow--danger">Nunca sale de tu dispositivo</p>
    <h3>Lo que no podemos ver</h3>
    <p>Tu texto sin cifrar · la clave de contenido y la semilla · tu frase de contraseña · si se puso una frase de contraseña · quién creó o abrió un secreto · cuándo se creó · registros de acceso a nivel de IP. Nada de esto se transmite ni se conserva.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Almacenado en nuestros servidores</p>
    <h3>Lo que sí tenemos</h3>
    <p>Un bloque cifrado que no podemos abrir · su categoría de tamaño con relleno · hashes unidireccionales de los valores que usa tu navegador para encontrarlo o destruirlo · si es de un solo uso o con tiempo limitado · una hora de caducidad redondeada. Todo ello inútil sin la semilla de tu enlace.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Conviene saberlo</p>
    <h3>Las advertencias honestas</h3>
    <p>Cualquiera que tenga el enlace completo (y la frase de contraseña, si la hay) puede leer un secreto de un solo uso: trata el enlace como el propio secreto. Después de mostrar un secreto, la página sobrescribe lo que puede cuando sales, pero JavaScript no puede garantizarlo; cierra la pestaña cuando termines. Un navegador controlado por automatización que introduzca acciones reales puede abrir un secreto de un solo uso igual que lo haría una persona; el destinatario no encontrará nada, que es el resultado honesto. Borrar un secreto elimina el registro; pueden quedar restos cifrados en diarios, espacio libre del disco o copias de seguridad hasta que se sobrescriban, como texto cifrado sin clave. Los secretos grandes almacenados fuera de la base de datos conservan la hora en que se escribió el archivo. Y, como con cualquier aplicación web, confías en el código que se envía a tu navegador: por eso shhnote es de código abierto y se puede alojar por cuenta propia.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Especificación criptográfica</p>
  <h2 class="section__heading">Todas las primitivas, en un solo lugar</h2>
</header>

<div class="spec-sheet">
  <div class="spec">
    <p class="eyebrow">Cifrado</p>
    <div class="spec__val">AES-256-GCM</div>
    <p>Cifrado simétrico autenticado en fragmentos de 64 KiB. Una clave de 256 bits más una etiqueta de integridad por fragmento, así que cualquier manipulación o truncamiento se detecta, no solo queda ilegible.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Derivación de claves</p>
    <div class="spec__val">HKDF · Argon2id</div>
    <p>Las claves y los identificadores se obtienen de la semilla mediante HKDF-SHA-256. Las frases de contraseña opcionales se refuerzan con una KDF de uso intensivo de memoria, lo que hace que la fuerza bruta sin conexión sea lenta y costosa incluso con hardware dedicado.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Aleatoriedad</p>
    <div class="spec__val">WebCrypto CSPRNG</div>
    <p>Las semillas, claves, sales y nonces salen del generador criptográficamente seguro del navegador. Nunca <span class="color-faint">Math.random()</span>, nunca predecibles.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Custodia de la clave</p>
    <div class="spec__val">Fragmento de URL&nbsp;#</div>
    <p>La semilla va después del # en tu enlace. Los navegadores nunca transmiten el fragmento, así que nunca llega a nuestros servidores.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">En tránsito</p>
    <div class="spec__val">TLS</div>
    <p>Solo el texto cifrado sale de tu dispositivo, a través de TLS moderno. Lo que recibimos es un bloque opaco que no podemos abrir.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">En reposo</p>
    <div class="spec__val">Texto cifrado + hashes</div>
    <p>Guardamos un bloque cifrado, hashes unidireccionales de sus credenciales y una caducidad redondeada: ni texto sin cifrar, ni claves, ni metadatos del remitente o del destinatario.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Preguntas técnicas</p>
  <h2 class="section__heading">Para quienes se preocupan por la seguridad</h2>
</header>

<div class="faq">
  <details open>
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
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="prose">

## Consejos para compartir de forma segura

- Envía la frase de contraseña por una vía distinta a la del enlace; por ejemplo, el enlace por correo y la frase de contraseña por teléfono.
- Elige la caducidad más corta que te sirva.
- Usa un secreto de un solo uso para contraseñas y otra información que deba leerse exactamente una vez.

<h2 id="reporting-a-vulnerability">Informar de una vulnerabilidad</h2>

Si crees que has encontrado un problema de seguridad en este sitio, escríbenos a [security@shhnote.com](mailto:security@shhnote.com) y avísanos en privado antes de contárselo a nadie más. Incluye lo que encontraste y cómo reproducirlo.

Nos comprometemos a:

- responder en un plazo de [number] días hábiles;
- mantenerte informado mientras lo corregimos;
- reconocer tu aportación cuando publiquemos la corrección, si así lo deseas.

Mientras haces pruebas, no accedas a datos de otras personas, no interrumpas el servicio ni ejecutes escaneos automatizados que lo sobrecarguen.

Vulnerabilidades en el propio software shhnote: consulta la [política de seguridad del proyecto](https://github.com/shhnote/shhnote/security).

<p class="btn-row btn-row--center"><a href="/es/#create" class="btn btn--primary"><span>Crear un secreto</span></a> <a href="https://github.com/shhnote/shhnote" target="_blank" rel="noopener" class="btn btn--ghost"><span>Ver el código en GitHub</span></a></p>

</div>
</div>
</section>
