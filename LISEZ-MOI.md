# Site DeeeMines

Le site vitrine, avec son administration à `/admin` pour modifier tous les
textes, les images et les actualités sans toucher au code.

---

## Ce qu'il y a dans ce dossier

    src/pages/              les sept pages du site, une par fichier
      accueil.njk             l'accueil
      technologie.njk         Notre technologie
      antimoine.njk           L'antimoine
      equipe.njk              L'équipe
      actualites.njk          Les actualités
      mentions.njk            Les mentions légales
      confidentialite.njk     La politique de confidentialité
    src/article.njk         le gabarit des pages d'actualité
    src/_includes/          les morceaux communs : tête, en-tête, styles, pied, scripts
    src/_data/              le contenu modifiable depuis l'administration
      textes/                 les 272 textes du site, un fichier par page, en deux langues
      actualites.json         la liste des actualités
      equipe.json             cofondateurs, équipe scientifique, comité stratégique
      partenaires.json        le bandeau de logos
      dependance.json         les chiffres du graphique de la page L'antimoine
      contenu.json            coordonnées, liens, feuille de route
      adresses.json           l'adresse de chaque page, en français et en anglais
      reglages.json           la clé du formulaire de contact et le nom de domaine
    src/assets/             les logos et les photos
    src/admin/              l'administration (Sveltia CMS)
    src/hero.mp4            la vidéo de fond du bandeau d'accueil, et son image d'attente
    eleventy.config.js      la configuration du générateur
    package.json            la liste des outils à installer

Chaque page existe en français et en anglais à sa propre adresse, soit seize
adresses au total. Les anciennes adresses à dièse redirigent vers les
nouvelles.

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

C'est l'étape qui ouvre `/admin` à Kristell. Elle se fait en trois temps, une
seule fois, et ne se touche plus ensuite.

**a. Le service de connexion.** L'administration a besoin d'un petit service
qui gère la connexion GitHub. Il est gratuit, publié par l'auteur de Sveltia,
et s'installe en trois clics : sur `github.com/sveltia/sveltia-cms-auth`,
bouton « Deploy to Cloudflare ». Cloudflare vous donne son adresse, du type
`https://sveltia-cms-auth.votre-compte.workers.dev`. Notez-la.

**b. L'autorisation GitHub.** Sur GitHub, « Settings » du compte, « Developer
settings », « OAuth Apps », « New OAuth App ».

    Application name              DeeeMines admin
    Homepage URL                  https://deeemines.com
    Authorization callback URL    <adresse du service>/callback

GitHub délivre un identifiant (*Client ID*) et un secret (*Client Secret*, à
générer d'un clic). Reportez-les côté Cloudflare, dans les réglages du
service, « Settings », « Variables and Secrets » :

    GITHUB_CLIENT_ID        l'identifiant
    GITHUB_CLIENT_SECRET    le secret, en type « Secret »
    ALLOWED_DOMAINS         deeemines.com,deeemines-site.pages.dev

La dernière variable interdit à tout autre site d'utiliser votre service de
connexion. Redéployez le service pour que les variables prennent effet.

**c. L'adresse dans la configuration.** Dans `src/admin/config.yml`,
complétez la ligne `base_url:` avec l'adresse du service, sans barre oblique
finale :

    base_url: https://sveltia-cms-auth.votre-compte.workers.dev

Tant que cette ligne est vide, le bouton « se connecter » ne fait rien.

### 4. Les accès

Sur GitHub, réglages du dépôt, « Collaborators », invitez le compte de
Kristell avec le rôle **Write**. Elle reçoit une invitation par courriel,
l'accepte, et n'a plus jamais à rouvrir GitHub : tout se passe ensuite sur
`deeemines.com/admin`.

Il lui faut donc un compte GitHub, gratuit, créé en deux minutes sur
`github.com`. C'est le seul compte à créer.

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
qui écrivent. Il est mentionné à ce titre dans la politique de
confidentialité, dont la lecture par un conseil juridique reste souhaitable.

### 7. Avant l'ouverture au public

Retirez du fichier `src/_includes/tete.njk` la ligne :

    <meta name="robots" content="noindex, nofollow">

Tant qu'elle est là, les moteurs de recherche ignorent le site.

---

## L'administration au quotidien

Sur `deeemines.com/admin`, après connexion : la liste des pages à gauche,
le formulaire d'une page au centre, l'aperçu du site à droite.

L'aperçu n'est pas une imitation du site : c'est le site lui-même, affiché
dans un cadre, qui remplace ses textes à mesure que vous tapez. Ce que l'on y
voit est donc exactement ce que verront les visiteurs.

Chaque texte apparaît en français et en anglais. « Enregistrer » écrit la
modification dans le dépôt ; Cloudflare reconstruit le site dans la minute
qui suit. Une modification malheureuse se retrouve donc toujours dans
l'historique du dépôt, et se défait.

Quelques textes contiennent de la mise en forme entre chevrons, par exemple
`<br>` pour un retour à la ligne ou `<span>` pour une couleur. Gardez-la
telle quelle et écrivez autour : le formulaire le rappelle au cas par cas.

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

Tous les textes des sept pages, dans les deux langues : titres, sur-titres,
paragraphes, légendes, étiquettes du schéma, libellés de la navigation et du
pied de page. Plus les actualités, les membres de l'équipe et leurs photos,
les logos partenaires, les coordonnées.

## Ce qui reste dans le code

Les mises en page, les largeurs, les espacements, les couleurs, l'animation
du schéma, les chiffres du graphique de la page L'antimoine. C'est
volontaire : ce sont les réglages qui font tenir la cohérence du site.
