import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  ShoppingCart,
  Trash2,
  Beer,
  Home,
  Flame,
  Zap,
  Scroll,
  MessageSquare,
  Send,
  X,
  Bot,
  CheckCircle,
  AlertCircle,
  Trophy,
  Clock,
  RotateCcw,
  Download,
  Share2,
  ChevronRight,
  Menu
} from 'lucide-react'
import { toPng } from 'html-to-image'

// SafeIcon component for dynamic icon rendering
const SafeIcon = ({ name, size = 24, className = '', color }) => {
  const icons = {
    shoppingCart: ShoppingCart,
    trash2: Trash2,
    beer: Beer,
    home: Home,
    flame: Flame,
    zap: Zap,
    scroll: Scroll,
    messageSquare: MessageSquare,
    send: Send,
    x: X,
    bot: Bot,
    checkCircle: CheckCircle,
    alertCircle: AlertCircle,
    trophy: Trophy,
    clock: Clock,
    rotateCcw: RotateCcw,
    download: Download,
    share2: Share2,
    chevronRight: ChevronRight,
    menu: Menu
  }

  const IconComponent = icons[name] || Bot
  return <IconComponent size={size} className={className} color={color} />
}

// Utility for class merging
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}

// Scroll to section helper
const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// FAQ Data for Chat Widget
const FAQ_DATA = [
  {
    question: 'Как играть в игру "Собери бутылки"?',
    answer: 'Нажимай на падающие бутылки, чтобы поймать их в корзину. У тебя есть 30 секунд! За каждую бутылку — 10 очков. Бонусные золотые бутылки дают 50 очков!',
    keywords: ['игра', 'бутылки', 'как играть', 'правила', 'очки']
  },
  {
    question: 'Как создать мем в генераторе?',
    answer: 'Выбери шаблон из галереи, добавь свой текст сверху и снизу, нажми "Скачать мем" — готово! Можешь поделиться с друзьями.',
    keywords: ['мем', 'генератор', 'создать', 'шаблон', 'картинка']
  },
  {
    question: 'Что это за сайт?',
    answer: 'Это сатирический юмористический блог о "бомжатском сообществе". Здесь мемы, смешные истории и мини-игры. Всё в шуточном ключе!',
    keywords: ['сайт', 'блог', 'бомж', 'что это', 'о нас']
  },
  {
    question: 'Как пройти опрос "Какой ты бомж"?',
    answer: 'Ответь на 5 вопросов выбрав варианты ответа. В конце узнаешь свой тип: Бутылочник, Картонный Король, Мудрец Подземки или Дворовый Философ!',
    keywords: ['опрос', 'тест', 'какой бомж', 'результат', 'тип']
  }
]

const SITE_CONTEXT = 'Весёлые Бомжи — юмористический сатирический блог о жизни "бомжатского сообщества". Сайт содержит мемы, смешные истории, мини-игры и опросы. Всё содержание носит шуточный характер и не призывает к бездействию или бродяжничеству. Мы против реальной бедности и за помощь бездомным!'

