# FactoryFlow API

API de gestion et de suivi de la production industrielle.

FactoryFlow permet à une entreprise industrielle de centraliser la gestion des matières premières, des produits, des compositions, des ordres de fabrication et des mouvements de stock.

L'application est une **API REST sans interface frontend** basée sur **Node.js, Express, MongoDB et Mongoose**.

---

## 1. Contexte

L'entreprise dispose de plusieurs fichiers pour gérer ses produits, ses matières premières, ses stocks et ses ordres de fabrication.

Cette organisation entraîne plusieurs problèmes :

* manque de visibilité sur les stocks ;
* lancement possible d'un ordre avec un stock insuffisant ;
* consommations difficiles à tracer ;
* absence d'historique centralisé ;
* difficulté à suivre les ordres de fabrication ;
* risques de double consommation du stock.

FactoryFlow centralise ces informations et applique les règles métier directement côté serveur.

Avant le démarrage d'un ordre, l'API :

1. récupère la composition du produit ;
2. calcule les besoins nécessaires ;
3. vérifie les stocks disponibles ;
4. refuse le démarrage si une matière est insuffisante ;
5. déduit toutes les matières si le stock est suffisant ;
6. enregistre les mouvements de sortie ;
7. passe l'ordre à l'état `en cours`.

---

## 2. Objectifs

Les principaux objectifs du projet sont :

* gérer les utilisateurs et leurs rôles ;
* gérer les matières premières ;
* gérer les stocks et les mouvements ;
* gérer les produits et leurs compositions ;
* créer et suivre les ordres de fabrication ;
* garantir la cohérence des stocks ;
* sécuriser l'API avec JWT ;
* appliquer les permissions selon le rôle ;
* documenter l'API avec Swagger/OpenAPI ;
* tester les règles métier avec des tests unitaires ;
* exécuter l'application avec Docker Compose ;
* conserver les données MongoDB après redémarrage.

---

## 3. Technologies utilisées

### Backend

* Node.js
* Express.js
* JavaScript

### Base de données

* MongoDB
* Mongoose

### Authentification

* JWT
* bcrypt

### Tests

* Jest

### Documentation

* Swagger / OpenAPI

### Infrastructure

* Docker
* Docker Compose

### Gestion du projet

* Git
* GitHub
* Jira

---

## 4. Architecture

Le projet utilise une architecture en couches afin de séparer les responsabilités.

```text
Client
  │
  ▼
Routes
  │
  ▼
Middlewares
  │
  ├── Authentication
  ├── Authorization
  └── Validation
  │
  ▼
Controllers
  │
  ▼
Services
  │
  ▼
Repositories
  │
  ▼
Models / Mongoose
  │
  ▼
MongoDB
```

### Routes

Les routes définissent les endpoints disponibles et associent chaque endpoint à un contrôleur.

Exemple :

```text
POST /api/auth/login
GET  /api/products
POST /api/production-orders
```

### Controllers

Les contrôleurs sont responsables des échanges HTTP :

* récupérer les paramètres de la requête ;
* appeler le service correspondant ;
* retourner la réponse HTTP ;
* gérer les codes HTTP appropriés.

Les contrôleurs ne contiennent pas les règles métier principales.

### Services

Les services contiennent les règles métier de l'application.

Exemples :

* vérifier qu'une matière existe ;
* calculer les besoins d'un ordre ;
* vérifier la disponibilité du stock ;
* démarrer un ordre ;
* empêcher un second démarrage ;
* vérifier les transitions de statut.

### Repositories

Les repositories centralisent les accès à MongoDB.

Ils utilisent les modèles Mongoose pour :

* créer ;
* rechercher ;
* modifier ;
* supprimer ;
* filtrer les données.

Les services ne doivent pas effectuer directement les requêtes MongoDB.

### Models

Les modèles Mongoose définissent la structure des documents MongoDB.

---

## 5. Structure du projet

Une structure possible du projet est :

