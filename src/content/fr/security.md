---
title: "Le cycle de vie cryptographique complet"
description: "Ce que deviennent vos données à chaque étape sur shhnote : primitives, paramètres et frontières de confiance détaillés, avec les limites honnêtement exposées."
eyebrow: "Sécurité · En détail"
intro: "Une description précise de ce que deviennent vos données à chaque étape, avec les primitives, les paramètres et les frontières de confiance détaillés. Chaque étape commence par un résumé en termes simples : lisez au niveau de détail qui vous convient."
wide: true
depth: detailed
---

<section class="section">
<div class="container">
<div class="explainer">
  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Étape 01 · Chiffrement</p>
      <h3>Votre secret est scellé sur votre appareil</h3>
      <p class="plain"><b>En termes simples :</b> le brouillage a lieu dans votre navigateur, avant tout envoi. Ce que nous recevons est déjà illisible.</p>
    </div>
    <div class="explainer__detail">
      <p>Lorsque vous appuyez sur <b>Chiffrer</b>, le navigateur tire une nouvelle clé de contenu de 256 bits du CSPRNG de WebCrypto et chiffre vos données avec <b>AES-256-GCM</b>. GCM est un mode authentifié : chaque bloc porte une étiquette de 128 bits, si bien que toute altération ultérieure est détectée au lieu d’être déchiffrée en silence.</p>
      <p>Le texte et les fichiers sont traités de la même façon : tous deux deviennent un bloc binaire opaque, complété jusqu’à une taille standard pour qu’un mot de passe court et un petit fichier se ressemblent. Le texte en clair ne passe jamais sur le réseau et ne quitte jamais la mémoire de l’onglet.</p>
      <div class="spec-list">
        <div><span class="k">Algorithme</span><span class="v">AES-256-GCM, blocs de 64 KiB</span></div>
        <div><span class="k">Clé de contenu</span><span class="v">256 bits, nouvelle pour chaque secret</span></div>
        <div><span class="k">Nonce</span><span class="v">préfixe aléatoire de 7 octets + compteur</span></div>
        <div><span class="k">Étiquette d’authentification</span><span class="v">128 bits par bloc</span></div>
        <div><span class="k">Remplissage</span><span class="v">Padmé, 64 KiB minimum</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Étape 02 · Garde de la clé</p>
      <h3>La clé se cache dans le lien, pas sur nos serveurs</h3>
      <p class="plain"><b>En termes simples :</b> la partie du lien située après le <span class="color-accent">#</span> contient la clé, et les navigateurs n’envoient jamais cette partie à aucun serveur.</p>
    </div>
    <div class="explainer__detail">
      <p>Votre lien transporte une <b>graine</b> aléatoire de 256 bits dans le <b>fragment</b> de l’URL, c’est-à-dire tout ce qui suit le <span class="color-accent">#</span>. Selon la spécification des URL, le navigateur retire le fragment, qui n’est <b>jamais inclus dans la requête</b> envoyée à nos serveurs. À partir de cette graine, le navigateur dérive, avec HKDF, une valeur de recherche pour retrouver le secret et la clé qui déchiffre la clé de contenu. Le serveur ne voit jamais qu’une empreinte de la valeur de recherche.</p>
      <p>Le navigateur du destinataire lit la graine dans le fragment et effectue la même dérivation localement. C’est ce que « divulgation nulle de connaissance » signifie ici : posséder les données chiffrées seules ne sert à rien sans le lien.</p>
      <div class="spec-list">
        <div><span class="k">Emplacement de la clé</span><span class="v">fragment d’URL #</span></div>
        <div><span class="k">Envoyée au serveur ?</span><span class="v">jamais</span></div>
        <div><span class="k">Graine</span><span class="v">32 octets aléatoires, base64url</span></div>
        <div><span class="k">Dérivation</span><span class="v">HKDF-SHA-256</span></div>
        <div><span class="k">Stocké par le serveur</span><span class="v">SHA-256(valeur de recherche) uniquement</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Étape 03 · Phrase de passe facultative</p>
      <h3>Un second verrou que seuls des humains détiennent</h3>
      <p class="plain"><b>En termes simples :</b> ajoutez une phrase de passe, et même une personne disposant du lien complet ne pourra pas ouvrir le secret sans elle.</p>
    </div>
    <div class="explainer__detail">
      <p>Si vous définissez une phrase de passe, elle est renforcée par <b>Argon2id</b>, une fonction de dérivation de clé à mémoire intensive, puis combinée à la graine pour former la clé qui chiffre la clé de contenu. La phrase de passe elle-même n’est jamais transmise ni stockée ; seuls vous et le destinataire la connaissez. Les essais erronés sont refaits dans le navigateur du destinataire, sur des données qu’il détient déjà : le serveur ne peut donc pas les compter.</p>
      <p>L’usage intensif de la mémoire rend coûteuses les tentatives hors ligne à grande échelle, même sur GPU et ASIC. Transmettez la phrase de passe par un <b>autre canal</b> que le lien, et les deux facteurs ne se trouvent jamais au même endroit. Le module Argon2 est téléchargé à chaque création et à chaque affichage, de sorte que le réseau ne peut pas savoir quels secrets en utilisent une.</p>
      <div class="spec-list">
        <div><span class="k">KDF</span><span class="v">Argon2id</span></div>
        <div><span class="k">Sel</span><span class="v">128 bits aléatoires</span></div>
        <div><span class="k">Encapsulation</span><span class="v">AES-256-GCM, IV de 96 bits</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Étape 04 · Transit &amp; stockage</p>
      <h3>Seules des données chiffrées quittent votre appareil</h3>
      <p class="plain"><b>En termes simples :</b> nous stockons une boîte verrouillée et une date d’expiration. Rien d’autre : pas de texte en clair, pas de clé, aucune trace de vous.</p>
    </div>
    <div class="explainer__detail">
      <p>Le bloc est envoyé via <b>TLS</b> et stocké au repos sous forme chiffrée, à côté d’identifiants hachés, de sa durée de vie et d’une heure d’expiration arrondie. Nous ne conservons délibérément <b>aucune</b> identité d’expéditeur, aucun destinataire, aucun journal d’IP, aucune date de création ni aucun historique d’accès. Il n’existe pas de système de comptes qui permettrait de relier un secret à une personne. La limitation de débit repose sur un HMAC de l’adresse avec un sel qui change régulièrement, si bien que rien de ce qui précède une rotation ne peut être relié à ce qui la suit.</p>
      <p>Comme l’objet stocké n’a aucun sens sans la graine contenue dans le fragment, une compromission du serveur ou une réquisition judiciaire ne livre que des octets opaques et des empreintes dont on ne peut rien tirer.</p>
      <div class="spec-list">
        <div><span class="k">En transit</span><span class="v">TLS</span></div>
        <div><span class="k">Au repos</span><span class="v">données chiffrées + clés hachées + expiration</span></div>
        <div><span class="k">Journaux</span><span class="v">aucun par secret</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Étape 05 · Récupération &amp; destruction</p>
      <h3>La première lecture l’emporte, puis tout est effacé</h3>
      <p class="plain"><b>En termes simples :</b> ouvrir un lien à usage unique remet la boîte une seule fois et supprime la copie du serveur. Vous pouvez aussi la détruire vous-même, à tout moment.</p>
    </div>
    <div class="explainer__detail">
      <p>Rien n’est récupéré au chargement de la page d’affichage : la requête ne part qu’après un vrai clic ou une vraie pression de touche, pour que les scanners de liens et les aperçus de chat ne puissent pas consommer un secret. Pour un secret à usage unique, le serveur <b>réclame</b> la ligne en une seule mise à jour conditionnelle (une seule requête l’emporte) et le secret est considéré comme consommé dès cet instant. Le même navigateur peut retélécharger pendant 15 minutes si la connexion est coupée ; personne d’autre ne le peut, et une réclamation non confirmée est détruite, jamais annulée. Les secrets à durée limitée sont simplement lus jusqu’à leur expiration.</p>
      <p>Chaque secret dispose aussi d’un <b>lien de destruction</b> privé. L’ouvrir ne détruit rien à lui seul ; confirmer efface les données chiffrées immédiatement, avant que le moindre destinataire puisse les lire.</p>
      <div class="spec-list">
        <div><span class="k">Usage unique</span><span class="v">réclamation atomique, puis destruction</span></div>
        <div><span class="k">Fenêtre de retéléchargement</span><span class="v">15 min, même client uniquement</span></div>
        <div><span class="k">Expiration</span><span class="v">15 min – 14 jours</span></div>
        <div><span class="k">Contrôle par le créateur</span><span class="v">lien de destruction</span></div>
      </div>
    </div>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Modèle de menace</p>
  <h2 class="section__heading">Ce que shhnote peut voir, et ce qu’il ne peut pas voir</h2>
  <p class="section__intro">La version honnête. Voici exactement où se situe la frontière de confiance.</p>
