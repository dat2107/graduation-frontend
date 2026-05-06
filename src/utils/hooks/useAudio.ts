import { useCallback, useRef, useState } from 'react'

type AudioSource = 'file' | 'dictionary' | 'tts' | null

interface UseAudioOptions {
  /** The word to pronounce (for dictionary API + TTS fallback) */
  word?: string
  /** Direct audio file URL (e.g. MinIO upload from teacher) */
  audioUrl?: string | null
  /** Full text to speak via TTS (for listening lessons / IELTS) */
  text?: string
  /** TTS language, default 'en-US' */
  lang?: string
  /** TTS speech rate, default 1 */
  rate?: number
}

interface UseAudioReturn {
  play: () => void
  stop: () => void
  playing: boolean
  source: AudioSource
}

const DICTIONARY_API_AUDIO = 'https://api.dictionaryapi.dev/media/pronunciations/en'

function getDictionaryAudioUrl(word: string): string {
  const cleaned = word.toLowerCase().trim()
  return `${DICTIONARY_API_AUDIO}/${cleaned}-us.mp3`
}

function getBestVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  // Prefer online/neural voices
  const online = voices.find(
    (v) => v.lang.startsWith(lang.slice(0, 2)) && !v.localService,
  )
  if (online) return online
  // Fallback to any matching voice
  return voices.find((v) => v.lang.startsWith(lang.slice(0, 2))) ?? null
}

/**
 * Unified audio hook with 3-tier fallback:
 * 1. Direct file URL (MinIO / teacher upload)
 * 2. Dictionary API pronunciation (vocabulary words)
 * 3. Browser TTS (Web Speech API) — universal fallback
 */
export function useAudio(options: UseAudioOptions): UseAudioReturn {
  const { word, audioUrl, text, lang = 'en-US', rate = 1 } = options
  const [playing, setPlaying] = useState(false)
  const [source, setSource] = useState<AudioSource>(null)
  const audioElRef = useRef<HTMLAudioElement | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const stopAll = useCallback(() => {
    if (audioElRef.current) {
      audioElRef.current.pause()
      audioElRef.current.currentTime = 0
      audioElRef.current = null
    }
    window.speechSynthesis.cancel()
    utteranceRef.current = null
    setPlaying(false)
    setSource(null)
  }, [])

  const speakWithTTS = useCallback(
    (content: string) => {
      if (!('speechSynthesis' in window)) return
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(content)
      utterance.lang = lang
      utterance.rate = rate

      const voice = getBestVoice(lang)
      if (voice) utterance.voice = voice

      utterance.onend = () => {
        setPlaying(false)
        setSource(null)
      }
      utterance.onerror = () => {
        setPlaying(false)
        setSource(null)
      }

      utteranceRef.current = utterance
      setSource('tts')
      setPlaying(true)
      window.speechSynthesis.speak(utterance)
    },
    [lang, rate],
  )

  const playAudioUrl = useCallback(
    (url: string, fallbackSource: AudioSource, onError: () => void) => {
      const audio = new Audio(url)
      audioElRef.current = audio

      audio.oncanplaythrough = () => {
        setSource(fallbackSource)
        setPlaying(true)
        audio.play()
      }

      audio.onended = () => {
        setPlaying(false)
        setSource(null)
        audioElRef.current = null
      }

      audio.onerror = () => {
        audioElRef.current = null
        onError()
      }

      // Timeout: if audio doesn't load in 3s, fallback
      const timeout = setTimeout(() => {
        if (!audio.readyState || audio.readyState < 2) {
          audio.src = ''
          audioElRef.current = null
          onError()
        }
      }, 3000)

      audio.oncanplaythrough = () => {
        clearTimeout(timeout)
        setSource(fallbackSource)
        setPlaying(true)
        audio.play()
      }
    },
    [],
  )

  const play = useCallback(() => {
    if (playing) {
      stopAll()
      return
    }

    const ttsContent = word || text || ''

    // Tier 1: Direct file URL (MinIO / teacher upload)
    if (audioUrl) {
      playAudioUrl(audioUrl, 'file', () => {
        // Tier 2: Dictionary API (only for single words)
        if (word) {
          const dictUrl = getDictionaryAudioUrl(word)
          playAudioUrl(dictUrl, 'dictionary', () => {
            // Tier 3: TTS
            if (ttsContent) speakWithTTS(ttsContent)
          })
        } else if (ttsContent) {
          // Tier 3: TTS
          speakWithTTS(ttsContent)
        }
      })
      return
    }

    // Tier 2: Dictionary API (only for single words)
    if (word) {
      const dictUrl = getDictionaryAudioUrl(word)
      playAudioUrl(dictUrl, 'dictionary', () => {
        // Tier 3: TTS
        if (ttsContent) speakWithTTS(ttsContent)
      })
      return
    }

    // Tier 3: TTS directly
    if (ttsContent) {
      speakWithTTS(ttsContent)
    }
  }, [playing, audioUrl, word, text, stopAll, playAudioUrl, speakWithTTS])

  return { play, stop: stopAll, playing, source }
}

/**
 * Simple TTS function for one-off use (no hook needed).
 * Used by AudioPlayer components as fallback.
 */
export function speakText(
  content: string,
  options?: { lang?: string; rate?: number; onEnd?: () => void },
): SpeechSynthesisUtterance | null {
  if (!('speechSynthesis' in window)) return null

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(content)
  utterance.lang = options?.lang ?? 'en-US'
  utterance.rate = options?.rate ?? 1

  const voice = getBestVoice(utterance.lang)
  if (voice) utterance.voice = voice

  if (options?.onEnd) utterance.onend = options.onEnd
  utterance.onerror = () => options?.onEnd?.()

  window.speechSynthesis.speak(utterance)
  return utterance
}
