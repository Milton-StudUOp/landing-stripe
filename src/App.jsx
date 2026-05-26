import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import './App.css'

/* ═══════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════ */

/** Triggers reveal animation when element enters viewport */
function useScrollReveal(margin = '-80px') {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin })
  return [ref, inView]
}

/* ═══════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════ */

/** Fade up from below — used for most section entries */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
}

/** Simple opacity fade */
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}

/** Fade in from left */
const fadeLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

/** Fade in from right */
const fadeRight = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

/** Scale + fade in — for cards */
const scaleIn = {
  hidden: { opacity: 0, scale: 0.94, y: 24 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}

/** Container that staggers its children */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

/** Child item for stagger containers */
const staggerItem = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 20, mass: 0.7 } },
}

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL WRAPPER
   ═══════════════════════════════════════════════════════ */

/**
 * Wraps children in a motion.div that animates in when scrolled into view.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {object} [props.variants=fadeUp] - Framer Motion variants
 * @param {string} [props.className]
 */
function ScrollReveal({ children, variants = fadeUp, className = '' }) {
  const [ref, inView] = useScrollReveal()
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════ */

/**
 * Counts from 0 to `end` with an eased animation when visible.
 * @param {{ end: number|string, suffix: string, duration: number }} props
 */
function AnimatedCounter({ end, suffix = '', duration = 2.4 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    let startTime = null
    const isFloat = String(end).includes('.')
    const total = parseFloat(end)

    const tick = (ts) => {
      if (!startTime) startTime = ts
      const elapsed = (ts - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * total
      setCount(isFloat ? parseFloat(current.toFixed(2)) : Math.floor(current))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, end, duration])

  return <span ref={ref}>{isNaN(end) ? end : `${count.toLocaleString('pt-BR')}${suffix}`}</span>
}

/* ═══════════════════════════════════════════════════════
   PARTICLE CANVAS
   ═══════════════════════════════════════════════════════ */

/**
 * Canvas-based floating particle system for the hero background.
 * Renders small glowing dots that drift and fade gently.
 */
function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let particles = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const COLORS = ['rgba(83,58,253,', 'rgba(124,58,237,', 'rgba(99,102,241,', 'rgba(167,139,250,']

    class Particle {
      constructor() { this.reset(true) }
      reset(initial = false) {
        this.x = Math.random() * canvas.width
        this.y = initial ? Math.random() * canvas.height : canvas.height + 10
        this.size = Math.random() * 2.5 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.4
        this.speedY = -(Math.random() * 0.5 + 0.2)
        this.opacity = 0
        this.maxOpacity = Math.random() * 0.5 + 0.1
        this.fadeIn = true
        this.life = 0
        this.maxLife = Math.random() * 300 + 200
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
      }
      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.life++
        if (this.fadeIn) {
          this.opacity = Math.min(this.opacity + 0.008, this.maxOpacity)
          if (this.opacity >= this.maxOpacity) this.fadeIn = false
        } else {
          this.opacity = Math.max(this.opacity - 0.003, 0)
        }
        if (this.life > this.maxLife || this.opacity <= 0) this.reset()
      }
      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = `${this.color}1)`
        ctx.shadowColor = `${this.color}0.8)`
        ctx.shadowBlur = 6
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle())

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero__canvas" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
}

/* ═══════════════════════════════════════════════════════
   TYPEWRITER
   ═══════════════════════════════════════════════════════ */

/**
 * Cycles through `words` with a typing cursor effect.
 * @param {{ words: string[], speed?: number, pause?: number }} props
 */
function Typewriter({ words, speed = 60, pause = 2200 }) {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[idx]
    const delay = deleting ? speed / 2 : speed

    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, text.length + 1))
        if (text.length + 1 === word.length) {
          setTimeout(() => setDeleting(true), pause)
        }
      } else {
        setText(word.slice(0, text.length - 1))
        if (text.length - 1 === 0) {
          setDeleting(false)
          setIdx((idx + 1) % words.length)
        }
      }
    }, delay)

    return () => clearTimeout(timeout)
  }, [text, deleting, idx, words, speed, pause])

  return (
    <span style={{ color: '#a78bfa' }}>
      {text}
      <span style={{
        display: 'inline-block',
        width: 2,
        height: '1em',
        background: '#a78bfa',
        marginLeft: 2,
        verticalAlign: 'text-bottom',
        animation: 'cursorBlink 0.9s step-end infinite',
      }} />
    </span>
  )
}

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

