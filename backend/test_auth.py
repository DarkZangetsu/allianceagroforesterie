#!/usr/bin/env python
"""
Script de test pour vérifier l'authentification JWT
"""
import os
import sys
import django
import requests
import json

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from graphql_jwt.shortcuts import get_token

User = get_user_model()

def test_authentication():
    """Test de l'authentification JWT"""
    
    # URL du serveur GraphQL
    url = 'http://localhost:8000/graphql/'
    
    # Créer un utilisateur de test s'il n'existe pas
    username = 'testuser'
    password = 'testpass123'
    
    try:
        user = User.objects.get(username=username)
        print(f"Utilisateur {username} existe déjà")
    except User.DoesNotExist:
        user = User.objects.create_user(
            username=username,
            email='test@example.com',
            password=password,
            first_name='Test',
            last_name='User',
            role='membre'
        )
        print(f"Utilisateur {username} créé")
    
    # Test de la mutation tokenAuthWithUser
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
        "username": username,
        "password": password
    }
    
    data = {
        'query': mutation,
        'variables': json.dumps(variables)
    }
    
    print("Test de la mutation tokenAuthWithUser...")
    response = requests.post(url, data=data)
    
    if response.status_code == 200:
        result = response.json()
        print("Réponse reçue:")
        print(json.dumps(result, indent=2))
        
        if 'data' in result and result['data']['tokenAuthWithUser']['success']:
            token = result['data']['tokenAuthWithUser']['token']
            user_data = result['data']['tokenAuthWithUser']['user']
            print(f"✅ Authentification réussie!")
            print(f"Token: {token[:50]}...")
            print(f"Utilisateur: {user_data['username']} ({user_data['role']})")
            return True
        else:
            print("❌ Échec de l'authentification")
            if 'errors' in result:
                print("Erreurs:", result['errors'])
            return False
    else:
        print(f"❌ Erreur HTTP: {response.status_code}")
        print(response.text)
        return False

def test_me_query():
    """Test de la query me avec un token"""
    
    # D'abord obtenir un token
    url = 'http://localhost:8000/graphql/'
    
    # Créer un utilisateur de test
    username = 'testuser2'
    password = 'testpass123'
    
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        user = User.objects.create_user(
            username=username,
            email='test2@example.com',
            password=password,
            first_name='Test2',
            last_name='User2',
            role='membre'
        )
    
    # Obtenir un token
    token = get_token(user)
    
    # Test de la query me
    query = """
    query GetMe {
        me {
            id
            username
            email
            firstName
            lastName
            role
        }
    }
    """
    
    headers = {
        'Authorization': f'JWT {token}',
        'Content-Type': 'application/json',
    }
    
    data = {
        'query': query
    }
    
    print("\nTest de la query me avec token...")
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code == 200:
        result = response.json()
        print("Réponse reçue:")
        print(json.dumps(result, indent=2))
        
        if 'data' in result and result['data']['me']:
            user_data = result['data']['me']
            print(f"✅ Query me réussie!")
            print(f"Utilisateur: {user_data['username']} ({user_data['role']})")
            return True
        else:
            print("❌ Échec de la query me")
            if 'errors' in result:
                print("Erreurs:", result['errors'])
            return False
    else:
        print(f"❌ Erreur HTTP: {response.status_code}")
        print(response.text)
        return False

if __name__ == '__main__':
    print("=== Test d'authentification JWT ===\n")
    
    # Test 1: Mutation tokenAuthWithUser
    success1 = test_authentication()
    
    # Test 2: Query me avec token
    success2 = test_me_query()
    
    print(f"\n=== Résultats ===")
    print(f"Test authentification: {'✅ Réussi' if success1 else '❌ Échec'}")
    print(f"Test query me: {'✅ Réussi' if success2 else '❌ Échec'}")
    
    if success1 and success2:
        print("\n🎉 Tous les tests sont passés!")
    else:
        print("\n⚠️ Certains tests ont échoué") 