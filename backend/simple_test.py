#!/usr/bin/env python
"""
Test simple d'authentification
"""
import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model, authenticate
from graphql_jwt.shortcuts import get_token

User = get_user_model()

def main():
    print("=== Test simple d'authentification ===\n")
    
    # Créer un utilisateur de test
    username = 'simpleuser'
    password = 'simplepass123'
    
    # Supprimer l'utilisateur s'il existe
    User.objects.filter(username=username).delete()
    
    # Créer un nouvel utilisateur
    user = User.objects.create_user(
        username=username,
        email='simple@example.com',
        password=password,
        first_name='Simple',
        last_name='User',
        role='membre'
    )
    
    print(f"✅ Utilisateur {username} créé")
    
    # Tester l'authentification
    auth_user = authenticate(username=username, password=password)
    
    if auth_user:
        print(f"✅ Authentification réussie")
        
        # Créer un token
        token = get_token(auth_user)
        print(f"✅ Token créé: {token[:50]}...")
        
        print("\n🎉 Test réussi!")
        return True
    else:
        print("❌ Échec de l'authentification")
        return False

if __name__ == '__main__':
    main() 