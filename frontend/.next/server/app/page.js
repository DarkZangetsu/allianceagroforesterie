(()=>{var e={};e.id=974,e.ids=[974],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},17210:(e,t,i)=>{Promise.resolve().then(i.bind(i,94623))},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},46348:(e,t,i)=>{"use strict";i.r(t),i.d(t,{GlobalError:()=>s.a,__next_app__:()=>u,pages:()=>m,routeModule:()=>c,tree:()=>d});var o=i(65239),r=i(48088),n=i(88170),s=i.n(n),a=i(30893),l={};for(let e in a)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>a[e]);i.d(t,l);let d=["",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(i.bind(i,79878)),"C:\\Users\\Fitahiana\\Documents\\GitHub\\Agri-Geo\\frontend\\src\\app\\page.js"]}]},{layout:[()=>Promise.resolve().then(i.bind(i,75535)),"C:\\Users\\Fitahiana\\Documents\\GitHub\\Agri-Geo\\frontend\\src\\app\\layout.js"],"not-found":[()=>Promise.resolve().then(i.bind(i,28069)),"C:\\Users\\Fitahiana\\Documents\\GitHub\\Agri-Geo\\frontend\\src\\app\\not-found.js"],forbidden:[()=>Promise.resolve().then(i.t.bind(i,89999,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(i.t.bind(i,65284,23)),"next/dist/client/components/unauthorized-error"]}],m=["C:\\Users\\Fitahiana\\Documents\\GitHub\\Agri-Geo\\frontend\\src\\app\\page.js"],u={require:i,loadChunk:()=>Promise.resolve()},c=new o.AppPageRouteModule({definition:{kind:r.RouteKind.APP_PAGE,page:"/page",pathname:"/",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},48443:(e,t,i)=>{"use strict";i.d(t,{$C:()=>P,Am:()=>a,EF:()=>b,I5:()=>k,JL:()=>v,K4:()=>w,KZ:()=>p,LN:()=>f,QG:()=>r,Qx:()=>D,Si:()=>$,Tf:()=>j,Tv:()=>g,Wj:()=>S,X6:()=>C,ZY:()=>q,Ze:()=>h,_Q:()=>m,em:()=>l,gm:()=>I,kv:()=>A,lH:()=>d,lj:()=>M,ly:()=>U,mb:()=>G,rW:()=>y,sI:()=>n,sj:()=>x,xh:()=>s,yU:()=>J,z7:()=>c,zU:()=>u});var o=i(79826);let r=(0,o.J1)`
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
`,n=(0,o.J1)`
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
`,l=(0,o.J1)`
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
`,d=(0,o.J1)`
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
`,m=(0,o.J1)`
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
`,u=(0,o.J1)`
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
`,c=(0,o.J1)`
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
`,p=(0,o.J1)`
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
`,g=(0,o.J1)`
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
`,h=(0,o.J1)`
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
`;let $=(0,o.J1)`
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
`,P=(0,o.J1)`
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
`,f=(0,o.J1)`
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
`;let x=(0,o.J1)`
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
`,b=(0,o.J1)`
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
`,S=(0,o.J1)`
  mutation DeleteSiege($id: ID!) {
    deleteSiege(id: $id) {
      success
      message
    }
  }
`,v=(0,o.J1)`
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
`,G=(0,o.J1)`
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
`,A=(0,o.J1)`
  mutation DeletePepiniere($id: ID!) {
    deletePepiniere(id: $id) {
      success
      message
    }
  }
`,w=(0,o.J1)`
  mutation ExportParcellesCSV {
    exportParcellesCsv {
      success
      message
      csvData
    }
  }
`,y=(0,o.J1)`
  mutation ImportParcellesCSV($csvFile: Upload!) {
    importParcellesCsv(csvFile: $csvFile) {
      success
      message
      importedCount
      errors
    }
  }
`,C=(0,o.J1)`
  mutation ExportSiegesCSV {
    exportSiegesCsv {
      success
      message
      csvData
    }
  }
`,I=(0,o.J1)`
  mutation ImportSiegesCSV($csvFile: Upload!) {
    importSiegesCsv(csvFile: $csvFile) {
      success
      message
      importedCount
      errors
    }
  }
`,U=(0,o.J1)`
  mutation ExportPepinieresCSV {
    exportPepinieresCsv {
      success
      message
      csvData
    }
  }
`,k=(0,o.J1)`
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
`;let q=(0,o.J1)`
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
`,J=(0,o.J1)`
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
`},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},70354:(e,t,i)=>{Promise.resolve().then(i.bind(i,79878))},79878:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>o});let o=(0,i(12907).registerClientReference)(function(){throw Error("Attempted to call the default export of \"C:\\\\Users\\\\Fitahiana\\\\Documents\\\\GitHub\\\\Agri-Geo\\\\frontend\\\\src\\\\app\\\\page.js\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"C:\\Users\\Fitahiana\\Documents\\GitHub\\Agri-Geo\\frontend\\src\\app\\page.js","default")},94623:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>u});var o=i(60687);i(16189);var r=i(8829),n=i(48443),s=i(43210),a=i(30036);i(72287);var l=i(97638),d=i.n(l);function m({parcelles:e=[],sieges:t=[],pepinieres:i=[],mapStyle:r="street",style:n,center:a}){let[l,d]=(0,s.useState)(null),[m,u]=(0,s.useState)(null),[c,p]=(0,s.useState)(null),[g,h]=(0,s.useState)(0);return(0,s.useRef)(null),(0,o.jsx)("div",{className:"w-full h-full flex items-center justify-center bg-gray-100",children:(0,o.jsxs)("div",{className:"text-center",children:[(0,o.jsx)("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"}),(0,o.jsx)("p",{className:"mt-2 text-gray-600",children:"Chargement de la carte..."})]})})}function u(){let{data:e,loading:t,error:i}=(0,r.IT)(n.xh),{data:a,loading:l,error:d}=(0,r.IT)(n._Q),{data:u,loading:c,error:p}=(0,r.IT)(n.KZ),{data:g}=(0,r.IT)(n.em),[h,$]=(0,s.useState)("street"),[P,f]=(0,s.useState)(!0),[x,j]=(0,s.useState)(!0),[b,S]=(0,s.useState)(!0),[v,G]=(0,s.useState)(""),[A,w]=(0,s.useState)(""),y=e?.allParcelles||[],C=a?.allSieges||[],I=u?.allPepinieres||[];function U(e,t,i){return e.filter(e=>{let o=(e.nom||"")+" "+(e.user?.firstName||"")+" "+(e.user?.lastName||""),r=!t||o.toLowerCase().includes(t.toLowerCase()),n=!i||e.user&&e.user.id===i;return r&&n})}let k=P?U(y,v,A):[],q=x?U(C,v,A):[],J=b?U(I,v,A):[],D=k&&k.length>0;return(0,o.jsxs)("div",{style:{height:"100vh",width:"100vw",display:"flex",flexDirection:"column"},children:[(0,o.jsxs)("div",{className:"bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 border-b shadow-sm",style:{flex:"0 0 auto"},children:[(0,o.jsx)("div",{className:"flex items-center gap-2",children:(0,o.jsx)("h1",{className:"ml-4 text-2xl font-extrabold text-blue-900",children:"Carte g\xe9n\xe9rale"})}),(0,o.jsxs)("div",{className:"flex flex-wrap items-center gap-4",children:[(0,o.jsx)("input",{type:"text",value:v,onChange:e=>G(e.target.value),placeholder:"Rechercher par nom, propri\xe9taire...",className:"px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 font-semibold shadow-sm"}),(0,o.jsxs)("select",{value:A,onChange:e=>w(e.target.value),className:"px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 font-semibold shadow-sm",children:[(0,o.jsx)("option",{value:"",children:"Tous les institutions"}),g?.allUsers?.map(e=>(0,o.jsx)("option",{value:e.id,children:e.nomInstitution},e.id))]}),(0,o.jsxs)("label",{className:"flex items-center gap-2 text-blue-900 font-semibold bg-blue-50 px-3 py-2 rounded-lg border border-blue-100",children:[(0,o.jsx)("input",{type:"checkbox",checked:P,onChange:()=>f(e=>!e),className:"accent-blue-600"}),"Sites de r\xe9f\xe9rence",(0,o.jsx)("span",{className:"ml-1 text-xs bg-blue-200 text-blue-900 rounded px-2 py-0.5 font-bold",children:y.length})]}),(0,o.jsxs)("label",{className:"flex items-center gap-2 text-red-900 font-semibold bg-red-50 px-3 py-2 rounded-lg border border-red-100",children:[(0,o.jsx)("input",{type:"checkbox",checked:x,onChange:()=>j(e=>!e),className:"accent-red-600"}),"Locaux",(0,o.jsx)("span",{className:"ml-1 text-xs bg-red-200 text-red-900 rounded px-2 py-0.5 font-bold",children:C.length})]}),(0,o.jsxs)("label",{className:"flex items-center gap-2 text-green-900 font-semibold bg-green-50 px-3 py-2 rounded-lg border border-green-100",children:[(0,o.jsx)("input",{type:"checkbox",checked:b,onChange:()=>S(e=>!e),className:"accent-green-600"}),"P\xe9pini\xe8res",(0,o.jsx)("span",{className:"ml-1 text-xs bg-green-200 text-green-900 rounded px-2 py-0.5 font-bold",children:I.length})]}),(0,o.jsxs)("select",{value:h,onChange:e=>$(e.target.value),className:"px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 font-semibold shadow-sm",children:[(0,o.jsx)("option",{value:"street",children:"Carte routi\xe8re"}),(0,o.jsx)("option",{value:"satellite",children:"Satellite"}),(0,o.jsx)("option",{value:"hybrid",children:"Hybride"})]})]})]}),(0,o.jsx)("div",{style:{flex:1,minHeight:0,height:"100%"},children:t||l||c?(0,o.jsx)("div",{className:"flex items-center justify-center h-full text-lg text-blue-700 font-semibold",children:"Chargement de la carte..."}):i?(0,o.jsxs)("div",{className:"flex items-center justify-center h-full text-lg text-red-700 font-semibold",children:["Erreur d'acc\xe8s aux parcelles : ",i.message]}):d?(0,o.jsxs)("div",{className:"flex items-center justify-center h-full text-lg text-red-700 font-semibold",children:["Erreur d'acc\xe8s aux si\xe8ges : ",d.message]}):p?(0,o.jsxs)("div",{className:"flex items-center justify-center h-full text-lg text-red-700 font-semibold",children:["Erreur d'acc\xe8s aux p\xe9pini\xe8res : ",p.message]}):(0,o.jsx)("div",{style:{height:"100%",width:"100%"},children:(0,o.jsx)(m,{parcelles:k,sieges:q,pepinieres:J,mapStyle:h,style:{height:"100%",width:"100%"},center:D?void 0:[-18.7669,46.8691]},k.length+"-"+q.length+"-"+J.length+"-"+h)})})]})}i(79887),i(83361),i(94216),new(d()).DivIcon({className:"",iconSize:[36,42],iconAnchor:[18,42],popupAnchor:[0,-36],html:`
    <svg width="36" height="42" viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#shadow)">
        <path d="M18 2C10.268 2 4 8.268 4 16.001c0 7.732 11.09 22.13 13.97 25.89a2 2 0 0 0 3.06 0C20.91 38.13 32 23.733 32 16.001 32 8.268 25.732 2 18 2Z" fill="#2563eb"/>
        <circle cx="18" cy="16" r="6" fill="#fff" stroke="#2563eb" stroke-width="2"/>
      </g>
      <defs>
        <filter id="shadow" x="0" y="0" width="36" height="42" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.2"/>
        </filter>
      </defs>
    </svg>
  `}),new(d()).Icon({iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),new(d()).Icon({iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),(0,a.default)(async()=>{},{loadableGenerated:{modules:["components\\MapGlobal.js -> react-leaflet"]},ssr:!1}),(0,a.default)(async()=>{},{loadableGenerated:{modules:["components\\MapGlobal.js -> react-leaflet"]},ssr:!1}),(0,a.default)(async()=>{},{loadableGenerated:{modules:["components\\MapGlobal.js -> react-leaflet"]},ssr:!1}),(0,a.default)(async()=>{},{loadableGenerated:{modules:["components\\MapGlobal.js -> react-leaflet"]},ssr:!1})}};var t=require("../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),o=t.X(0,[176,804,829,995,747,216,887,361],()=>i(46348));module.exports=o})();