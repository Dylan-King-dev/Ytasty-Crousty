# Ytasty Crousty

---
## Organisation du projet

Dylan: Panier, Commande & Suivi client

Malek: Auth, Back-office & Administration

Ranya: Restaurants, Produits & Catalogue

---

## Conventions communes du frontend

Ces conventions servent de contrat entre les trois parties. Les types partagés se trouvent dans `frontend/src/types/api.ts` : on les importe au lieu de redéfinir un même type dans plusieurs fichiers.

### Données et API

* Les propriétés reçues de FastAPI gardent leur nom d'origine en `snake_case` (`restaurant_id`, `is_available`, `pickup_mode`). Les noms des variables propres à React restent en `camelCase`.
* `Restaurant`, `Product`, `Order`, `Role`, `OrderStatus` et `PickupMode` sont définis une seule fois dans `types/api.ts`.
* Les prix venant de l'API sont des nombres en euros. L'interface les formate en euros, sans changer la valeur envoyée au backend.
* Les catégories restent des chaînes correspondant aux valeurs renvoyées par l'API. Les libellés affichés peuvent être traduits dans l'interface.
* Axios est configuré dans `frontend/src/api/client.ts`. Les appels spécifiques sont rangés par domaine dans `api/restaurants.api.ts`, `api/products.api.ts`, `api/orders.api.ts` et `api/auth.api.ts`.

### Commande et panier

* Le panier ne mélange pas les produits de plusieurs restaurants : une commande FastAPI contient un seul `restaurant_id`. Si le client change de restaurant, l'interface doit lui faire confirmer le changement de panier.
* Un produit indisponible ou un restaurant fermé ne peut pas être commandé. Le backend reste la validation finale.
* `CartLine` contient un `Product` et une `quantity`; le store conserve les lignes dans `state.cart.items`. Le total est calculé depuis ces lignes, il n'est pas stocké séparément.
* Le corps de `POST /orders` suit ce format :

```json
{
  "restaurant_id": 1,
  "items": [{ "product_id": 10, "quantity": 2 }],
  "pickup_mode": "takeaway",
  "customer": { "name": "Prénom Nom", "email": "client@example.com" }
}
```

* Les seuls modes de retrait sont `onsite` et `takeaway`. Les statuts de commande sont `pending`, `validated`, `preparing`, `ready`, `collected` et `cancelled`.

### Authentification et état partagé

* Le store Redux est configuré dans `frontend/src/app/store.ts`. Les clés de premier niveau sont `cart`, `auth` et `restaurant`.
* `state.restaurant.selectedId` contient l'identifiant du restaurant sélectionné; `state.auth.token` contient le JWT ou `null`.
* Les rôles reconnus sont `staff`, `admin` et `direction`. Les règles d'accès doivent rester alignées sur celles vérifiées par FastAPI.
* Les commandes de commande client restent publiques; les pages cuisine et administration nécessitent une authentification.

### Routes frontend

Les routes communes sont déclarées dans `frontend/src/App.tsx` : `/restaurants`, `/menu`, `/produit/:id`, `/panier`, `/commande`, `/confirmation/:orderNumber`, `/suivi` (saisie manuelle) et `/suivi/:orderNumber`, `/login`, `/cuisine` et `/administration`.

### Répartition et intégration

* Étudiant 1 maintient les types et appels Restaurants/Produits. Les étudiants 2 et 3 réutilisent `Product` au lieu de créer une copie.
* Étudiant 2 maintient `CartLine`, les reducers du panier et le parcours de commande client.
* Étudiant 3 maintient les types/règles d'authentification et les pages métier. Les contrôles de rôle côté frontend améliorent l'interface, mais ne remplacent jamais ceux du backend.
* Socket.io est un travail commun : avant de coder, choisir l'option, le nom de l'événement, les données envoyées et l'identifiant de commande/restaurant utilisé. Aucun événement n'est encore standardisé.

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


