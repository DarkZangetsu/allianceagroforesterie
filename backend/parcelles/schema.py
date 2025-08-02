import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth import authenticate
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import create_refresh_token, get_token
from graphql_jwt.mutations import ObtainJSONWebToken, Refresh, Verify
from graphene_file_upload.scalars import Upload
from .models import User, Parcelle, ParcelleImage, Siege, SiegeImage, Pepiniere, PepiniereImage
import csv
import io
import json
from decimal import Decimal
from decimal import Decimal, InvalidOperation

class UserType(DjangoObjectType):
    abreviation = graphene.String()
    nomInstitution = graphene.String(source='nom_institution')
    nomProjet = graphene.String(source='nom_projet')
    logo = graphene.String()

    class Meta:
        model = User
        fields = "__all__"

    def resolve_logo(self, info):
        if self.logo:
            try:
                request = info.context
                # Si build_absolute_uri existe (cas normal)
                if hasattr(request, "build_absolute_uri"):
                    return request.build_absolute_uri(self.logo.url)
                # Fallback : BASE_URL ou localhost
                import os
                base_url = os.environ.get("BASE_URL") or "http://91.204.209.201:8000"
                return f"{base_url}/media/{self.logo.name}"
            except Exception:
                return str(self.logo)
        return ""

class ParcelleImageType(DjangoObjectType):
    class Meta:
        model = ParcelleImage
        fields = "__all__"

class ParcelleType(DjangoObjectType):
    images = graphene.List(ParcelleImageType)
    
    class Meta:
        model = Parcelle
        fields = "__all__"
    
    def resolve_images(self, info):
        return self.images.all()

class SiegeImageType(DjangoObjectType):
    class Meta:
        model = SiegeImage
        fields = "__all__"

class SiegeType(DjangoObjectType):
    photos_batiment = graphene.List(SiegeImageType)
    nom_projet = graphene.String()
    
    class Meta:
        model = Siege
        fields = "__all__"
    
    def resolve_photos_batiment(self, info):
        return self.photos_batiment.all()

    def resolve_nom_projet(self, info):
        return self.nom_projet

class PepiniereImageType(DjangoObjectType):
    class Meta:
        model = PepiniereImage
        fields = "__all__"

class PepiniereType(DjangoObjectType):
    photos = graphene.List(PepiniereImageType)
    nom_projet = graphene.String()
    
    class Meta:
        model = Pepiniere
        exclude = ("capacite",)
    
    def resolve_photos(self, info):
        return self.photos.all()

class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        role = graphene.String()
        logo = Upload()
        abreviation = graphene.String()
        nom_institution = graphene.String()
        nom_projet = graphene.String()

    def mutate(self, info, email, password, role="membre", logo=None, abreviation="", nom_institution="", nom_projet=""):
        try:
            if User.objects.filter(email=email).exists():
                return CreateUser(success=False, message="Email déjà utilisé")
            user = User.objects.create_user(
                email=email,
                password=password,
                role=role,
                abreviation=abreviation,
                nom_institution=nom_institution,
                nom_projet=nom_projet
            )
            if logo:
                user.logo = logo
                user.save()
            return CreateUser(user=user, success=True, message="Utilisateur créé avec succès")
        except Exception as e:
            return CreateUser(success=False, message=str(e))

class LoginUser(graphene.Mutation):
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    message = graphene.String()
    token = graphene.String()

    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, email, password):
        try:
            user = authenticate(email=email, password=password)
            if user:
                if not user.is_active:
                    return LoginUser(
                        success=False,
                        message="Compte désactivé, contactez l'administrateur."
                    )
                token = get_token(user)
                return LoginUser(
                    user=user,
                    success=True,
                    message="Connexion réussie",
                    token=token
                )
            else:
                return LoginUser(
                    success=False,
                    message="Identifiants incorrects"
                )
        except Exception as e:
            return LoginUser(
                success=False,
                message=f"Erreur de connexion: {str(e)}"
            )

class CreateParcelle(graphene.Mutation):
    parcelle = graphene.Field(ParcelleType)
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        nom = graphene.String(required=True)
        geojson = graphene.JSONString(required=True)
        superficie = graphene.Decimal()
        pratique = graphene.String()
        nom_projet = graphene.String()
        description = graphene.String()
        images = graphene.List(Upload)
        # Champs personne référente
        nom_personne_referente = graphene.String()
        poste = graphene.String()
        telephone = graphene.String()
        email = graphene.String()

    @login_required
    def mutate(self, info, nom, geojson, **kwargs):
        import json
        try:
            user = info.context.user
            # Extraire les images du kwargs
            images = kwargs.pop('images', [])
            # Désérialiser le geojson si c'est une chaîne
            if isinstance(geojson, str):
                try:
                    geojson = json.loads(geojson)
                except Exception:
                    pass
            parcelle = Parcelle.objects.create(
                nom=nom,
                geojson=geojson,
                user=user,
                **kwargs
            )
            # Créer les images associées
            for i, image_file in enumerate(images):
                if image_file:
                    ParcelleImage.objects.create(
                        parcelle=parcelle,
                        image=image_file,
                        ordre=i
                    )
            return CreateParcelle(parcelle=parcelle, success=True, message="Parcelle créée avec succès")
        except Exception as e:
            return CreateParcelle(success=False, message=str(e))

