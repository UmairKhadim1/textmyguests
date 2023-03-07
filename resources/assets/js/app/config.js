export default {
  apiUrl: 'http://yoursite.com/api/',
};
const siteConfig = {
  siteName: 'TextMyGuests',
  siteIcon: 'ion-flash',
  footerText: 'TextMyGuests ' + new Date().getFullYear(),
  siteUrl:
    process.env.NODE_ENV === 'development'
      ? 'https://dev.textmyguests.com'
      : 'https://textmyguests.com',
  shortUrl:
    process.env.NODE_ENV === 'development'
      ? 'https://dev.tmg.link'
      : 'https://tmg.link',
};

const themeConfig = {
  topbar: 'themedefault',
  sidebar: 'themedefault',
  layout: 'themedefault',
  theme: 'themedefault',
};
const language = 'english';
const AlgoliaSearchConfig = {
  appId: '',
  apiKey: '',
};
const Auth0Config = {
  domain: '',
  clientID: '',
  allowedConnections: ['Username-Password-Authentication'],
  rememberLastLogin: true,
  language: 'en',
  closable: true,
  options: {
    auth: {
      autoParseHash: true,
      redirect: true,
      redirectUrl: 'http://localhost:3000/auth0loginCallback',
    },
    languageDictionary: {
      title: 'Isomorphic',
      emailInputPlaceholder: 'demo@gmail.com',
      passwordInputPlaceholder: 'demodemo',
    },
    theme: {
      labeledSubmitButton: true,
      logo: '',
      primaryColor: '#E14615',
      authButtons: {
        connectionName: {
          displayName: 'Log In',
          primaryColor: '#b7b7b7',
          foregroundColor: '#000000',
        },
      },
    },
  },
};
const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
};
const googleConfig = {
  apiKey: '', //
};
const mapboxConfig = {
  tileLayer: '',
  maxZoom: '',
  defaultZoom: '',
  center: [],
};
const youtubeSearchApi = '';
const s3Config = {
  bucket:
    process.env.NODE_ENV === 'production' ? 'textmyguests' : 'textmyguests-dev',
  urlPrefix:
    process.env.NODE_ENV === 'production'
      ? 'https://s3.amazonaws.com/textmyguests/'
      : 'https://s3.amazonaws.com/textmyguests-dev/',
};

export {
  siteConfig,
  themeConfig,
  language,
  AlgoliaSearchConfig,
  Auth0Config,
  firebaseConfig,
  googleConfig,
  mapboxConfig,
  youtubeSearchApi,
  s3Config,
};