```text
factoryflow/
│
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── swagger.js
│   │
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── InstallationController.js
│   │   ├── UserController.js
│   │   ├── RawMaterialController.js
│   │   ├── ProductController.js
│   │   ├── ProductionOrderController.js
│   │   └── StockMovementController.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── validationMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── RawMaterial.js
│   │   ├── Product.js
│   │   ├── Composition.js
│   │   ├── ProductionOrder.js
│   │   ├── StockMovement.js
│   │   └── Installation.js
│   │
│   ├── repositories/
│   │   ├── UserRepository.js
│   │   ├── RawMaterialRepository.js
│   │   ├── ProductRepository.js
│   │   ├── ProductionOrderRepository.js
│   │   └── StockMovementRepository.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── installation.routes.js
│   │   ├── users.routes.js
│   │   ├── rawMaterials.routes.js
│   │   ├── products.routes.js
│   │   ├── productionOrders.routes.js
│   │   └── stockMovements.routes.js
│   │
│   ├── services/
│   │   ├── AuthService.js
│   │   ├── InstallationService.js
│   │   ├── UserService.js
│   │   ├── RawMaterialService.js
│   │   ├── ProductService.js
│   │   ├── ProductionOrderService.js
│   │   └── StockMovementService.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── product.validator.js
│   │   ├── rawMaterial.validator.js
│   │   └── productionOrder.validator.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   └── services/
│       ├── InstallationService.test.js
│       ├── ProductionOrderService.test.js
│       └── ProductService.test.js
│
├── docs/
│   └── openapi.yaml
│
├── .env.example
├── .gitignore
├── .dockerignore
├── Dockerfile
├── compose.yaml
├── package.json
└── README.md
```

---

# 6. Installation

## Prérequis

Les éléments suivants doivent être installés :

* Git
* Docker
* Docker Compose

Vérifier les installations :

```bash
git --version
docker --version
docker compose version
```

Aucune installation locale de MongoDB n'est nécessaire.

---

# 7. Configuration

Créer le fichier `.env` à partir du fichier d'exemple :

```bash
cp .env.example .env
```

Exemple :

```env
PORT=3000

MONGO_URI=mongodb://mongodb:27017/factoryflow

JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=1d

NODE_ENV=development
```

> Le fichier `.env` ne doit jamais être envoyé sur GitHub.

Il doit être ajouté au `.gitignore`.

Exemple :

```gitignore
.env
node_modules/
coverage/
```

---

# 8. Docker Compose

L'application utilise deux services principaux :

```text
┌──────────────────────┐
│      Backend         │
│      Node.js         │
│      Express         │
│      Port 3000       │
└──────────┬───────────┘
           │
           │ MongoDB
           ▼
┌──────────────────────┐
│       MongoDB        │
│      Port 27017      │
│   Persistent Volume  │
└──────────────────────┘
```

Le backend et MongoDB sont exécutés dans des conteneurs séparés.

---

# 9. Démarrer l'application

Cloner le projet :

```bash
git clone <URL_DU_REPOSITORY>
cd factoryflow
```

Créer le fichier `.env` :

```bash
cp .env.example .env
```

Démarrer les services :

```bash
docker compose up -d
```

Pour voir les logs :

```bash
docker compose logs -f
```

Pour voir l'état des conteneurs :

```bash
docker compose ps
```

L'API est disponible sur :

```text
http://localhost:3000
```

---

# 10. Développement avec Docker

Le projet utilise un volume pour prendre en compte les modifications du code local sans reconstruire l'image à chaque modification.

Après une modification du code :

```bash
docker compose restart backend
```

ou, si le projet utilise `nodemon`, le serveur peut redémarrer automatiquement.

Pour reconstruire l'image uniquement lorsque les dépendances ou le Dockerfile changent :

```bash
docker compose up -d --build
```

---

# 11. Arrêter l'application

Arrêter les conteneurs :

```bash
docker compose down
```

Les données MongoDB sont conservées grâce au volume Docker.

