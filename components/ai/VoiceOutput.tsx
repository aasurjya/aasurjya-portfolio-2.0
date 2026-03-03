'use client'

import { Volume2, VolumeX } from 'lucide-react'

interface VoiceOutputProps {
  isVoiceEnabled: boolean
  onToggle: () => void
}

export default function VoiceOutput({ isVoiceEnabled, onToggle }: VoiceOutputProps) {
  return (
    <button
      onClick={onToggle}
      className={`p-1.5 rounded-lg transition-colors ${
        isVoiceEnabled
          ? 'text-foreground bg-white/10'
          : 'text-muted-foreground hover:text-foreground'
      }`}
      title={isVoiceEnabled ? 'Disable voice' : 'Enable voice'}
    >
      {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </button>
  )
}