</header>

<div class="bordered-cells bordered-cells--stack">
  <div class="cell">
    <p class="eyebrow eyebrow--danger">Ne quitte jamais votre appareil</p>
    <h3>Ce que nous ne pouvons pas voir</h3>
    <p>Votre texte en clair · la clé de contenu et la graine · votre phrase de passe · le fait qu’une phrase de passe ait été définie ou non · qui a créé ou ouvert un secret · quand il a été créé · les journaux d’accès au niveau IP. Rien de tout cela n’est transmis ni conservé.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Stocké sur nos serveurs</p>
    <h3>Ce que nous détenons</h3>
    <p>Un bloc chiffré que nous ne pouvons pas ouvrir · sa classe de taille après remplissage · des empreintes à sens unique des valeurs que votre navigateur utilise pour le retrouver ou le détruire · s’il est à usage unique ou à durée limitée · une heure d’expiration arrondie. Tout cela est inutile sans la graine contenue dans votre lien.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Bon à savoir</p>
    <h3>Les limites, honnêtement</h3>
    <p>Toute personne disposant du lien complet (et de la phrase de passe, le cas échéant) peut lire un secret à usage unique : considérez le lien comme le secret lui-même. Après l’affichage d’un secret, la page écrase ce qu’elle peut lorsque vous la quittez, mais JavaScript ne peut pas le garantir ; fermez l’onglet quand vous avez terminé. Un navigateur piloté par un automate qui injecte de vraies saisies peut ouvrir un secret à usage unique comme le ferait une personne ; le destinataire ne trouve alors rien, ce qui est le résultat honnête. Supprimer un secret efface l’enregistrement ; des restes chiffrés peuvent subsister dans les journaux, l’espace disque libre ou les sauvegardes jusqu’à ce qu’ils soient écrasés, sous forme de données chiffrées sans clé. Les secrets volumineux stockés en dehors de la base de données portent l’heure d’écriture du fichier. Enfin, comme pour toute application web, vous faites confiance au code envoyé à votre navigateur : c’est pourquoi shhnote est open source et auto-hébergeable.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Spécification cryptographique</p>
  <h2 class="section__heading">Toutes les primitives, au même endroit</h2>
