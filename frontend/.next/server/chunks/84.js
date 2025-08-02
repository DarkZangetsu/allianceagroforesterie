"use strict";exports.id=84,exports.ids=[84],exports.modules={306:(e,t,i)=>{i.d(t,{A:()=>x});var o=i(60687),s=i(76180),n=i.n(s),r=i(43210),a=i(43371),l=i(64021),d=i(12597),m=i(13861),c=i(79410),u=i(58869),p=i(35020),g=i(19169),f=i(28559),h=i(70334);let $=({id:e,name:t,value:i,onChange:s,placeholder:n,label:r,showPassword:a,onTogglePassword:c})=>(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{htmlFor:e,className:"block text-sm font-medium text-gray-700 mb-1",children:(0,o.jsxs)("span",{className:"flex items-center gap-2",children:[(0,o.jsx)(l.A,{className:"w-4 h-4"})," ",r," *"]})}),(0,o.jsxs)("div",{className:"relative",children:[(0,o.jsx)("input",{id:e,name:t,type:a?"text":"password",required:!0,value:i,onChange:s,className:"modern-input pr-10",placeholder:n}),(0,o.jsx)("button",{type:"button",className:"absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors",onClick:c,children:a?(0,o.jsx)(d.A,{className:"h-5 w-5"}):(0,o.jsx)(m.A,{className:"h-5 w-5"})})]})]});function x({onLogin:e,onRegister:t,loading:i,mode:s}){let[l]=(0,r.useState)(!s||"login"===s),[d,m]=(0,r.useState)(0),[x,j]=(0,r.useState)({email:"",password:"",confirmPassword:"",abreviation:"",nomInstitution:"",nomProjets:[],role:"membre"}),[P,b]=(0,r.useState)(""),[v,S]=(0,r.useState)(!1),[w,y]=(0,r.useState)(!1),[N,A]=(0,r.useState)(!1),{showToast:G,ToastContainer:I}=(0,a.d)(),C=e=>{let{name:t,value:i}=e.target;j(e=>({...e,[t]:i}))},J=e=>{j(t=>({...t,nomProjets:t.nomProjets.filter(t=>t!==e)}))},k=async i=>{if(i.preventDefault(),l){if(!x.email||!x.password)return void G("Veuillez remplir tous les champs obligatoires","error")}else{if(!x.email||!x.password||!x.confirmPassword||!x.abreviation||!x.nomInstitution)return void G("Veuillez remplir tous les champs obligatoires","error");if(x.password!==x.confirmPassword)return void G("Les mots de passe ne correspondent pas","error");if(x.password.length<6)return void G("Le mot de passe doit contenir au moins 6 caract\xe8res","error")}S(!0);try{l?(await e({email:x.email,password:x.password}),G("Connexion r\xe9ussie !","success")):(await t({email:x.email,password:x.password,abreviation:x.abreviation,nomInstitution:x.nomInstitution,nomProjet:x.nomProjets.join(", "),role:"membre"}),G("Inscription r\xe9ussie !","success"))}catch(e){G(e.message,"error")}finally{S(!1)}},q=[{label:"Institution",content:(0,o.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{htmlFor:"nomInstitution",className:"block text-sm font-medium text-gray-700 mb-1",children:(0,o.jsxs)("span",{className:"flex items-center gap-2",children:[(0,o.jsx)(c.A,{className:"w-4 h-4"})," Nom de l'institution *"]})}),(0,o.jsx)("input",{id:"nomInstitution",name:"nomInstitution",type:"text",required:!0,value:x.nomInstitution,onChange:C,className:"modern-input",placeholder:"Nom de l'institution"})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{htmlFor:"abreviation",className:"block text-sm font-medium text-gray-700 mb-1",children:(0,o.jsxs)("span",{className:"flex items-center gap-2",children:[(0,o.jsx)(u.A,{className:"w-4 h-4"})," Abr\xe9viation *"]})}),(0,o.jsx)("input",{id:"abreviation",name:"abreviation",type:"text",required:!0,value:x.abreviation,onChange:C,className:"modern-input",placeholder:"Abr\xe9viation (ex: JD)"})]})]})},{label:"Projets",content:(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{htmlFor:"nomProjet",className:"block text-sm font-medium text-gray-700 mb-1",children:(0,o.jsxs)("span",{className:"flex items-center gap-2",children:[(0,o.jsx)(p.A,{className:"w-4 h-4"})," Projets rattach\xe9s"]})}),(0,o.jsxs)("div",{className:"flex gap-2 mb-2",children:[(0,o.jsx)("input",{id:"nomProjet",name:"nomProjet",type:"text",value:P,onChange:e=>b(e.target.value),className:"modern-input",placeholder:"Ajouter un projet et appuyer sur +"}),(0,o.jsx)("button",{type:"button",onClick:e=>{e.preventDefault();let t=P.trim();t&&!x.nomProjets.includes(t)&&(j(e=>({...e,nomProjets:[...e.nomProjets,t]})),b(""))},className:"px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold",children:"+"})]}),(0,o.jsx)("div",{className:"flex flex-wrap gap-2",children:x.nomProjets.map((e,t)=>(0,o.jsxs)("span",{className:"bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center",children:[e,(0,o.jsx)("button",{type:"button",onClick:()=>J(e),className:"ml-1 text-blue-800 hover:text-red-600",children:"\xd7"})]},t))})]})},{label:"Compte",content:(0,o.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{htmlFor:"email",className:"block text-sm font-medium text-gray-700 mb-1",children:(0,o.jsxs)("span",{className:"flex items-center gap-2",children:[(0,o.jsx)(g.A,{className:"w-4 h-4"})," Email *"]})}),(0,o.jsx)("input",{id:"email",name:"email",type:"email",required:!0,value:x.email,onChange:C,className:"modern-input",placeholder:"Email"})]}),(0,o.jsx)($,{id:"password",name:"password",value:x.password,onChange:C,placeholder:"Mot de passe",label:"Mot de passe",showPassword:w,onTogglePassword:()=>y(!w)}),(0,o.jsx)("div",{className:"md:col-span-2",children:(0,o.jsx)($,{id:"confirmPassword",name:"confirmPassword",value:x.confirmPassword,onChange:C,placeholder:"Confirmer le mot de passe",label:"Confirmer le mot de passe",showPassword:N,onTogglePassword:()=>A(!N)})})]})}],M=s?"login"===s:l;return(0,o.jsxs)("div",{className:"jsx-f6c81dccf4169f79 min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-12 px-4 sm:px-6 lg:px-8",children:[(0,o.jsx)(I,{className:"jsx-f6c81dccf4169f79"}),(0,o.jsx)("div",{className:"jsx-f6c81dccf4169f79 w-full max-w-lg",children:(0,o.jsxs)("div",{className:"jsx-f6c81dccf4169f79 bg-white rounded-2xl shadow-2xl p-8 relative",children:[(0,o.jsx)("div",{className:"jsx-f6c81dccf4169f79 mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-blue-50 mb-4",children:(0,o.jsx)("svg",{style:{color:"rgb(0,70,144)"},fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",className:"jsx-f6c81dccf4169f79 h-8 w-8",children:(0,o.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",className:"jsx-f6c81dccf4169f79"})})}),(0,o.jsxs)("h2",{className:"jsx-f6c81dccf4169f79 text-center text-3xl font-extrabold text-gray-900 leading-tight",children:[(0,o.jsx)("div",{className:"jsx-f6c81dccf4169f79",children:M?"Connexion":"Inscription"}),(0,o.jsx)("div",{className:"jsx-f6c81dccf4169f79 text-lg",children:"\xe0"}),(0,o.jsx)("div",{className:"jsx-f6c81dccf4169f79",children:"Alliance-Agroforesterie"})]}),!M&&(0,o.jsx)("div",{className:"jsx-f6c81dccf4169f79 flex items-center justify-center gap-2 mt-6 mb-2",children:q.map((e,t)=>(0,o.jsx)("div",{className:`jsx-f6c81dccf4169f79 h-2 w-2 md:w-8 rounded-full transition-all duration-300 ${t<=d?"bg-blue-700":"bg-blue-200"} ${t===d?"md:w-12":""}`},e.label))}),(0,o.jsxs)("form",{onSubmit:k,className:"jsx-f6c81dccf4169f79 mt-4 space-y-6",children:[(0,o.jsx)("div",{className:"jsx-f6c81dccf4169f79 rounded-md shadow-sm flex flex-col gap-4 max-h-[60vh] overflow-y-auto",children:M?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)("div",{className:"jsx-f6c81dccf4169f79",children:[(0,o.jsx)("label",{htmlFor:"email",className:"jsx-f6c81dccf4169f79 block text-sm font-medium text-gray-700 mb-1",children:(0,o.jsxs)("span",{className:"jsx-f6c81dccf4169f79 flex items-center gap-2",children:[(0,o.jsx)(g.A,{className:"w-4 h-4"})," Email *"]})}),(0,o.jsx)("input",{id:"email",name:"email",type:"email",required:!0,value:x.email,onChange:C,placeholder:"Email",className:"jsx-f6c81dccf4169f79 modern-input"})]}),(0,o.jsx)($,{id:"password",name:"password",value:x.password,onChange:C,placeholder:"Mot de passe",label:"Mot de passe",showPassword:w,onTogglePassword:()=>y(!w)})]}):q[d].content}),!M&&(0,o.jsxs)("div",{className:"jsx-f6c81dccf4169f79 flex justify-between items-center mt-2",children:[(0,o.jsxs)("button",{type:"button",onClick:()=>m(e=>Math.max(0,e-1)),disabled:0===d,className:`jsx-f6c81dccf4169f79 flex items-center gap-2 px-4 py-2 rounded-md font-medium ${0===d?"bg-gray-200 text-gray-400 cursor-not-allowed":"bg-blue-100 text-blue-700 hover:bg-blue-200"}`,children:[(0,o.jsx)(f.A,{className:"w-4 h-4"})," Pr\xe9c\xe9dent"]}),d<q.length-1?(0,o.jsxs)("button",{type:"button",onClick:()=>m(e=>Math.min(q.length-1,e+1)),disabled:!(l||(0===d?x.nomInstitution.trim()&&x.abreviation.trim():1===d||2!==d||x.email.trim()&&x.password.trim()&&x.confirmPassword.trim())),className:"jsx-f6c81dccf4169f79 flex items-center gap-2 px-4 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed",children:["Suivant ",(0,o.jsx)(h.A,{className:"w-4 h-4"})]}):(0,o.jsx)("button",{type:"submit",disabled:v||i,className:"jsx-f6c81dccf4169f79 group relative flex items-center gap-2 justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60",children:v||i?(0,o.jsxs)("span",{className:"jsx-f6c81dccf4169f79 flex items-center justify-center",children:[(0,o.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",className:"jsx-f6c81dccf4169f79 animate-spin h-5 w-5 text-white mr-2",children:[(0,o.jsx)("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4",className:"jsx-f6c81dccf4169f79 opacity-25"}),(0,o.jsx)("path",{fill:"currentColor",d:"M4 12a8 8 0 018-8v8z",className:"jsx-f6c81dccf4169f79 opacity-75"})]}),"Inscription..."]}):"Cr\xe9er un compte"})]}),M&&(0,o.jsx)("div",{className:"jsx-f6c81dccf4169f79",children:(0,o.jsx)("button",{type:"submit",disabled:v||i,className:"jsx-f6c81dccf4169f79 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60",children:v||i?(0,o.jsxs)("span",{className:"jsx-f6c81dccf4169f79 flex items-center justify-center",children:[(0,o.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",className:"jsx-f6c81dccf4169f79 animate-spin h-5 w-5 text-white mr-2",children:[(0,o.jsx)("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4",className:"jsx-f6c81dccf4169f79 opacity-25"}),(0,o.jsx)("path",{fill:"currentColor",d:"M4 12a8 8 0 018-8v8z",className:"jsx-f6c81dccf4169f79 opacity-75"})]}),"Connexion..."]}):"Se connecter"})})]}),(0,o.jsx)("div",{className:"jsx-f6c81dccf4169f79 text-center mt-4",children:M?(0,o.jsx)("a",{href:"/register",className:"jsx-f6c81dccf4169f79 text-blue-700 hover:underline text-sm font-medium",children:"Pas encore de compte ? S'inscrire"}):(0,o.jsx)("a",{href:"/login",className:"jsx-f6c81dccf4169f79 text-blue-700 hover:underline text-sm font-medium",children:"D\xe9j\xe0 inscrit ? Se connecter"})})]})}),(0,o.jsx)(n(),{id:"f6c81dccf4169f79",children:".modern-input{@apply appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-base transition-all duration-200 shadow-sm;}"})]})}},48443:(e,t,i)=>{i.d(t,{$C:()=>$,Am:()=>a,EF:()=>b,I5:()=>J,JL:()=>S,K4:()=>N,KZ:()=>p,LN:()=>x,QG:()=>s,Qx:()=>M,Si:()=>h,Tf:()=>P,Tv:()=>g,Wj:()=>v,X6:()=>G,ZY:()=>k,Ze:()=>f,_Q:()=>m,em:()=>l,gm:()=>I,kv:()=>y,lH:()=>d,lj:()=>U,ly:()=>C,mb:()=>w,rW:()=>A,sI:()=>n,sj:()=>j,xh:()=>r,yU:()=>q,z7:()=>u,zU:()=>c});var o=i(79826);let s=(0,o.J1)`
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
`,r=(0,o.J1)`
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
`,c=(0,o.J1)`
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
`,f=(0,o.J1)`
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
`;let h=(0,o.J1)`
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
`,$=(0,o.J1)`
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
`,x=(0,o.J1)`
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
`;let j=(0,o.J1)`
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
`;let P=(0,o.J1)`
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
`,v=(0,o.J1)`
  mutation DeleteSiege($id: ID!) {
    deleteSiege(id: $id) {
      success
      message
    }
  }
`,S=(0,o.J1)`
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
`,w=(0,o.J1)`
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
`,y=(0,o.J1)`
  mutation DeletePepiniere($id: ID!) {
    deletePepiniere(id: $id) {
      success
      message
    }
  }
`,N=(0,o.J1)`
  mutation ExportParcellesCSV {
    exportParcellesCsv {
      success
      message
      csvData
    }
  }
`,A=(0,o.J1)`
  mutation ImportParcellesCSV($csvFile: Upload!) {
    importParcellesCsv(csvFile: $csvFile) {
      success
      message
      importedCount
      errors
    }
  }
`,G=(0,o.J1)`
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
`,C=(0,o.J1)`
  mutation ExportPepinieresCSV {
    exportPepinieresCsv {
      success
      message
      csvData
    }
  }
`,J=(0,o.J1)`
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
`;let k=(0,o.J1)`
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
`,q=(0,o.J1)`
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
`,M=(0,o.J1)`
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
`,U=(0,o.J1)`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      success
      message
    }
  }
`}};