# Projet Web Dynamique – Notes Personnelles
> Laravel 11 + React 18 + Tailwind CSS + Laravel Sanctum + MySQL

---

## Structure du projet

```
projet web dynamique/
├── back/     ← API Laravel 11
└── front/    ← SPA React 18 (Vite)
```

---

## Prérequis

| Outil       | Version minimale |
|-------------|-----------------|
| PHP         | 8.2+            |
| Composer    | 2.x             |
| Node.js     | 18+             |
| npm         | 9+              |
| MySQL       | 5.7+            |
| phpMyAdmin  | (recommandé)    |

---

## Installation Backend (`back/`)

### 1. Créer le projet Laravel
ouvrir le dossier de travail dans VSCode
```bash
composer create-project laravel/laravel back
cd back
```

### 2. Installer Sanctum
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 3. Copier les fichiers du projet
Remplacez les fichiers suivants par ceux du projet :
- `app/Http/Controllers/AuthController.php`
- `app/Http/Controllers/NoteController.php`
- `app/Models/Note.php`
- `app/Models/User.php`
- `database/migrations/2024_01_01_000001_create_notes_table.php`
- `database/seeders/DatabaseSeeder.php`
- `routes/api.php`
- `config/cors.php`
- `bootstrap/app.php`

### 4. Configurer `.env`
```bash
copy .env.example .env
php artisan key:generate
```

Ouvrez `.env` et modifiez la section base de données :
```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gestion_notes_db
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:3000,127.0.0.1:5173
```

### 5. Créer la base de données
Dans **phpMyAdmin** (`http://localhost/phpmyadmin`), créez une base nommée `gestion_notes_db`.

### 6. Exécuter les migrations
```bash
php artisan migrate:fresh
```

### 7. Lancer le serveur
```bash
php artisan serve
# → http://localhost:8000
```

---

## Installation Frontend (`front/`)

```bash

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
# → http://localhost:5173
```

---

## Utilisation quotidienne

Chaque fois que vous voulez utiliser l'application, ouvrez **2 terminaux** :

**Terminal 1 — Backend**
```bash
php artisan serve
```

**Terminal 2 — Frontend**
```bash
npm run dev
```

Puis ouvrez **http://localhost:5173** dans votre navigateur.

---

## Routes API

| Méthode  | Endpoint            | Description              | Auth     |
|----------|---------------------|--------------------------|----------|
| POST     | /api/register       | Inscription              | —        |
| POST     | /api/login          | Connexion → token        | —        |
| POST     | /api/logout         | Déconnexion              | Sanctum  |
| GET      | /api/notes          | Lister les notes         | Sanctum  |
| POST     | /api/notes          | Créer une note           | Sanctum  |
| PUT      | /api/notes/{id}     | Modifier une note        | Sanctum  |
| DELETE   | /api/notes/{id}     | Supprimer une note       | Sanctum  |

---

## Fonctionnalités

### Authentification
- Inscription avec nom, email et mot de passe
- Connexion sécurisée via token Sanctum
- Déconnexion avec révocation du token
- Protection des routes (redirection automatique si non connecté)

### Gestion des notes (CRUD complet)
- Créer une note avec titre, contenu optionnel et priorité
- Lister toutes ses notes triées par date décroissante
- Modifier une note (formulaire pré-rempli)
- Supprimer une note avec confirmation
- Badge de couleur selon la priorité (🟢 Basse / 🟠 Moyenne / 🔴 Haute)
- Date de création affichée en format lisible (ex : 9 mai 2026)

### Retours utilisateur
- Notifications toast après chaque action
- Validation côté client (titre obligatoire)
- Gestion des erreurs API (401, 422, 500)

### Fonctionnalités BONUS (+3 pts)
- **Filtre par priorité** : Toutes / Haute / Moyenne / Basse
- **Recherche textuelle** : en temps réel sur titre et contenu

---

## En cas de problème

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan serve
```