</header>

<div class="spec-sheet">
  <div class="spec">
    <p class="eyebrow">Chiffrement</p>
    <div class="spec__val">AES-256-GCM</div>
    <p>Chiffrement symétrique authentifié par blocs de 64 KiB. Une clé de 256 bits et une étiquette d’intégrité par bloc : toute altération ou troncature est détectée, pas seulement rendue illisible.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Dérivation de clé</p>
    <div class="spec__val">HKDF · Argon2id</div>
    <p>Les clés et les identifiants sont dérivés de la graine par HKDF-SHA-256. Les phrases de passe facultatives sont renforcées par une KDF à mémoire intensive, ce qui rend la force brute hors ligne lente et coûteuse, même sur du matériel dédié.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Aléa</p>
    <div class="spec__val">WebCrypto CSPRNG</div>
    <p>Les graines, clés, sels et nonces proviennent du générateur cryptographiquement sûr du navigateur. Jamais <span class="color-faint">Math.random()</span>, jamais prévisibles.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Garde de la clé</p>
    <div class="spec__val">Fragment d’URL&nbsp;#</div>
    <p>La graine voyage après le # de votre lien. Les navigateurs ne transmettent jamais le fragment : elle n’atteint donc jamais nos serveurs.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">En transit</p>
    <div class="spec__val">TLS</div>
    <p>Seules des données chiffrées quittent votre appareil, via un TLS moderne. Ce que nous recevons est un bloc opaque que nous ne pouvons pas ouvrir.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Au repos</p>
    <div class="spec__val">Données chiffrées + empreintes</div>
    <p>Nous conservons un bloc chiffré, des empreintes à sens unique de ses identifiants et une expiration arrondie : pas de texte en clair, pas de clés, pas de métadonnées sur l’expéditeur ou le destinataire.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">FAQ technique</p>
  <h2 class="section__heading">Pour les plus exigeants en sécurité</h2>
</header>

