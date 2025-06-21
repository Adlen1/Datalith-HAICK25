# Rapport Technique et d'Utilisation - SATIM Pay

**Auteur :** équipe Datalith &#x20;
**Projet :** SATIM Pay - Application Web Full-Stack &#x20;
**Date :** Juin 2025 &#x20;
**Version :** 1.0.0

---

## Résumé Exécutif

Ce document constitue un guide exhaustif pour les développeurs travaillant sur l'application bancaire SATIM Pay. Cette solution moderne intègre des technologies récentes telles que **FastAPI**, **Next.js**, **MongoDB** et un **chatbot IA** alimenté par Groq. Le système repose sur une architecture modulaire, testée et prête pour un déploiement en production.

---

## Table des Matières

1. Architecture du Système
2. Prérequis et Dépendances
3. Installation et Configuration Complète
4. Configuration de la Base de Données
5. Documentation API Backend
6. Configuration Frontend
7. Authentification et Sécurité
8. Intégration du Chatbot IA
9. Tests et Validation
10. Lignes Directrices pour le Déploiement
11. Rapport d’Utilisation
12. Annexes Techniques

---

## 1. Architecture du Système

L'application suit une architecture en trois tiers :

* **Frontend (Next.js + TypeScript)** : interface utilisateur moderne et réactive
* **Backend (FastAPI + Python)** : logique métier, API REST, authentification
* **Base de données (MongoDB)** : stockage documentaire des utilisateurs, comptes et transactions

Le frontend envoie des requêtes API au backend, qui traite les données via MongoDB et retourne les réponses structurées.

---

## 2. Prérequis et Dépendances

### Système recommandé :

* Ubuntu 22.04 LTS (Linux recommandé pour production)
* 8 Go de RAM minimum
* Espace disque : 20 Go

### Logiciels requis :

* Python 3.11+
* Node.js 18.16+
* MongoDB 7.0+
* Git

### Outils de développement :

* Visual Studio Code ou PyCharm
* Postman ou Insomnia pour tester les API

### Packages Python (backend) :

* fastapi, uvicorn, motor, pymongo, bcrypt, passlib, python-jose\[cryptography]

### Packages JavaScript (frontend) :

* next, react, typescript, tailwindcss, radix-ui, react-hook-form, zod

---

## 3. Installation et Configuration Complète

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/your-org/Datalith-HAICK25-adlen-s-branch.git
cd Datalith-HAICK25-adlen-s-branch
```

### Étape 2 : Installer et configurer MongoDB (local ou distant)

```bash
# Ubuntu (local)
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Étape 3 : Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Créer fichier .env
cp .env.example .env
nano .env
# Ajouter vos variables (MONGODB_URL, GROQ_API_KEY, etc.)

# Initialiser la base de données avec des données fictives
python3 setup_database.py

# Lancer le serveur backend
python3 standalone_main.py  # Accessible sur http://localhost:8000
```

### Étape 4 : Frontend

```bash
cd ../frontend
npm install --legacy-peer-deps

# Créer fichier .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Lancer le serveur frontend
npm run dev  # Accessible sur http://localhost:3000
```

---

## 4. Configuration de la Base de Données

Nom de la base de données (dev) : `satim_pay_test`

### Collections principales :

* **users** : données personnelles, sécurité, préférences
* **accounts** : solde, type de compte, utilisateur lié
* **transactions** : paiements, transferts, historique
* **notifications** : alertes système, messages

### Données générées automatiquement :

* 1 utilisateur admin, 3 utilisateurs standards
* Comptes en dinars (DZD) avec soldes réalistes
* Historique de transactions varié

---

## 5. Documentation API Backend

### Accès :

* Swagger UI : [http://localhost:8000/docs](http://localhost:8000/docs)
* Redoc : [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Authentification :

* JWT (access + refresh tokens)
* Accès par rôle (admin, user, support)

### Endpoints :

```http
POST /api/v1/auth/login
GET /api/v1/auth/me
GET /api/v1/transactions
POST /api/v1/ai/chat
```

### Exemple de connexion :

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
 -d "username=admin@satimpay.com&password=admin123"
```

---

## 6. Configuration Frontend

### Structure des dossiers :

```
frontend/
├── app/
├── components/
├── lib/
├── public/
├── styles/
├── .env.local
```

### Fonctionnalités intégrées :

* Page d’accueil avec redirection conditionnelle
* Connexion / inscription sécurisées
* Tableau de bord utilisateur
* Chatbot flottant intelligent

---

## 7. Authentification et Sécurité

* Hachage bcrypt pour les mots de passe
* JWT avec expiration courte (30 min) et refresh token (7 jours)
* Suivi des connexions, verrouillage de compte
* Entrées validées avec Pydantic
* Headers de sécurité et politique CORS strictes

---

## 8. Intégration du Chatbot IA

* **Modèle :** mixtral-8x7b via API Groq
* **Backend :** pré-traitement + appel API Groq
* **Frontend :** composant `FloatingChatbot.tsx`
* **Langues supportées :** FR / AR / EN

---

## 9. Tests et Validation

### Backend :

* **Unitaires :** pytest
* **Intégration :** FastAPI test client + DB test

### Frontend :

* **Composants :** Jest + React Testing Library
* **E2E :** Playwright ou Cypress (login, transactions)

---

## 10. Lignes Directrices pour le Déploiement

### Serveur de production (recommandé) :

* **Backend :** gunicorn + uvicorn workers
* **Frontend :** `npm run build` + Nginx
* **Base de données :** MongoDB sécurisé + sauvegarde
* **Certificat SSL :** Let’s Encrypt

### Exemple de déploiement :

```bash
# Lancer gunicorn
cd backend
source venv/bin/activate
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Construire le frontend
cd ../frontend
npm run build
npm start
```

### Configuration Nginx :

```nginx
server {
  listen 80;
  server_name satimpay.dz;

  location / {
    proxy_pass http://localhost:3000;
  }

  location /api/ {
    proxy_pass http://localhost:8000;
  }
}
```

---

## 11. Rapport d’Utilisation

* Utilisateur admin : [admin@satimpay.com](mailto:admin@satimpay.com) / admin123
* Utilisateurs test : [john.doe@example.com](mailto:john.doe@example.com), [jane.smith@example.com](mailto:jane.smith@example.com), [ahmed.benali@example.com](mailto:ahmed.benali@example.com)
* Solde de départ : entre 50,000 DZD et 120,000 DZD
* Transactions simulées (virements, paiements)
* Notifications en temps réel simulées

---

## 12. Annexes Techniques

* Schémas MongoDB détaillés
* Extraits de code (hachage, JWT)
* Exemples curl/Postman complets
* Scripts shell pour :

  * installation MongoDB
  * lancement backend/frontend
  * sauvegarde base de données

---

## Conclusion

Le projet SATIM Pay représente une base solide pour une solution bancaire moderne et évolutive. Grâce à une architecture modulaire, une sécurité rigoureuse et une documentation complète, il est prêt pour la production, tout en étant personnalisable pour répondre à des besoins spécifiques.

**Auteur :** équipe Datalith