Pour arrêter les conteneurs **et supprimer les volumes** :

```bash
docker compose down -v
```

> Cette dernière commande supprime les données persistantes de MongoDB.

---

# 12. Installation de l'application via API

FactoryFlow possède un mécanisme d'installation initiale.

## Vérifier l'état de l'installation

```http
GET /api/installation/status
```

Exemple de réponse :

```json
{
  "installed": false
}
```

---

## Initialiser l'application

```http
POST /api/installation
```

Body :

```json
{
  "name": "Admin FactoryFlow",
  "email": "admin@factoryflow.com",
  "password": "Admin123!"
}
```

L'installation :

1. vérifie que l'application n'est pas déjà installée ;
2. valide les informations reçues ;
3. hache le mot de passe ;
4. crée le premier utilisateur avec le rôle `ADMIN` ;
5. enregistre durablement l'état d'installation.

Exemple :

```json
{
  "message": "Application installed successfully"
}
```

Une deuxième installation est refusée.

```http
POST /api/installation
```

Réponse :

```json
{
  "message": "Application is already installed"
}
```

---

# 13. Authentification

L'authentification utilise des JSON Web Tokens (JWT).

## Login

```http
POST /api/auth/login
```

Body :

```json
{
  "email": "admin@factoryflow.com",
  "password": "Admin123!"
}
```

Réponse :

```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN"
}
```

Le token doit être envoyé dans les routes protégées :

```http
Authorization: Bearer JWT_TOKEN
```

---

# 14. Rôles

FactoryFlow possède deux rôles :

```text
ADMIN
OPERATOR
```

## Admin

L'Admin peut :

* consulter son profil ;
* créer des utilisateurs ;
* créer d'autres Admins ;
* gérer les matières premières ;
* gérer les stocks ;
* gérer les produits ;
* gérer les compositions ;
* créer des ordres ;
* affecter les ordres aux opérateurs ;
* modifier les ordres planifiés ;
* annuler les ordres planifiés ;
* consulter tous les ordres ;
* utiliser les filtres et la pagination ;
* consulter les matières sous leur seuil d'alerte.

## Opérateur

L'Opérateur peut :

* consulter son profil ;
* consulter les ordres qui lui sont affectés ;
* consulter le détail de ses ordres ;
* démarrer un ordre qui lui est affecté ;
* terminer un ordre en cours ;
* consulter l'historique de ses ordres terminés.

Un opérateur ne peut pas :

* créer un Admin ;
* modifier les matières ;
* modifier les produits ;
* consulter les ordres d'un autre opérateur ;
* modifier les ordres qui ne lui appartiennent pas ;
* effectuer des opérations réservées à l'Admin.

---

# 15. Matières premières

Chaque matière première possède notamment :

```text
reference
name
unit
quantity
alertThreshold
createdAt
updatedAt
```

Règles :

* la référence est unique ;
* l'unité est obligatoire ;
* le stock initial peut être `0` ;
* le seuil d'alerte peut être `0` ;
* les entrées de stock doivent être strictement positives.

Exemple :

```json
{
  "reference": "MAT-A",
  "name": "Matière A",
  "unit": "kg",
  "quantity": 100,
  "alertThreshold": 20
}
```

---

# 16. Produits

Un produit possède une référence unique et une composition.

Exemple :

```text
Produit P1

MAT-A → 2 kg
MAT-B → 3 unités
```

Pour fabriquer une unité du produit :

```text
2 kg de MAT-A
3 unités de MAT-B
```

Un produit doit utiliser au moins une matière existante.

Une matière ne peut apparaître qu'une seule fois dans la composition.

---

# 17. Ordres de fabrication

Un ordre possède notamment :

```text
product
quantity
compositionSnapshot
operator
status
createdAt
startedAt
finishedAt
```

Les statuts possibles sont :

```text
PLANIFIE
EN_COURS
TERMINE
ANNULE
```

Le parcours normal est :

```text
PLANIFIE
    │
    ▼
EN_COURS
    │
    ▼
TERMINE
```