<div class="faq">
  <details open>
    <summary>Comment la garantie d’usage unique résiste-t-elle aux accès concurrents ?</summary>
    <p>L’affichage exécute une seule mise à jour conditionnelle qui fait passer la ligne de l’état « actif » à l’état « réclamé ». Deux requêtes simultanées ne peuvent pas réussir toutes les deux ; la seconde trouve un enregistrement déjà réclamé et reçoit la même réponse « aucun secret trouvé » que n’importe qui d’autre. La réclamation n’est jamais annulée : si le téléchargement échoue, le détenteur du jeton de réclamation peut retélécharger pendant la fenêtre prévue ; sinon, le secret est détruit sans avoir été lu.</p>
  </details>
  <details>
    <summary>Pourquoi le fragment d’URL plutôt qu’un paramètre de requête ?</summary>
    <p>Les paramètres de requête sont envoyés au serveur et se retrouvent dans les journaux d’accès, les proxys et les outils d’analyse. Le fragment (après le <span class="color-accent">#</span>) est défini par la spécification des URL comme restant côté client : le navigateur ne l’inclut jamais dans la requête HTTP. Cette propriété est le fondement même de la conception à divulgation nulle de connaissance. Après l’affichage, la page retire aussi le fragment de la barre d’adresse et de l’historique.</p>
  </details>
  <details>
    <summary>Qu’est-ce qui empêche les scanners de liens de consommer les secrets à usage unique trop tôt ?</summary>
    <p>La page de consultation est le même document statique pour tous les secrets et ne récupère rien au chargement. La requête n’est envoyée qu’après un vrai clic ou une vraie pression de touche : un <code>click()</code> scripté ou une soumission de formulaire ne compte pas. Les scanners automatiques (sécurité des e-mails, aperçus de liens dans les chats, antivirus) ne chargent jamais que cette coquille statique.</p>
  </details>
  <details>
    <summary>Puis-je vérifier tout cela ou l’héberger moi-même ?</summary>
    <p>Oui. L’intégralité du code source est publique sous licence AGPLv3, le protocole est décrit dans une spécification accompagnée de vecteurs de conformité que toute implémentation peut utiliser pour se vérifier, et il existe un guide d’auto-hébergement. Vous pouvez auditer la cryptographie côté client et faire tourner votre propre instance, pour que la frontière de confiance soit entièrement la vôtre.</p>
  </details>
  <details>
    <summary>Est-ce que quelque chose est journalisé pour lutter contre les abus ?</summary>
    <p>Nous ne conservons ni journaux d’accès par secret ni historique d’adresses IP. La limitation de débit utilise un hachage à clé de l’adresse, avec un sel qui change régulièrement et remet à zéro tous les compteurs à chaque rotation. Les signalements d’abus sont comptés par jour ; aucune trace n’indique quel secret a été signalé.</p>
  </details>
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="prose">

## Conseils pour partager en toute sécurité

- Transmettez la phrase de passe par un autre moyen que le lien, par exemple le lien par e-mail et la phrase de passe par téléphone.
- Choisissez la durée d’expiration la plus courte possible.
- Utilisez un secret à usage unique pour les mots de passe et les autres informations qui ne doivent être lues qu’une seule fois.

<h2 id="reporting-a-vulnerability">Signaler une vulnérabilité</h2>

Si vous pensez avoir trouvé un problème de sécurité sur ce site, écrivez à [security@shhnote.com](mailto:security@shhnote.com) et prévenez-nous en privé avant d’en parler à qui que ce soit. Indiquez ce que vous avez trouvé et comment le reproduire.

Nous nous engageons à :

- répondre sous [number] jours ouvrés ;
- vous tenir informé pendant la correction ;
- vous créditer lors de la publication du correctif, si vous le souhaitez.

Pendant vos tests, merci de ne pas accéder aux données d’autrui, de ne pas perturber le service et de ne pas lancer de scans automatisés qui le surchargent.

Pour les vulnérabilités du logiciel shhnote lui-même, consultez la [politique de sécurité du projet](https://github.com/shhnote/shhnote/security).

<p class="btn-row btn-row--center"><a href="/fr/#create" class="btn btn--primary"><span>Créer un secret</span></a> <a href="https://github.com/shhnote/shhnote" target="_blank" rel="noopener" class="btn btn--ghost"><span>Voir le code source sur GitHub</span></a></p>

</div>
</div>
</section>
