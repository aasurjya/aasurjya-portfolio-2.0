const greetingsByCountry: Record<string, string> = {
  IN: 'Namaste',
  US: 'Hello',
  GB: 'Hello',
  JP: 'Konnichiwa',
  KR: 'Annyeonghaseyo',
  FR: 'Bonjour',
  DE: 'Hallo',
  ES: 'Hola',
  PT: 'Ola',
  BR: 'Ola',
  CN: 'Ni hao',
  RU: 'Privet',
  IT: 'Ciao',
  NL: 'Hallo',
  SE: 'Hej',
  NO: 'Hei',
  TH: 'Sawasdee',
  AE: 'Marhaba',
  SA: 'Marhaba',
  NP: 'Namaste',
  BD: 'Assalamu Alaikum',
}

function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Hey there, night owl'
}

export function buildPersonalizedGreeting(country?: string | null): string {
  const timeGreeting = getTimeOfDayGreeting()
  const localGreeting = country && greetingsByCountry[country]
    ? `${greetingsByCountry[country]}! `
    : ''

  return `${localGreeting}${timeGreeting}! I'm Aasurjya AI — I know everything about him. What's your name, and what brings you here today?`
}

export function getConversationStarters(mode?: string | null): string[] {
  const common = [
    "I'm a recruiter, tell me about him",
    "I'm a developer, what can we build together?",
    'What projects has Aasurjya built?',
    'What are his key skills?',
  ]

  if (mode === 'xr') {
    return [
      "I'm a recruiter, tell me about him",
      'What XR projects has he worked on?',
      'Tell me about his research at IIT Jodhpur',
      'What AR/VR technologies does he use?',
    ]
  }

  if (mode === 'fullstack') {
    return [
      "I'm a recruiter, tell me about him",
      'What full-stack projects has he built?',
      'What tech stack does he specialize in?',
      'Tell me about his SaaS experience',
    ]
  }

  return common
}