class UpdateParcelle(graphene.Mutation):
    parcelle = graphene.Field(ParcelleType)
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        id = graphene.ID(required=True)
        nom = graphene.String()
        geojson = graphene.JSONString()
        superficie = graphene.Decimal()
        pratique = graphene.String()
        nom_projet = graphene.String()
        description = graphene.String()
        images = graphene.List(Upload)
        # Champs personne référente
        nom_personne_referente = graphene.String()
        poste = graphene.String()
        telephone = graphene.String()
        email = graphene.String()

    @login_required
    def mutate(self, info, id, **kwargs):
        import json
        try:
            user = info.context.user
            parcelle = Parcelle.objects.get(id=id)
            if parcelle.user != user and user.role != 'admin':
                return UpdateParcelle(success=False, message="Non autorisé")
            # Extraire les images du kwargs
            images = kwargs.pop('images', None)
            # Désérialiser le geojson si c'est une chaîne
            if 'geojson' in kwargs and isinstance(kwargs['geojson'], str):
                try:
                    kwargs['geojson'] = json.loads(kwargs['geojson'])
                except Exception:
                    pass
            # Mettre à jour les champs
            for field, value in kwargs.items():
                if value is not None:
                    setattr(parcelle, field, value)
            parcelle.save()
            # Mettre à jour les images si fournies
            if images is not None:
                parcelle.images.all().delete()
                for i, image_file in enumerate(images[:3]):
                    if image_file:
                        ParcelleImage.objects.create(
                            parcelle=parcelle,
                            image=image_file,
                            ordre=i
                        )
            return UpdateParcelle(parcelle=parcelle, success=True, message="Parcelle mise à jour avec succès")
        except Parcelle.DoesNotExist:
            return UpdateParcelle(success=False, message="Parcelle non trouvée")
        except Exception as e:
            return UpdateParcelle(success=False, message=str(e))

class DeleteParcelle(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, id):
        try:
            user = info.context.user
            parcelle = Parcelle.objects.get(id=id)
            
            if parcelle.user != user and user.role != 'admin':
                return DeleteParcelle(success=False, message="Non autorisé")
            
            parcelle.delete()
            return DeleteParcelle(success=True, message="Parcelle supprimée")
        except Parcelle.DoesNotExist:
            return DeleteParcelle(success=False, message="Parcelle non trouvée")
        except Exception as e:
            return DeleteParcelle(success=False, message=str(e))

class CreateSiege(graphene.Mutation):
    siege = graphene.Field(SiegeType)
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        nom = graphene.String(required=True)
        adresse = graphene.String(required=True)
        latitude = graphene.Decimal(required=True)
        longitude = graphene.Decimal(required=True)
        description = graphene.String()
        # Nouveaux champs
        categorie = graphene.String()
        nom_point_contact = graphene.String()
        poste = graphene.String()
        telephone = graphene.String()
        email = graphene.String()
        nom_projet = graphene.String()
        horaire_matin = graphene.String()
        horaire_apres_midi = graphene.String()
        photos_batiment = graphene.List(Upload)

    @login_required
    def mutate(self, info, nom, adresse, latitude, longitude, description=None, categorie='social', nom_point_contact="", poste="", telephone="", email="", nom_projet="", horaire_matin="", horaire_apres_midi="", photos_batiment=None):
        try:
            user = info.context.user
            siege = Siege.objects.create(
                user=user,
                nom=nom,
                adresse=adresse,
                latitude=latitude,
                longitude=longitude,
                description=description,
                categorie=categorie,
                nom_point_contact=nom_point_contact,
                poste=poste,
                telephone=telephone,
                email=email,
                nom_projet=nom_projet,
                horaire_matin=horaire_matin,
                horaire_apres_midi=horaire_apres_midi
            )
            
            # Créer les photos associées
            if photos_batiment:
                for i, photo_file in enumerate(photos_batiment):
                    if photo_file:
                        SiegeImage.objects.create(
                            siege=siege,
                            image=photo_file,
                            ordre=i
                        )
                        
            return CreateSiege(siege=siege, success=True, message="Siège créé avec succès")
        except Exception as e:
            return CreateSiege(success=False, message=str(e))

class UpdateSiege(graphene.Mutation):
    siege = graphene.Field(SiegeType)
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        id = graphene.ID(required=True)
        nom = graphene.String()
        adresse = graphene.String()
        latitude = graphene.Decimal()
        longitude = graphene.Decimal()
        description = graphene.String()
        # Nouveaux champs
        categorie = graphene.String()
        nom_point_contact = graphene.String()
        poste = graphene.String()
        telephone = graphene.String()
        email = graphene.String()
        nom_projet = graphene.String()
        horaire_matin = graphene.String()
        horaire_apres_midi = graphene.String()
        photos_batiment = graphene.List(Upload)

    @login_required
    def mutate(self, info, id, **kwargs):
        try:
            user = info.context.user
            siege = Siege.objects.get(id=id)
            if siege.user != user and user.role != 'admin':
                return UpdateSiege(success=False, message="Non autorisé")
            
            # Extraire les photos du kwargs
            photos_batiment = kwargs.pop('photos_batiment', None)
            
            for field, value in kwargs.items():
                if value is not None:
                    setattr(siege, field, value)
            siege.save()
            
            # Mettre à jour les photos si fournies
            if photos_batiment is not None:
                siege.photos_batiment.all().delete()
                for i, photo_file in enumerate(photos_batiment):
                    if photo_file:
                        SiegeImage.objects.create(
                            siege=siege,
                            image=photo_file,
                            ordre=i
                        )
                        
            return UpdateSiege(siege=siege, success=True, message="Siège mis à jour")
        except Siege.DoesNotExist:
            return UpdateSiege(success=False, message="Siège non trouvé")
        except Exception as e:
            return UpdateSiege(success=False, message=str(e))

