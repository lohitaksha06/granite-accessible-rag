export const GREETING_WORDS = {
  hello: [
    'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
    'hola', 'bonjour', 'hallo', 'ciao', 'ola', 'привет', 'こんにちは', '你好', '안녕하세요',
    'مرحبا', 'नमस्ते', 'xin chao', 'สวัสดี', 'czesc'
  ],
  goodbye: [
    'goodbye', 'bye', 'see you', 'farewell', 'take care',
    'adios', 'au revoir', 'auf wiedersehen', 'arrivederci', 'tchau',
    'до свидания', 'さようなら', '再见', '안녕히', 'مع السلامة', 'अलविदा'
  ],
  thanks: [
    'thank', 'thanks', 'gracias', 'merci', 'danke', 'grazie', 'obrigado',
    'спасибо', 'ありがとう', '谢谢', '감사합니다', 'شكرا', 'धन्यवाद'
  ]
}

export const SADNESS_WORDS = [
  'sad', 'upset', 'depressed', 'down', 'cry', 'hurt', 'lonely', 'anxious', 'stressed'
]

export const OFFENSIVE_WORDS = [
  'stupid', 'idiot', 'hate', 'dumb', 'useless', 'shut up', 'moron', 'trash', 'worst'
]

export const QUESTION_WORDS = [
  'what', 'why', 'how', 'when', 'where', 'who', 'can you', 'could you', 'would you', 'is it', 'do you'
]

export const DEFAULT_REACTION_SETTINGS = {
  enableGreetings: true,
  enableQuestionDetection: true,
  enableSadTone: true,
  enableOffensiveTone: true,
  helloWordsText: GREETING_WORDS.hello.join(', '),
  goodbyeWordsText: GREETING_WORDS.goodbye.join(', '),
  thanksWordsText: GREETING_WORDS.thanks.join(', '),
  sadnessWordsText: SADNESS_WORDS.join(', '),
  offensiveWordsText: OFFENSIVE_WORDS.join(', '),
  questionWordsText: QUESTION_WORDS.join(', ')
}

function parseWordList(text, fallback) {
  const parsed = String(text || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)

  return parsed.length > 0 ? parsed : fallback
}

function buildWordConfig(settings = {}) {
  return {
    helloWords: parseWordList(settings.helloWordsText, GREETING_WORDS.hello),
    goodbyeWords: parseWordList(settings.goodbyeWordsText, GREETING_WORDS.goodbye),
    thanksWords: parseWordList(settings.thanksWordsText, GREETING_WORDS.thanks),
    sadnessWords: parseWordList(settings.sadnessWordsText, SADNESS_WORDS),
    offensiveWords: parseWordList(settings.offensiveWordsText, OFFENSIVE_WORDS),
    questionWords: parseWordList(settings.questionWordsText, QUESTION_WORDS)
  }
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word))
}

export function detectGreetingGesture(text, settings = {}) {
  const lower = String(text || '').toLowerCase().trim()
  const words = buildWordConfig(settings)

  if (!lower) return null
  if (includesAny(lower, words.helloWords)) return 'hello'
  if (includesAny(lower, words.goodbyeWords)) return 'goodbye'
  if (includesAny(lower, words.thanksWords)) return 'thumbsup'

  return null
}

export function detectQuerySignals(text, settings = {}) {
  const lower = String(text || '').toLowerCase().trim()
  const words = buildWordConfig(settings)

  const hasSadTone = settings.enableSadTone !== false && includesAny(lower, words.sadnessWords)
  const hasOffensiveTone = settings.enableOffensiveTone !== false && includesAny(lower, words.offensiveWords)
  const looksLikeQuestion =
    settings.enableQuestionDetection === false
      ? false
      : lower.includes('?') ||
        words.questionWords.some((word) => lower.startsWith(`${word} `) || lower.includes(` ${word} `))

  return {
    hasSadTone,
    hasOffensiveTone,
    looksLikeQuestion
  }
}

export function resolveInputReaction(text, defaultMood = 'neutral', settings = {}) {
  const lower = String(text || '').toLowerCase().trim()

  if (!lower) {
    return {
      mood: defaultMood,
      gesture: 'idle',
      badgeTone: 'neutral',
      badgeText: 'Neutral tone'
    }
  }

  const greetingGesture = settings.enableGreetings === false ? null : detectGreetingGesture(lower, settings)
  const { hasSadTone, hasOffensiveTone, looksLikeQuestion } = detectQuerySignals(lower, settings)
  const negativeTone = hasSadTone || hasOffensiveTone

  if (negativeTone && looksLikeQuestion) {
    return {
      mood: 'sad',
      gesture: 'thinking',
      badgeTone: 'mixed',
      badgeText: 'Mixed tone: upset question'
    }
  }

  if (negativeTone) {
    return {
      mood: 'sad',
      gesture: 'idle',
      badgeTone: hasOffensiveTone ? 'offensive' : 'sad',
      badgeText: hasOffensiveTone ? 'Harsh tone detected' : 'Sad tone detected'
    }
  }

  if (greetingGesture) {
    if (greetingGesture === 'goodbye') {
      return {
        mood: 'happy',
        gesture: 'goodbye',
        badgeTone: 'positive',
        badgeText: 'Goodbye detected'
      }
    }

    if (greetingGesture === 'thumbsup') {
      return {
        mood: 'happy',
        gesture: 'thumbsup',
        badgeTone: 'positive',
        badgeText: 'Thanks detected'
      }
    }

    return {
      mood: 'happy',
      gesture: 'hello',
      badgeTone: 'positive',
      badgeText: 'Greeting detected'
    }
  }

  if (looksLikeQuestion) {
    return {
      mood: 'thinking',
      gesture: 'thinking',
      badgeTone: 'question',
      badgeText: 'Question detected'
    }
  }

  return {
    mood: defaultMood,
    gesture: 'idle',
    badgeTone: 'neutral',
    badgeText: 'Neutral tone'
  }
}
