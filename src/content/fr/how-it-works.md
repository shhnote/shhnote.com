---
title: "Un secret qui s’ouvre une fois, puis disparaît"
description: "Le fonctionnement de shhnote en termes simples : votre secret est scellé dans votre navigateur, la clé voyage dans le lien, et le secret est supprimé une fois lu ou expiré."
eyebrow: "Fonctionnement"
intro: "Pas de compte, pas d’application, pas de jargon. Voici tout le principe en termes simples : vous l’aurez compris en moins d’une minute."
wide: true
depth: simple
---

<section class="section">
<div class="container">
<div class="flow">
  <div class="flow__step">
    <div class="flow__num">1</div>
    <div class="flow__body">
      <h3>Vous écrivez votre secret</h3>
      <p>Tapez un message ou joignez des fichiers : un mot de passe, une note privée, un document. Avant même qu’il ne quitte votre appareil, votre navigateur l’enferme dans une boîte scellée que seule une clé spéciale peut ouvrir.</p>
    </div>
  </div>
  <div class="flow__step">
    <div class="flow__num">2</div>
    <div class="flow__body">
      <h3>Vous obtenez un lien à partager</h3>
      <p>shhnote vous remet un lien unique et cache la clé <span class="color-faint">à l’intérieur</span>, après le #. Envoyez ce lien comme vous le souhaitez : SMS, e-mail, chat. La clé voyage avec le lien, jamais par le serveur de ce site : personne ici ne peut donc jeter un œil dans la boîte.</p>
    </div>
  </div>
  <div class="flow__step">
    <div class="flow__num">3</div>
    <div class="flow__body">
      <h3>Le destinataire l’ouvre, puis il disparaît</h3>
      <p>Le destinataire appuie sur un bouton, son navigateur ouvre la boîte, et le secret est supprimé du serveur de ce site : immédiatement pour un secret à usage unique, ou à la fin du délai que vous avez choisi. Rouvrez un lien à usage unique et il n’y a tout simplement plus rien. Pas de copie, pas d’historique, aucune trace.</p>
    </div>
  </div>
</div>

<div class="callout callout--lg">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 3l7 3v5c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>
  <span><b>Imaginez un mot qui se consume après une seule lecture.</b> Vous le scellez, vous le transmettez, et une fois lu, il n’existe plus. Même nous, qui exploitons ce site, ne pouvons jamais lire son contenu ni le faire revenir.</span>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Pourquoi c’est sûr</p>
  <h2 class="section__heading">Trois promesses, une ligne chacune</h2>
</header>

<div class="fenced-cells">
  <div class="cell">
    <p class="eyebrow">Privé</p>
    <h3>Nous ne pouvons pas le lire</h3>
    <p>Votre secret est brouillé sur votre appareil. Nous ne stockons que la boîte scellée, jamais la clé.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Éphémère</p>
    <h3>Il ne traîne pas</h3>
    <p>Une seule consultation, ou un délai que vous choisissez. Au premier des deux, le secret est supprimé pour de bon.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Transparent</p>
    <h3>Chacun peut vérifier notre travail</h3>
    <p>shhnote est open source. Des experts en sécurité peuvent lire, et lisent, exactement comment il fonctionne.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Questions fréquentes</p>
  <h2 class="section__heading">Les réponses courtes</h2>
</header>

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
</div>

<p class="prose-note">Envie de découvrir la vraie cryptographie derrière ces promesses ? <a href="/fr/security/">Lire la version détaillée →</a> Ou consultez <a href="/fr/faq/">toutes les questions</a>.</p>
</div>
</section>

