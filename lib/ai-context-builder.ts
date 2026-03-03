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

  return `${localGreeting}${timeGreeting}! I'm Aasurjya AI — ask me about his projects, skills, or research.`
}

export function getConversationStarters(mode?: string | null): string[] {
  const common = [
    'What projects has Aasurjya built?',
    'Tell me about his background',
    'What are his key skills?',
    'How can I contact him?',
  ]

  if (mode === 'xr') {
    return [
      'What XR projects has he worked on?',
      'Tell me about his research at IIT Jodhpur',
      'What AR/VR technologies does he use?',
      ...common.slice(1),
    ]
  }

  if (mode === 'fullstack') {
    return [
      'What full-stack projects has he built?',
      'What tech stack does he specialize in?',
      'Tell me about his SaaS experience',
      ...common.slice(1),
    ]
  }

  return common
}
