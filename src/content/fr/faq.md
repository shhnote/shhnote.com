---
title: "Vos questions, nos réponses"
description: "Questions fréquentes sur shhnote : comptes, liens, phrases de passe, expiration, et les détails techniques pour les plus exigeants en sécurité."
eyebrow: "FAQ"
intro: "D’abord les réponses courtes, ensuite les techniques. Si votre question n’y figure pas, les pages Fonctionnement et Sécurité vont plus loin, et vous pouvez toujours nous écrire."
wide: true
---

<section class="section">
<div class="container">
<div class="faq">
  <details open>
    <summary>Ai-je besoin d’un compte ?</summary>
    <p>Non. Il n’y a rien à créer ni rien à installer. Ouvrez shhnote, écrivez votre secret, partagez le lien. C’est tout.</p>
  </details>
  <details>
    <summary>Et si le lien tombe entre de mauvaises mains ?</summary>
    <p>Un secret à usage unique ne peut être lu que par la première personne qui l’ouvre ; ensuite, il est détruit, et vous saurez que quelque chose l’a lu, car le destinataire prévu ne trouvera rien. Pour plus de sécurité, vous pouvez ajouter une phrase de passe et la transmettre séparément : le lien seul ne suffit alors plus. Et si vous changez d’avis, vous pouvez détruire le secret vous-même grâce à votre lien de destruction privé.</p>
  </details>
  <details>
    <summary>shhnote peut-il lire mon secret ?</summary>
    <p>Non. La clé qui permet de l’ouvrir ne nous parvient jamais : elle reste glissée dans votre lien, de votre côté. Nous ne détenons qu’une version brouillée que nous n’avons aucun moyen d’ouvrir.</p>
  </details>
  <details>
    <summary>Que se passe-t-il si personne ne l’ouvre ?</summary>
    <p>Vous choisissez une durée d’expiration, de 15 minutes à 14 jours. Une fois le délai écoulé, le secret est supprimé automatiquement, qu’il ait été ouvert ou non.</p>
  </details>
  <details>
    <summary>Quelle différence entre un secret à usage unique et un secret à durée limitée ?</summary>
    <p>Un secret à usage unique est détruit dès son ouverture. Un secret à durée limitée peut être rouvert jusqu’à son expiration, mais la page n’indique jamais le temps restant : considérez donc chaque secret comme quelque chose à enregistrer dès la première lecture.</p>
  </details>
  <details>
    <summary>Qu’est-ce que le lien de destruction ?</summary>
    <p>Un second lien, privé, que vous recevez en créant un secret. L’ouvrir affiche une demande de confirmation ; confirmer détruit le secret immédiatement, avant que quiconque puisse le lire. Gardez-le pour vous.</p>
  </details>
  <details>
    <summary>Puis-je envoyer des fichiers ?</summary>
    <p>Oui. Les fichiers sont chiffrés dans votre navigateur exactement comme le texte et voyagent dans le même bloc scellé. Tout est complété jusqu’à des tailles standard, si bien que même nous ne pouvons pas distinguer une courte note d’un petit fichier.</p>
  </details>
  <details>
    <summary>Est-ce que ça fonctionne dans Tor Browser ou sans JavaScript ?</summary>
    <p>Créer et afficher un secret nécessite JavaScript, car le chiffrement a lieu dans votre navigateur. Cela fonctionne dans Tor Browser au niveau « Plus sûr » ; au niveau « Le plus sûr », WebAssembly est désactivé : les secrets protégés par une phrase de passe ne peuvent alors pas être ouverts, et la page l’indique. Toutes les autres pages fonctionnent sans JavaScript.</p>
  </details>
  <details>
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
  <details>
    <summary>Y a-t-il une API ?</summary>
    <p>Oui, la même que celle qu’utilise ce site. La <a href="/en/docs/">documentation</a> la décrit, et le paquet client open source implémente le protocole pour vos propres outils.</p>
  </details>
</div>

<p class="prose-note">Encore des questions ? Découvrez <a href="/fr/how-it-works/">le fonctionnement</a>, les <a href="/fr/security/">détails de sécurité</a>, ou <a href="/fr/contact/">écrivez-nous</a>.</p>
</div>
</section>