class DeleteSiege(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, id):
        user = info.context.user
        try:
            siege = Siege.objects.get(id=id)
            if siege.user != user and user.role != 'admin':
                return DeleteSiege(success=False, message="Non autorisé")
            siege.delete()
            return DeleteSiege(success=True, message="Siège supprimé")
        except Exception as e:
            return DeleteSiege(success=False, message=str(e))

class TokenAuthWithUser(graphene.Mutation):
    token = graphene.String()
    refreshToken = graphene.String()
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, email, password):
        try:
            user = authenticate(email=email, password=password)
            if user and user.is_active:
                token = get_token(user)
                refresh_token = create_refresh_token(user)
                return TokenAuthWithUser(
                    token=token,
                    refreshToken=refresh_token,
                    user=user,
                    success=True,
                    message="Connexion réussie"
                )
            else:
                return TokenAuthWithUser(
                    success=False,
                    message="Identifiants incorrects ou compte inactif"
                )
        except Exception as e:
            return TokenAuthWithUser(
                success=False,
                message=f"Erreur de connexion: {str(e)}"
            )

class ExportParcellesCSV(graphene.Mutation):
    csv_data = graphene.String()
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info):
        try:
            user = info.context.user
            if hasattr(user, 'role') and user.role == 'admin':
                parcelles = Parcelle.objects.all()
            else:
                parcelles = Parcelle.objects.filter(user=user)
            
            output = io.StringIO()
            writer = csv.writer(output)

            # En-têtes
            headers = [
                'SITES DE REFERENCE',
                'SUPERFICIE (ha)',
                'PRATIQUE',
                'PROJET RATTACHE',
                'DESCRIPTION',
                'NOM PERSONNE REFERENTE',
                'POSTE',
                'TELEPHONE',
                'GEOJSON',
                'DATE DE CREATION',
                'DATE DE MODIFICATION'
            ]
            writer.writerow(headers)

            # Données
            for parcelle in parcelles:
                row = [
                    parcelle.nom,
                    str(parcelle.superficie or ''),
                    parcelle.pratique or '',
                    parcelle.nom_projet or '',
                    parcelle.description or '',
                    parcelle.nom_personne_referente or '',
                    parcelle.poste or '',
                    parcelle.telephone or '',
                    json.dumps(parcelle.geojson, ensure_ascii=False) if parcelle.geojson else '',
                    parcelle.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    parcelle.updated_at.strftime('%Y-%m-%d %H:%M:%S')
                ]
                writer.writerow(row)

            csv_content = output.getvalue()
            output.close()

            return ExportParcellesCSV(
                csv_data=csv_content,
                success=True,
                message=f"Export CSV réussi - {parcelles.count()} parcelle(s) exportée(s)."
            )

        except Exception as e:
            return ExportParcellesCSV(
                success=False,
                csv_data="",
                message=f"Erreur lors de l'export : {str(e)}"
            )

class ImportParcellesCSV(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()
    imported_count = graphene.Int()
    errors = graphene.List(graphene.String)

    class Arguments:
        csv_file = Upload(required=True)

    @login_required
    def mutate(self, info, csv_file):
        try:
            user = info.context.user
            imported_count = 0
            errors = []
            csv_content = csv_file.read().decode('utf-8')
            csv_reader = csv.DictReader(io.StringIO(csv_content))
            
            for row_num, row in enumerate(csv_reader, start=2):
                try:
                    # Validation des champs obligatoires
                    if not row.get('Nom'):
                        errors.append(f"Ligne {row_num}: Le nom est requis")
                        continue
                    
                    # Gestion de la superficie
                    superficie = None
                    if row.get('Superficie'):
                        try:
                            superficie = Decimal(row['Superficie'].replace(',', '.'))
                        except:
                            errors.append(f"Ligne {row_num}: Superficie invalide")
                            continue
                    
                    # Gestion de la géométrie
                    geojson = None
                    geometrie_str = row.get('geometrie', '').strip()
                    if geometrie_str:
                        import json
                        try:
                            # Si c'est un vrai GeoJSON
                            geojson_candidate = json.loads(geometrie_str)
                            if isinstance(geojson_candidate, dict) and 'type' in geojson_candidate and 'coordinates' in geojson_candidate:
                                geojson = {
                                    "type": "Feature",
                                    "geometry": geojson_candidate,
                                }
                        except Exception:
                            # Sinon, on suppose que c'est une liste de points
                            try:
                                import re
                                points = re.findall(r'\[([\d\.-]+),([\d\.-]+)\]', geometrie_str)
                                coords = [[float(lon), float(lat)] for lon, lat in points]
                                if len(coords) >= 4 and coords[0] == coords[-1]:
                                    pass
                                elif len(coords) >= 3:
                                    coords.append(coords[0])
                                geojson = {
                                    "type": "Feature",
                                    "geometry": {
                                        "type": "Polygon",
                                        "coordinates": [coords]
                                    }
                                }
                            except Exception:
                                errors.append(f"Ligne {row_num}: Format de géométrie invalide")
                                geojson = None
                    
                    # Si pas de géométrie fournie, créer une géométrie par défaut
                    if not geojson:
                        geojson = {
                            "type": "Feature",
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [[[0, 0], [0, 0.001], [0.001, 0.001], [0.001, 0], [0, 0]]]
                            }
                        }
                    
                    # Création de la parcelle avec le nouveau modèle
                    parcelle = Parcelle.objects.create(
                        user=user,
                        nom=row['Nom'],
                        nom_personne_referente=row.get('Nom Personne Référente', ''),
                        poste=row.get('Poste', ''),
                        telephone=row.get('Téléphone', ''),
                        email=row.get('Email', ''),
                        superficie=superficie,
                        pratique=row.get('Pratique', ''),
                        nom_projet=row.get('Nom projet', ''),
                        description=row.get('Description', ''),
                        geojson=geojson
                    )
                    imported_count += 1
                    
                except Exception as e:
                    errors.append(f"Ligne {row_num}: {str(e)}")
                    continue
            
            # Message de retour
            message = f"Import terminé: {imported_count} parcelles importées"
            if errors:
                message += f", {len(errors)} erreurs"
            
            return ImportParcellesCSV(
                success=True,
                message=message,
                imported_count=imported_count,
                errors=errors
            )
            
        except Exception as e:
            return ImportParcellesCSV(
                success=False,
                message=f"Erreur lors de l'import: {str(e)}",
                imported_count=0,
                errors=[str(e)]
            )