// Chat Widget Component
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Привет, бомж-брат! 🤠 Чем могу помочь? Спроси про мемы, игру или опросы!' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findFAQAnswer = (text) => {
    const lowerText = text.toLowerCase()
    for (const faq of FAQ_DATA) {
      if (faq.keywords.some(keyword => lowerText.includes(keyword))) {
        return faq.answer
      }
    }
    return null
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setInputValue('')
    setIsTyping(true)

    // Check FAQ first
    const faqAnswer = findFAQAnswer(userMessage)

    if (faqAnswer) {
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', text: faqAnswer }])
        setIsTyping(false)
      }, 500)
      return
    }

    // Fallback to API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, context: SITE_CONTEXT })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, { type: 'bot', text: data.reply || 'Брат, не понял вопроса... Спроси про мемы, игру или опросы!' }])
      } else {
        throw new Error('API failed')
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Связь с штабом потеряна! 🍺 Но ты можешь спросить: как играть, как создать мем, или что это за сайт. Или посмотри FAQ внизу страницы!'
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-80 sm:w-96 bg-amber-50 rounded-2xl cartoon-border cartoon-shadow overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SafeIcon name="bot" className="text-white" size={24} />
                <span className="cartoon-text text-white text-sm">Бомж-Бот</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
              >
                <SafeIcon name="x" size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3 bg-yellow-50/50">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'max-w-[85%] p-3 rounded-xl text-sm',
                    msg.type === 'user'
                      ? 'bg-amber-600 text-white ml-auto cartoon-shadow-sm'
                      : 'bg-white cartoon-border cartoon-shadow-sm text-gray-800'
                  )}
                >
                  {msg.text}
                </motion.div>
              ))}
              {isTyping && (
                <div className="bg-white cartoon-border cartoon-shadow-sm p-3 rounded-xl inline-flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t-2 border-black flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Напиши сообщение..."
                className="flex-1 px-3 py-2 bg-amber-50 border-2 border-black rounded-xl focus:outline-none focus:border-amber-600 text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="bg-amber-600 text-white p-2 rounded-xl hover:bg-amber-700 transition-colors cartoon-shadow-sm active:translate-y-1 active:shadow-none"
              >
                <SafeIcon name="send" size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-full cartoon-border cartoon-shadow flex items-center justify-center hover:from-amber-500 hover:to-orange-400 transition-all"
      >
        {isOpen ? <SafeIcon name="x" size={24} /> : <SafeIcon name="messageSquare" size={24} />}
      </motion.button>
    </div>
  )
}

