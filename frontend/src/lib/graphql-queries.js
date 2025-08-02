import { gql } from '@apollo/client';

// Queries
export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      role
      logo
      abreviation
      nomInstitution
      nomProjet
    }
  }
`;

export const GET_MY_PARCELLES = gql`
  query GetMyParcelles {
    myParcelles {
      id
      nom
      nomPersonneReferente
      poste
      telephone
      email
      geojson
      superficie
      pratique
      nomProjet
      description
      createdAt
      updatedAt
      user {
        id
        email
        logo
        abreviation
        nomInstitution
        nomProjet
      }
      images {
        id
        image
        ordre
      }
    }
  }
`;

export const GET_ALL_PARCELLES = gql`
  query GetAllParcelles {
    allParcelles {
      id
      nom
      nomPersonneReferente
      poste
      telephone
      email
      geojson
      superficie
      pratique
      nomProjet
      description
      createdAt
      updatedAt
      user {
        id
        email
        logo
        abreviation
        nomInstitution
        nomProjet
      }
      images {
        id
        image
        ordre
      }
    }
  }
`;

export const GET_PARCELLE = gql`
  query GetParcelle($id: ID!) {
    parcelle(id: $id) {
      id
      nom
      nomPersonneReferente
      poste
      telephone
      email
      geojson
      superficie
      pratique
      nomProjet
      description
      createdAt
      updatedAt
      user {
        id
        email
        logo
        abreviation
        nomInstitution
        nomProjet
      }
      images {
        id
        image
        ordre
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    allUsers {
      id
      email
      role
      logo
      abreviation
      nomInstitution
      nomProjet
      dateJoined
    }
  }
`;

export const GET_MY_SIEGES = gql`
  query GetMySieges {
    mySieges {
      id
      nom
      nomProjet
      adresse
      latitude
      longitude
      description
      categorie
      nomPointContact
      poste
      telephone
      email
      horaireMatin
      horaireApresMidi
      createdAt
      updatedAt
      user {
        id
        email
        logo
      }
      photosBatiment {
        id
        image
        titre
        description
        ordre
      }
    }
  }
`;

export const GET_ALL_SIEGES = gql`
  query GetAllSieges {
    allSieges {
      id
      nom
      nomProjet
      adresse
      latitude
      longitude
      description
      categorie
      nomPointContact
      poste
      telephone
      email
      horaireMatin
      horaireApresMidi
      createdAt
      updatedAt
      user {
        id
        email
        logo
        abreviation
        nomInstitution
        nomProjet
      }
      photosBatiment {
        id
        image
        titre
        description
        ordre
      }
    }
  }
`;

export const GET_SIEGE = gql`
  query GetSiege($id: ID!) {
    siege(id: $id) {
      id
      nom
      nomProjet
      adresse
      latitude
      longitude
      description
      categorie
      nomPointContact
      poste
      telephone
      email
      horaireMatin
      horaireApresMidi
      createdAt
      updatedAt
      user {
        id
        email
        logo
        abreviation
        nomInstitution
        nomProjet
      }
      photosBatiment {
        id
        image
        titre
        description
        ordre
      }
    }
  }
`;

// Nouvelles queries pour Pépinière
export const GET_MY_PEPINIERES = gql`
  query GetMyPepinieres {
    myPepinieres {
      id
      nom
      adresse
      latitude
      longitude
      description
      nomGestionnaire
      posteGestionnaire
      telephoneGestionnaire
      emailGestionnaire
      especesProduites
      nomProjet
      quantiteProductionGenerale
      createdAt
      updatedAt
      user {
        id
        email
        logo
        abreviation
        nomInstitution
        nomProjet
      }
      photos {
        id
        image
        titre
        description
        ordre
      }
    }
  }
`;

export const GET_ALL_PEPINIERES = gql`
  query GetAllPepinieres {
    allPepinieres {
      id
      nom
      adresse
      latitude
      longitude
      description
      nomGestionnaire
      posteGestionnaire
      telephoneGestionnaire
      emailGestionnaire
      especesProduites
      nomProjet
      quantiteProductionGenerale
      createdAt
      updatedAt
      user {
        id
        email
        logo
        abreviation
        nomInstitution
        nomProjet
      }
      photos {
        id
        image
        titre
        description
        ordre
      }
    }
  }
`;

export const GET_PEPINIERE = gql`
  query GetPepiniere($id: ID!) {
    pepiniere(id: $id) {
      id
      nom
      adresse
      latitude
      longitude
      description
      nomGestionnaire
      posteGestionnaire
      telephoneGestionnaire
      emailGestionnaire
      especesProduites
      nomProjet
      quantiteProductionGenerale
      createdAt
      updatedAt
      user {
        id
        email
        logo
        abreviation
        nomInstitution
        nomProjet
      }
      photos {
        id
        image
        titre
        description
        ordre
      }
    }
  }
`;

// Mutations
export const CREATE_USER = gql`
  mutation CreateUser(
    $email: String!
    $password: String!
    $abreviation: String
    $role: String
    $logo: Upload
    $nomInstitution: String
    $nomProjet: String
  ) {
    createUser(
      email: $email
      password: $password
      abreviation: $abreviation
      role: $role
      logo: $logo
      nomInstitution: $nomInstitution
      nomProjet: $nomProjet
    ) {
      success
      message
      user {
        id
        email
        abreviation
        role
        logo
        nomInstitution
        nomProjet
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      success
      message
      token
      user {
        id
        email
        role
        logo
        nomInstitution
        nomProjet
      }
    }
  }
`;

export const CREATE_PARCELLE = gql`
  mutation CreateParcelle(
    $nom: String!
    $geojson: JSONString!
    $superficie: Decimal
    $pratique: String
    $nomProjet: String
    $description: String
    $images: [Upload]
    $nomPersonneReferente: String
    $poste: String
    $telephone: String
    $email: String
  ) {
    createParcelle(
      nom: $nom
      geojson: $geojson
      superficie: $superficie
      pratique: $pratique
      nomProjet: $nomProjet
      description: $description
      images: $images
      nomPersonneReferente: $nomPersonneReferente
      poste: $poste
      telephone: $telephone
      email: $email
    ) {
      success
      message
      parcelle {
        id
        nom
        nomPersonneReferente
        poste
        telephone
        email
        geojson
        superficie
        pratique
        nomProjet
        description
        createdAt
        updatedAt
        user {
          id
          email
          logo
          abreviation
          nomInstitution
          nomProjet
        }
        images {
          id
          image
          ordre
        }
      }
    }
  }
`;

export const UPDATE_PARCELLE = gql`
  mutation UpdateParcelle(
    $id: ID!
    $nom: String
    $geojson: JSONString
    $superficie: Decimal
    $pratique: String
    $nomProjet: String
    $description: String
    $images: [Upload]
    $nomPersonneReferente: String
    $poste: String
    $telephone: String
    $email: String
  ) {
    updateParcelle(
      id: $id
      nom: $nom
      geojson: $geojson
      superficie: $superficie
      pratique: $pratique
      nomProjet: $nomProjet
      description: $description
      images: $images
      nomPersonneReferente: $nomPersonneReferente
      poste: $poste
      telephone: $telephone
      email: $email
    ) {
      success
      message
      parcelle {
        id
        nom
        nomPersonneReferente
        poste
        telephone
        email
        geojson
        superficie
        pratique
        nomProjet
        description
        createdAt
        updatedAt
        user {
          id
          email
          logo
          abreviation
          nomInstitution
          nomProjet
        }
        images {
          id
          image
          ordre
        }
      }
    }
  }
`;

export const DELETE_PARCELLE = gql`
  mutation DeleteParcelle($id: ID!) {
    deleteParcelle(id: $id) {
      success
      message
    }
  }
`;

// Mutations JWT
export const TOKEN_AUTH = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
      refreshToken
    }
  }
`;

export const TOKEN_AUTH_WITH_USER = gql`
  mutation TokenAuthWithUser($email: String!, $password: String!) {
    tokenAuthWithUser(email: $email, password: $password) {
      token
      refreshToken
      user {
        id
        email
        role
        logo
        nomInstitution
        nomProjet
      }
      success
      message
    }
  }
`;

export const VERIFY_TOKEN = gql`
  mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
      payload
    }
  }
`;

export const CREATE_SIEGE = gql`
  mutation CreateSiege(
    $nom: String!
    $adresse: String!
    $latitude: Decimal!
    $longitude: Decimal!
    $description: String
    $categorie: String
    $nomPointContact: String
    $poste: String
    $telephone: String
    $email: String
    $nomProjet: String
    $horaireMatin: String
    $horaireApresMidi: String
    $photosBatiment: [Upload]
  ) {
    createSiege(
      nom: $nom
      adresse: $adresse
      latitude: $latitude
      longitude: $longitude
      description: $description
      categorie: $categorie
      nomPointContact: $nomPointContact
      poste: $poste
      telephone: $telephone
      email: $email
      nomProjet: $nomProjet
      horaireMatin: $horaireMatin
      horaireApresMidi: $horaireApresMidi
      photosBatiment: $photosBatiment
    ) {
      success
      message
      siege {
        id
        nom
        nomProjet
        adresse
        latitude
        longitude
        description
        categorie
        nomPointContact
        poste
        telephone
        email
        horaireMatin
        horaireApresMidi
        createdAt
        updatedAt
        user {
          id
          email
        }
        photosBatiment {
          id
          image
          titre
          description
          ordre
        }
      }
    }
  }
`;

export const UPDATE_SIEGE = gql`
  mutation UpdateSiege(
    $id: ID!
    $nom: String
    $adresse: String
    $latitude: Decimal
    $longitude: Decimal
    $description: String
    $categorie: String
    $nomPointContact: String
    $poste: String
    $telephone: String
    $email: String
    $nomProjet: String
    $horaireMatin: String
    $horaireApresMidi: String
    $photosBatiment: [Upload]
  ) {
    updateSiege(
      id: $id
      nom: $nom
      adresse: $adresse
      latitude: $latitude
      longitude: $longitude
      description: $description
      categorie: $categorie
      nomPointContact: $nomPointContact
      poste: $poste
      telephone: $telephone
      email: $email
      nomProjet: $nomProjet
      horaireMatin: $horaireMatin
      horaireApresMidi: $horaireApresMidi
      photosBatiment: $photosBatiment
    ) {
      success
      message
      siege {
        id
        nom
        nomProjet
        adresse
        latitude
        longitude
        description
        categorie
        nomPointContact
        poste
        telephone
        email
        horaireMatin
        horaireApresMidi
        createdAt
        updatedAt
        user {
          id
          email
        }
        photosBatiment {
          id
          image
          titre
          description
          ordre
        }
      }
    }
  }
`;

export const DELETE_SIEGE = gql`
  mutation DeleteSiege($id: ID!) {
    deleteSiege(id: $id) {
      success
      message
    }
  }
`;

// Nouvelles mutations pour Pépinière
export const CREATE_PEPINIERE = gql`
  mutation CreatePepiniere(
    $nom: String!
    $adresse: String!
    $latitude: Decimal!
    $longitude: Decimal!
    $description: String
    $nomGestionnaire: String
    $posteGestionnaire: String
    $telephoneGestionnaire: String
    $emailGestionnaire: String
    $especesProduites: String
    $nomProjet: String
    $quantiteProductionGenerale: String
    $photos: [Upload]
  ) {
    createPepiniere(
      nom: $nom
      adresse: $adresse
      latitude: $latitude
      longitude: $longitude
      description: $description
      nomGestionnaire: $nomGestionnaire
      posteGestionnaire: $posteGestionnaire
      telephoneGestionnaire: $telephoneGestionnaire
      emailGestionnaire: $emailGestionnaire
      especesProduites: $especesProduites
      nomProjet: $nomProjet
      quantiteProductionGenerale: $quantiteProductionGenerale
      photos: $photos
    ) {
      success
      message
      pepiniere {
        id
        nom
        adresse
        latitude
        longitude
        description
        nomGestionnaire
        posteGestionnaire
        telephoneGestionnaire
        emailGestionnaire
        especesProduites
        nomProjet
        quantiteProductionGenerale
        createdAt
        updatedAt
        user {
          id
          email
        }
        photos {
          id
          image
          titre
          description
          ordre
        }
      }
    }
  }
`;

export const UPDATE_PEPINIERE = gql`
  mutation UpdatePepiniere(
    $id: ID!
    $nom: String
    $adresse: String
    $latitude: Decimal
    $longitude: Decimal
    $description: String
    $nomGestionnaire: String
    $posteGestionnaire: String
    $telephoneGestionnaire: String
    $emailGestionnaire: String
    $especesProduites: String
    $nomProjet: String
    $quantiteProductionGenerale: String
    $photos: [Upload]
  ) {
    updatePepiniere(
      id: $id
      nom: $nom
      adresse: $adresse
      latitude: $latitude
      longitude: $longitude
      description: $description
      nomGestionnaire: $nomGestionnaire
      posteGestionnaire: $posteGestionnaire
      telephoneGestionnaire: $telephoneGestionnaire
      emailGestionnaire: $emailGestionnaire
      especesProduites: $especesProduites
      nomProjet: $nomProjet
      quantiteProductionGenerale: $quantiteProductionGenerale
      photos: $photos
    ) {
      success
      message
      pepiniere {
        id
        nom
        adresse
        latitude
        longitude
        description
        nomGestionnaire
        posteGestionnaire
        telephoneGestionnaire
        emailGestionnaire
        especesProduites
        nomProjet
        quantiteProductionGenerale
        createdAt
        updatedAt
        user {
          id
          email
        }
        photos {
          id
          image
          titre
          description
          ordre
        }
      }
    }
  }
`;

export const DELETE_PEPINIERE = gql`
  mutation DeletePepiniere($id: ID!) {
    deletePepiniere(id: $id) {
      success
      message
    }
  }
`;

// CSV Import/Export mutations
export const EXPORT_PARCELLES_CSV = gql`
  mutation ExportParcellesCSV {
    exportParcellesCsv {
      success
      message
      csvData
    }
  }
`;

export const IMPORT_PARCELLES_CSV = gql`
  mutation ImportParcellesCSV($csvFile: Upload!) {
    importParcellesCsv(csvFile: $csvFile) {
      success
      message
      importedCount
      errors
    }
  }
`;

export const EXPORT_SIEGES_CSV = gql`
  mutation ExportSiegesCSV {
    exportSiegesCsv {
      success
      message
      csvData
    }
  }
`;

export const IMPORT_SIEGES_CSV = gql`
  mutation ImportSiegesCSV($csvFile: Upload!) {
    importSiegesCsv(csvFile: $csvFile) {
      success
      message
      importedCount
      errors
    }
  }
`;

// Nouvelles mutations CSV pour Pépinière
export const EXPORT_PEPINIERES_CSV = gql`
  mutation ExportPepinieresCSV {
    exportPepinieresCsv {
      success
      message
      csvData
    }
  }
`;

export const IMPORT_PEPINIERES_CSV = gql`
  mutation ImportPepinieresCSV($csvFile: Upload!) {
    importPepinieresCsv(csvFile: $csvFile) {
      success
      message
      importedCount
      errors
    }
  }
`;

export const UPDATE_USER_ACTIVE_STATUS = gql`
  mutation UpdateUserActiveStatus($userId: ID!, $isActive: Boolean!) {
    updateUserActiveStatus(userId: $userId, isActive: $isActive) {
      success
      message
      user {
        id
        isActive
      }
    }
  }
`;

export const UPDATE_USER_ABREVIATION = gql`
  mutation UpdateUserAbreviation($userId: ID!, $abreviation: String!) {
    updateUserAbreviation(userId: $userId, abreviation: $abreviation) {
      success
      message
      user {
        id
        abreviation
        email
        logo
        nomInstitution
        nomProjet
      }
    }
  }
`;

export const UPDATE_USER_LOGO = gql`
  mutation UpdateUserLogo($logo: Upload!) {
    updateUserLogo(logo: $logo) {
      success
      message
      user {
        id
        email
        abreviation
        logo
        nomInstitution
        nomProjet
      }
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($nomInstitution: String, $nomProjet: String, $email: String) {
    updateUserProfile(nomInstitution: $nomInstitution, nomProjet: $nomProjet, email: $email) {
      success
      message
      user {
        id
        nomInstitution
        nomProjet
        email
        abreviation
        logo
      }
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      success
      message
    }
  }
`; 