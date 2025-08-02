# Agri-Geo - Backend

API Django avec GraphQL pour la gestion des parcelles agricoles.

## 🚀 Fonctionnalités

### 👤 Authentification & Autorisation
- **Modèle utilisateur personnalisé** avec rôles (admin/membre)
- **Authentification JWT** avec tokens
- **Autorisations basées sur les rôles**
- **Gestion des sessions sécurisée**

### 🗺️ Gestion des parcelles
- **Modèle Parcelle** avec champ GeoJSON
- **CRUD complet** via GraphQL
- **Validation des données géospatiales**
- **Association utilisateur-parcelle**

### 🔧 Interface GraphQL
- **Schema Graphene** complet
- **Queries** pour récupérer les données
- **Mutations** pour créer/modifier/supprimer
- **Authentification intégrée**

### 🛡️ Sécurité
- **CORS configuré** pour le frontend
- **Validation des données** côté serveur
- **Protection CSRF**
- **Gestion des permissions**

## 🛠️ Installation

1. **Créer un environnement virtuel** :
```bash
python -m venv env
source env/bin/activate  # Linux/Mac
# ou
env\Scripts\activate     # Windows
```

2. **Installer les dépendances** :
```bash
pip install -r requirements.txt
```

3. **Configurer la base de données** :
```bash
python manage.py makemigrations
python manage.py migrate
```

4. **Créer un superutilisateur** :
```bash
python manage.py createsuperuser
```

5. **Démarrer le serveur** :
```bash
python manage.py runserver
```

6. **Accéder à l'API** :
```
http://localhost:8000/graphql/
```

## 📋 Modèles de données

### User (Utilisateur personnalisé)
```python
class User(AbstractUser):
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='membre')
    # Hérite de username, email, password, etc.
```

**Rôles disponibles** :
- `membre` : Agriculteur qui peut créer ses parcelles
- `admin` : Administrateur avec accès complet

### Parcelle
```python
class Parcelle(models.Model):
    nom = models.CharField(max_length=200)
    culture = models.CharField(max_length=100)
    proprietaire = models.CharField(max_length=200)
    geojson = models.JSONField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

## 🔧 Configuration

### Settings.py
```python
# Modèle utilisateur personnalisé
AUTH_USER_MODEL = 'parcelles.User'

# GraphQL
GRAPHENE = {
    'SCHEMA': 'parcelles.schema.schema'
}

# JWT
GRAPHQL_JWT = {
    'JWT_VERIFY_EXPIRATION': True,
    'JWT_EXPIRATION_DELTA': timedelta(days=7),
}

# CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### URLs
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('graphql/', GraphQLView.as_view(graphiql=True)),
]
```

## 🗂️ Schema GraphQL

### Queries disponibles

#### `me`
Récupère les informations de l'utilisateur connecté
```graphql
query {
  me {
    id
    username
    email
    firstName
    lastName
    role
  }
}
```

#### `myParcelles`
Récupère les parcelles de l'utilisateur connecté
```graphql
query {
  myParcelles {
    id
    nom
    culture
    proprietaire
    geojson
    createdAt
  }
}
```

#### `allParcelles` (admin uniquement)
Récupère toutes les parcelles
```graphql
query {
  allParcelles {
    id
    nom
    culture
    proprietaire
    geojson
    user {
      username
      role
    }
    createdAt
  }
}
```

#### `allUsers` (admin uniquement)
Récupère tous les utilisateurs
```graphql
query {
  allUsers {
    id
    username
    email
    firstName
    lastName
    role
    dateJoined
  }
}
```

### Mutations disponibles

#### `createUser`
Créer un nouvel utilisateur
```graphql
mutation {
  createUser(
    username: "agriculteur1"
    email: "agri@example.com"
    password: "motdepasse123"
    firstName: "Jean"
    lastName: "Dupont"
    role: "membre"
  ) {
    success
    message
    user {
      id
      username
      role
    }
  }
}
```

#### `loginUser`
Connexion utilisateur
```graphql
mutation {
  loginUser(
    username: "agriculteur1"
    password: "motdepasse123"
  ) {
    success
    message
    token
    user {
      id
      username
      role
    }
  }
}
```

#### `createParcelle`
Créer une nouvelle parcelle
```graphql
mutation {
  createParcelle(
    nom: "Champ de blé"
    culture: "Blé"
    proprietaire: "Jean Dupont"
    geojson: "{\"type\":\"FeatureCollection\",\"features\":[...]}"
  ) {
    success
    message
    parcelle {
      id
      nom
      culture
      geojson
    }
  }
}
```

#### `deleteParcelle` (admin uniquement)
Supprimer une parcelle
```graphql
mutation {
  deleteParcelle(id: "1") {
    success
    message
  }
}
```

## 🔒 Sécurité et permissions

### Authentification
- **JWT tokens** avec expiration automatique
- **Refresh tokens** pour renouveler l'authentification
- **Logout** pour invalider les tokens

### Autorisations
- **Membres** : Peuvent créer/modifier/supprimer leurs propres parcelles
- **Admins** : Accès complet à toutes les données
- **Validation** : Vérification des permissions sur chaque mutation

### Validation des données
- **GeoJSON** : Validation du format et de la structure
- **Champs obligatoires** : Nom, culture, propriétaire
- **Taille des données** : Limitation pour éviter les abus

## 🗄️ Base de données

### SQLite (développement)
- Base de données par défaut
- Fichier `db.sqlite3` dans le projet
- Migrations automatiques

### PostgreSQL (production recommandé)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'agri_geo',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## 🚀 Déploiement

### Variables d'environnement
```env
DEBUG=False
SECRET_KEY=votre-clé-secrète
ALLOWED_HOSTS=votre-domaine.com
DATABASE_URL=postgresql://user:pass@host:port/db
```

### Production avec Gunicorn
```bash
pip install gunicorn
gunicorn backend.wsgi:application
```

### Docker (optionnel)
```dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## 🧪 Tests

### Lancer les tests
```bash
python manage.py test
```

### Tests spécifiques
```bash
python manage.py test parcelles.tests
```

## 📊 Monitoring

### Logs Django
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

### GraphQL Playground
- Accès via `http://localhost:8000/graphql/`
- Interface interactive pour tester les requêtes
- Documentation automatique du schema

## 🔧 Maintenance

### Migrations
```bash
# Créer une migration
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Voir l'état des migrations
python manage.py showmigrations
```

### Backup de la base de données
```bash
python manage.py dumpdata > backup.json
```

### Restauration
```bash
python manage.py loaddata backup.json
```

## 🐛 Dépannage

### Erreurs courantes
1. **CORS errors** : Vérifiez `CORS_ALLOWED_ORIGINS`
2. **JWT errors** : Vérifiez `SECRET_KEY` et `GRAPHQL_JWT`
3. **Database errors** : Vérifiez les migrations

### Debug mode
```python
DEBUG = True
```

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs Django
2. Testez avec GraphQL Playground
3. Vérifiez la configuration CORS
4. Contactez l'équipe de développement 