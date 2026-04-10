export interface Merchant {
  id: string;
  name: string;
  patterns: string[];
  category: 'streaming' | 'ai_saas' | 'gaming' | 'fitness' | 'cloud' | 'delivery' | 'fintech' | 'telecom' | 'insurance' | 'productivity' | 'education' | 'other';
  typicalPriceEur: number[];
  cancelUrl: string;
  cancelStepsEs: string[];
  trialTrap: boolean;
}

export const merchants: Merchant[] = [
  {
    id: 'netflix', name: 'Netflix',
    patterns: ['NETFLIX', 'NETFLIX.COM', 'NETFLIX INTL', 'NETFLIX.COM AMSTERDAM NLD', 'NETFLIX MEMBERSERVICES'],
    category: 'streaming', typicalPriceEur: [6.99, 11.99, 17.99, 22.99],
    cancelUrl: 'https://www.netflix.com/es/cancelplan',
    cancelStepsEs: ['Inicia sesi\u00f3n en Netflix.com', 'Ve a tu cuenta > Suscripci\u00f3n', 'Selecciona "Cancelar suscripci\u00f3n"', 'Elige la raz\u00f3n y confirma'],
    trialTrap: true
  },
  {
    id: 'spotify', name: 'Spotify',
    patterns: ['SPOTIFY', 'SPOTIFY.COM', 'SPOTIFY AB STOCKHOLM', 'SPOTIFY SUECIA', 'SPOTIFY.BV'],
    category: 'streaming', typicalPriceEur: [11.99, 14.99],
    cancelUrl: 'https://www.spotify.com/es/account/cancel/',
    cancelStepsEs: ['Accede a spotify.com', 'Haz clic en tu perfil > Premium', 'Selecciona "Cancelar Premium"', 'Confirma la cancelaci\u00f3n'],
    trialTrap: true
  },
  {
    id: 'hbo_max', name: 'HBO Max',
    patterns: ['HBO MAX', 'HBOMAX', 'HBO.COM', 'HBOMAX EMEA', 'WARNER MEDIA'],
    category: 'streaming', typicalPriceEur: [5.99, 7.99, 13.99],
    cancelUrl: 'https://www.hbomax.com/es/es/account/manage',
    cancelStepsEs: ['Inicia sesi\u00f3n en HBO Max', 'Accede a Mi cuenta', 'Selecciona "Planes y pagos"', 'Haz clic en "Cancelar suscripci\u00f3n"'],
    trialTrap: true
  },
  {
    id: 'disney_plus', name: 'Disney+',
    patterns: ['DISNEY PLUS', 'DISNEYPLUS', 'DISNEY+', 'DISNEY STREAMING', 'DISNEY.STREAMING'],
    category: 'streaming', typicalPriceEur: [8.99, 13.99, 14.99],
    cancelUrl: 'https://www.disneyplus.com/es/account',
    cancelStepsEs: ['Ve a disneyplus.com', 'Accede a tu cuenta', 'Selecciona "Suscripci\u00f3n"', 'Haz clic en "Cancelar suscripci\u00f3n"'],
    trialTrap: true
  },
  {
    id: 'amazon_prime', name: 'Amazon Prime Video',
    patterns: ['AMAZON PRIME', 'AMAZON.ES', 'AMAZON PRIME VIDEO', 'AMAZON.COM', 'AMZN.COM'],
    category: 'streaming', typicalPriceEur: [4.99, 36.00],
    cancelUrl: 'https://www.primevideo.com/settings/memberships',
    cancelStepsEs: ['Accede a tu cuenta de Amazon', 'Ve a "Configuraci\u00f3n de cuenta"', 'Selecciona "Membres\u00edas y suscripciones"', 'Haz clic en "Editar" y luego "Cancelar"'],
    trialTrap: true
  },
  {
    id: 'apple_music', name: 'Apple Music',
    patterns: ['APPLE MUSIC', 'APPLE.COM', 'ITUNES APPLE', 'APPLE CUPERTINO', 'APPLE SUBSCRIPTION'],
    category: 'streaming', typicalPriceEur: [11.99, 7.99, 19.99],
    cancelUrl: 'https://support.apple.com/es-es/108176',
    cancelStepsEs: ['Abre Configuraci\u00f3n en iPhone/Mac', 'Ve a tu perfil de Apple ID', 'Selecciona "Suscripciones"', 'Elige Apple Music y cancela'],
    trialTrap: true
  },
  {
    id: 'youtube_premium', name: 'YouTube Premium',
    patterns: ['YOUTUBE PREMIUM', 'YOUTUBE', 'YOUTUBE.COM', 'GOOGLE YOUTUBE', 'ALPHABET GOOGLE'],
    category: 'streaming', typicalPriceEur: [13.99, 139.99],
    cancelUrl: 'https://www.youtube.com/account/memberships',
    cancelStepsEs: ['Inicia sesi\u00f3n en YouTube', 'Ve a tu foto de perfil > Membres\u00edas', 'Selecciona "Gestionar"', 'Haz clic en "Cancelar suscripci\u00f3n"'],
    trialTrap: true
  },
  {
    id: 'dazn', name: 'DAZN',
    patterns: ['DAZN', 'DAZN.COM', 'DAZN SPAIN', 'PERFORM DAZN'],
    category: 'streaming', typicalPriceEur: [9.99, 14.99],
    cancelUrl: 'https://www.dazn.com/es-ES/account/subscription',
    cancelStepsEs: ['Accede a DAZN.com', 'Ve a "Mi cuenta"', 'Selecciona "Suscripci\u00f3n"', 'Haz clic en "Cancelar suscripci\u00f3n"'],
    trialTrap: true
  },
  {
    id: 'crunchyroll', name: 'Crunchyroll',
    patterns: ['CRUNCHYROLL', 'CRUNCHYROLL.COM', 'SONY CRUNCHYROLL'],
    category: 'streaming', typicalPriceEur: [4.99, 14.99, 19.99],
    cancelUrl: 'https://www.crunchyroll.com/es/account/subscription',
    cancelStepsEs: ['Inicia sesi\u00f3n en Crunchyroll', 'Ve a "Mi cuenta"', 'Selecciona "Suscripci\u00f3n"', 'Haz clic en "Cancelar suscripci\u00f3n"'],
    trialTrap: true
  },
  {
    id: 'adobe_cc', name: 'Adobe Creative Cloud',
    patterns: ['ADOBE', 'ADOBE.COM', 'ADOBE SYSTEMS', 'ADOBE CREATIVE'],
    category: 'ai_saas', typicalPriceEur: [9.99, 19.99, 54.99, 59.49],
    cancelUrl: 'https://account.adobe.com/plans',
    cancelStepsEs: ['Accede a account.adobe.com', 'Ve a "Suscripciones"', 'Selecciona el plan a cancelar', 'Haz clic en "Cancelar suscripci\u00f3n"'],
    trialTrap: true
  },
  {
    id: 'canva_pro', name: 'Canva Pro',
    patterns: ['CANVA', 'CANVA.COM', 'CANVA PRO', 'CANVA AUSTRALIA'],
    category: 'ai_saas', typicalPriceEur: [14.99, 179.99],
    cancelUrl: 'https://www.canva.com/es_es/account/memberships/',
    cancelStepsEs: ['Inicia sesi\u00f3n en Canva', 'Ve a tu perfil > "Membres\u00eda"', 'Haz clic en "Cambiar o cancelar"', 'Selecciona "Cancelar membres\u00eda"'],
    trialTrap: true
  },
  {
    id: 'openai_chatgpt', name: 'OpenAI / ChatGPT Plus',
    patterns: ['OPENAI', 'OPENAI.COM', 'CHATGPT', 'CHATGPT PLUS', 'STRIPE OPENAI'],
    category: 'ai_saas', typicalPriceEur: [20.00],
    cancelUrl: 'https://platform.openai.com/account/billing/overview',
    cancelStepsEs: ['Ve a platform.openai.com', 'Ve a "Billing" > "Manage subscription"', 'Haz clic en "Cancel plan"', 'Confirma la cancelaci\u00f3n'],
    trialTrap: false
  },
  {
    id: 'midjourney', name: 'Midjourney',
    patterns: ['MIDJOURNEY', 'MIDJOURNEY.COM', 'STRIPE MIDJOURNEY'],
    category: 'ai_saas', typicalPriceEur: [10.00, 30.00, 60.00],
    cancelUrl: 'https://www.midjourney.com/account/',
    cancelStepsEs: ['Accede a midjourney.com', 'Ve a tu cuenta', 'Selecciona "Manage subscription"', 'Haz clic en "Cancel plan"'],
    trialTrap: false
  },
  {
    id: 'anthropic_claude', name: 'Claude Pro (Anthropic)',
    patterns: ['ANTHROPIC', 'CLAUDE PRO', 'STRIPE ANTHROPIC'],
    category: 'ai_saas', typicalPriceEur: [20.00],
    cancelUrl: 'https://claude.ai/account',
    cancelStepsEs: ['Ve a claude.ai', 'Accede a tu cuenta', 'Ve a "Subscription"', 'Haz clic en "Manage plan" y cancela'],
    trialTrap: false
  },
  {
    id: 'github_copilot', name: 'GitHub Copilot',
    patterns: ['GITHUB', 'GITHUB.COM', 'GITHUB COPILOT', 'GITHUB INC'],
    category: 'ai_saas', typicalPriceEur: [10.00, 19.00],
    cancelUrl: 'https://github.com/settings/billing/summary',
    cancelStepsEs: ['Inicia sesi\u00f3n en GitHub', 'Ve a Configuraci\u00f3n > Facturaci\u00f3n', 'Selecciona "Copilot"', 'Haz clic en "Cancel Copilot subscription"'],
    trialTrap: false
  },
  {
    id: 'notion', name: 'Notion',
    patterns: ['NOTION', 'NOTION.COM', 'NOTION LABS', 'STRIPE NOTION'],
    category: 'productivity', typicalPriceEur: [10.00, 20.00, 25.00],
    cancelUrl: 'https://www.notion.so/account/settings',
    cancelStepsEs: ['Ve a notion.so', 'Accede a "Settings"', 'Ve a "Plans"', 'Haz clic en "Upgrade/Change plan" y cancela'],
    trialTrap: false
  },
  {
    id: 'figma', name: 'Figma',
    patterns: ['FIGMA', 'FIGMA.COM', 'FIGMA INC'],
    category: 'productivity', typicalPriceEur: [12.00, 60.00, 144.00],
    cancelUrl: 'https://www.figma.com/billing/settings',
    cancelStepsEs: ['Inicia sesi\u00f3n en Figma', 'Ve a "Billing"', 'Selecciona tu equipo', 'Haz clic en "Downgrade" y confirma'],
    trialTrap: true
  },
  {
    id: 'icloud_plus', name: 'iCloud+ (Apple)',
    patterns: ['ICLOUD', 'ICLOUD PLUS', 'APPLE ICLOUD', 'APPLE.COM'],
    category: 'cloud', typicalPriceEur: [0.99, 2.99, 9.99],
    cancelUrl: 'https://support.apple.com/es-es/HT211828',
    cancelStepsEs: ['Ve a Configuraci\u00f3n > [Tu nombre]', 'Selecciona "iCloud"', 'Toca "Gestionar almacenamiento"', 'Elige "Cambiar plan" y cancela'],
    trialTrap: false
  },
  {
    id: 'google_one', name: 'Google One',
    patterns: ['GOOGLE ONE', 'GOOGLE.COM', 'ALPHABET GOOGLE', 'GOOGLE STORAGE'],
    category: 'cloud', typicalPriceEur: [1.99, 9.99, 19.99],
    cancelUrl: 'https://one.google.com/about/plans',
    cancelStepsEs: ['Ve a one.google.com', 'Haz clic en tu perfil', 'Selecciona "Gestionar suscripci\u00f3n"', 'Haz clic en "Cancelar suscripci\u00f3n"'],
    trialTrap: false
  },
  {
    id: 'dropbox', name: 'Dropbox Plus/Pro',
    patterns: ['DROPBOX', 'DROPBOX.COM', 'DROPBOX INC'],
    category: 'cloud', typicalPriceEur: [9.99, 16.99, 19.99],
    cancelUrl: 'https://www.dropbox.com/account/plan',
    cancelStepsEs: ['Inicia sesi\u00f3n en Dropbox', 'Ve a tu cuenta', 'Selecciona "Plan"', 'Haz clic en "Cambiar plan" y cancela'],
    trialTrap: false
  },
  {
    id: 'strava', name: 'Strava',
    patterns: ['STRAVA', 'STRAVA.COM', 'STRAVA INC'],
    category: 'fitness', typicalPriceEur: [7.99, 79.99],
    cancelUrl: 'https://www.strava.com/athlete/settings',
    cancelStepsEs: ['Ve a strava.com', 'Ve a "Configuraci\u00f3n"', 'Selecciona "Suscripci\u00f3n"', 'Haz clic en "Cancelar suscripci\u00f3n"'],
    trialTrap: true
  },
  {
    id: 'calm', name: 'Calm',
    patterns: ['CALM', 'CALM.COM', 'CALM APP', 'CALM INC'],
    category: 'fitness', typicalPriceEur: [14.99, 69.99, 99.99],
    cancelUrl: 'https://www.calm.com/account',
    cancelStepsEs: ['Inicia sesi\u00f3n en Calm', 'Ve a "Mi cuenta"', 'Selecciona "Suscripci\u00f3n"', 'Haz clic en "Cancelar suscripci\u00f3n"'],
    trialTrap: true
  },
  {
    id: 'playstation_plus', name: 'PlayStation Plus',
    patterns: ['PLAYSTATION', 'PLAYSTATION PLUS', 'PSN', 'SONY PLAYSTATION'],
    category: 'gaming', typicalPriceEur: [8.99, 13.49, 16.99],
    cancelUrl: 'https://www.playstation.com/es-es/account/services/',
    cancelStepsEs: ['Ve a tu cuenta de PlayStation', 'Selecciona "Suscripciones"', 'Elige PlayStation Plus', 'Haz clic en "Cambiar o cancelar"'],
    trialTrap: true
  },
  {
    id: 'xbox_gamepass', name: 'Xbox Game Pass',
    patterns: ['XBOX', 'XBOX GAMEPASS', 'XBOX GAME PASS', 'MICROSOFT XBOX'],
    category: 'gaming', typicalPriceEur: [9.99, 16.99],
    cancelUrl: 'https://account.microsoft.com/billing/subscriptions',
    cancelStepsEs: ['Ve a tu cuenta Microsoft', 'Selecciona "Suscripciones"', 'Elige Xbox Game Pass', 'Haz clic en "Cancelar suscripci\u00f3n"'],
    trialTrap: true
  },
  {
    id: 'uber_one', name: 'Uber One',
    patterns: ['UBER', 'UBER.COM', 'UBER ONE', 'UBER TRIP'],
    category: 'delivery', typicalPriceEur: [9.99, 99.99],
    cancelUrl: 'https://www.uber.com/es/es/account/',
    cancelStepsEs: ['Inicia sesi\u00f3n en Uber', 'Ve a "Cuenta"', 'Selecciona "Membres\u00edas"', 'Haz clic en "Cambiar o cancelar"'],
    trialTrap: true
  },
  {
    id: 'glovo_prime', name: 'Glovo Prime',
    patterns: ['GLOVO', 'GLOVO.COM', 'GLOVO SPAIN', 'GLOVO DELIVERY'],
    category: 'delivery', typicalPriceEur: [3.99, 7.99],
    cancelUrl: 'https://www.glovoapp.com/es/account/subscription',
    cancelStepsEs: ['Abre la app Glovo', 'Ve a tu perfil', 'Selecciona "Suscripci\u00f3n"', 'Haz clic en "Cancelar suscripci\u00f3n"'],
    trialTrap: true
  },
  {
    id: 'revolut_premium', name: 'Revolut Premium',
    patterns: ['REVOLUT', 'REVOLUT.COM', 'REVOLUT LTD'],
    category: 'fintech', typicalPriceEur: [9.99, 19.99, 99.99],
    cancelUrl: 'https://app.revolut.com/account/subscriptions',
    cancelStepsEs: ['Abre la app Revolut', 'Ve a "Suscripciones"', 'Selecciona tu plan', 'Haz clic en "Cancelar suscripci\u00f3n"'],
    trialTrap: false
  },
  {
    id: 'typeform', name: 'Typeform',
    patterns: ['TYPEFORM', 'TYPEFORM.COM', 'TYPEFORM SPAIN', 'TYPEFORM SL'],
    category: 'productivity', typicalPriceEur: [25.00, 50.00, 83.00],
    cancelUrl: 'https://admin.typeform.com/account/billing',
    cancelStepsEs: ['Accede a admin.typeform.com', 'Ve a "Billing"', 'Selecciona tu plan', 'Haz clic en "Cancel plan"'],
    trialTrap: true
  },
  {
    id: 'mailchimp', name: 'Mailchimp',
    patterns: ['MAILCHIMP', 'MAILCHIMP.COM', 'MAILCHIMP INC'],
    category: 'productivity', typicalPriceEur: [15.00, 35.00, 75.00],
    cancelUrl: 'https://mailchimp.com/account/billing/',
    cancelStepsEs: ['Inicia sesi\u00f3n en Mailchimp', 'Ve a "Configuraci\u00f3n"', 'Selecciona "Planes"', 'Haz clic en "Cambiar plan" y cancela'],
    trialTrap: false
  },
  {
    id: 'grammarly', name: 'Grammarly Premium',
    patterns: ['GRAMMARLY', 'GRAMMARLY.COM', 'GRAMMARLY INC'],
    category: 'productivity', typicalPriceEur: [11.99, 139.99],
    cancelUrl: 'https://www.grammarly.com/account',
    cancelStepsEs: ['Ve a grammarly.com/account', 'Selecciona "Billing"', 'Haz clic en "Change plan"', 'Selecciona "Downgrade" y confirma'],
    trialTrap: true
  }
];

export function findMerchant(concept: string): Merchant | null {
  const normalized = concept.toUpperCase().trim();
  for (const merchant of merchants) {
    for (const pattern of merchant.patterns) {
      if (normalized.includes(pattern)) return merchant;
    }
  }
  return null;
}

export const categoryLabels: Record<string, string> = {
  streaming: 'Streaming',
  ai_saas: 'IA / SaaS',
  gaming: 'Gaming',
  fitness: 'Fitness',
  cloud: 'Nube',
  delivery: 'Delivery',
  fintech: 'Fintech',
  telecom: 'Telecom',
  insurance: 'Seguros',
  productivity: 'Productividad',
  education: 'Educaci\u00f3n',
  other: 'Otros'
};