Un ordre `PLANIFIE` peut être annulé :

```text
PLANIFIE
    │
    ▼
ANNULE
```

Les autres transitions sont refusées.

---

# 18. Snapshot de composition

Lorsqu'un ordre est créé, la composition actuelle du produit est copiée dans l'ordre.

Exemple :

```text
Produit A

Matière A → 2 kg
Matière B → 3 unités
```

Création d'un ordre :

```text
Ordre #001

Matière A → 2 kg
Matière B → 3 unités
```

Si la composition du produit est ensuite modifiée :

```text
Produit A

Matière A → 5 kg
Matière B → 3 unités
```

l'ordre `#001` conserve :

```text
Matière A → 2 kg
Matière B → 3 unités
```

Cela garantit que l'ordre représente la composition utilisée au moment de sa création.

---

# 19. Calcul des besoins

Les besoins sont calculés avec la formule :

```text
besoin = quantité unitaire × quantité à fabriquer
```

Exemple :

```text
Matière A = 2 kg / produit
Matière B = 3 unités / produit

Quantité à fabriquer = 10
```

Les besoins sont :

```text
Matière A = 2 × 10 = 20 kg
Matière B = 3 × 10 = 30 unités
```

Le système doit vérifier :

```text
stock disponible >= besoin
```

pour chaque matière.

---

# 20. Démarrage d'un ordre

Lorsqu'un opérateur démarre un ordre :

```http
POST /api/production-orders/:id/start
```

Le service :

1. vérifie que l'ordre existe ;
2. vérifie que l'utilisateur est autorisé ;
3. vérifie que l'ordre est `PLANIFIE` ;
4. calcule les besoins ;
5. vérifie toutes les matières ;
6. refuse l'opération si une seule matière est insuffisante ;
7. déduit toutes les matières ;
8. crée les mouvements de sortie ;
9. modifie le statut vers `EN_COURS` ;
10. enregistre `startedAt`.

---

# 21. Cohérence du stock

Le démarrage d'un ordre doit être atomique.

Les opérations suivantes doivent réussir ensemble :

```text
Déduction du stock
       +
Création des mouvements
       +
Modification du statut
```

Si une opération échoue :

```text
Aucune modification ne doit être conservée.
```

MongoDB utilise une transaction avec une session Mongoose pour garantir cette cohérence.

Conceptuellement :

```text
START TRANSACTION

  Vérifier les stocks

  Déduire les matières

  Créer les mouvements

  Modifier le statut de l'ordre

COMMIT
```

En cas d'erreur :

```text
ROLLBACK
```

---

# 22. Prévention du double démarrage

Un ordre déjà démarré ne peut pas être démarré une deuxième fois.

Exemple :

```text
PLANIFIE
   ↓
EN_COURS
```

Une nouvelle tentative :

```text
EN_COURS
   ↓
START
```

est refusée.

Cela empêche une deuxième déduction du stock.

---

# 23. Mouvements de stock

Chaque consommation est enregistrée dans un mouvement.

Un mouvement peut contenir :

```text
material
type
quantity
user
productionOrder
createdAt
```

Types possibles :

```text
IN
OUT
```

Exemple d'une sortie :

```json
{
  "type": "OUT",
  "quantity": 20,
  "material": "MAT-A",
  "productionOrder": "ORDER_ID",
  "user": "OPERATOR_ID"
}
```

Les mouvements permettent de conserver l'historique des opérations sur les stocks.

---

# 24. Filtres et pagination

L'Admin peut consulter les ordres avec des filtres.

Exemple :

```http
GET /api/production-orders?status=PLANIFIE
```

Filtrer par produit :

```http
GET /api/production-orders?product=PRODUCT_ID
```

Filtrer par période :

```http
GET /api/production-orders?startDate=2026-10-05&endDate=2026-10-16
```

Pagination :

```http
GET /api/production-orders?page=1&limit=10
```

Exemple combiné :

