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

### 1. Le dépôt GitHub

Créez un dépôt nommé `deeemines-site`, en **privé**, et déposez-y le contenu
de ce dossier. La branche doit s'appeler `main`.

Puis ouvrez `src/admin/config.yml` et complétez la ligne `repo:` avec le nom
du compte GitHub qui héberge le dépôt. C'est la seule ligne à changer.

### 2. Netlify

Sur netlify.com, « Add new site », « Import an existing project », choisissez
GitHub et le dépôt. Netlify lit `netlify.toml` et n'a besoin d'aucun réglage :
il lance `npm run build` et publie le dossier `_site`.

À partir de là, toute modification enregistrée depuis l'administration
reconstruit et republie le site automatiquement, en une minute environ.

### 3. L'authentification

Dans Netlify, ouvrez les réglages du site, « Access control », puis
« OAuth » et « Install provider » : choisissez GitHub. C'est ce qui permet
au bouton « se connecter » de l'administration de fonctionner.

### 4. Les accès

Sur GitHub, dans les réglages du dépôt, « Collaborators », invitez le second
compte. Les personnes invitées se connectent ensuite sur
`deeemines.com/admin`, cliquent sur « se connecter avec GitHub », et voient
directement le formulaire. Elles n'ont jamais à ouvrir GitHub ensuite.

### 5. Le domaine

Le nom de domaine reste chez OVH. Dans Netlify, « Domain management »,
ajoutez `deeemines.com` : Netlify indique les enregistrements DNS à créer
chez OVH. Le certificat de sécurité est délivré automatiquement.

### 6. Les messages du formulaire

Le formulaire de contact est branché sur Netlify Forms : rien à configurer,
Netlify détecte le formulaire au premier déploiement. Les messages arrivent
dans « Forms » dans le tableau de bord du site.

Pour les recevoir par courriel, allez dans les réglages du site,
« Forms », « Form notifications », « Add notification », « Email
notification », et indiquez kristell.riounivert@deeemines.com. Gratuit jusqu'à cent
messages par mois.

Le formulaire ne fonctionne que sur le site publié. En local il affichera
un message d'erreur invitant à écrire directement : c'est normal.

### 7. Avant l'ouverture au public

Retirez du fichier `src/index.njk` la ligne :

    <meta name="robots" content="noindex, nofollow">

Tant qu'elle est là, les moteurs de recherche ignorent le site.

---

## Travailler en local

    npm install
    npm start

Le site s'ouvre sur `http://localhost:8080` et se recharge à chaque
modification. `npm run build` produit le dossier `_site` sans le serveur.

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
