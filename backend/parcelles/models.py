from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('L\'email est obligatoire')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Le superuser doit avoir is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Le superuser doit avoir is_superuser=True.')
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('membre', 'Membre'),
    )
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='membre')
    logo = models.ImageField(upload_to='logos/', null=True, blank=True, help_text="Logo du membre")
    abreviation = models.CharField(max_length=20, blank=True, help_text="Abréviation du membre")
    nom_institution = models.CharField(max_length=200, blank=True, help_text="Nom de l'institution")
    nom_projet = models.CharField(max_length=200, blank=True, help_text="Nom du projet")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return f"{self.email} ({self.role})"
    class Meta : 
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"

class Parcelle(models.Model):
    # Informations de base
    nom = models.CharField(max_length=100)
    
    # Nouveaux champs pour personne référente
    nom_personne_referente = models.CharField(max_length=100, blank=True, help_text="Nom de la personne référente")
    poste = models.CharField(max_length=100, blank=True, help_text="Poste de la personne référente")
    telephone = models.CharField(max_length=20, blank=True, help_text="Téléphone de la personne référente")
    email = models.EmailField(blank=True, help_text="Email de la personne référente")
    
    # Informations agricoles
    superficie = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Superficie en hectares")
    
    # Champ pratique : liste séparée par virgule, ou 'autres' si besoin
    pratique = models.TextField(blank=True, help_text="Pratiques agricoles principales (plusieurs pratiques séparées par virgule, ou 'autres')")
    
    # Nouveau champ nom projet
    nom_projet = models.CharField(max_length=200, blank=True, help_text="Nom du projet")
    
    # Données géospatiales (GeoJSON converti depuis les fichiers .shp, .kml, etc.)
    geojson = models.JSONField(help_text="Données GeoJSON converties depuis les fichiers uploadés")
    
    # Description (remplace notes)
    description = models.TextField(null=True, blank=True, help_text="Description de la parcelle")
    
    # Relations et métadonnées
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='parcelles')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.nom}"
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Site de référence"
        verbose_name_plural = "Sites de référence"

class ParcelleImage(models.Model):
    parcelle = models.ForeignKey(Parcelle, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='parcelles/', help_text="Image de la parcelle")
    titre = models.CharField(max_length=200, null=True, blank=True, help_text="Titre de l'image")
    description = models.TextField(null=True, blank=True, help_text="Description de l'image")
    ordre = models.IntegerField(default=0, help_text="Ordre d'affichage")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['ordre', 'created_at']
        verbose_name = "Images du site de référence"
        verbose_name_plural = "Images des sites de référence"
    
    def __str__(self):
        return f"Image {self.ordre} - {self.parcelle.nom}"

class Siege(models.Model):
    CATEGORIE_CHOICES = (
        ('social', 'Siège social'),
        ('regional', 'Siège régional'),
        ('technique', 'Siège technique'),
        ('provisoire', 'Siège provisoire'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sieges')
    nom = models.CharField(max_length=100)
    
    # Nouveaux champs
    categorie = models.CharField(max_length=20, choices=CATEGORIE_CHOICES, default='social', help_text="Catégorie du siège")
    nom_point_contact = models.CharField(max_length=100, blank=True, help_text="Nom du point de contact")
    poste = models.CharField(max_length=100, blank=True, help_text="Poste du point de contact")
    telephone = models.CharField(max_length=20, blank=True, help_text="Téléphone du point de contact")
    email = models.EmailField(blank=True, help_text="Email du point de contact")

    # Champ projet rattaché
    nom_projet = models.CharField(max_length=200, blank=True, help_text="Nom du projet")

    # Horaires fixes
    horaire_matin = models.CharField(max_length=100, blank=True, help_text="Horaires du matin")
    horaire_apres_midi = models.CharField(max_length=100, blank=True, help_text="Horaires de l'après-midi")

    adresse = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nom} - {self.user.email}"
    class Meta : 
        verbose_name = "Local"
        verbose_name_plural = "Locaux"

class SiegeImage(models.Model):
    siege = models.ForeignKey(Siege, on_delete=models.CASCADE, related_name='photos_batiment')
    image = models.ImageField(upload_to='sieges/', help_text="Photo du bâtiment")
    titre = models.CharField(max_length=200, null=True, blank=True, help_text="Titre de l'image")
    description = models.TextField(null=True, blank=True, help_text="Description de l'image")
    ordre = models.IntegerField(default=0, help_text="Ordre d'affichage")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['ordre', 'created_at']
        verbose_name = "Images du local"
        verbose_name_plural = "Images des locaux"
    
    def __str__(self):
        return f"Photo {self.ordre} - {self.siege.nom}"

class Pepiniere(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pepinieres')
    nom = models.CharField(max_length=100)
    adresse = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    description = models.TextField(null=True, blank=True)
    
    # Champs spécifiques à la pépinière
    nom_gestionnaire = models.CharField(max_length=100, blank=True, help_text="Nom du gestionnaire")
    poste_gestionnaire = models.CharField(max_length=100, blank=True, help_text="Poste du gestionnaire")
    telephone_gestionnaire = models.CharField(max_length=20, blank=True, help_text="Téléphone du gestionnaire")
    email_gestionnaire = models.EmailField(blank=True, help_text="Email du gestionnaire")
    especes_produites = models.TextField(blank=True, help_text="Espèces produites")
    nom_projet = models.CharField(max_length=200, blank=True, help_text="Nom du projet")
    quantite_production_generale = models.TextField(blank=True, help_text="Quantité de production générale")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nom} - {self.user.email}"

class PepiniereImage(models.Model):
    pepiniere = models.ForeignKey(Pepiniere, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='pepinieres/', help_text="Photo de la pépinière")
    titre = models.CharField(max_length=200, null=True, blank=True, help_text="Titre de l'image")
    description = models.TextField(null=True, blank=True, help_text="Description de l'image")
    ordre = models.IntegerField(default=0, help_text="Ordre d'affichage")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['ordre', 'created_at']
        verbose_name = "Images de pépinière"
        verbose_name_plural = "Images des pépinières"
    
    def __str__(self):
        return f"Photo {self.ordre} - {self.pepiniere.nom}"
