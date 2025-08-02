"use strict";exports.id=975,exports.ids=[975],exports.modules={48443:(e,i,t)=>{t.d(i,{$C:()=>h,Am:()=>a,EF:()=>G,I5:()=>C,JL:()=>f,K4:()=>J,KZ:()=>g,LN:()=>S,QG:()=>n,Qx:()=>D,Si:()=>P,Tf:()=>j,Tv:()=>c,Wj:()=>A,X6:()=>y,ZY:()=>x,Ze:()=>$,_Q:()=>l,em:()=>d,gm:()=>q,kv:()=>I,lH:()=>m,lj:()=>M,ly:()=>k,mb:()=>b,rW:()=>U,sI:()=>r,sj:()=>v,xh:()=>s,yU:()=>w,z7:()=>u,zU:()=>p});var o=t(79826);let n=(0,o.J1)`
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
`,r=(0,o.J1)`
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
`,s=(0,o.J1)`
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
`,a=(0,o.J1)`
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
`,d=(0,o.J1)`
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
`,m=(0,o.J1)`
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
`,l=(0,o.J1)`
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
`,p=(0,o.J1)`
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
`,u=(0,o.J1)`
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
`,g=(0,o.J1)`
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
`,c=(0,o.J1)`
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
`,$=(0,o.J1)`
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
`;(0,o.J1)`
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
`;let P=(0,o.J1)`
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
`,h=(0,o.J1)`
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
`,S=(0,o.J1)`
  mutation DeleteParcelle($id: ID!) {
    deleteParcelle(id: $id) {
      success
      message
    }
  }
`;(0,o.J1)`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
      refreshToken
    }
  }
`;let v=(0,o.J1)`
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
`;(0,o.J1)`
  mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`,(0,o.J1)`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
      payload
    }
  }
`;let j=(0,o.J1)`
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
`,G=(0,o.J1)`
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
`,A=(0,o.J1)`
  mutation DeleteSiege($id: ID!) {
    deleteSiege(id: $id) {
      success
      message
    }
  }
`,f=(0,o.J1)`
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
`,b=(0,o.J1)`
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
`,I=(0,o.J1)`
  mutation DeletePepiniere($id: ID!) {
    deletePepiniere(id: $id) {
      success
      message
    }
  }
`,J=(0,o.J1)`
  mutation ExportParcellesCSV {
    exportParcellesCsv {
      success
      message
      csvData
    }
  }
`,U=(0,o.J1)`
  mutation ImportParcellesCSV($csvFile: Upload!) {
    importParcellesCsv(csvFile: $csvFile) {
      success
      message
      importedCount
      errors
    }
  }
`,y=(0,o.J1)`
  mutation ExportSiegesCSV {
    exportSiegesCsv {
      success
      message
      csvData
    }
  }
`,q=(0,o.J1)`
  mutation ImportSiegesCSV($csvFile: Upload!) {
    importSiegesCsv(csvFile: $csvFile) {
      success
      message
      importedCount
      errors
    }
  }
`,k=(0,o.J1)`
  mutation ExportPepinieresCSV {
    exportPepinieresCsv {
      success
      message
      csvData
    }
  }
`,C=(0,o.J1)`
  mutation ImportPepinieresCSV($csvFile: Upload!) {
    importPepinieresCsv(csvFile: $csvFile) {
      success
      message
      importedCount
      errors
    }
  }
`;(0,o.J1)`
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
`;let x=(0,o.J1)`
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
`,w=(0,o.J1)`
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
`,D=(0,o.J1)`
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
`,M=(0,o.J1)`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      success
      message
    }
  }
`},76717:(e,i,t)=>{t.d(i,{$:()=>d});var o=t(60687);t(43210);var n=t(8730),r=t(24224),s=t(65222);let a=(0,r.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",{variants:{variant:{default:"bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",destructive:"bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",secondary:"bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2 has-[>svg]:px-3",sm:"h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",lg:"h-10 rounded-md px-6 has-[>svg]:px-4",icon:"size-9"}},defaultVariants:{variant:"default",size:"default"}});function d({className:e,variant:i,size:t,asChild:r=!1,...d}){let m=r?n.DX:"button";return(0,o.jsx)(m,{"data-slot":"button",className:(0,s.cn)(a({variant:i,size:t,className:e})),...d})}}};