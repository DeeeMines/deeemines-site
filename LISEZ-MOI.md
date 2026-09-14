# Site DeeeMines

Le site vitrine, avec son administration à `/admin` pour modifier les textes,
les images et les actualités sans toucher au code.

---

## Ce qu'il y a dans ce dossier

    src/index.njk           la page du site (accueil, antimoine, équipe, actualités, mentions)
    src/article.njk         le gabarit des pages d'actualité
    src/_includes/          les morceaux communs : tête, en-tête, styles, pied, scripts
    src/_data/              le contenu modifiable depuis l'administration
      contenu.json            bandeau d'accueil, trois matières, feuille de route, coordonnées
      actualites.json         la liste des actualités
      equipe.json             cofondateurs, équipe scientifique, comité stratégique
      partenaires.json        le bandeau de logos
      statique.json           les traductions des textes qui restent dans le gabarit
      i18n.js                 assemble le dictionnaire français / anglais
      articles.js             la liste des actualités qui ont une page dédiée
    src/assets/             les 25 logos et photos
    src/admin/              l'administration (Sveltia CMS)
    eleventy.config.js      la configuration du générateur
    netlify.toml            la configuration de la mise en ligne

Deux fichiers ne sont pas dans l'archive et sont à copier **dans le
sous-dossier `src/`** avant l'envoi sur GitHub : **hero.mp4** et
**hero-poster.jpg**, la vidéo de fond du bandeau d'accueil et son image
d'attente. Ils vont à côté de `index.njk`, pas à la racine.

---

## Mise en place, une seule fois

Le site est hébergé chez **Cloudflare Pages**. Trois raisons : c'est gratuit
sans compteur qui puisse éteindre le site, les publications sont plafonnées à
500 par mois au lieu d'une vingtaine, et un dépassement bloque les nouvelles
publications sans jamais mettre le site hors ligne.

### 1. Le dépôt GitHub

Un dépôt `deeemines-site`, branche `main`, contenant ce dossier. La ligne
`repo:` de `src/admin/config.yml` porte le nom du compte qui l'héberge.

### 2. Cloudflare Pages

Sur dash.cloudflare.com, « Workers & Pages », « Create application », onglet
« Pages », « Connect to Git ». Choisissez le dépôt, puis renseignez :

    Framework preset            None
    Build command               npm run build
    Build output directory      _site
    Variable d'environnement    NODE_VERSION = 20

Cloudflare publie sur une adresse en `.pages.dev` et reconstruit à chaque
modification du dépôt, y compris celles enregistrées depuis l'administration.

### 3. La connexion à l'administration

L'administration a besoin d'un petit service qui gère la connexion GitHub.
Il est gratuit, publié par l'auteur de Sveltia, et s'installe en trois clics :
`github.com/sveltia/sveltia-cms-auth`, bouton « Deploy to Cloudflare ».

Ensuite, sur GitHub, « Settings » du compte, « Developer settings »,
« OAuth Apps », « New OAuth App ». L'adresse de rappel est celle du service
suivie de `/callback`. Reportez l'identifiant et le secret obtenus dans les
variables du service, côté Cloudflare.

Enfin, dans `src/admin/config.yml`, complétez la ligne `base_url:` avec
l'adresse du service. Sans elle, le bouton « se connecter » ne fait rien.

### 4. Les accès

Sur GitHub, réglages du dépôt, « Collaborators », invitez le second compte
avec le rôle **Write**. Les personnes invitées se connectent ensuite sur
`deeemines.com/admin` et n'ont jamais à rouvrir GitHub.

### 5. Le domaine

Le nom de domaine reste chez OVH. Dans le projet Cloudflare Pages, onglet
« Custom domains », ajoutez `deeemines.com` : Cloudflare indique les
enregistrements à créer chez OVH. Le certificat est délivré automatiquement.

### 6. Les messages du formulaire

Le formulaire est envoyé à un service extérieur qui les transmet par courriel.
Créez une clé d'accès gratuite sur `web3forms.com` en indiquant l'adresse de
réception, puis reportez cette clé dans `src/_data/reglages.json`, champ
`formulaire_cle`.

Tant que ce champ est vide, le formulaire n'essaie même pas d'envoyer : il
affiche le message invitant à écrire directement, avec un lien de messagerie
prérempli. C'est aussi ce qui se passe en local, et c'est normal.

Ce service reçoit le nom, l'adresse électronique et le message des personnes
qui écrivent. Il doit donc être mentionné dans la politique de confidentialité,
et le point mérite d'être soumis au conseil juridique.

### 7. Avant l'ouverture au public

Retirez du fichier `src/index.njk` la ligne :

    <meta name="robots" content="noindex, nofollow">

Tant qu'elle est là, les moteurs de recherche ignorent le site.

---

## Travailler en local

Rien n'oblige à publier pour voir le résultat, et c'est bien plus rapide.

Une seule fois, installez Node.js (`winget install OpenJS.NodeJS.LTS`),
puis dans le dossier du site :

    npm install

Ensuite, à chaque séance de travail :

    npm start

Le site s'ouvre sur `http://localhost:8080` et se recharge tout seul à
chaque fichier déposé dans le dossier. Aucune connexion, aucun crédit.
`npm run build` produit le dossier `_site` sans lancer le serveur.

### Montrer une version à quelqu'un sans publier

Déposez les fichiers sur une branche autre que `main` : Cloudflare construit
un aperçu à une adresse temporaire, sans toucher au site public. La fusion
dans `main` publie pour de bon.

---

## Les actualités

Chaque actualité a un **résumé**, affiché dans la liste, et un **article
complet** facultatif. Si le champ « Article complet » est rempli, l'actualité
obtient sa propre page à une adresse du type
`deeemines.com/actualites/prix-i-phd`, et un lien « Lire la suite » apparaît
dans la liste. S'il est vide, seul le résumé s'affiche, sans lien.

L'adresse de la page se déduit du titre, sauf si vous renseignez le champ
« Adresse de la page ». Une fois un article partagé, ne changez plus cette
adresse : les liens déjà envoyés cesseraient de fonctionner.

## Ce qui se modifie depuis l'administration

Le bandeau d'accueil, les textes des trois matières valorisées, la feuille
de route, les coordonnées, les actualités, les membres de l'équipe et leurs
photos, les logos partenaires. Chaque texte apparaît en français et en
anglais côte à côte.

## Ce qui reste dans le code

Les mises en page, les largeurs, les espacements, les couleurs, la page
« L'antimoine », les mentions légales et la politique de confidentialité.
C'est volontaire : ce sont les réglages qui font tenir la cohérence du site.