class ExportSiegesCSV(graphene.Mutation):
    csv_data = graphene.String()
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info):
        try:
            user = info.context.user
            sieges = Siege.objects.all() if getattr(user, 'role', '') == 'admin' else Siege.objects.filter(user=user)
            
            output = io.StringIO()
            writer = csv.writer(output)

            # En-têtes CSV
            headers = [
                'LOCAUX',
                'ADRESSE',
                'LATITUDE',
                'LONGITUDE',
                'DESCRIPTION',
                'CATÉGORIE',
                'NOM POINT CONTACT',
                'POSTE',
                'TÉLÉPHONE',
                'PROJET RATTACHÉ',
                'HORAIRE MATIN',
                'HORAIRE APRÈS-MIDI',
                'UTILISATEUR (EMAIL)',
                'DATE CRÉATION',
                'DATE MODIFICATION'
            ]
            writer.writerow(headers)

            # Contenu des lignes
            for siege in sieges:
                row = [
                    siege.nom,
                    siege.adresse,
                    str(siege.latitude),
                    str(siege.longitude),
                    siege.description or '',
                    siege.get_categorie_display(), 
                    siege.nom_point_contact or '',
                    siege.poste or '',
                    siege.telephone or '',
                    siege.email or '',
                    siege.nom_projet or '',
                    siege.horaire_matin or '',
                    siege.horaire_apres_midi or '',
                    siege.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    siege.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
                ]
                writer.writerow(row)

            csv_content = output.getvalue()
            output.close()

            return ExportSiegesCSV(
                csv_data=csv_content,
                success=True,
                message=f"Export CSV réussi - {sieges.count()} siège(s) exporté(s)"
            )

        except Exception as e:
            return ExportSiegesCSV(
                success=False,
                csv_data="",
                message=f"Erreur lors de l'export : {str(e)}"
            )