/** Top navigation links */
const NAV_LINKS = [
  { label: 'Recursos', href: '#features' },
  { label: 'Produtos', href: '#products' },
  { label: 'Preços', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contato', href: '#contact' },
]

/**
 * Partner companies for the infinite marquee.
 * Each item has a name and optional SVG icon path.
 */
const PARTNERS = [
  { name: 'Stripe', icon: 'M12.4 12c0-1.8 1.4-2.5 3.7-2.5 2.1 0 4.5.7 6 1.6V5.4c-1.8-.7-4.1-1-6.2-1C9.6 4.4 5.3 7 5.3 12.6c0 6.9 9.5 5.8 9.5 8.9 0 2-1.8 2.6-4.1 2.6-2.5 0-5.1-1-6.8-2v5.8c1.9.8 4.6 1.2 7 1.2 6.5 0 10.7-2.7 10.7-8.3 0-7.3-9.2-6-9.2-8.8z' },
  { name: 'Nubank', icon: 'M5 3h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm3.5 5.5a.5.5 0 00-.5.5v6c0 .276.224.5.5.5h7a.5.5 0 00.5-.5V9a.5.5 0 00-.5-.5h-7z' },
  { name: 'PicPay', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z' },
  { name: 'Mercado Pago', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l5 4.5-5 4.5z' },
  { name: 'Inter', icon: 'M12 2L2 7v10l10 5 10-5V7l-10-5zm0 3.5l7 3.5v7l-7 3.5-7-3.5V9l7-3.5z' },
  { name: 'C6 Bank', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' },
  { name: 'Shopify', icon: 'M15.85 3.3c-.07-.06-.17-.08-.26-.05l-1.08.33A5.17 5.17 0 0013.8 2.3C13.3 1.55 12.6 1 11.7 1c-.08 0-.16 0-.24.02a.9.9 0 00-.16-.18c-.52-.48-1.18-.67-1.98-.57C7.18.64 5.1 2.93 4.34 5.78L2.1 6.47c-.65.2-.67.22-.75.83L0 17.06 12.87 19 19 17.07 15.85 3.3z' },
  { name: 'Hotmart', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z' },
]

/** Core product features for the Features section */
const FEATURES = [
  {
    icon: 'bolt',
    title: 'Pagamentos Instantâneos',
    desc: 'PIX, cartão de crédito e boleto processados em tempo real. Liquidação D+1 para cartão, instantânea para PIX.',
  },
  {
    icon: 'split',
    title: 'Split de Pagamentos',
    desc: 'Divida transações entre múltiplos vendedores automaticamente. Ideal para marketplaces e plataformas.',
  },
  {
    icon: 'loop',
    title: 'Assinaturas Inteligentes',
    desc: 'Planos recorrentes com retentativa automática. Reduza churn com cobrança inteligente em até 3 tentativas.',
  },
  {
    icon: 'shield',
    title: 'PayShield Antifraude',
    desc: 'IA analisa 200+ pontos de dados em tempo real. 99.7% de precisão no bloqueio de transações suspeitas.',
  },
  {
    icon: 'code',
    title: 'API REST + SDKs',
    desc: 'Integração em minutos com SDKs para Node.js, Python, PHP, Java e Go. Documentação interativa completa.',
  },
  {
    icon: 'chart',
    title: 'Relatórios em Tempo Real',
    desc: 'Dashboard financeiro completo com conciliação automática, extrato PIX e exportação CSV/PDF.',
  },
]

/** Key metrics shown in the Stats section */
const STATS = [
  { value: '2.5', suffix: 'B+', label: 'Transacionados via PayFlow' },
  { value: '15000', suffix: '+', label: 'Empresas Ativas' },
  { value: '99.97', suffix: '%', label: 'Uptime Garantido' },
  { value: '200', suffix: '+', label: 'Integrações Disponíveis' },
]

/** Security and compliance trust badges */
const TRUST_BADGES = [
  {
    name: 'PCI DSS',
    desc: 'Certificação nível 1 para processamento seguro de cartões',
    icon: 'shield-check',
  },
  {
    name: 'ISO 27001',
    desc: 'Gestão de segurança da informação certificada internacionalmente',
    icon: 'badge',
  },
  {
    name: 'SOC 2 Type II',
    desc: 'Controles de segurança auditados por terceiros independentes',
    icon: 'verified',
  },
  {
    name: 'LGPD Compliant',
    desc: 'Proteção de dados pessoais em conformidade com a legislação brasileira',
    icon: 'lock',
  },
]

/**
 * Product tab content for the Product Showcase section.
 * Each key maps to a tab with title, subtitle, description, code snippet, and image.
 */
const PRODUCT_TABS = {
  'payment-links': {
    title: 'Links de Pagamento',
    subtitle: 'Cobre em segundos, sem e-commerce.',
    desc: 'Crie e compartilhe links de cobrança via WhatsApp, Instagram ou email. Configure o valor, envie e receba — simples assim.',
    img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=90',
    imgAlt: 'Checkout mobile PayFlow',
    code: `// Criar Link de Pagamento
const link = await payflow.paymentLinks.create({
  amount: 14990,        // R$ 149,90
  currency: "brl",
  title: "Curso Online Completo",
  max_uses: 15,
  expires_in: "48h",
  payment_methods: ["pix", "credit_card"],
  redirect_url: "https://seusite.com/sucesso",
  metadata: {
    product_id: "prod_abc123",
    campaign: "black_friday"
  }
});
// → { url: "https://pay.payflow.com.br/lnk_7xB..." }`,
  },
  'api-rest': {
    title: 'API REST Robusta',
    subtitle: 'Integração de alto desempenho.',
    desc: 'Checkout customizado diretamente na sua aplicação. Webhooks em tempo real com retentativa automática e garantia de entrega.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=90',
    imgAlt: 'Dashboard de analytics PayFlow',
    code: `// Cobrança via Cartão de Crédito
const charge = await payflow.charges.create({
  amount: 25000,        // R$ 250,00
  currency: "brl",
  payment_method: "credit_card",
  installments: 3,
  capture: true,
  card: {
    number: "4532XXXXXXXX1234",
    holder: "Augusto F Ramos",
    exp_month: 12,
    exp_year: 2028,
    cvv: "321"
  },
  customer_id: "cus_h8d2j8k93h"
});`,
  },
  subscriptions: {
    title: 'Assinaturas Recorrentes',
    subtitle: 'SaaS e clubes de assinatura.',
    desc: 'Gerencie planos mensais ou anuais com retentativas inteligentes. Upgrade, downgrade e cancelamento automático via API.',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=90',
    imgAlt: 'Time usando plataforma SaaS',
    code: `// Criar Assinatura Recorrente
const sub = await payflow.subscriptions.create({
  customer_id: "cus_h8d2j8k93h",
  plan_id: "plan_saas_pro_yearly",
  trial_days: 14,
  billing_behavior: "charge_automatically",
  retry_config: {
    max_retries: 3,
    interval_days: [1, 3, 7]
  },
  metadata: { team: "Marketing" }
});
// → sub.status: "trialing"`,
  },
}

/** Pricing plans for the Pricing section */
const PLANS = [
  {
    name: 'Starter',
    monthly: 'Grátis',
    yearly: 'Grátis',
    desc: 'Perfeito para testar a plataforma e validar sua ideia.',
    features: [
      'Até 50 transações/mês',
      'Dashboard básico',
      'Suporte por email',
      'PIX e boleto',
      'API REST sandbox',
      'Documentação completa',
    ],
    cta: 'Começar Grátis',
    popular: false,
  },
  {
    name: 'Professional',
    monthly: 'R$ 49',
    yearly: 'R$ 39',
    desc: 'Para negócios em crescimento que precisam de escala e performance.',
    features: [
      'Transações ilimitadas',
      'Split de pagamentos',
      'PayShield Antifraude',
      'Suporte prioritário 24/7',
      'Relatórios avançados',
      'Webhooks em tempo real',
      'Até 5 usuários',
      'API em Produção',
    ],
    cta: 'Assinar Agora',
    popular: true,
  },
  {
    name: 'Enterprise',
    monthly: 'R$ 299',
    yearly: 'R$ 239',
    desc: 'Solução completa para grandes operações com SLA dedicado.',
    features: [
      'Tudo do Professional',
      'Gerente de conta dedicado',
      'SLA personalizado',
      'Taxas negociadas',
      'Onboarding assistido',
      'Integrações customizadas',
      'Usuários ilimitados',
      'Ambiente dedicado',
    ],
    cta: 'Falar com Vendas',
    popular: false,
  },
]

/**
 * Customer testimonials.
 * Images from Unsplash at high resolution (w=200 for avatars).
 */
const TESTIMONIALS = [
  {
    name: 'Carolina Mendes',
    role: 'CTO, TechRetail',
    quote: 'A PayFlow transformou nossa operação. Reduzimos custos de transação em 40% e a integração com PIX foi a mais rápida do mercado.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=90',
    rating: 5,
  },
  {
    name: 'Rafael Oliveira',
    role: 'Founder, SubscriBox',
    quote: 'O sistema de assinaturas recorrentes reduziu nosso churn em 25%. As retentativas inteligentes recuperaram milhares de reais em receita todo mês.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=90',
    rating: 5,
  },
  {
    name: 'Juliana Costa',
    role: 'CEO, MakPlace',
    quote: 'O split de pagamentos foi o diferencial para nosso marketplace. Dividir automaticamente entre 200+ vendedores nunca foi tão simples e confiável.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=90',
    rating: 5,
  },
]

/** Frequently asked questions */
const FAQ = [
  {
    q: 'Como funciona a ativação da conta?',
    a: 'A ativação é 100% digital. Cadastre-se no sandbox em menos de 2 minutos para testar. Para produção, preencha os dados da empresa e em poucas horas sua conta está ativa e verificada.',
  },
  {
    q: 'Quais são as taxas de transação?',
    a: 'PIX: R$ 0,49 por transação. Boleto: R$ 1,49 compensado. Cartão de crédito: a partir de 1,99% + R$ 0,40. Sem taxas fixas mensais no plano Starter. Taxas negociadas no Enterprise.',
  },
  {
    q: 'A PayFlow possui proteção contra fraudes?',
    a: 'Sim! O PayShield usa IA com machine learning que analisa 200+ pontos de dados em tempo real, bloqueando compras suspeitas com 99.7% de precisão e taxa de falso-positivo inferior a 0.1%.',
  },
  {
    q: 'Posso integrar em plataformas prontas?',
    a: 'Sim! Oferecemos plugins homologados para WooCommerce, Shopify, Magento, Nuvemshop, Hotmart e dezenas de outras plataformas. Instalação em minutos, sem precisar escrever código.',
  },
  {
    q: 'Como funciona o suporte técnico?',
    a: 'Starter: central de ajuda + email (resposta em até 24h). Professional: chat 24/7 + WhatsApp dedicado. Enterprise: gerente de conta dedicado + SLA personalizado + onboarding assistido.',
  },
  {
    q: 'O PayFlow é certificado PCI DSS?',
    a: 'Sim, somos certificados PCI DSS Nível 1 — o mais alto nível de certificação para processamento de pagamentos com cartão. Também somos ISO 27001 e SOC 2 Type II.',
  },
]

const FOOTER_COLS = [
  { title: 'Produto', links: ['Pagamentos', 'Split', 'Assinaturas', 'Link de Pagamento', 'PayShield'] },
  { title: 'Plataforma', links: ['API Referência', 'SDKs', 'Plugins', 'Status', 'Changelog'] },
  { title: 'Recursos', links: ['Documentação', 'Guia de Integração', 'Blog', 'Central de Ajuda', 'Comunidade'] },
  { title: 'Empresa', links: ['Sobre Nós', 'Carreiras', 'Blog', 'Parceiros', 'Imprensa'] },
]

/** Contact Info for Footer */
const CONTACT_INFO = {
  email: 'oi@payflow.com.br',
  phone: '(11) 9999-8888',
  address: 'Av. Paulista, 1000 - São Paulo - SP'
}

/** Social media icon paths (SVG) */
const SOCIALS = [
  { name: 'GitHub', path: 'M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.4.6.1.82-.26.82-.58v-2.17c-3.34.72-4.04-1.4-4.04-1.4-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0112 5.8c1.02 0 2.05.14 3.01.4 2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z' },
  { name: 'Twitter', path: 'M23.44 4.83c-.8.37-1.67.62-2.57.73a4.5 4.5 0 001.97-2.48 9 9 0 01-2.85 1.09 4.5 4.5 0 00-7.65 4.1A12.76 12.76 0 011.64 3.16a4.5 4.5 0 001.39 6 4.5 4.5 0 01-2.03-.56v.06a4.5 4.5 0 003.6 4.41 4.5 4.5 0 01-2.03.08 4.5 4.5 0 004.2 3.12 9.02 9.02 0 01-5.59 1.93c-.36 0-.72-.02-1.07-.06A12.74 12.74 0 007.42 21c8.5 0 13.14-7.04 13.14-13.14 0-.2 0-.4-.01-.6a9.4 9.4 0 002.9-1.43z' },
  { name: 'LinkedIn', path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05a3.75 3.75 0 013.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .78 0 1.77v20.46C0 23.22.79 24 1.77 24h20.46c.98 0 1.77-.78 1.77-1.77V1.77C24 .78 23.22 0 22.23 0z' },
  { name: 'Instagram', path: 'M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.78 1.69 4.93 4.93.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.24-1.68 4.78-4.93 4.93-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.25-.15-4.78-1.69-4.93-4.93-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.37 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0-2.16C8.74 0 8.33.01 7.05.07 3.11.27.27 3.1.07 7.05.01 8.33 0 8.73 0 12s.01 3.67.07 4.95c.2 3.94 3.04 6.78 6.98 6.98 1.28.06 1.67.07 4.95.07s3.67-.01 4.95-.07c3.94-.2 6.78-3.04 6.98-6.98.06-1.28.07-1.67.07-4.95s-.01-3.67-.07-4.95C23.73 3.11 20.89.27 16.95.07 15.67.01 15.26 0 12 0zM12 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zm0 10.16a4 4 0 110-8 4 4 0 010 8zm6.41-11.41a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z' },
]

/* ═══════════════════════════════════════════════════════
   ICON COMPONENTS
   ═══════════════════════════════════════════════════════ */

/** Renders a feature icon by name */
function FeatureIcon({ name }) {
  const icons = {
    bolt: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    split: (
      <>
        <circle cx="12" cy="5" r="3" />
        <circle cx="5" cy="19" r="3" />
        <circle cx="19" cy="19" r="3" />
        <path d="M12 8v8M5 16l7-8 7 8" />
      </>
    ),
    loop: <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 11-.57-8.38l5.67-5.67" />,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    code: (
      <>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
      </>
    ),
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  )
}

/** Renders a trust badge icon by name */
function TrustIcon({ name }) {
  const icons = {
    'shield-check': (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </>
    ),
    badge: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </>
    ),
    verified: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
    lock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </>
    ),
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
      {icons[name]}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════
   LOGO SVG
   ═══════════════════════════════════════════════════════ */
function PayFlowLogo({ size = 32 }) {
  return (
    <div className="nav__logo-icon" style={{ width: size, height: size }}>
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 20 20" fill="none">
        <path d="M4 14V6h4c1.8 0 3 1 3 3s-1.2 3-3 3H7v2H4zm3-4h1c.7 0 1.2-.4 1.2-1.1S8.7 7.8 8 7.8H7V10z" fill="white" />
        <path d="M13 14V9l4 2.5-4 2.5z" fill="rgba(255,255,255,0.5)" />
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   INFINITE MARQUEE
   ═══════════════════════════════════════════════════════ */

/**
 * Renders an infinite auto-scrolling marquee of partner logos.
 * Duplicates items to create a seamless loop.
 */
function Marquee() {
  const doubled = [...PARTNERS, ...PARTNERS]
  return (
    <div className="marquee-section">
      <p className="marquee-label">Integrado com as principais plataformas do mercado</p>
      <div className="marquee-track-wrap">
        <div className="marquee-track">
          {doubled.map((p, i) => (
            <span key={i} className="marquee-item">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d={p.icon} />
              </svg>
              {p.name}
              {i < doubled.length - 1 && <span className="marquee-sep">·</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════ */

/**
 * Root application component.
 * Contains all sections: Nav → Hero → Marquee → Features → Stats →
 * Trust → Products → Pricing → Testimonials → FAQ → CTA → Footer.
 */
export default function App() {
  // ─── State ───
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [billing, setBilling] = useState('monthly')
  const [activeFaq, setActiveFaq] = useState(null)
  const [activeTab, setActiveTab] = useState('payment-links')

  // Payment simulator
  const [payAmount, setPayAmount] = useState('149,90')
  const [payName, setPayName] = useState('Mariana Silva')
  const [payEmail, setPayEmail] = useState('mariana@empresa.com')
  const [payStatus, setPayStatus] = useState('idle')

  // Cursor blink keyframes injected once
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `@keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  // ─── Scroll watcher ───
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ─── Smooth scroll to section ───
  const scrollTo = useCallback((id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  // ─── Payment simulator ───
  const simulatePayment = (e) => {
    e.preventDefault()
    if (payStatus !== 'idle') return
    setPayStatus('processing')
    setTimeout(() => setPayStatus('success'), 2000)
  }

  // ─── FAQ toggle ───
  const toggleFaq = (i) => setActiveFaq(activeFaq === i ? null : i)

  return (
    <div className="app">

      {/* ═══════ 1. NAV ═══════ */}
      <motion.nav
        className={`nav ${scrolled ? 'nav--scrolled' : ''}`}
        initial={{ y: -68, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container nav__inner">
          {/* Logo */}
          <a onClick={() => scrollTo('hero')} className="nav__logo" id="nav-logo">
            <PayFlowLogo size={32} />
            <span>PayFlow</span>
          </a>

          {/* Desktop links */}
          <div className="nav__links">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                id={`nav-link-${l.label.toLowerCase()}`}
                onClick={() => scrollTo(l.href.slice(1))}
                className="nav__link"
              >
                {l.label}
                <span className="nav__underline" />
              </a>
            ))}
            <motion.button
              id="nav-cta"
              className="btn btn--primary"
              onClick={() => scrollTo('contact')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ marginLeft: 8 }}
            >
              Criar Conta
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <button
            id="nav-hamburger"
            className={`nav__hamburger ${menuOpen ? 'is-active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu de navegação"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="nav__mobile"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {NAV_LINKS.map((l) => (
                <a key={l.href} onClick={() => scrollTo(l.href.slice(1))}>{l.label}</a>
              ))}
              <button className="btn btn--gradient" onClick={() => scrollTo('contact')}>
                Começar Grátis
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ═══════ 2. HERO ═══════ */}
      <section id="hero" className="hero">
        {/* Animated glow orbs */}
        <div className="hero__glow-orb hero__glow-orb--1" />
        <div className="hero__glow-orb hero__glow-orb--2" />
        <div className="hero__glow-orb hero__glow-orb--3" />

        {/* Particle system */}
        <ParticleCanvas />

        {/* Hero content */}
        <div className="hero__content">
          {/* Eyebrow badge */}
          <motion.div
            className="hero__eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero__eyebrow-dot" />
            PIX instantâneo · Cartão · Boleto · Split
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero__title-line">Infraestrutura de pagamentos</span>
            <span className="hero__title-line hero__title-gradient">
              <Typewriter words={['para o futuro.', 'que converte.', 'sem limites.', 'inteligente.']} />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="hero__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Aceite cobranças online, automatize assinaturas recorrentes e faça splits dinâmicos com a melhor taxa de conversão do mercado.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button
              id="hero-cta-primary"
              className="btn btn--gradient btn--lg"
              onClick={() => scrollTo('contact')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Começar grátis
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
            <motion.button
              id="hero-cta-secondary"
              className="btn btn--ghost-white btn--lg"
              onClick={() => scrollTo('products')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Ver a API
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="hero__trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {['PCI DSS Nível 1', 'ISO 27001', 'Sem contrato', 'Cancele quando quiser'].map((t) => (
              <span key={t} className="hero__trust-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Hero preview window */}
        <motion.div
          className="hero__preview"
          initial={{ opacity: 0, y: 80, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.65, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero__preview-window">
            {/* Left: payment form */}
            <div className="preview__form">
              <AnimatePresence mode="wait">
                {payStatus === 'idle' && (
                  <motion.form
                    key="idle"
                    onSubmit={simulatePayment}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
                  >
                    <div className="pf-logo">payflow_checkout</div>
                    <div className="pf-amount">R$ {payAmount}</div>
                    <div className="pf-plan">Plano SaaS Professional</div>

                    <div className="pf-field">
                      <label htmlFor="pf-name">Nome Completo</label>
                      <input id="pf-name" type="text" value={payName} onChange={(e) => setPayName(e.target.value)} required />
                    </div>
                    <div className="pf-field">
                      <label htmlFor="pf-email">Email de Cobrança</label>
                      <input id="pf-email" type="email" value={payEmail} onChange={(e) => setPayEmail(e.target.value)} required />
                    </div>
                    <div className="pf-row">
                      <div className="pf-field">
                        <label htmlFor="pf-amount">Valor (R$)</label>
                        <input id="pf-amount" type="text" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
                      </div>
                      <div className="pf-field">
                        <label>Cartão</label>
                        <input type="text" value="•••• 4321" disabled />
                      </div>
                    </div>
                    <motion.button
                      id="pf-pay-btn"
                      type="submit"
                      className="btn btn--gradient pf-pay"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      Pagar com PayFlow
                    </motion.button>
                  </motion.form>
                )}

                {payStatus === 'processing' && (
                  <motion.div
                    key="processing"
                    className="pf-result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="pf-spinner" />
                    <h4>Processando…</h4>
                    <p>Criptografando e verificando antifraude em tempo real</p>
                  </motion.div>
                )}

                {payStatus === 'success' && (
                  <motion.div
                    key="success"
                    className="pf-result pf-success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="pf-check">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="26" height="26">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h4>Pagamento Aprovado!</h4>
                    <p>Webhook enviado · Transação tokenizada</p>
                    <button
                      id="pf-retry-btn"
                      className="btn btn--ghost btn--sm"
                      onClick={() => setPayStatus('idle')}
                      style={{ marginTop: 8 }}
                    >
                      Simular novamente
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: live code preview */}
            <div className="preview__code">
              <div className="pc-header">
                <span className="pc-dot red" />
                <span className="pc-dot yellow" />
                <span className="pc-dot green" />
                <span className="pc-title">payflow_payment.js</span>
              </div>
              <pre className="pc-editor"><code>{`// Inicializando SDK PayFlow
const payflow = require("payflow")("pk_live_51M...");

const payment = await payflow.payments.create({
  amount: ${payAmount.replace(',', '')},
  currency: "brl",
  customer: {
    name: "${payName}",
    email: "${payEmail}"
  },
  metadata: {
    plano: "professional_saas"
  }
});

if (payment.status === "approved") {
  console.log("✓ Aprovado:", payment.id);
  sendWebhook(payment);
}`}</code></pre>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════ 3. MARQUEE — Infinite logo scroll ═══════ */}
      <Marquee />

      {/* ═══════ 4. FEATURES ═══════ */}
      <section id="features" className="section features">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__label">RECURSOS</span>
              <h2 className="section__title">Tudo que você precisa para cobrar e crescer</h2>
              <p className="section__desc">
                Da integração simples à automação complexa — a PayFlow tem a ferramenta certa para cada etapa do seu negócio.
              </p>
            </div>
          </ScrollReveal>

          <motion.div
            className="features__grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                id={`feature-card-${f.icon}`}
                className="feature__card"
                variants={staggerItem}
              >
                <div className="feature__card-accent" />
                <div className="feature__icon">
                  <FeatureIcon name={f.icon} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ 5. STATS ═══════ */}
      <section className="stats">
        <div className="container">
          <motion.div
            className="stats__grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {STATS.map((s, i) => (
              <motion.div key={i} className="stats__card" variants={staggerItem}>
                <span className="stats__num">
                  <AnimatedCounter end={s.value} suffix={s.suffix} />
                </span>
                <span className="stats__label">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ 6. TRUST BADGES ═══════ */}
      <section className="trust">
        <div className="container">
          <ScrollReveal>
            <div className="section__header" style={{ marginBottom: 40 }}>
              <span className="section__label">SEGURANÇA</span>
              <h2 className="section__title">Certificações que protegem seu negócio</h2>
              <p className="section__desc">Cumprimos os mais altos padrões de segurança do setor financeiro global.</p>
            </div>
          </ScrollReveal>

          <motion.div
            className="trust__grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {TRUST_BADGES.map((b, i) => (
              <motion.div key={i} id={`trust-badge-${i}`} className="trust__card" variants={staggerItem}>
                <div className="trust__icon">
                  <TrustIcon name={b.icon} />
                </div>
                <span className="trust__name">{b.name}</span>
                <span className="trust__desc">{b.desc}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ 7. PRODUCT SHOWCASE ═══════ */}
      <section id="products" className="section showcase">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__label">PRODUTOS</span>
              <h2 className="section__title">Uma plataforma, infinitas possibilidades</h2>
              <p className="section__desc">Escolha o produto ideal e integre em minutos com nossa API e SDKs completos.</p>
            </div>
          </ScrollReveal>

          {/* Tab navigation */}
          <div className="showcase__tabs">
            {Object.entries(PRODUCT_TABS).map(([key, tab]) => (
              <button
                key={key}
                id={`showcase-tab-${key}`}
                className={`showcase__tab ${activeTab === key ? 'is-active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {tab.title}
                {activeTab === key && (
                  <motion.div
                    className="showcase__tab-indicator"
                    layoutId="showcase-indicator"
                    transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="showcase__panel"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Left: info + code */}
              <motion.div className="showcase__info" variants={fadeLeft} initial="hidden" animate="visible">
                <h3>{PRODUCT_TABS[activeTab].subtitle}</h3>
                <p>{PRODUCT_TABS[activeTab].desc}</p>
                <div className="showcase__code">
                  <div className="showcase__code-header">
                    <span className="pc-dot red" />
                    <span className="pc-dot yellow" />
                    <span className="pc-dot green" />
                    <span style={{ marginLeft: 8 }}>payflow_example.js</span>
                  </div>
                  <pre><code>{PRODUCT_TABS[activeTab].code}</code></pre>
                </div>
              </motion.div>

              {/* Right: image */}
              <motion.div className="showcase__visual" variants={fadeRight} initial="hidden" animate="visible">
                <div className="showcase__glow" />
                <div className="showcase__img-wrap">
                  <img
                    src={PRODUCT_TABS[activeTab].img}
                    alt={PRODUCT_TABS[activeTab].imgAlt}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="showcase__img-overlay" />
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════ 8. PRICING ═══════ */}
      <section id="pricing" className="section pricing">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__label">PREÇOS</span>
              <h2 className="section__title">Planos que crescem com você</h2>
              <p className="section__desc">Sem taxas escondidas. Cancele quando quiser. Todos os planos incluem suporte técnico.</p>
            </div>
          </ScrollReveal>

          {/* Billing toggle */}
          <div className="pricing__toggle">
            <span
              id="billing-monthly"
              className={billing === 'monthly' ? 'is-active' : ''}
              onClick={() => setBilling('monthly')}
            >
              Mensal
            </span>
            <button
              id="billing-toggle"
              className={`pricing__toggle-track ${billing === 'yearly' ? 'is-yearly' : ''}`}
              onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
              aria-label="Alternar entre plano mensal e anual"
            >
              <motion.div
                className="pricing__toggle-thumb"
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span
              id="billing-yearly"
              className={billing === 'yearly' ? 'is-active' : ''}
              onClick={() => setBilling('yearly')}
            >
              Anual <span className="pricing__badge">20% OFF</span>
            </span>
          </div>

          {/* Pricing cards */}
          <div className="pricing__grid">
            {PLANS.map((plan, i) => (
              <motion.div
                key={i}
                id={`pricing-card-${plan.name.toLowerCase()}`}
                className={`pricing__card ${plan.popular ? 'is-popular' : ''}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
              >
                {plan.popular && <div className="pricing__popular-ring" />}
                {plan.popular && <span className="pricing__popular-badge">⭐ Mais Popular</span>}

                <p className="pricing__name">{plan.name}</p>

                <div className="pricing__price">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={billing}
                      className="pricing__value"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                    >
                      {billing === 'monthly' ? plan.monthly : plan.yearly}
                    </motion.span>
                  </AnimatePresence>
                  {plan.monthly !== 'Grátis' && (
                    <span className="pricing__period">/mês</span>
                  )}
                </div>

                <p className="pricing__desc">{plan.desc}</p>
                <div className="pricing__divider" />

                <ul className="pricing__features">
                  {plan.features.map((f, j) => (
                    <li key={j}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={plan.popular ? '#10d070' : '#533afd'} strokeWidth="2.5" width="16" height="16">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <motion.button
                  id={`pricing-cta-${plan.name.toLowerCase()}`}
                  className={`btn ${plan.popular ? 'btn--gradient' : 'btn--ghost'} btn--block`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ marginTop: 'auto' }}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 9. TESTIMONIALS ═══════ */}
      <section className="section testimonials">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__label">DEPOIMENTOS</span>
              <h2 className="section__title">O que nossos clientes dizem</h2>
              <p className="section__desc">Empresas de todos os tamanhos confiam na PayFlow para transformar seus pagamentos.</p>
            </div>
          </ScrollReveal>

          <motion.div
            className="testimonials__grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                id={`testimonial-card-${i}`}
                className="testimonial__card"
                variants={staggerItem}
              >
                {/* Stars */}
                <div className="testimonial__stars">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <svg key={s} viewBox="0 0 24 24" fill="#f59e0b" width="16" height="16">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                <p className="testimonial__quote">{t.quote}</p>

                <div className="testimonial__author">
                  <div className="testimonial__avatar-wrap">
                    <img
                      src={t.avatar}
                      alt={`Foto de ${t.name}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ 10. FAQ ═══════ */}
      <section id="faq" className="section faq">
        <div className="container faq__container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__label">FAQ</span>
              <h2 className="section__title">Perguntas frequentes</h2>
              <p className="section__desc">Tire suas dúvidas sobre a PayFlow. Precisa de mais? Nosso time está disponível 24/7.</p>
            </div>
          </ScrollReveal>

          <div className="faq__list">
            {FAQ.map((item, i) => (
              <motion.div
                key={i}
                id={`faq-item-${i}`}
                className={`faq__item ${activeFaq === i ? 'is-open' : ''}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
              >
                <button
                  className="faq__question"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={activeFaq === i}
                >
                  <span>{item.q}</span>
                  <div className="faq__question-icon">
                    <motion.svg
                      animate={{ rotate: activeFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </motion.svg>
                  </div>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      className="faq__answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 11. CTA ═══════ */}
      <section id="contact" className="cta">
        <div className="cta__glow" />
        <div className="container cta__inner">
          <motion.div
            className="cta__label"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            🚀 &nbsp;Comece hoje, sem cartão de crédito
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Pronto para transformar<br />seus pagamentos?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Comece grátis hoje. Sem contrato, sem taxas escondidas. Integre em minutos e comece a receber.
          </motion.p>

          <motion.div
            className="cta__actions"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.32, duration: 0.5 }}
          >
            <motion.button
              id="cta-primary"
              className="btn btn--white btn--lg"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Criar conta grátis
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
            <motion.button
              id="cta-secondary"
              className="btn btn--ghost-white btn--lg"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Falar com vendas
            </motion.button>
          </motion.div>

          {/* Social proof avatars */}
          <motion.div
            className="cta__social-proof"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="cta__avatars">
              {TESTIMONIALS.map((t, i) => (
                <img key={i} src={t.avatar} alt={t.name} />
              ))}
            </div>
            <p className="cta__social-text">
              Junte-se a <strong>+15.000 empresas</strong> que já usam a PayFlow
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ 12. FOOTER ═══════ */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__top">
            {/* Brand column */}
            <div className="footer__brand">
              <div className="footer__brand-logo">
                <PayFlowLogo size={30} />
                <span className="footer__logo-text">PayFlow</span>
              </div>
              <p className="footer__tagline">
                Infraestrutura de pagamentos moderna para negócios que querem crescer sem limites.
              </p>
              <div className="footer__socials">
                {SOCIALS.map((s, i) => (
                  <a
                    key={i}
                    href="#"
                    className="footer__social-btn"
                    aria-label={s.name}
                    id={`social-${s.name.toLowerCase()}`}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            {FOOTER_COLS.map((col, i) => (
              <div key={i} className="footer__col">
                <span className="footer__col-title">{col.title}</span>
                {col.links.map((link, j) => (
                  <a key={j} href="#" id={`footer-link-${link.toLowerCase().replace(/\s+/g, '-')}`}>
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="footer__bottom">
            <span>© 2026 PayFlow Tecnologia Ltda. Todos os direitos reservados.</span>
            <div className="footer__bottom-links">
              <a href="#">Privacidade</a>
              <a href="#">Termos de Uso</a>
              <a href="#">Cookies</a>
              <a href="#">Status</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