```http
GET /api/production-orders?status=EN_COURS&page=1&limit=10
```

Les paramètres de pagination doivent être validés.

---

# 25. Matières sous le seuil d'alerte

L'Admin peut identifier les matières dont le stock est inférieur ou égal au seuil d'alerte.

Exemple :

```text
Stock disponible : 15 kg
Seuil d'alerte    : 20 kg
```

La matière doit être signalée comme nécessitant une attention.

---

# 26. Validation

Les données reçues par l'API sont validées avant leur traitement.

Exemples de règles :

### Matière

```text
reference → obligatoire et unique
unit → obligatoire
quantity → >= 0
alertThreshold → >= 0
```

### Composition

```text
quantity → > 0
material → matière existante
```

### Produit

```text
reference → obligatoire et unique
composition → au moins une matière
```

### Ordre

```text
quantity → > 0
product → produit existant
operator → opérateur existant
```

---

# 27. Gestion des erreurs

Un middleware global centralise la gestion des erreurs.

Exemples :

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
```

Exemple :

```json
{
  "status": 400,
  "message": "Insufficient stock for material MAT-A"
}
```

---

# 28. Swagger / OpenAPI

La documentation de l'API est disponible avec Swagger/OpenAPI.

Après démarrage de l'application :

```text
http://localhost:3000/api-docs
```

La documentation présente :

* les endpoints ;
* les paramètres ;
* les bodies ;
* les réponses ;
* les codes HTTP ;
* les erreurs ;
* les permissions ;
* l'authentification JWT.

---

# 29. Tests unitaires

Les règles métier sont testées indépendamment de MongoDB.

Les repositories sont simulés afin d'isoler les services.

Exemple :

```text
ProductionOrderService
        │
        ├── Mock ProductionOrderRepository
        ├── Mock RawMaterialRepository
        └── Mock StockMovementRepository
