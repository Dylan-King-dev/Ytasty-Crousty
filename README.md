# Ytasty Crousty

---
## Organisation du projet

Dylan: Panier, Commande & Suivi client

Malek: Auth, Back-office & Administration

Ranya: Restaurants, Produits & Catalogue

---

## Technologies utilisées

* **Python 3.11+**
* **FastAPI** — création de l'API REST
* **Uvicorn** — serveur ASGI
* **SQLAlchemy** — ORM et gestion des modèles de données
* **PostgreSQL 15** — système de gestion de base de données
* **Pydantic** — validation et gestion des données
* **Passlib / bcrypt** — hachage et vérification des mots de passe
* **Docker** — conteneurisation de l'application
* **Docker Compose** — orchestration de l'API et de la base de données
* **uv** — gestion des dépendances et de l'environnement Python

---

## Données initiales

Le fichier :

```text
src/ytasty_crousty/seed.py
```

permet d'initialiser la base de données.

Il crée notamment plusieurs restaurants de démonstration :

* Ytasty Crousty Aix
* Ytasty Crousty Paris
* Ytasty Crousty Lyon

Un compte administrateur initial est également prévu pour le développement.

> Les identifiants présents dans le fichier `seed.py` sont destinés à l'environnement de développement et doivent être modifiés avant toute utilisation en production.

---

## Installation

### Prérequis

Pour utiliser le projet en local, il est recommandé d'avoir :

* Python 3.11 ou supérieur ;
* Docker ;
* Docker Compose ;
* Git.

Pour une installation avec `uv`, celui-ci doit également être installé.

---

## Installation avec Git

Cloner le dépôt :

```bash
git clone https://github.com/issa-le-goat/Projet-Ytasty-Crousty.git
```

Entrer dans le projet :

```bash
cd Projet-Ytasty-Crousty
```

---

## Lancement avec Docker Compose

La méthode recommandée pour lancer l'environnement de développement est Docker Compose.

Construire et démarrer les services :

```bash
docker compose up --build
```

Deux services sont lancés :

```text
db
api
```

### Base de données

Le service PostgreSQL utilise :

```text
Port : 5432
Base : ytasty_db
Utilisateur : postgres
```

### API

L'API est accessible sur :

```text
http://localhost:8000
```

---

## Vérification de l'API

Une route de santé est actuellement disponible :

```http
GET /health
```

Elle retourne :

```json
{
  "status": "ok"
}
```

Cette route permet de vérifier que l'API fonctionne correctement.

---

## Documentation FastAPI

FastAPI génère automatiquement une documentation interactive de l'API.

Une fois l'application lancée, elle est disponible à l'adresse :

```text
http://localhost:8000/docs
```

La documentation alternative ReDoc est disponible à :

```text
http://localhost:8000/redoc
```

---

## Gestion de la base de données

La connexion SQLAlchemy est centralisée dans :

```text
src/ytasty_crousty/database.py
```

Ce fichier contient notamment :

* la configuration de la connexion PostgreSQL ;
* le moteur SQLAlchemy ;
* la session de base de données ;
* la classe `Base` utilisée par les modèles ;
* la dépendance permettant d'obtenir une session de base de données.

Les modèles SQLAlchemy sont organisés par domaine fonctionnel dans le dossier `modules`.

---

## Objectif du projet

L'objectif de **Ytasty Crousty** est de construire une API backend permettant de centraliser la gestion d'une chaîne de restaurants.

À terme, l'API doit permettre de gérer les différents restaurants, leurs produits, leurs utilisateurs et leurs commandes, tout en fournissant un système d'authentification et une base de données centralisée.


