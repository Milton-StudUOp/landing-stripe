import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import './App.css'

/* ═══════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════ */

function useScrollReveal(threshold = 0.15, once = true) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-80px' })
  return [ref, inView]
}

/* ═══════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } }
}

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 18, mass: 0.6 } }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }
}

/* ═══════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════ */

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

function AnimatedCounter({ end, suffix = '', duration = 2.2 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!inView) return
    let startTime = null
    const isFloat = end.toString().includes('.')
    const total = parseFloat(end)

    const animate = (ts) => {
      if (!startTime) startTime = ts
      const elapsed = (ts - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * total

      setCount(isFloat ? parseFloat(current.toFixed(2)) : Math.floor(current))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, end, duration])

  return <span ref={ref}>{isNaN(end) ? end : `${count.toLocaleString()}${suffix}`}</span>
}

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: 'Recursos', href: '#features' },
  { label: 'Produtos', href: '#products' },
  { label: 'Preços', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contato', href: '#contact' },
]

const PARTNERS = [
  { name: 'Stripe', svg: 'M12.4 12c0-1.8 1.4-2.5 3.7-2.5 2.1 0 4.5.7 6 1.6V5.4c-1.8-.7-4.1-1-6.2-1C9.6 4.4 5.3 7 5.3 12.6c0 6.9 9.5 5.8 9.5 8.9 0 2-1.8 2.6-4.1 2.6-2.5 0-5.1-1-6.8-2v5.8c1.9.8 4.6 1.2 7 1.2 6.5 0 10.7-2.7 10.7-8.3 0-7.3-9.2-6-9.2-8.8z' },
  { name: 'Nubank', svg: 'M5 3h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm3.5 5.5a.5.5 0 00-.5.5v6c0 .276.224.5.5.5h7a.5.5 0 00.5-.5V9a.5.5 0 00-.5-.5h-7z' },
  { name: 'PicPay', svg: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z' },
  { name: 'Mercado Pago', svg: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l5 4.5-5 4.5z' },
  { name: 'Inter', svg: 'M12 2L2 7v10l10 5 10-5V7l-10-5zm0 3.5l7 3.5v7l-7 3.5-7-3.5V9l7-3.5z' },
  { name: 'C6 Bank', svg: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' },
]

const FEATURES = [
  { icon: 'bolt', title: 'Pagamentos Instantâneos', desc: 'PIX, cartão de crédito e boleto processados em tempo real. Liquidação em D+1 para cartão, instantânea para PIX.' },
  { icon: 'split', title: 'Split de Pagamentos', desc: 'Divida transações entre múltiplos vendedores automaticamente. Ideal para marketplaces e plataformas de vendas.' },
  { icon: 'loop', title: 'Assinaturas Inteligentes', desc: 'Planos recorrentes com retentativa automática. Reduza churn com cobrança inteligente em até 3 tentativas.' },
  { icon: 'shield', title: 'PayShield Antifraude', desc: 'IA analisa 200+ pontos de dados em tempo real. Bloqueio de transações suspeitas com taxa de aprovação líder.' },
  { icon: 'code', title: 'API REST + SDKs', desc: 'Integração em minutos com SDKs para Node.js, Python, PHP, Java e Go. Documentação interativa completa.' },
  { icon: 'chart', title: 'Relatórios em Tempo Real', desc: 'Dashboard financeiro completo com conciliação automática, extrato PIX e relatórios exportáveis em CSV/PDF.' },
]

const STATS = [
  { value: '2.5', suffix: 'B+', label: 'Processados via PayFlow' },
  { value: '15000', suffix: '+', label: 'Empresas Ativas' },
  { value: '99.97', suffix: '%', label: 'Uptime Garantido' },
  { value: '200', suffix: '+', label: 'Integrações Disponíveis' },
]

const PRODUCT_TABS = {
  'payment-links': {
    title: 'Links de Pagamento',
    subtitle: 'Crie e compartilhe links de cobrança em segundos.',
    desc: 'Perfeito para vender via WhatsApp, Instagram ou email. Sem e-commerce, configure o valor e envie.',
    img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80',
    imgAlt: 'Mockup de pagamento mobile',
    code: `// Criar Link de Pagamento
const link = await payflow.paymentLinks.create({
  amount: 14990,   // R$ 149,90
  currency: "brl",
  title: "Curso Online Completo",
  max_uses: 15,
  expires_in: "48h",
  payment_methods: ["pix", "credit_card"],
  redirect_url: "https://seusite.com/sucesso"
});
console.log(\`Link criado: \${link.url}\`);`,
  },
  'api-rest': {
    title: 'API REST Robusta',
    subtitle: 'Integração de alta performance.',
    desc: 'Checkout customizado direto na sua aplicação. Webhooks em tempo real com retentativa automática.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    imgAlt: 'Dashboard API analytics',
    code: `// Cobrança via Cartão de Crédito
const charge = await payflow.charges.create({
  amount: 25000,
  currency: "brl",
  payment_method: "credit_card",
  card: {
    number: "4532XXXXXXXX1234",
    holder: "Augusto F Ramos",
    exp_month: 12,
    exp_year: 2028,
    cvv: "321"
  }
});`,
  },
  'subscriptions': {
    title: 'Assinaturas Recorrentes',
    subtitle: 'Gerencie planos mensais ou anuais.',
    desc: 'Ideal para SaaS e clubes de assinatura. Retentativas inteligentes e upgrade/downgrade automático.',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
    imgAlt: 'Team collaboration SaaS',
    code: `// Criar Assinatura Recorrente
const sub = await payflow.subscriptions.create({
  customer_id: "cus_h8d2j8k93h",
  plan_id: "plan_saas_pro_yearly",
  trial_days: 7,
  billing_behavior: "charge_automatically",
  metadata: { department: "Marketing" }
});
console.log(\`Assinatura: \${sub.id}\`);`,
  },
}

const PLANS = [
  {
    name: 'Starter',
    monthly: 'Grátis',
    yearly: 'Grátis',
    desc: 'Perfeito para começar a testar a plataforma.',
    features: ['Até 50 transações/mês', 'Dashboard básico', 'Suporte por email', 'PIX e boleto', 'API REST sandbox', 'Documentação completa'],
    cta: 'Começar Grátis',
    popular: false,
  },
  {
    name: 'Professional',
    monthly: 'R$ 49',
    yearly: 'R$ 39',
    desc: 'Para negócios em crescimento que precisam de escala.',
    features: ['Transações ilimitadas', 'Split de pagamentos', 'PayShield Antifraude', 'Suporte prioritário 24/7', 'Relatórios avançados', 'Webhooks em tempo real', 'Até 5 usuários', 'API Produção'],
    cta: 'Assinar Agora',
    popular: true,
  },
  {
    name: 'Enterprise',
    monthly: 'R$ 299',
    yearly: 'R$ 239',
    desc: 'Solução completa para grandes operações.',
    features: ['Tudo do Professional', 'Gerente de conta dedicado', 'SLA personalizado', 'Taxas negociadas', 'Onboarding assistido', 'Integrações customizadas', 'Usuários ilimitados', 'Ambiente dedicado'],
    cta: 'Falar com Vendas',
    popular: false,
  },
]

const TESTIMONIALS = [
  { name: 'Carolina Mendes', role: 'CTO, TechRetail', quote: 'A PayFlow transformou nossa operação. Reduzimos custos de transação em 40% e a integração com PIX foi a mais rápida do mercado.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { name: 'Rafael Oliveira', role: 'Founder, SubscriBox', quote: 'O sistema de assinaturas recorrentes reduziu nosso churn em 25%. As retentativas inteligentes recuperaram milhares de reais em receita.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { name: 'Juliana Costa', role: 'CEO, MakPLace', quote: 'O split de pagamentos foi o diferencial para nosso marketplace. Dividir automaticamente entre 200+ vendedores nunca foi tão simples.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
]

const FAQ = [
  { q: 'Como funciona a ativação da conta?', a: 'A ativação é 100% digital. Cadastre-se no sandbox em menos de 2 minutos para testar. Para produção, preencha os dados da empresa e em poucas horas sua conta está ativa.' },
  { q: 'Quais são as taxas de transação?', a: 'PIX: R$ 0,49 por transação. Boleto: R$ 1,49 compensado. Cartão de crédito: a partir de 1,99% + R$ 0,40. Sem taxas fixas mensais no plano Starter.' },
  { q: 'A PayFlow possui proteção contra fraudes?', a: 'Sim, o PayShield usa IA com machine learning analisando 200+ pontos de dados em tempo real, bloqueando compras suspeitas com 99.7% de precisão.' },
  { q: 'Posso integrar em plataformas prontas?', a: 'Sim! Oferecemos plugins homologados para WooCommerce, Shopify, Magento, Nuvemshop e dezenas de outras plataformas. Sem código necessário.' },
  { q: 'Como funciona o suporte?', a: 'Starter: central de ajuda + email (24h). Professional: chat 24/7 + WhatsApp. Enterprise: gerente dedicado + SLA personalizado + onboarding assistido.' },
]

const FOOTER_COLS = [
  { title: 'Produto', links: ['Pagamentos', 'Split', 'Assinaturas', 'Link de Pagamento', 'PayShield'] },
  { title: 'Plataforma', links: ['API Referência', 'SDKs', 'Plugins', 'Status', 'Changelog'] },
  { title: 'Recursos', links: ['Documentação', 'Guia de Integração', 'Blog', 'Central de Ajuda', 'Comunidade'] },
  { title: 'Empresa', links: ['Sobre Nós', 'Carreiras', 'Parceiros', 'Imprensa', 'Contato'] },
]

const SOCIALS = [
  { name: 'GitHub', path: 'M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.4.6.1.82-.26.82-.58v-2.17c-3.34.72-4.04-1.4-4.04-1.4-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0112 5.8c1.02 0 2.05.14 3.01.4 2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z' },
  { name: 'Twitter', path: 'M23.44 4.83c-.8.37-1.67.62-2.57.73a4.5 4.5 0 001.97-2.48 9 9 0 01-2.85 1.09 4.5 4.5 0 00-7.65 4.1A12.76 12.76 0 011.64 3.16a4.5 4.5 0 001.39 6 4.5 4.5 0 01-2.03-.56v.06a4.5 4.5 0 003.6 4.41 4.5 4.5 0 01-2.03.08 4.5 4.5 0 004.2 3.12 9.02 9.02 0 01-5.59 1.93c-.36 0-.72-.02-1.07-.06A12.74 12.74 0 007.42 21c8.5 0 13.14-7.04 13.14-13.14 0-.2 0-.4-.01-.6a9.4 9.4 0 002.9-1.43z' },
  { name: 'LinkedIn', path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05a3.75 3.75 0 013.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .78 0 1.77v20.46C0 23.22.79 24 1.77 24h20.46c.98 0 1.77-.78 1.77-1.77V1.77C24 .78 23.22 0 22.23 0z' },
  { name: 'Instagram', path: 'M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.78 1.69 4.93 4.93.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.24-1.68 4.78-4.93 4.93-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.25-.15-4.78-1.69-4.93-4.93-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.37 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0-2.16C8.74 0 8.33.01 7.05.07 3.11.27.27 3.1.07 7.05.01 8.33 0 8.73 0 12s.01 3.67.07 4.95c.2 3.94 3.04 6.78 6.98 6.98 1.28.06 1.67.07 4.95.07s3.67-.01 4.95-.07c3.94-.2 6.78-3.04 6.98-6.98.06-1.28.07-1.67.07-4.95s-.01-3.67-.07-4.95C23.73 3.11 20.89.27 16.95.07 15.67.01 15.26 0 12 0zM12 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zm0 10.16a4 4 0 110-8 4 4 0 010 8zm6.41-11.41a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z' },
]

/* ═══════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════ */

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [billing, setBilling] = useState('monthly')
  const [activeFaq, setActiveFaq] = useState(null)
  const [activeTab, setActiveTab] = useState('payment-links')

  // Payment simulator state
  const [payAmount, setPayAmount] = useState('149,90')
  const [payName, setPayName] = useState('Mariana Silva')
  const [payEmail, setPayEmail] = useState('mariana@empresa.com')
  const [payStatus, setPayStatus] = useState('idle')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = useCallback((id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  const simulatePayment = (e) => {
    e.preventDefault()
    if (payStatus !== 'idle') return
    setPayStatus('processing')
    setTimeout(() => setPayStatus('success'), 2000)
  }

  const toggleFaq = (i) => setActiveFaq(activeFaq === i ? null : i)

  return (
    <div className="app">
      {/* ═══════ 1. NAV ═══════ */}
      <motion.nav
        className={`nav ${scrolled ? 'nav--scrolled' : ''}`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container nav__inner">
          <a onClick={() => scrollTo('hero')} className="nav__logo" style={{ cursor: 'pointer' }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#533afd" />
              <path d="M8 22V10h5.5c2.5 0 4.5 1.5 4.5 4.5s-2 4.5-4.5 4.5H12v3H8zm4-6h1.5c1.1 0 1.8-.7 1.8-1.8s-.7-1.7-1.8-1.7H12v3.5z" fill="white" />
            </svg>
            <span>PayFlow</span>
          </a>

          <div className="nav__links">
            {NAV_LINKS.map((l) => (
              <a key={l.href} onClick={() => scrollTo(l.href.slice(1))} className="nav__link">
                {l.label}
                <span className="nav__underline" />
              </a>
            ))}
            <motion.button
              className="btn btn--primary"
              onClick={() => scrollTo('contact')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Criar Conta
            </motion.button>
          </div>

          <button
            className={`nav__hamburger ${menuOpen ? 'is-active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            <span /><span /><span />
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="nav__mobile"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {NAV_LINKS.map((l) => (
                <a key={l.href} onClick={() => scrollTo(l.href.slice(1))}>{l.label}</a>
              ))}
              <button className="btn btn--primary" onClick={() => scrollTo('contact')}>Começar Agora</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ═══════ 2. HERO ═══════ */}
      <section id="hero" className="hero">
        <div className="hero__glow-1" /><div className="hero__glow-2" />

        <div className="container hero__content">
          <motion.div
            className="hero__badge"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="hero__badge-dot" />
            Processamento Instantâneo PIX & Cartão
          </motion.div>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Infraestrutura de pagamentos<br />
            <span className="hero__title-accent">elegante para quem quer crescer</span>
          </motion.h1>

          <motion.p
            className="hero__sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            Aceite cobranças online, automatize assinaturas recorrentes e faça splits de pagamento dinâmicos com a melhor taxa de conversão do mercado.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <motion.button
              className="btn btn--gradient btn--lg"
              onClick={() => scrollTo('contact')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Começar grátis
            </motion.button>
            <motion.button
              className="btn btn--ghost btn--lg"
              onClick={() => scrollTo('products')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Conhecer API
            </motion.button>
          </motion.div>
        </div>

        {/* Hero Interactive Preview */}
        <motion.div
          className="hero__preview"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="hero__preview-window">
            {/* Payment Form */}
            <div className="preview__form">
              <AnimatePresence mode="wait">
                {payStatus === 'idle' && (
                  <motion.form key="idle" onSubmit={simulatePayment}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="pf-logo">payflow_checkout</div>
                    <div className="pf-amount">R$ {payAmount}</div>
                    <div className="pf-plan">Plano SaaS Professional</div>

                    <div className="pf-field">
                      <label>Nome Completo</label>
                      <input type="text" value={payName} onChange={(e) => setPayName(e.target.value)} required />
                    </div>
                    <div className="pf-field">
                      <label>Email de Cobrança</label>
                      <input type="email" value={payEmail} onChange={(e) => setPayEmail(e.target.value)} required />
                    </div>
                    <div className="pf-row">
                      <div className="pf-field">
                        <label>Valor (R$)</label>
                        <input type="text" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
                      </div>
                      <div className="pf-field">
                        <label>Cartão</label>
                        <input type="text" value="•••• 4321" disabled />
                      </div>
                    </div>
                    <motion.button type="submit" className="btn btn--primary pf-pay"
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      Pagar com PayFlow
                    </motion.button>
                  </motion.form>
                )}

                {payStatus === 'processing' && (
                  <motion.div key="processing" className="pf-result"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="pf-spinner" />
                    <h4>Processando Pagamento...</h4>
                    <p>Criptografando dados e analisando riscos antifraude</p>
                  </motion.div>
                )}

                {payStatus === 'success' && (
                  <motion.div key="success" className="pf-result pf-success"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <div className="pf-check">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h4>Pagamento Aprovado!</h4>
                    <p>Transação tokenizada com sucesso via webhook</p>
                    <button className="btn btn--ghost btn--sm" onClick={() => setPayStatus('idle')}>
                      Simular Novamente
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Code Editor */}
            <div className="preview__code">
              <div className="pc-header">
                <span className="pc-dot red" /><span className="pc-dot yellow" /><span className="pc-dot green" />
                <span className="pc-title">payflow_payment.js</span>
              </div>
              <pre className="pc-editor"><code>{`// Inicializando checkout
const payflow = require("payflow")("pk_live_51M...");

const payment = await payflow.payments.create({
  amount: ${payAmount.replace(',', '')},
  currency: "brl",
  customer: {
    name: "${payName}",
    email: "${payEmail}"
  },
  metadata: { plano: "professional_saas" }
});

if (payment.status === "approved") {
  console.log("✓ Pagamento aprovado");
}`}</code></pre>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════ 3. SOCIAL PROOF ═══════ */}
      <section className="social">
        <div className="container social__inner">
          <span className="social__label">Trusted by +15,000 companies</span>
          <div className="social__logos">
            {PARTNERS.map((p, i) => (
              <div key={i} className="social__logo" title={p.name}>
                <svg viewBox="0 0 24 24" fill="currentColor" opacity="0.45">
                  <path d={p.svg} />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 4. FEATURES ═══════ */}
      <section id="features" className="section features">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__label">RECURSOS</span>
              <h2 className="section__title">Tudo que você precisa para cobrar e receber</h2>
              <p className="section__desc">Da integração simples à automação complexa, a PayFlow tem a ferramenta certa para cada etapa do seu negócio.</p>
            </div>
          </ScrollReveal>

          <motion.div
            className="features__grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {FEATURES.map((f, i) => (
              <motion.div key={i} className="feature__card" variants={staggerItem} whileHover={{ y: -6 }}>
                <div className="feature__card-glow" />
                <div className="feature__icon">
                  {f.icon === 'bolt' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>}
                  {f.icon === 'split' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="5" r="3" /><circle cx="5" cy="19" r="3" /><circle cx="19" cy="19" r="3" /><path d="M12 8v8M5 16l7-8 7 8" /></svg>}
                  {f.icon === 'loop' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 11-.57-8.38l5.67-5.67" /></svg>}
                  {f.icon === 'shield' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
                  {f.icon === 'code' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>}
                  {f.icon === 'chart' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg>}
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
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {STATS.map((s, i) => (
              <motion.div key={i} className="stats__card" variants={staggerItem}>
                <span className="stats__num"><AnimatedCounter end={s.value} suffix={s.suffix} /></span>
                <span className="stats__label">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ 6. PRODUCT SHOWCASE ═══════ */}
      <section id="products" className="section showcase">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__label">PRODUTOS</span>
              <h2 className="section__title">Uma plataforma, infinitas possibilidades</h2>
              <p className="section__desc">Escolha o produto ideal e integre em minutos com nossa API moderna e SDKs completos.</p>
            </div>
          </ScrollReveal>

          <div className="showcase__tabs">
            {Object.entries(PRODUCT_TABS).map(([key, tab]) => (
              <button
                key={key}
                className={`showcase__tab ${activeTab === key ? 'is-active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {tab.title}
                {activeTab === key && <motion.div className="showcase__tab-indicator" layoutId="tab-indicator" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="showcase__panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <div className="showcase__info">
                <h3>{PRODUCT_TABS[activeTab].subtitle}</h3>
                <p>{PRODUCT_TABS[activeTab].desc}</p>
                <div className="showcase__code">
                  <div className="showcase__code-header">
                    <span className="pc-dot red" /><span className="pc-dot yellow" /><span className="pc-dot green" />
                    <span>payflow_example.js</span>
                  </div>
                  <pre><code>{PRODUCT_TABS[activeTab].code}</code></pre>
                </div>
              </div>
              <div className="showcase__visual">
                <div className="showcase__glow" />
                <img
                  src={PRODUCT_TABS[activeTab].img}
                  alt={PRODUCT_TABS[activeTab].imgAlt}
                  loading="lazy"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════ 7. PRICING ═══════ */}
      <section id="pricing" className="section pricing">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__label">PREÇOS</span>
              <h2 className="section__title">Planos que crescem com você</h2>
              <p className="section__desc">Sem taxas escondidas. Cancele quando quiser. Todos os planos incluem suporte técnico.</p>
            </div>
          </ScrollReveal>

          <div className="pricing__toggle">
            <span className={billing === 'monthly' ? 'is-active' : ''} onClick={() => setBilling('monthly')}>Mensal</span>
            <button
              className={`pricing__toggle-track ${billing === 'yearly' ? 'is-yearly' : ''}`}
              onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
              aria-label="Alternar faturamento"
            >
              <motion.div className="pricing__toggle-thumb" layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
            </button>
            <span className={billing === 'yearly' ? 'is-active' : ''} onClick={() => setBilling('yearly')}>
              Anual <span className="pricing__badge">20% OFF</span>
            </span>
          </div>

          <div className="pricing__grid">
            {PLANS.map((plan, i) => (
              <motion.div
                key={i}
                className={`pricing__card ${plan.popular ? 'is-popular' : ''}`}
                variants={staggerItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                {plan.popular && <span className="pricing__popular-badge">Mais Popular</span>}
                <h3 className="pricing__name">{plan.name}</h3>
                <div className="pricing__price">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={billing}
                      className="pricing__value"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {billing === 'monthly' ? plan.monthly : plan.yearly}
                    </motion.span>
                  </AnimatePresence>
                  {plan.monthly !== 'Grátis' && <span className="pricing__period">/{billing === 'monthly' ? 'mês' : 'mês'}</span>}
                </div>
                <p className="pricing__desc">{plan.desc}</p>
                <ul className="pricing__features">
                  {plan.features.map((f, j) => (
                    <li key={j}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#15be53" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.button
                  className={`btn ${plan.popular ? 'btn--gradient' : 'btn--ghost'} btn--block`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 8. TESTIMONIALS ═══════ */}
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
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} className="testimonial__card" variants={staggerItem}>
                <div className="testimonial__stars">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} viewBox="0 0 24 24" fill="#f5a623" width="16" height="16">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="testimonial__quote">"{t.quote}"</p>
                <div className="testimonial__author">
                  <img src={t.avatar} alt={t.name} loading="lazy" />
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

      {/* ═══════ 9. FAQ ═══════ */}
      <section id="faq" className="section faq">
        <div className="container faq__container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__label">FAQ</span>
              <h2 className="section__title">Perguntas frequentes</h2>
              <p className="section__desc">Tire suas dúvidas sobre a PayFlow. Se precisar de mais informações, nosso time está pronto para ajudar.</p>
            </div>
          </ScrollReveal>

          <div className="faq__list">
            {FAQ.map((item, i) => (
              <motion.div
                key={i}
                className={`faq__item ${activeFaq === i ? 'is-open' : ''}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <button className="faq__question" onClick={() => toggleFaq(i)}>
                  <span>{item.q}</span>
                  <motion.svg
                    animate={{ rotate: activeFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      className="faq__answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
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

      {/* ═══════ 10. CTA ═══════ */}
      <section id="contact" className="cta">
        <div className="container cta__inner">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Pronto para transformar<br />seus pagamentos?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            Comece grátis hoje mesmo. Sem contrato, sem taxas escondidas. Integre em minutos.
          </motion.p>
          <motion.div
            className="cta__actions"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.button
              className="btn btn--white btn--lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Começar grátis
            </motion.button>
            <motion.button
              className="btn btn--ghost-white btn--lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Falar com vendas
            </motion.button>
          </motion.div>
        </div>
        <div className="cta__glow" />
      </section>

      {/* ═══════ 11. FOOTER ═══════ */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
              <rect width="32" height="32" rx="6" fill="#533afd" />
              <path d="M8 22V10h5.5c2.5 0 4.5 1.5 4.5 4.5s-2 4.5-4.5 4.5H12v3H8zm4-6h1.5c1.1 0 1.8-.7 1.8-1.8s-.7-1.7-1.8-1.7H12v3.5z" fill="white" />
            </svg>
            <div>
              <span className="footer__logo-text">PayFlow</span>
              <span className="footer__tagline">Plataforma moderna de pagamentos.</span>
            </div>
          </div>

          <div className="footer__grid">
            {FOOTER_COLS.map((col, i) => (
              <div key={i} className="footer__col">
                <h4>{col.title}</h4>
                {col.links.map((link, j) => (
                  <a key={j} href="#">{link}</a>
                ))}
              </div>
            ))}
          </div>

          <div className="footer__bottom">
            <span>© 2026 PayFlow. Todos os direitos reservados.</span>
            <div className="footer__socials">
              {SOCIALS.map((s, i) => (
                <a key={i} href="#" aria-label={s.name}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