class ImportSiegesCSV(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()
    imported_count = graphene.Int()
    errors = graphene.List(graphene.String)

    class Arguments:
        csv_file = Upload(required=True)

    @login_required
    def mutate(self, info, csv_file):
        try:
            user = info.context.user
            imported_count = 0
            errors = []
            
            # Lire le contenu du fichier CSV
            csv_content = csv_file.read().decode('utf-8')
            csv_reader = csv.DictReader(io.StringIO(csv_content))
            
            # Validation des en-têtes requis
            required_headers = ['Nom', 'Adresse', 'Latitude', 'Longitude']
            if not all(header in csv_reader.fieldnames for header in required_headers):
                missing_headers = [h for h in required_headers if h not in csv_reader.fieldnames]
                return ImportSiegesCSV(
                    success=False,
                    message=f"En-têtes manquants: {', '.join(missing_headers)}",
                    imported_count=0,
                    errors=[f"En-têtes manquants: {', '.join(missing_headers)}"]
                )
            
            # Traitement des lignes
            for row_num, row in enumerate(csv_reader, start=2):
                try:
                    # Validation des champs obligatoires
                    nom = row.get('Nom', '').strip()
                    adresse = row.get('Adresse', '').strip()
                    latitude_str = row.get('Latitude', '').strip()
                    longitude_str = row.get('Longitude', '').strip()
                    
                    if not nom or not adresse or not latitude_str or not longitude_str:
                        errors.append(f"Ligne {row_num}: Nom, Adresse, Latitude et Longitude sont requis")
                        continue
                    
                    # Validation et conversion des coordonnées avec Decimal
                    try:
                        # Remplacer les virgules par des points et nettoyer les espaces
                        latitude_clean = latitude_str.replace(',', '.').replace(' ', '')
                        longitude_clean = longitude_str.replace(',', '.').replace(' ', '')
                        
                        # Conversion en Decimal (plus précis que float pour les coordonnées)
                        latitude = Decimal(latitude_clean)
                        longitude = Decimal(longitude_clean)
                        
                        # Validation des limites géographiques
                        if not (Decimal('-90') <= latitude <= Decimal('90')):
                            errors.append(f"Ligne {row_num}: Latitude doit être entre -90 et 90 (valeur: {latitude})")
                            continue
                        if not (Decimal('-180') <= longitude <= Decimal('180')):
                            errors.append(f"Ligne {row_num}: Longitude doit être entre -180 et 180 (valeur: {longitude})")
                            continue
                            
                    except (ValueError, InvalidOperation, TypeError) as e:
                        errors.append(f"Ligne {row_num}: Format de coordonnées invalide - Latitude: '{latitude_str}', Longitude: '{longitude_str}' - Erreur: {str(e)}")
                        continue
                    
                    # Validation de la catégorie
                    categorie = row.get('Catégorie', 'social').strip().lower()
                    valid_categories = ['social', 'regional', 'technique', 'provisoire']
                    if categorie not in valid_categories:
                        errors.append(f"Ligne {row_num}: Catégorie invalide '{categorie}'. Valeurs possibles: {', '.join(valid_categories)}")
                        continue
                    
                    # Validation de l'email si fourni
                    email = row.get('Email', '').strip()
                    if email and '@' not in email:
                        errors.append(f"Ligne {row_num}: Format d'email invalide '{email}'")
                        continue
                    
                    # Validation de la longueur des champs
                    if len(nom) > 100:
                        errors.append(f"Ligne {row_num}: Le nom est trop long (max 100 caractères)")
                        continue
                    if len(adresse) > 255:
                        errors.append(f"Ligne {row_num}: L'adresse est trop longue (max 255 caractères)")
                        continue
                    
                    # Préparation des champs optionnels
                    description = row.get('Description', '').strip()
                    nom_point_contact = row.get('Nom Point Contact', '').strip()
                    poste = row.get('Poste', '').strip()
                    telephone = row.get('Téléphone', '').strip()
                    nom_projet = row.get('Nom Projet', '').strip()
                    horaire_matin = row.get('Horaire Matin', '').strip()
                    horaire_apres_midi = row.get('Horaire Après-midi', '').strip()
                    
                    # Validation des longueurs des champs optionnels
                    if len(nom_point_contact) > 100:
                        errors.append(f"Ligne {row_num}: Le nom du point de contact est trop long (max 100 caractères)")
                        continue
                    if len(poste) > 100:
                        errors.append(f"Ligne {row_num}: Le poste est trop long (max 100 caractères)")
                        continue
                    if len(telephone) > 20:
                        errors.append(f"Ligne {row_num}: Le téléphone est trop long (max 20 caractères)")
                        continue
                    if len(nom_projet) > 200:
                        errors.append(f"Ligne {row_num}: Le nom du projet est trop long (max 200 caractères)")
                        continue
                    if len(horaire_matin) > 100:
                        errors.append(f"Ligne {row_num}: L'horaire matin est trop long (max 100 caractères)")
                        continue
                    if len(horaire_apres_midi) > 100:
                        errors.append(f"Ligne {row_num}: L'horaire après-midi est trop long (max 100 caractères)")
                        continue
                    
                    # Création du siège
                    Siege.objects.create(
                        user=user,
                        nom=nom,
                        adresse=adresse,
                        latitude=latitude,
                        longitude=longitude,
                        description=description,
                        categorie=categorie,
                        nom_point_contact=nom_point_contact,
                        poste=poste,
                        telephone=telephone,
                        email=email,
                        nom_projet=nom_projet,
                        horaire_matin=horaire_matin,
                        horaire_apres_midi=horaire_apres_midi
                    )
                    imported_count += 1
                    
                except Exception as e:
                    errors.append(f"Ligne {row_num}: Erreur lors de la création - {str(e)}")
                    continue
            
            # Message de retour
            if imported_count == 0:
                message = "Aucun siège n'a pu être importé"
                success = False
            else:
                message = f"Import terminé: {imported_count} siège(s) importé(s)"
                success = True
                
            if errors:
                message += f", {len(errors)} erreur(s)"
            
            return ImportSiegesCSV(
                success=success,
                message=message,
                imported_count=imported_count,
                errors=errors
            )
            
        except Exception as e:
            return ImportSiegesCSV(
                success=False,
                message=f"Erreur lors de l'import: {str(e)}",
                imported_count=0,
                errors=[str(e)]
            )

class CreatePepiniere(graphene.Mutation):
    pepiniere = graphene.Field(PepiniereType)
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        nom = graphene.String(required=True)
        adresse = graphene.String(required=True)
        latitude = graphene.Decimal(required=True)
        longitude = graphene.Decimal(required=True)
        description = graphene.String()
        # Champs spécifiques à la pépinière
        nom_gestionnaire = graphene.String()
        poste_gestionnaire = graphene.String()
        telephone_gestionnaire = graphene.String()
        email_gestionnaire = graphene.String()
        especes_produites = graphene.String()
        nom_projet = graphene.String()
        quantite_production_generale = graphene.String()
        photos = graphene.List(Upload)

    @login_required
    def mutate(self, info, nom, adresse, latitude, longitude, description=None, nom_gestionnaire="", poste_gestionnaire="", telephone_gestionnaire="", email_gestionnaire="", especes_produites="", nom_projet="", quantite_production_generale="", photos=None):
        try:
            user = info.context.user
            pepiniere = Pepiniere.objects.create(
                user=user,
                nom=nom,
                adresse=adresse,
                latitude=latitude,
                longitude=longitude,
                description=description,
                nom_gestionnaire=nom_gestionnaire,
                poste_gestionnaire=poste_gestionnaire,
                telephone_gestionnaire=telephone_gestionnaire,
                email_gestionnaire=email_gestionnaire,
                especes_produites=especes_produites,
                nom_projet=nom_projet,
                quantite_production_generale=quantite_production_generale
            )
            
            # Créer les photos associées
            if photos:
                for i, photo_file in enumerate(photos):
                    if photo_file:
                        PepiniereImage.objects.create(
                            pepiniere=pepiniere,
                            image=photo_file,
                            ordre=i
                        )
                        
            return CreatePepiniere(pepiniere=pepiniere, success=True, message="Pépinière créée avec succès")
        except Exception as e:
            return CreatePepiniere(success=False, message=str(e))

class UpdatePepiniere(graphene.Mutation):
    pepiniere = graphene.Field(PepiniereType)
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        id = graphene.ID(required=True)
        nom = graphene.String()
        adresse = graphene.String()
        latitude = graphene.Decimal()
        longitude = graphene.Decimal()
        description = graphene.String()
        nom_gestionnaire = graphene.String()
        poste_gestionnaire = graphene.String()
        telephone_gestionnaire = graphene.String()
        email_gestionnaire = graphene.String()
        especes_produites = graphene.String()
        nom_projet = graphene.String()
        quantite_production_generale = graphene.String()
        photos = graphene.List(Upload)

    @login_required
    def mutate(self, info, id, **kwargs):
        try:
            user = info.context.user
            pepiniere = Pepiniere.objects.get(id=id)
            if pepiniere.user != user and user.role != 'admin':
                return UpdatePepiniere(success=False, message="Non autorisé")
            
            # Extraire les photos du kwargs
            photos = kwargs.pop('photos', None)
            
            for field, value in kwargs.items():
                if value is not None:
                    if field != "capacite":
                        setattr(pepiniere, field, value)
            pepiniere.save()
            
            # Mettre à jour les photos si fournies
            if photos is not None:
                pepiniere.photos.all().delete()
                for i, photo_file in enumerate(photos):
                    if photo_file:
                        PepiniereImage.objects.create(
                            pepiniere=pepiniere,
                            image=photo_file,
                            ordre=i
                        )
                        
            return UpdatePepiniere(pepiniere=pepiniere, success=True, message="Pépinière mise à jour")
        except Pepiniere.DoesNotExist:
            return UpdatePepiniere(success=False, message="Pépinière non trouvée")
        except Exception as e:
            return UpdatePepiniere(success=False, message=str(e))

class DeletePepiniere(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, id):
        try:
            user = info.context.user
            pepiniere = Pepiniere.objects.get(id=id)
            if pepiniere.user != user and user.role != 'admin':
                return DeletePepiniere(success=False, message="Non autorisé")
            pepiniere.delete()
            return DeletePepiniere(success=True, message="Pépinière supprimée")
        except Pepiniere.DoesNotExist:
            return DeletePepiniere(success=False, message="Pépinière non trouvée")
        except Exception as e:
            return DeletePepiniere(success=False, message=str(e))

class ExportPepinieresCSV(graphene.Mutation):
    csv_data = graphene.String()
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info):
        try:
            user = info.context.user
            pepinieres = Pepiniere.objects.all() if getattr(user, 'role', '') == 'admin' else Pepiniere.objects.filter(user=user)
            
            output = io.StringIO()
            writer = csv.writer(output)

            # En-têtes en MAJUSCULES
            headers = [
                'PEPINIERES',
                'ADRESSE',
                'LATITUDE',
                'LONGITUDE',
                'DESCRIPTION',
                'NOM GESTIONNAIRE',
                'POSTE GESTIONNAIRE',
                'TÉLÉPHONE GESTIONNAIRE',
                'EMAIL GESTIONNAIRE',
                'ESPÈCES PRODUITES',
                'QUANTITÉ PRODUCTION GÉNÉRALE',
                'PROJET RATTACHÉ',
                'DATE CRÉATION',
                'DATE MODIFICATION'
            ]
            writer.writerow(headers)

            # Données
            for pep in pepinieres:
                row = [
                    pep.nom,
                    pep.adresse,
                    str(pep.latitude),
                    str(pep.longitude),
                    pep.description or '',
                    pep.nom_gestionnaire or '',
                    pep.poste_gestionnaire or '',
                    pep.telephone_gestionnaire or '',
                    pep.email_gestionnaire or '',
                    pep.especes_produites or '',
                    pep.quantite_production_generale or '',
                    pep.nom_projet or '',
                    pep.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    pep.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
                ]
                writer.writerow(row)

            csv_content = output.getvalue()
            output.close()

            return ExportPepinieresCSV(
                csv_data=csv_content,
                success=True,
                message=f"Export CSV réussi - {pepinieres.count()} pépinière(s) exportée(s)"
            )

        except Exception as e:
            return ExportPepinieresCSV(
                success=False,
                csv_data="",
                message=f"Erreur lors de l'export : {str(e)}"
            )