```

Les tests couvrent notamment :

* calcul des besoins ;
* stock suffisant ;
* stock insuffisant ;
* démarrage réussi ;
* second démarrage refusé ;
* transitions de statut ;
* nouvelle installation refusée.

---

# 30. Lancer les tests

Installer les dépendances :

```bash
npm install
```

Lancer les tests :

```bash
npm test
```

Lancer les tests avec couverture :

```bash
npm test -- --coverage
```

Les tests peuvent également être exécutés dans Docker selon la configuration du projet.

---

# 31. API principale

## Installation

| Méthode | Endpoint                   | Permission                            |
| ------- | -------------------------- | ------------------------------------- |
| GET     | `/api/installation/status` | Public                                |
| POST    | `/api/installation`        | Public, uniquement avant installation |

## Authentification

| Méthode | Endpoint            | Permission  |
| ------- | ------------------- | ----------- |
| POST    | `/api/auth/login`   | Public      |
| GET     | `/api/auth/profile` | Authentifié |

## Utilisateurs

| Méthode | Endpoint         | Permission |
| ------- | ---------------- | ---------- |
| POST    | `/api/users`     | Admin      |
| GET     | `/api/users`     | Admin      |
| GET     | `/api/users/:id` | Admin      |
| PATCH   | `/api/users/:id` | Admin      |

## Matières premières

| Méthode | Endpoint                 | Permission |
| ------- | ------------------------ | ---------- |
| POST    | `/api/raw-materials`     | Admin      |
| GET     | `/api/raw-materials`     | Admin      |
| GET     | `/api/raw-materials/:id` | Admin      |
| PATCH   | `/api/raw-materials/:id` | Admin      |

## Stocks

| Méthode | Endpoint                    | Permission |
| ------- | --------------------------- | ---------- |
| POST    | `/api/stock-movements`      | Admin      |
| GET     | `/api/stock-movements`      | Admin      |
| GET     | `/api/raw-materials/alerts` | Admin      |

## Produits

| Méthode | Endpoint            | Permission |
| ------- | ------------------- | ---------- |
| POST    | `/api/products`     | Admin      |
| GET     | `/api/products`     | Admin      |
| GET     | `/api/products/:id` | Admin      |
| PATCH   | `/api/products/:id` | Admin      |

## Ordres de fabrication

| Méthode | Endpoint                            | Permission                 |
| ------- | ----------------------------------- | -------------------------- |
| POST    | `/api/production-orders`            | Admin                      |
| GET     | `/api/production-orders`            | Admin                      |
| GET     | `/api/production-orders/:id`        | Admin / Opérateur autorisé |
| PATCH   | `/api/production-orders/:id`        | Admin                      |
| PATCH   | `/api/production-orders/:id/cancel` | Admin                      |
| POST    | `/api/production-orders/:id/start`  | Opérateur affecté          |
| POST    | `/api/production-orders/:id/finish` | Opérateur affecté          |
| GET     | `/api/production-orders/my-orders`  | Opérateur                  |

> Les endpoints exacts doivent être maintenus synchronisés avec la documentation Swagger du projet.

---

# 32. Exemple de parcours fonctionnel

Le scénario principal est le suivant.

### Étape 1 — Installation

```http
POST /api/installation
```

Création du premier Admin.

### Étape 2 — Login Admin

```http
POST /api/auth/login
```

Récupération du JWT.

### Étape 3 — Création des matières

Exemple :

```text
MAT-A → 100 kg
MAT-B → 200 unités
```

### Étape 4 — Création du produit

Composition :

```text
MAT-A → 2 kg
MAT-B → 3 unités
```

### Étape 5 — Création de l'ordre

```text
Produit : Produit A
Quantité : 10
Opérateur : Operator 1
Statut : PLANIFIE
```

### Étape 6 — Login opérateur

L'opérateur obtient son JWT.

### Étape 7 — Démarrage

L'opérateur démarre l'ordre.

L'API calcule :

```text
MAT-A → 2 × 10 = 20 kg
MAT-B → 3 × 10 = 30 unités
```

Elle vérifie les stocks :

```text
MAT-A : 100 >= 20 ✓
MAT-B : 200 >= 30 ✓
```

Puis elle effectue :

```text
MAT-A : 100 → 80
MAT-B : 200 → 170

Order :
PLANIFIE → EN_COURS
```

Deux mouvements `OUT` sont enregistrés.

### Étape 8 — Fin de production

L'opérateur termine l'ordre :

```text
EN_COURS → TERMINE
```

La date `finishedAt` est enregistrée.

---

# 33. Exemple de cas de stock insuffisant

Supposons :

```text
MAT-A disponible : 10 kg
Besoin           : 20 kg
```

L'API refuse le démarrage :

```json
{
  "status": 409,
  "message": "Insufficient stock for material MAT-A"
}
```

Le résultat doit être :

```text
Stock MAT-A : 10 kg
Order       : PLANIFIE
Movements   : aucun nouveau mouvement
```

Aucune quantité ne doit être déduite.

---

# 34. Persistance MongoDB

MongoDB utilise un volume Docker :

```yaml
volumes:
  mongodb_data:
```

Ce volume permet de conserver les données lorsque les conteneurs sont arrêtés.

Exemple :

```bash
docker compose down
docker compose up -d
```

Après redémarrage :

* les utilisateurs existent toujours ;
* les produits existent toujours ;
* les matières existent toujours ;
* les stocks existent toujours ;
* les ordres existent toujours ;
* les mouvements existent toujours ;
* l'état d'installation reste enregistré.

---

# 35. Variables d'environnement

Les secrets et paramètres sensibles ne sont pas stockés dans le code source.

Exemple :

```env
PORT=3000
MONGO_URI=mongodb://mongodb:27017/factoryflow
JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

Le fichier `.env` est ignoré par Git.

Un fichier `.env.example` est fourni afin d'indiquer les variables nécessaires.

---

# 36. Git

Créer une branche pour chaque fonctionnalité :

```bash
git checkout -b feature/installation
```

Exemples :

