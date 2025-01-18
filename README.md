# Gestion des Produits, Commandes et Fournisseurs

Ce projet est une application permettant de gérer les produits, commandes, clients, fournisseurs et relations entre eux. Il offre une API REST qui permet d'effectuer des opérations telles que la création, la mise à jour, la suppression et la recherche des données.

---

## 📚 Table des matières

1. [Technologies utilisées](#technologies-utilisées)
2. [Configuration du projet](#configuration-du-projet)
3. [Démarrage du serveur](#démarrage-du-serveur)
4. [Structure du projet](#structure-du-projet)

---


## 🛠️ Technologies utilisées
- **Node.js** : Runtime JavaScript pour le backend
- **Express.js** : Framework minimaliste pour les APIs
- **MySQL** : Base de données relationnelle
- **Joi** : Validation des données côté serveur
- **dotenv** : Gestion des variables d'environnement

---

## ⚙️ Configuration du projet

### Pré-requis

1. [Node.js](https://nodejs.org/) (version LTS recommandée)
2. [MySQL](https://www.mysql.com/)

### Installation

1. Clonez ce dépôt :
   ```bash
   git clone <URL_DU_DEPOT>
   ```
2.	Installez les dépendances :
   ```bash
   npm install
   ```
3.	Configurez les variables d’environnement :
    Créez un fichier .env à la racine et ajoutez les informations nécessaires :
    ```env
    DB_HOST=
    DB_USER=
    DB_PASSWORD=
    DB_DATABASE=
    ```
---
## ▶️ Démarrage du serveur
### V1
Lancer le serveur avec l'API :
```
    npm start
```
Initialiser la DB
```
    npm init
```
Ajouter des données

```
    npm add
```
### V2
Script de création de commande - avec le serveur lancé dans un autre terminal

```
    npm order
```
Script d'aministration - avec le serveur lancé dans un autre terminal
```
    npm admin
```
Affichage des statistques - sans avoir le serveur lancé
```
    npm stats
```