class ImportPepinieresCSV(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()
    imported_count = graphene.Int()
    errors = graphene.List(graphene.String)

    class Arguments:
        csv_file = Upload(required=True)

    @login_required
    def mutate(self, info, csv_file):
        try:
            user = info.context.user
            imported_count = 0
            errors = []
            
            # Lire le contenu du fichier CSV
            csv_content = csv_file.read().decode('utf-8')
            csv_reader = csv.DictReader(io.StringIO(csv_content))
            
            # Validation des en-têtes requis
            required_headers = ['Nom', 'Adresse', 'Latitude', 'Longitude']
            if not all(header in csv_reader.fieldnames for header in required_headers):
                missing_headers = [h for h in required_headers if h not in csv_reader.fieldnames]
                return ImportPepinieresCSV(
                    success=False,
                    message=f"En-têtes manquants: {', '.join(missing_headers)}",
                    imported_count=0,
                    errors=[f"En-têtes manquants: {', '.join(missing_headers)}"]
                )
            
            # Traitement des lignes
            for row_num, row in enumerate(csv_reader, start=2):
                try:
                    # Validation des champs obligatoires
                    nom = row.get('Nom', '').strip()
                    adresse = row.get('Adresse', '').strip()
                    latitude_str = row.get('Latitude', '').strip()
                    longitude_str = row.get('Longitude', '').strip()
                    
                    if not nom or not adresse or not latitude_str or not longitude_str:
                        errors.append(f"Ligne {row_num}: Nom, Adresse, Latitude et Longitude sont requis")
                        continue
                    
                    # Validation et conversion des coordonnées avec Decimal
                    try:
                        # Remplacer les virgules par des points et nettoyer les espaces
                        latitude_clean = latitude_str.replace(',', '.').replace(' ', '')
                        longitude_clean = longitude_str.replace(',', '.').replace(' ', '')
                        
                        # Conversion en Decimal (plus précis que float pour les coordonnées)
                        latitude = Decimal(latitude_clean)
                        longitude = Decimal(longitude_clean)
                        
                        # Validation des limites géographiques
                        if not (Decimal('-90') <= latitude <= Decimal('90')):
                            errors.append(f"Ligne {row_num}: Latitude doit être entre -90 et 90 (valeur: {latitude})")
                            continue
                        if not (Decimal('-180') <= longitude <= Decimal('180')):
                            errors.append(f"Ligne {row_num}: Longitude doit être entre -180 et 180 (valeur: {longitude})")
                            continue
                            
                    except (ValueError, InvalidOperation, TypeError) as e:
                        errors.append(f"Ligne {row_num}: Format de coordonnées invalide - Latitude: '{latitude_str}', Longitude: '{longitude_str}' - Erreur: {str(e)}")
                        continue
                    
                    # Validation de l'email si fourni
                    email_gestionnaire = row.get('Email Gestionnaire', '').strip()
                    if email_gestionnaire and '@' not in email_gestionnaire:
                        errors.append(f"Ligne {row_num}: Format d'email gestionnaire invalide '{email_gestionnaire}'")
                        continue
                    
                    # Validation de la longueur des champs obligatoires
                    if len(nom) > 100:
                        errors.append(f"Ligne {row_num}: Le nom est trop long (max 100 caractères)")
                        continue
                    if len(adresse) > 255:
                        errors.append(f"Ligne {row_num}: L'adresse est trop longue (max 255 caractères)")
                        continue
                    
                    # Préparation des champs optionnels
                    description = row.get('Description', '').strip()
                    nom_gestionnaire = row.get('Nom Gestionnaire', '').strip()
                    poste_gestionnaire = row.get('Poste Gestionnaire', '').strip()
                    telephone_gestionnaire = row.get('Téléphone Gestionnaire', '').strip()
                    especes_produites = row.get('Espèces Produites', '').strip()
                    quantite_production_generale = row.get('Quantité Production Générale', '').strip()
                    nom_projet = row.get('Nom Projet', '').strip()
                    
                    # Validation des longueurs des champs optionnels
                    if len(nom_gestionnaire) > 100:
                        errors.append(f"Ligne {row_num}: Le nom du gestionnaire est trop long (max 100 caractères)")
                        continue
                    if len(poste_gestionnaire) > 100:
                        errors.append(f"Ligne {row_num}: Le poste du gestionnaire est trop long (max 100 caractères)")
                        continue
                    if len(telephone_gestionnaire) > 20:
                        errors.append(f"Ligne {row_num}: Le téléphone du gestionnaire est trop long (max 20 caractères)")
                        continue
                    if len(nom_projet) > 200:
                        errors.append(f"Ligne {row_num}: Le nom du projet est trop long (max 200 caractères)")
                        continue
                    
                    # Création de la pépinière
                    Pepiniere.objects.create(
                        user=user,
                        nom=nom,
                        adresse=adresse,
                        latitude=latitude,
                        longitude=longitude,
                        description=description,
                        nom_gestionnaire=nom_gestionnaire,
                        poste_gestionnaire=poste_gestionnaire,
                        telephone_gestionnaire=telephone_gestionnaire,
                        email_gestionnaire=email_gestionnaire,
                        especes_produites=especes_produites,
                        quantite_production_generale=quantite_production_generale,
                        nom_projet=nom_projet
                    )
                    imported_count += 1
                    
                except Exception as e:
                    errors.append(f"Ligne {row_num}: Erreur lors de la création - {str(e)}")
                    continue
            
            # Message de retour
            if imported_count == 0:
                message = "Aucune pépinière n'a pu être importée"
                success = False
            else:
                message = f"Import terminé: {imported_count} pépinière(s) importée(s)"
                success = True
                
            if errors:
                message += f", {len(errors)} erreur(s)"
            
            return ImportPepinieresCSV(
                success=success,
                message=message,
                imported_count=imported_count,
                errors=errors
            )
            
        except Exception as e:
            return ImportPepinieresCSV(
                success=False,
                message=f"Erreur lors de l'import: {str(e)}",
                imported_count=0,
                errors=[str(e)]
            )

class UpdateUserActiveStatus(graphene.Mutation):
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        user_id = graphene.ID(required=True)
        is_active = graphene.Boolean(required=True)

    @login_required
    def mutate(self, info, user_id, is_active):
        user = info.context.user
        if not user.is_superuser and user.role != 'admin':
            return UpdateUserActiveStatus(success=False, message="Permission refusée")
        try:
            target_user = User.objects.get(id=user_id)
            target_user.is_active = is_active
            target_user.save()
            return UpdateUserActiveStatus(user=target_user, success=True, message="Statut mis à jour")
        except User.DoesNotExist:
            return UpdateUserActiveStatus(success=False, message="Utilisateur introuvable")

class UpdateUserAbreviation(graphene.Mutation):
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        user_id = graphene.ID(required=True)
        abreviation = graphene.String(required=True)

    @login_required
    def mutate(self, info, user_id, abreviation):
        user = info.context.user
        # Permettre à l'utilisateur de modifier sa propre abréviation ou aux admins de modifier n'importe quelle abréviation
        if str(user.id) != str(user_id) and not user.is_superuser and user.role != 'admin':
            return UpdateUserAbreviation(success=False, message="Permission refusée")
        try:
            target_user = User.objects.get(id=user_id)
            target_user.abreviation = abreviation
            target_user.save()
            return UpdateUserAbreviation(user=target_user, success=True, message="Abréviation mise à jour")
        except User.DoesNotExist:
            return UpdateUserAbreviation(success=False, message="Utilisateur introuvable")

class UpdateUserLogo(graphene.Mutation):
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        logo = Upload(required=True)

    @login_required
    def mutate(self, info, logo):
        user = info.context.user
        try:
            user.logo = logo
            user.save()
            return UpdateUserLogo(user=user, success=True, message="Logo mis à jour")
        except Exception as e:
            return UpdateUserLogo(success=False, message=str(e))

class UpdateUserProfile(graphene.Mutation):
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        nom_institution = graphene.String()
        nom_projet = graphene.String()
        email = graphene.String()

    @login_required
    def mutate(self, info, nom_institution=None, nom_projet=None, email=None):
        user = info.context.user

        try:
            if nom_institution is not None:
                user.nom_institution = nom_institution

            if nom_projet is not None:
                user.nom_projet = nom_projet

            if email is not None:
                # Vérifie que l'email est unique pour les autres utilisateurs
                if User.objects.filter(email=email).exclude(id=user.id).exists():
                    return UpdateUserProfile(success=False, message="Cet email est déjà utilisé")
                user.email = email

            user.save()
            return UpdateUserProfile(user=user, success=True, message="Profil mis à jour")
        except Exception as e:
            return UpdateUserProfile(success=False, message=f"Erreur : {str(e)}")

class ChangePassword(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        old_password = graphene.String(required=True)
        new_password = graphene.String(required=True)

    @login_required
    def mutate(self, info, old_password, new_password):
        user = info.context.user
        if not user.check_password(old_password):
            return ChangePassword(success=False, message="Ancien mot de passe incorrect")
        if len(new_password) < 6:
            return ChangePassword(success=False, message="Le nouveau mot de passe doit contenir au moins 6 caractères")
        user.set_password(new_password)
        user.save()
        return ChangePassword(success=True, message="Mot de passe modifié avec succès")

class Query(graphene.ObjectType):
    all_parcelles = graphene.List(ParcelleType)
    my_parcelles = graphene.List(ParcelleType)
    parcelle = graphene.Field(ParcelleType, id=graphene.ID(required=True))
    all_users = graphene.List(UserType)
    me = graphene.Field(UserType)
    all_sieges = graphene.List(SiegeType)
    my_sieges = graphene.List(SiegeType)
    siege = graphene.Field(SiegeType, id=graphene.ID(required=True))
    # Nouvelles queries pour Pépinière
    all_pepinieres = graphene.List(PepiniereType)
    my_pepinieres = graphene.List(PepiniereType)
    pepiniere = graphene.Field(PepiniereType, id=graphene.ID(required=True))

    # ENLEVER @login_required pour rendre public
    def resolve_all_parcelles(self, info):
        return Parcelle.objects.all()

    @login_required
    def resolve_my_parcelles(self, info):
        user = info.context.user
        return Parcelle.objects.filter(user=user)

   
    def resolve_parcelle(self, info, id):
        return Parcelle.objects.get(pk=id)

    def resolve_all_users(self, info):
        return User.objects.all()

    @login_required
    def resolve_me(self, info):
        user = info.context.user
        return user

    # ENLEVER @login_required pour rendre public
    def resolve_all_sieges(self, info):
        return Siege.objects.all()

    @login_required
    def resolve_my_sieges(self, info):
        user = info.context.user
        return Siege.objects.filter(user=user)

    def resolve_siege(self, info, id):
        return Siege.objects.get(pk=id)

    # ENLEVER @login_required pour rendre public
    def resolve_all_pepinieres(self, info):
        return Pepiniere.objects.all()

    @login_required
    def resolve_my_pepinieres(self, info):
        user = info.context.user
        return Pepiniere.objects.filter(user=user)

   
    def resolve_pepiniere(self, info, id):
        return Pepiniere.objects.get(pk=id)

class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    login_user = LoginUser.Field()
    create_parcelle = CreateParcelle.Field()
    update_parcelle = UpdateParcelle.Field()
    delete_parcelle = DeleteParcelle.Field()
    create_siege = CreateSiege.Field()
    update_siege = UpdateSiege.Field()
    delete_siege = DeleteSiege.Field()
    # Nouvelles mutations pour Pépinière
    create_pepiniere = CreatePepiniere.Field()
    update_pepiniere = UpdatePepiniere.Field()
    delete_pepiniere = DeletePepiniere.Field()
    
    # JWT mutations
    token_auth = ObtainJSONWebToken.Field()
    token_auth_with_user = TokenAuthWithUser.Field()
    refresh_token = Refresh.Field()
    verify_token = Verify.Field()
    export_parcelles_csv = ExportParcellesCSV.Field()
    import_parcelles_csv = ImportParcellesCSV.Field()
    export_sieges_csv = ExportSiegesCSV.Field()
    import_sieges_csv = ImportSiegesCSV.Field()
    # Nouvelles mutations CSV pour Pépinière
    export_pepinieres_csv = ExportPepinieresCSV.Field()
    import_pepinieres_csv = ImportPepinieresCSV.Field()
    update_user_active_status = UpdateUserActiveStatus.Field()
    update_user_abreviation = UpdateUserAbreviation.Field()
    update_user_logo = UpdateUserLogo.Field()
    update_user_profile = UpdateUserProfile.Field()
    change_password = ChangePassword.Field()

schema = graphene.Schema(query=Query, mutation=Mutation) 