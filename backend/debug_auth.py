#!/usr/bin/env python
"""
Script de débogage pour l'authentification JWT
"""
import os
import sys
import django
import json

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model, authenticate
from graphql_jwt.shortcuts import get_token, create_refresh_token
import jwt
from django.conf import settings

User = get_user_model()

def test_user_creation():
    """Test de création d'utilisateur"""
    print("=== Test de création d'utilisateur ===")
    
    username = 'debuguser'
    password = 'debugpass123'
    
    try:
        # Supprimer l'utilisateur s'il existe
        User.objects.filter(username=username).delete()
        
        # Créer un nouvel utilisateur
        user = User.objects.create_user(
            username=username,
            email='debug@example.com',
            password=password,
            first_name='Debug',
            last_name='User',
            role='membre'
        )
        
        print(f"✅ Utilisateur {username} créé avec succès")
        print(f"   ID: {user.id}")
        print(f"   Actif: {user.is_active}")
        print(f"   Staff: {user.is_staff}")
        print(f"   Superuser: {user.is_superuser}")
        
        return user, password
        
    except Exception as e:
        print(f"❌ Erreur lors de la création: {e}")
        return None, None

def test_authentication(user, password):
    """Test d'authentification"""
    print("\n=== Test d'authentification ===")
    
    try:
        # Authentifier l'utilisateur
        authenticated_user = authenticate(username=user.username, password=password)
        
        if authenticated_user:
            print(f"✅ Authentification réussie pour {user.username}")
            print(f"   Utilisateur: {authenticated_user}")
            print(f"   Actif: {authenticated_user.is_active}")
            return True
        else:
            print(f"❌ Échec d'authentification pour {user.username}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur lors de l'authentification: {e}")
        return False

def test_token_creation(user):
    """Test de création de token"""
    print("\n=== Test de création de token ===")
    
    try:
        # Créer le token JWT
        token = get_token(user)
        print(f"✅ Token créé avec succès")
        print(f"   Token (premiers caractères): {token[:50]}...")
        
        # Créer le refresh token
        refresh_token = create_refresh_token(user)
        print(f"✅ Refresh token créé avec succès")
        print(f"   Refresh token (premiers caractères): {refresh_token[:50]}...")
        
        return token, refresh_token
        
    except Exception as e:
        print(f"❌ Erreur lors de la création du token: {e}")
        import traceback
        traceback.print_exc()
        return None, None

def test_token_decoding(token):
    """Test de décodage du token"""
    print("\n=== Test de décodage du token ===")
    
    try:
        # Décoder le token sans vérification (pour voir le contenu)
        decoded = jwt.decode(token, options={"verify_signature": False})
        print(f"✅ Token décodé avec succès")
        print(f"   Payload: {json.dumps(decoded, indent=2)}")
        
        # Vérifier le token avec la clé secrète
        verified = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        print(f"✅ Token vérifié avec succès")
        print(f"   Utilisateur ID: {verified.get('user_id')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors du décodage: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_graphql_mutation():
    """Test de la mutation GraphQL"""
    print("\n=== Test de la mutation GraphQL ===")
    
    try:
        import requests
        
        url = 'http://localhost:8000/graphql/'
        
        mutation = """
        mutation TokenAuthWithUser($username: String!, $password: String!) {
            tokenAuthWithUser(username: $username, password: $password) {
                token
                refreshToken
                user {
                    id
                    username
                    email
                    firstName
                    lastName
                    role
                }
                success
                message
            }
        }
        """
        
        variables = {
            "username": "debuguser",
            "password": "debugpass123"
        }
        
        data = {
            'query': mutation,
            'variables': json.dumps(variables)
        }
        
        print("Envoi de la requête GraphQL...")
        response = requests.post(url, data=data)
        
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            if 'data' in result and result['data']['tokenAuthWithUser']['success']:
                print("✅ Mutation GraphQL réussie!")
                return True
            else:
                print("❌ Échec de la mutation GraphQL")
                if 'errors' in result:
                    print("Erreurs:", result['errors'])
                return False
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur lors du test GraphQL: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("🔍 Débogage de l'authentification JWT\n")
    
    # Test 1: Création d'utilisateur
    user, password = test_user_creation()
    if not user:
        return
    
    # Test 2: Authentification
    if not test_authentication(user, password):
        return
    
    # Test 3: Création de token
    token, refresh_token = test_token_creation(user)
    if not token:
        return
    
    # Test 4: Décodage de token
    if not test_token_decoding(token):
        return
    
    # Test 5: Mutation GraphQL
    test_graphql_mutation()
    
    print("\n🎯 Tests terminés!")

if __name__ == '__main__':
    main() 