```text
feature/auth
feature/raw-materials
feature/products
feature/production-orders
feature/stock-management
feature/swagger
feature/tests
feature/docker
```

Les commits doivent être explicites :

```bash
git add .
git commit -m "feat: add production order service"
```

---

# 37. Jira

Le développement est suivi dans Jira.

Les tâches principales sont organisées autour de :

* Docker et environnement ;
* architecture backend ;
* installation ;
* authentification ;
* utilisateurs et permissions ;
* matières premières ;
* stocks ;
* produits ;
* compositions ;
* ordres de fabrication ;
* transactions MongoDB ;
* filtres et pagination ;
* Swagger ;
* tests unitaires ;
* README et livrables.

Le tableau Jira doit refléter l'avancement réel du projet.

---

# 38. Planification

Le projet est réalisé sur deux semaines.

```text
Début       : 05/10/2026
Deadline    : 16/10/2026 à 23:59
Durée       : 2 semaines
Modalité    : Individuel
```

Les tâches doivent être planifiées dans Jira et représentées dans le diagramme de Gantt.

Le Gantt doit présenter :

* les tâches ;
* les durées ;
* les dépendances ;
* les dates ;
* les principales échéances.

---

# 39. Livrables

Le projet doit fournir :

* [x] Backend Node.js / Express
* [x] MongoDB / Mongoose
* [x] Architecture Routes / Controllers / Services / Repositories / Models
* [x] Authentification JWT
* [x] Gestion des rôles
* [x] Installation via API
* [x] Gestion des matières premières
* [x] Gestion des stocks
* [x] Gestion des produits
* [x] Gestion des compositions
* [x] Gestion des ordres de fabrication
* [x] Transactions MongoDB pour la cohérence du stock
* [x] Filtres et pagination
* [x] Swagger/OpenAPI
* [x] Tests unitaires
* [x] Dockerfile
* [x] compose.yaml
* [x] .dockerignore
* [x] Volume MongoDB
* [x] README.md
* [x] Diagramme UML
* [x] Diagramme de Gantt
* [x] Rapport de tests
* [x] Planification Jira

---

# 40. Commandes principales

### Démarrer

```bash
docker compose up -d
```

### Démarrer avec reconstruction

```bash
docker compose up -d --build
```

### Voir les conteneurs

```bash
docker compose ps
```

### Voir les logs

```bash
docker compose logs -f
```

### Voir les logs du backend

```bash
docker compose logs -f backend
```

### Arrêter

```bash
docker compose down
```

### Arrêter et supprimer les données

```bash
docker compose down -v
```

### Tests

```bash
npm test
```

### Tests avec couverture

```bash
npm test -- --coverage
```

---

# 41. Démonstration finale

Pour la démonstration, le scénario suivant peut être utilisé :

1. Démarrer MongoDB et le backend avec Docker Compose.
2. Vérifier l'état de l'installation.
3. Installer l'application avec le premier Admin.
4. Se connecter avec l'Admin.
5. Créer un opérateur.
6. Créer deux matières premières avec des stocks suffisants.
7. Créer un produit et sa composition.
8. Créer un ordre de fabrication.
9. Affecter l'ordre à l'opérateur.
10. Se connecter avec l'opérateur.
11. Consulter ses ordres.
12. Démarrer l'ordre.
13. Vérifier la déduction des stocks.
14. Vérifier les mouvements de sortie.
15. Vérifier le changement de statut.
16. Essayer de démarrer une deuxième fois et montrer le refus.
17. Terminer l'ordre.
18. Vérifier l'historique.
19. Montrer Swagger.
20. Montrer les tests unitaires.

---

# 42. Auteur

Projet réalisé individuellement dans le cadre d'un projet pédagogique de développement d'API.

**Projet : FactoryFlow**

**Technologies principales :**

```text
Node.js
Express
MongoDB
Mongoose
JWT
Jest
Swagger/OpenAPI
Docker
Docker Compose
Git
GitHub
Jira
```