// Meme Generator Component
const MemeGenerator = () => {
  const [topText, setTopText] = useState('КОГДА НАШЁЛ')
  const [bottomText, setBottomText] = useState('ПОЛНУЮ БУТЫЛКУ')
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const memeRef = useRef(null)

  const templates = [
    'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop'
  ]

  const downloadMeme = async () => {
    if (memeRef.current) {
      try {
        const dataUrl = await toPng(memeRef.current, { quality: 0.95 })
        const link = document.createElement('a')
        link.download = `veselye-bomzhi-mem-${Date.now()}.png`
        link.href = dataUrl
        link.click()
      } catch (err) {
        alert('Ошибка при создании мема!')
      }
    }
  }

  return (
    <div className="bg-white cartoon-border cartoon-shadow rounded-3xl p-6 md:p-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="space-y-4">
          <div
            ref={memeRef}
            className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden cartoon-border"
          >
            <img
              src={templates[selectedTemplate]}
              alt="Meme template"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <p className="cartoon-text text-white text-center text-2xl md:text-3xl uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,1)] stroke-black" style={{ WebkitTextStroke: '2px black' }}>
                {topText}
              </p>
              <p className="cartoon-text text-white text-center text-2xl md:text-3xl uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,1)]" style={{ WebkitTextStroke: '2px black' }}>
                {bottomText}
              </p>
            </div>
          </div>

          <button
            onClick={downloadMeme}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl cartoon-border cartoon-shadow flex items-center justify-center gap-2 transition-all active:translate-y-1 active:shadow-none"
          >
            <SafeIcon name="download" size={20} />
            Скачать мем
          </button>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-bold mb-2 cartoon-text text-amber-900">Текст сверху:</label>
            <input
              type="text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              className="w-full px-4 py-3 bg-amber-50 border-2 border-black rounded-xl focus:outline-none focus:border-amber-600 font-handwritten text-lg"
              placeholder="Введи текст..."
            />
          </div>

          <div>
            <label className="block text-lg font-bold mb-2 cartoon-text text-amber-900">Текст снизу:</label>
            <input
              type="text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              className="w-full px-4 py-3 bg-amber-50 border-2 border-black rounded-xl focus:outline-none focus:border-amber-600 font-handwritten text-lg"
              placeholder="Введи текст..."
            />
          </div>

          <div>
            <label className="block text-lg font-bold mb-2 cartoon-text text-amber-900">Шаблон:</label>
            <div className="grid grid-cols-4 gap-2">
              {templates.map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTemplate(idx)}
                  className={cn(
                    'aspect-video rounded-lg overflow-hidden border-2 transition-all',
                    selectedTemplate === idx ? 'border-amber-600 ring-2 ring-amber-600' : 'border-gray-300 hover:border-amber-400'
                  )}
                >
                  <img src={tpl} alt={`Template ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Poll Component
const PollSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)

  const questions = [
    {
      question: 'Что ты делаешь, когда видишь пустую бутылку?',
      options: [
        { text: 'Бегу сломя голову!', value: 'butilochnik', icon: 'zap' },
        { text: 'Оценю расстояние и траекторию', value: 'filosof', icon: 'scroll' },
        { text: 'Это мой дом теперь', value: 'karton', icon: 'home' },
        { text: 'Подожду, пока кто-то другой поднимет', value: 'mudrec', icon: 'clock' }
      ]
    },
    {
      question: 'Где твоё идеальное жильё?',
      options: [
        { text: 'Под мостом с видом на закат', value: 'filosof', icon: 'home' },
        { text: 'Картонная коробка премиум-класса', value: 'karton', icon: 'shoppingCart' },
        { text: 'Любой подъезд со сквозняком', value: 'butilochnik', icon: 'zap' },
        { text: 'Там, где тепло и никто не гонит', value: 'mudrec', icon: 'flame' }
      ]
    },
    {
      question: 'Что ты делаешь с находкой?',
      options: [
        { text: 'Несу сдать немедленно', value: 'butilochnik', icon: 'trash2' },
        { text: 'Сохраню на чёрный день', value: 'mudrec', icon: 'scroll' },
        { text: 'Создам произведение искусства', value: 'filosof', icon: 'flame' },
        { text: 'Обустрою жилище', value: 'karton', icon: 'home' }
      ]
    },
    {
      question: 'Твой девиз жизни?',
      options: [
        { text: 'Одна бутылка — маленький шаг', value: 'butilochnik', icon: 'zap' },
        { text: 'Картон теплее бетона', value: 'karton', icon: 'home' },
        { text: 'Мудрость приходит с холодом', value: 'mudrec', icon: 'scroll' },
        { text: 'Жизнь — это дорога, а я пешеход', value: 'filosof', icon: 'flame' }
      ]
    },
    {
      question: 'Какой у тебя супергеройский навык?',
      options: [
        { text: 'Нахожу бутылки на расстоянии 500м', value: 'butilochnik', icon: 'zap' },
        { text: 'Создаю уют из мусора', value: 'karton', icon: 'home' },
        { text: 'Знаю все тёплые места в городе', value: 'mudrec', icon: 'flame' },
        { text: 'Могу спать в любой позе', value: 'filosof', icon: 'clock' }
      ]
    }
  ]

  const results = {
    butilochnik: {
      title: 'Бутылочник-Спринтер 🏃‍♂️',
      description: 'Ты готов пробежать марафон ради сдачки! Твои ноги — твой капитал, а бутылки — твоя мечта. Ты веришь, что малыми бутылками создаётся великое состояние.',
      color: 'bg-blue-500'
    },
    karton: {
      title: 'Картонный Король 📦',
      description: 'Для тебя дом — там, где коробка. Ты мастер обустройства пространства из подручных материалов. IKEA отдыхает перед твоим инженерным гением!',
      color: 'bg-amber-600'
    },
    mudrec: {
      title: 'Мудрец Подземки 🧙‍♂️',
      description: 'Ты знаешь все тайны города и его тёплые трубы. Твоя мудрость передаётся из поколения в поколение бомжей. С тобой никто не замёрзнет!',
      color: 'bg-purple-600'
    },
    filosof: {
      title: 'Дворовый Философ 🎭',
      description: 'Жизнь для тебя — сплошная метафора. Ты находишь глубокий смысл в каждой бутылке и превращаешь бедность в искусство. Твои речи у костра — легендарны!',
      color: 'bg-red-500'
    }
  }

  const handleAnswer = (value) => {
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResult(true)
    }
  }

  const calculateResult = () => {
    const counts = {}
    answers.forEach(answer => {
      counts[answer] = (counts[answer] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
  }

  const resetPoll = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResult(false)
  }

  if (showResult) {
    const resultKey = calculateResult()
    const result = results[resultKey]

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white cartoon-border cartoon-shadow rounded-3xl p-8 text-center"
      >
        <div className={`${result.color} w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 cartoon-border cartoon-shadow`}>
          <SafeIcon name="trophy" size={48} className="text-white" />
        </div>
        <h3 className="cartoon-text text-2xl md:text-3xl text-amber-900 mb-4">{result.title}</h3>
        <p className="text-lg text-gray-700 mb-8 max-w-md mx-auto leading-relaxed">{result.description}</p>
        <button
          onClick={resetPoll}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-xl cartoon-border cartoon-shadow flex items-center gap-2 mx-auto transition-all active:translate-y-1 active:shadow-none"
        >
          <SafeIcon name="rotateCcw" size={20} />
          Пройти ещё раз
        </button>
      </motion.div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="bg-white cartoon-border cartoon-shadow rounded-3xl p-6 md:p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-gray-500">Вопрос {currentQuestion + 1} из {questions.length}</span>
          <div className="flex gap-1">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  'w-2 h-2 rounded-full',
                  idx <= currentQuestion ? 'bg-amber-600' : 'bg-gray-300'
                )}
              />
            ))}
          </div>
        </div>
        <h3 className="cartoon-text text-xl md:text-2xl text-amber-900">{currentQ.question}</h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {currentQ.options.map((option, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer(option.value)}
            className="p-4 bg-amber-50 hover:bg-amber-100 border-2 border-black rounded-xl text-left transition-colors flex items-start gap-3"
          >
            <div className="bg-amber-600 text-white p-2 rounded-lg shrink-0">
              <SafeIcon name={option.icon} size={20} />
            </div>
            <span className="font-bold text-amber-900 pt-1">{option.text}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// Bottle Collection Game
const BottleGame = () => {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)
  const [bottles, setBottles] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const gameAreaRef = useRef(null)

  useEffect(() => {
    let interval
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsPlaying(false)
      setGameOver(true)
    }
    return () => clearInterval(interval)
  }, [isPlaying, timeLeft])

  useEffect(() => {
    let interval
    if (isPlaying) {
      interval = setInterval(() => {
        spawnBottle()
      }, 800)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const spawnBottle = () => {
    if (!gameAreaRef.current) return

    const rect = gameAreaRef.current.getBoundingClientRect()
    const isGolden = Math.random() < 0.1
    const newBottle = {
      id: Date.now() + Math.random(),
      x: Math.random() * (rect.width - 50),
      y: -50,
      isGolden,
      speed: 2 + Math.random() * 2
    }
    setBottles(prev => [...prev, newBottle])
  }

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setBottles(prev => {
        const updated = prev.map(bottle => ({
          ...bottle,
          y: bottle.y + bottle.speed
        })).filter(bottle => {
          if (bottle.y > 400) return false
          return true
        })
        return updated
      })
    }, 16)

    return () => clearInterval(interval)
  }, [isPlaying])

  const catchBottle = (id, isGolden) => {
    setBottles(prev => prev.filter(b => b.id !== id))
    setScore(prev => prev + (isGolden ? 50 : 10))
  }

  const startGame = () => {
    setScore(0)
    setTimeLeft(30)
    setIsPlaying(true)
    setGameOver(false)
    setBottles([])
  }

  return (
    <div className="bg-gradient-to-b from-sky-300 to-sky-200 cartoon-border cartoon-shadow rounded-3xl p-4 md:p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="bg-white cartoon-border cartoon-shadow px-4 py-2 rounded-xl">
          <span className="cartoon-text text-amber-900">Очки: {score}</span>
        </div>
        <div className="bg-white cartoon-border cartoon-shadow px-4 py-2 rounded-xl flex items-center gap-2">
          <SafeIcon name="clock" size={20} className="text-red-500" />
          <span className="cartoon-text text-amber-900">{timeLeft}с</span>
        </div>
      </div>

      {/* Game Area */}
      <div
        ref={gameAreaRef}
        className="relative h-64 bg-gradient-to-b from-sky-200 to-green-200 rounded-2xl border-2 border-black overflow-hidden cursor-crosshair"
      >
        {/* Background elements */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-green-400 border-t-2 border-black" />
        <div className="absolute bottom-16 left-10 w-8 h-12 bg-amber-700 rounded-t-lg border-2 border-black" />
        <div className="absolute bottom-16 right-20 w-6 h-8 bg-gray-600 rounded-t-lg border-2 border-black" />

        {/* Bottles */}
        {bottles.map(bottle => (
          <motion.button
            key={bottle.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1, x: bottle.x, y: bottle.y }}
            onClick={() => catchBottle(bottle.id, bottle.isGolden)}
            className={cn(
              'absolute w-10 h-12 rounded-lg border-2 border-black flex items-center justify-center transition-transform active:scale-90',
              bottle.isGolden ? 'bg-yellow-400' : 'bg-green-500'
            )}
            style={{ left: 0, top: 0 }}
          >
            <SafeIcon name="beer" size={24} className={bottle.isGolden ? 'text-yellow-800' : 'text-green-900'} />
            {bottle.isGolden && <div className="absolute -top-1 -right-1 text-xs">✨</div>}
          </motion.button>
        ))}

        {/* Start/Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-white cartoon-border cartoon-shadow p-6 rounded-2xl text-center max-w-xs">
              {!gameOver ? (
                <>
                  <SafeIcon name="trash2" size={48} className="text-green-600 mx-auto mb-4" />
                  <h3 className="cartoon-text text-xl text-amber-900 mb-2">Собери бутылки!</h3>
                  <p className="text-sm text-gray-600 mb-4">Лови падающие бутылки! Золотые = 50 очков!</p>
                </>
              ) : (
                <>
                  <h3 className="cartoon-text text-2xl text-amber-900 mb-2">Игра окончена!</h3>
                  <p className="text-lg font-bold text-green-600 mb-4">Твой счёт: {score}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    {score < 100 ? 'Новичок! Ты можешь лучше!' :
                     score < 300 ? 'Неплохо, бомж-брат!' :
                     'Легенда помоек! 👑'}
                  </p>
                </>
              )}
              <button
                onClick={startGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl cartoon-border cartoon-shadow transition-all active:translate-y-1 active:shadow-none"
              >
                {gameOver ? 'Играть снова' : 'Начать игру!'}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-gray-600 mt-3">
        Нажимай на бутылки, чтобы поймать их! 🍾
      </p>
    </div>
  )
}

// Blog Card Component
const BlogCard = ({ title, excerpt, image, category, date, delay }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white cartoon-border cartoon-shadow rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer group"
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full cartoon-border">
          {category}
        </div>
      </div>
      <div className="p-5">
        <div className="text-xs text-gray-500 mb-2">{date}</div>
        <h3 className="cartoon-text text-lg text-amber-900 mb-2 leading-tight">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{excerpt}</p>
        <div className="mt-4 flex items-center text-amber-600 font-bold text-sm group-hover:gap-2 transition-all">
          Читать далее <SafeIcon name="chevronRight" size={16} className="ml-1" />
        </div>
      </div>
    </motion.article>
  )
}

// Header Component
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Блог', id: 'blog' },
    { label: 'Мемы', id: 'memes' },
    { label: 'Опрос', id: 'poll' },
    { label: 'Игра', id: 'game' },
  ]

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
      isScrolled ? 'bg-amber-50/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    )}>
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2 group"
          >
            <div className="w-12 h-12 bg-amber-600 rounded-xl cartoon-border cartoon-shadow flex items-center justify-center group-hover:rotate-12 transition-transform">
              <SafeIcon name="home" className="text-white" size={28} />
            </div>
            <div className="hidden sm:block">
              <h1 className="cartoon-text text-amber-900 text-lg leading-none">ВЕСЁЛЫЕ</h1>
              <span className="cartoon-text text-amber-600 text-sm leading-none">БОМЖИ</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 font-bold text-amber-900 hover:bg-amber-100 rounded-xl transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-12 h-12 bg-white cartoon-border cartoon-shadow rounded-xl flex items-center justify-center"
          >
            <SafeIcon name={mobileMenuOpen ? 'x' : 'menu'} size={24} className="text-amber-900" />
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 bg-white cartoon-border cartoon-shadow rounded-2xl overflow-hidden"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full px-6 py-4 text-left font-bold text-amber-900 hover:bg-amber-50 transition-colors border-b-2 border-gray-100 last:border-0"
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

// Main App Component
function App() {
  const blogPosts = [
    {
      title: 'Топ-5 лайфхаков для зимнего выживания',
      excerpt: 'Открой для себя секреты настоящих мудрецов подземки! Узнай, как картонная коробка может спасти твою жизнь при -20°C, и почему газетки — это не только чтиво, но и утеплитель премиум-класса.',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=400&fit=crop',
      category: 'Лайфхаки',
      date: '15 декабря 2024'
    },
    {
      title: 'История великого сбора бутылок 2024',
      excerpt: 'Репортаж с полей великой битвы за стеклотару. Как один бомж собрал рекордные 347 бутылок за день и купил себе новые валенки. Вдохновляющая история успеха!',
      image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&h=400&fit=crop',
      category: 'Истории',
      date: '12 декабря 2024'
    },
    {
      title: 'Гид по лучшим помойкам города',
      excerpt: 'Рейтинговый обзор мусорных баков всех районов. Где найти нетронутые банки тушёнки? Где выбрасывают почти новые куртки? Всё это в нашем эксклюзивном гиде!',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
      category: 'Гид',
      date: '10 декабря 2024'
    },
    {
      title: 'Кулинарный блог: Шедевры из мусора',
      excerpt: 'Готовим вкусно и по-бомжатски! Рецепт "Сюрприз из супермаркета", "Тушёнка à la carte" и фирменный "Коктейль из всего, что нашёл". Приятного аппетита!',
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&h=400&fit=crop',
      category: 'Кулинария',
      date: '8 декабря 2024'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-12 md:pt-32 md:pb-20 px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-4 w-16 h-16 bg-green-400 rounded-full cartoon-border opacity-50 animate-float" />
        <div className="absolute top-40 right-8 w-12 h-12 bg-yellow-400 rounded-full cartoon-border opacity-50 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-red-400 rounded-full cartoon-border opacity-50 animate-float" style={{ animationDelay: '2s' }} />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white cartoon-border cartoon-shadow px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-gray-700">Сатирический юмор без оскорблений</span>
            </div>

            <h1 className="cartoon-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-amber-900 mb-4 leading-none tracking-tight">
              ВЕСЁЛЫЕ<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">БОМЖИ</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto font-handwritten">
              Блог о жизни уличного сообщества с юмором, сатирой и доброй иронией.
              Мемы, истории и мини-игры для настоящих ценителей!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('blog')}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-2xl cartoon-border cartoon-shadow text-lg transition-all hover:scale-105 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
              >
                <SafeIcon name="scroll" size={20} />
                Читать блог
              </button>
              <button
                onClick={() => scrollToSection('game')}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl cartoon-border cartoon-shadow text-lg transition-all hover:scale-105 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
              >
                <SafeIcon name="beer" size={20} />
                Играть
              </button>
            </div>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            <div className="bg-white cartoon-border cartoon-shadow p-4 rounded-2xl">
              <div className="cartoon-text text-2xl md:text-3xl text-amber-600">10K+</div>
              <div className="text-xs md:text-sm text-gray-600 font-bold">Бутылок собрано</div>
            </div>
            <div className="bg-white cartoon-border cartoon-shadow p-4 rounded-2xl">
              <div className="cartoon-text text-2xl md:text-3xl text-green-600">5K+</div>
              <div className="text-xs md:text-sm text-gray-600 font-bold">Мемов создано</div>
            </div>
            <div className="bg-white cartoon-border cartoon-shadow p-4 rounded-2xl">
              <div className="cartoon-text text-2xl md:text-3xl text-purple-600">1K+</div>
              <div className="text-xs md:text-sm text-gray-600 font-bold">Историй</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block bg-white cartoon-border cartoon-shadow px-6 py-3 rounded-2xl mb-4"
            >
              <SafeIcon name="scroll" size={24} className="text-amber-600 inline-block mr-2" />
              <span className="cartoon-text text-amber-900 text-lg">БЛОГ СООБЩЕСТВА</span>
            </motion.div>
            <h2 className="cartoon-text text-3xl md:text-5xl text-amber-900 mb-4">Последние истории</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Смешные, грустные и абсурдные истории из жизни улиц. Читай и делись своими!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {blogPosts.map((post, idx) => (
              <BlogCard key={idx} {...post} delay={idx * 0.1} />
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="bg-white hover:bg-amber-50 text-amber-900 font-bold py-4 px-8 rounded-2xl cartoon-border cartoon-shadow transition-all hover:scale-105 active:translate-y-1 active:shadow-none inline-flex items-center gap-2">
              Загрузить ещё истории <SafeIcon name="chevronRight" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Meme Generator Section */}
      <section id="memes" className="py-16 md:py-24 px-4 bg-gradient-to-b from-transparent to-amber-100/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block bg-amber-600 text-white cartoon-border cartoon-shadow px-6 py-3 rounded-2xl mb-4"
            >
              <SafeIcon name="share2" size={24} className="inline-block mr-2" />
              <span className="cartoon-text text-lg">ГЕНЕРАТОР МЕМОВ</span>
            </motion.div>
            <h2 className="cartoon-text text-3xl md:text-5xl text-amber-900 mb-4">Создай свой бомж-мем</h2>
            <p className="text-lg text-gray-600">
              Выбери шаблон, добавь текст и скачай уникальный мем для соцсетей!
            </p>
          </div>

          <MemeGenerator />
        </div>
      </section>

      {/* Poll Section */}
      <section id="poll" className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block bg-purple-600 text-white cartoon-border cartoon-shadow px-6 py-3 rounded-2xl mb-4"
            >
              <SafeIcon name="flame" size={24} className="inline-block mr-2" />
              <span className="cartoon-text text-lg">ТЕСТ НА ЛИЧНОСТЬ</span>
            </motion.div>
            <h2 className="cartoon-text text-3xl md:text-5xl text-amber-900 mb-4">Какой ты бомж?</h2>
            <p className="text-lg text-gray-600">
              Пройди тест из 5 вопросов и узнай свой тип: Бутылочник, Картонный Король, Мудрец или Философ!
            </p>
          </div>

          <PollSection />
        </div>
      </section>

      {/* Game Section */}
      <section id="game" className="py-16 md:py-24 px-4 bg-gradient-to-b from-transparent to-sky-100/50">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block bg-green-500 text-white cartoon-border cartoon-shadow px-6 py-3 rounded-2xl mb-4"
            >
              <SafeIcon name="zap" size={24} className="inline-block mr-2" />
              <span className="cartoon-text text-lg">МИНИ-ИГРА</span>
            </motion.div>
            <h2 className="cartoon-text text-3xl md:text-5xl text-amber-900 mb-4">Собери бутылки!</h2>
            <p className="text-lg text-gray-600">
              У тебя 30 секунд! Лови падающие бутылки и набирай очки. Золотые бутылки дают бонус!
            </p>
          </div>

          <BottleGame />
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-12 px-4 bg-amber-900 text-amber-50">
        <div className="container mx-auto max-w-3xl text-center">
          <SafeIcon name="alertCircle" size={48} className="mx-auto mb-4 text-amber-300" />
          <h3 className="cartoon-text text-2xl mb-4">Важное сообщение</h3>
          <p className="text-lg leading-relaxed mb-6">
            Этот сайт создан исключительно в юмористических и сатирических целях.
            Мы не пропагандируем бродяжничество или бездействие.
            Напротив — мы за помощь бездомным и за то, чтобы каждый имел кров и работу.
            Если ты видишь человека в беде — помоги, позови социальные службы.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-amber-800 px-4 py-2 rounded-full">#Сатира</span>
            <span className="bg-amber-800 px-4 py-2 rounded-full">#Юмор</span>
            <span className="bg-amber-800 px-4 py-2 rounded-full">#ПомогиБездомным</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 telegram-safe-bottom">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                  <SafeIcon name="home" className="text-white" size={24} />
                </div>
                <span className="cartoon-text text-xl">ВЕСЁЛЫЕ БОМЖИ</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-sm">
                Юмористический проект о жизни "уличного сообщества".
                Мемы, игры и сатира для взрослых с чувством юмора.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors">
                  <span className="font-bold">VK</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors">
                  <span className="font-bold">TG</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-amber-400">Разделы</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('blog')} className="hover:text-white transition-colors">Блог</button></li>
                <li><button onClick={() => scrollToSection('memes')} className="hover:text-white transition-colors">Мемы</button></li>
                <li><button onClick={() => scrollToSection('poll')} className="hover:text-white transition-colors">Опросы</button></li>
                <li><button onClick={() => scrollToSection('game')} className="hover:text-white transition-colors">Игры</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-amber-400">Помощь</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Связаться</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Помощь бездомным</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2024 Весёлые Бомжи. Все права защищены. 18+ Сатирический контент.</p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}

export default App