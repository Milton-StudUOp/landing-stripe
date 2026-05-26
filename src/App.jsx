import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleFaq = (index) => setActiveFaq(activeFaq === index ? null : index)

  const scrollToSection = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app">
      {/* NAV */}
      <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => scrollToSection('hero')}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#533afd"/>
              <path d="M10 22V10h4.5c3 0 5.5 2 5.5 5.5s-2.5 5.5-5.5 5.5H14v2h-4zm4-4h.5c1.5 0 2.5-1 2.5-2.5S16 13 14.5 13H14v5z" fill="white"/>
            </svg>
            <span className="nav-logo-text">PayFlow</span>
          </div>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          </button>
          <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
            <a onClick={() => scrollToSection('features')}>Recursos</a>
            <a onClick={() => scrollToSection('products')}>Produtos</a>
            <a onClick={() => scrollToSection('pricing')}>Preços</a>
            <a onClick={() => scrollToSection('faq')}>FAQ</a>
            <a onClick={() => scrollToSection('contact')}>Contato</a>
            <button className="btn btn-primary btn-nav">Começar grátis</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="hero">
        <div className="container">
          <div className="hero-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <span>Processamento em tempo real</span>
          </div>
          <h1 className="hero-title">Pagamentos inteligentes<br/>para o seu negócio</h1>
          <p className="hero-subtitle">
            Aceite pagamentos online com a plataforma mais moderna do mercado. 
            Taxas transparentes, aprovação instantânea e integração em minutos.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg">Criar conta gratuita</button>
            <button className="btn btn-ghost btn-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Ver demonstração
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">+50k</span>
              <span className="stat-label">Empresas ativas</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">R$ 2B+</span>
              <span className="stat-label">Processados por mês</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime garantido</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-label">Recursos</div>
          <h2 className="section-title">Tudo que você precisa para vender mais</h2>
          <p className="section-desc">
            Uma plataforma completa de pagamentos com as melhores ferramentas 
            para acelerar o crescimento do seu negócio.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>
                </svg>
              </div>
              <h3>Checkout Otimizado</h3>
              <p>Taxa de conversão de até 94% com nosso checkout em uma página. 
              Design responsivo e suporte a todos os métodos de pagamento.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>Segurança Total</h3>
              <p>Certificação PCI DSS Level 1, criptografia ponta a ponta e 
              proteção antifraude com machine learning em tempo real.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3>Analytics Poderosos</h3>
              <p>Dashboard completo com métricas em tempo real, relatórios 
              exportáveis e insights acionáveis para seu negócio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="products">
        <div className="container">
          <div className="section-label">Produtos</div>
          <h2 className="section-title">Soluções completas de pagamento</h2>
          <p className="section-desc">
            Da loja virtual ao marketplace, temos a solução ideal para cada 
            modelo de negócio.
          </p>

          <div className="product-row">
            <div className="product-content">
              <div className="product-icon-wrap" style={{background: '#ede9fe'}}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <h3>Link de Pagamento</h3>
              <p>Cobre seus clientes com um link simples de compartilhar. 
              Ideal para vendas por WhatsApp, redes sociais e email. 
              Criação em segundos sem precisar de site.</p>
              <ul className="product-features">
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Compartilhamento instantâneo
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  PIX, cartão e boleto
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Personalização da página
                </li>
              </ul>
            </div>
            <div className="product-visual">
              <div className="product-card-preview">
                <div className="preview-header">
                  <div className="preview-dot"></div>
                  <div className="preview-dot"></div>
                  <div className="preview-dot"></div>
                </div>
                <div className="preview-body">
                  <div className="preview-price">R$ 149,90</div>
                  <div className="preview-label">Curso Online Completo</div>
                  <div className="preview-divider"></div>
                  <div className="preview-qr">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                      <rect x="2" y="2" width="24" height="24" rx="2" fill="#533afd" fillOpacity="0.15" stroke="#533afd" strokeWidth="1.5"/>
                      <rect x="8" y="8" width="4" height="4" rx="0.5" fill="#533afd"/>
                      <rect x="18" y="8" width="4" height="4" rx="0.5" fill="#533afd"/>
                      <rect x="8" y="18" width="4" height="4" rx="0.5" fill="#533afd"/>
                      <rect x="34" y="2" width="24" height="24" rx="2" fill="#533afd" fillOpacity="0.15" stroke="#533afd" strokeWidth="1.5"/>
                      <rect x="40" y="8" width="4" height="4" rx="0.5" fill="#533afd"/>
                      <rect x="50" y="8" width="4" height="4" rx="0.5" fill="#533afd"/>
                      <rect x="40" y="18" width="4" height="4" rx="0.5" fill="#533afd"/>
                      <rect x="50" y="18" width="4" height="4" rx="0.5" fill="#533afd"/>
                      <rect x="2" y="34" width="24" height="24" rx="2" fill="#533afd" fillOpacity="0.15" stroke="#533afd" strokeWidth="1.5"/>
                      <rect x="8" y="40" width="4" height="4" rx="0.5" fill="#533afd"/>
                      <rect x="18" y="40" width="4" height="4" rx="0.5" fill="#533afd"/>
                      <rect x="8" y="50" width="4" height="4" rx="0.5" fill="#533afd"/>
                      <rect x="34" y="34" width="10" height="10" rx="1" fill="none" stroke="#533afd" strokeWidth="1.5"/>
                      <rect x="48" y="34" width="10" height="10" rx="1" fill="none" stroke="#533afd" strokeWidth="1.5"/>
                      <rect x="34" y="48" width="10" height="10" rx="1" fill="none" stroke="#533afd" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <button className="btn btn-primary" style={{padding:'10px 28px',fontSize:'14px'}}>Pagar agora</button>
                </div>
              </div>
            </div>
          </div>

          <div className="product-row product-row-reverse">
            <div className="product-content">
              <div className="product-icon-wrap" style={{background: '#ede9fe'}}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <h3>API de Pagamentos</h3>
              <p>Integração completa via API REST para desenvolvedores. 
              Documentação clara, SDKs em 8 linguagens e sandbox para testes.</p>
              <ul className="product-features">
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Webhooks em tempo real
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  SDKs: JS, Python, Go, PHP, Ruby, Java, C#, Swift
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Split de pagamentos
                </li>
              </ul>
            </div>
            <div className="product-visual">
              <div className="code-block">
                <div className="code-header">
                  <span className="code-lang">JavaScript</span>
                  <div className="code-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
<pre className="code-content">{`import PayFlow from 'payflow'

const payflow = new PayFlow('sk_live_...')

const payment = await payflow.payments.create({
  amount: 14990,
  currency: 'brl',
  payment_method: ['pix', 'card'],
  customer: {
    name: 'João Silva',
    email: 'joao@email.com'
  }
})

console.log(payment.id)
`}</pre>
              <span className="code-comment">// PAY-8a7b3c...</span></div>
              </div>
            </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="container">
          <div className="section-label">Depoimentos</div>
          <h2 className="section-title">O que nossos clientes dizem</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {'★★★★★'.split('').map((s,i) => <span key={i} className="star">{s}</span>)}
              </div>
              <p className="testimonial-quote">
                "Migrar para a PayFlow foi a melhor decisão. Nossa taxa de 
                aprovação subiu 23% e a integração levou menos de um dia."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{background:'#533afd'}}>LS</div>
                <div>
                  <strong>Lucas Santos</strong>
                  <span>CTO, ShopNow</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {'★★★★★'.split('').map((s,i) => <span key={i} className="star">{s}</span>)}
              </div>
              <p className="testimonial-quote">
                "O dashboard de analytics transformou a forma como enxergamos 
                nossas vendas. Dados claros que nos ajudam a crescer."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{background:'#059669'}}>AM</div>
                <div>
                  <strong>Ana Martins</strong>
                  <span>CEO, BeautyStore</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {'★★★★★'.split('').map((s,i) => <span key={i} className="star">{s}</span>)}
              </div>
              <p className="testimonial-quote">
                "Suporte excepcional e a API mais bem documentada que já usei. 
                Recomendo para qualquer empresa que queira profissionalizar 
                seus pagamentos."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{background:'#d97706'}}>PR</div>
                <div>
                  <strong>Pedro Rocha</strong>
                  <span>Desenvolvedor Lead, TechLab</span>
                </div>
              </div>
            </div>
          </div>
          <div className="testimonial-logos">
            <span className="logo-placeholder">shopnow</span>
            <span className="logo-placeholder">beautystore</span>
            <span className="logo-placeholder">techlab</span>
            <span className="logo-placeholder">fitclub</span>
            <span className="logo-placeholder">educa+</span>
            <span className="logo-placeholder">greenbox</span>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricing">
        <div className="container">
          <div className="section-label">Preços</div>
          <h2 className="section-title">Planos para todos os tamanhos</h2>
          <p className="section-desc">
            Comece grátis e escale conforme seu negócio cresce. Sem taxas 
            escondidas.
          </p>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-badge">Comece grátis</div>
              <h3>Starter</h3>
              <div className="pricing-amount">
                <span className="pricing-currency">R$</span>
                <span className="pricing-value">0</span>
                <span className="pricing-period">/mês</span>
              </div>
              <p className="pricing-desc">Perfeito para quem está começando</p>
              <ul className="pricing-features">
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Até 100 transações/mês
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Checkout básico
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  PIX e boleto
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Suporte por email
                </li>
              </ul>
              <button className="btn btn-ghost btn-block">Começar grátis</button>
            </div>

            <div className="pricing-card pricing-featured">
              <div className="pricing-badge pricing-badge-featured">Mais popular</div>
              <h3>Professional</h3>
              <div className="pricing-amount">
                <span className="pricing-currency">R$</span>
                <span className="pricing-value">97</span>
                <span className="pricing-period">/mês</span>
              </div>
              <p className="pricing-desc">Para negócios em crescimento</p>
              <ul className="pricing-features">
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Até 5.000 transações/mês
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Checkout completo
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  PIX, cartão e boleto
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Analytics avançados
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Suporte prioritário
                </li>
              </ul>
              <button className="btn btn-primary btn-block">Assinar agora</button>
            </div>

            <div className="pricing-card">
              <div className="pricing-badge">Para grandes volumes</div>
              <h3>Enterprise</h3>
              <div className="pricing-amount">
                <span className="pricing-currency">R$</span>
                <span className="pricing-value">297</span>
                <span className="pricing-period">/mês</span>
              </div>
              <p className="pricing-desc">Solução personalizada</p>
              <ul className="pricing-features">
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Transações ilimitadas
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  API completa + SDKs
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Todos os métodos
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  SLA 99.99%
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#533afd" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Gerente de conta dedicado
                </li>
              </ul>
              <button className="btn btn-ghost btn-block">Falar com vendas</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="faq">
        <div className="container">
          <div className="section-label">FAQ</div>
          <h2 className="section-title">Perguntas frequentes</h2>
          <div className="faq-list">
            {[
              {
                q: 'Quanto tempo leva para começar a usar?',
                a: 'Você pode criar sua conta gratuita em menos de 2 minutos. A integração do checkout leva em média 30 minutos com nosso plugin ou algumas horas via API, dependendo da complexidade do seu projeto.'
              },
              {
                q: 'Quais formas de pagamento são aceitas?',
                a: 'Aceitamos PIX (com aprovação instantânea), cartões de crédito e débito (Visa, Mastercard, Elo, American Express), boleto bancário e carteiras digitais. Todos com a maior taxa de aprovação do mercado.'
              },
              {
                q: 'Como funciona a taxa de processamento?',
                a: 'Nossas taxas são transparentes: a partir de 1.99% por transação no cartão de crédito. PIX tem taxa fixa de R$ 0,49. Boleto tem taxa de R$ 1,49. Sem mensalidade no plano Starter.'
              },
              {
                q: 'O recebimento é instantâneo?',
                a: 'PIX cai na hora, 24h por dia. Cartão de crédito tem liquidação em D+14 (recebível em até 2 dias úteis com antecipação). Boleto é compensado em até 2 dias úteis após o pagamento.'
              },
              {
                q: 'Posso testar antes de contratar?',
                a: 'Sim! Oferecemos um ambiente de sandbox completo para testes e o plano Starter gratuito para você experimentar todos os recursos antes de decidir migrar para um plano pago.'
              }
            ].map((item, i) => (
              <div key={i} className={`faq-item ${activeFaq === i ? 'faq-active' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(i)}>
                  <span>{item.q}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`faq-chevron ${activeFaq === i ? 'faq-chevron-open' : ''}`}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2 className="cta-title">Pronto para transformar seus pagamentos?</h2>
            <p className="cta-desc">Crie sua conta em menos de 2 minutos. Sem cartão de crédito.</p>
            <button className="btn btn-primary btn-lg">Criar conta gratuita →</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col footer-brand">
              <div className="footer-logo">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="#533afd"/>
                  <path d="M10 22V10h4.5c3 0 5.5 2 5.5 5.5s-2.5 5.5-5.5 5.5H14v2h-4zm4-4h.5c1.5 0 2.5-1 2.5-2.5S16 13 14.5 13H14v5z" fill="white"/>
                </svg>
                <span>PayFlow</span>
              </div>
              <p className="footer-desc">
                Plataforma moderna de pagamentos para acelerar o crescimento 
                do seu negócio.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>
                </a>
                <a href="#" className="social-link" aria-label="YouTube">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9.75 15.02l6.5-3.03-6.5-3v6.03zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm8 10c0 4.41-3.59 8-8 8s-8-3.59-8-8 3.59-8 8-8 8 3.59 8 8z"/></svg>
                </a>
                <a href="#" className="social-link" aria-label="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Produto</h4>
              <a href="#">Checkout</a>
              <a href="#">Link de pagamento</a>
              <a href="#">API</a>
              <a href="#">PIX</a>
              <a href="#">Assinaturas</a>
            </div>
            <div className="footer-col">
              <h4>Empresa</h4>
              <a href="#">Sobre nós</a>
              <a href="#">Carreiras</a>
              <a href="#">Blog</a>
              <a href="#">Parceiros</a>
              <a href="#">Imprensa</a>
            </div>
            <div className="footer-col">
              <h4>Suporte</h4>
              <a href="#">Central de ajuda</a>
              <a href="#">Documentação</a>
              <a href="#">Status</a>
              <a href="#">Contato</a>
              <a href="#">Privacidade</a>
            </div>
            <div className="footer-col">
              <h4>Contato</h4>
              <div className="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>oi@payflow.com.br</span>
              </div>
              <div className="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                <span>(11) 9999-8888</span>
              </div>
              <div className="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Av. Paulista, 1000<br/>São Paulo - SP</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 PayFlow Tecnologia Ltda. Todos os direitos reservados.</p>
            <div className="footer-bottom-links">
              <a href="#">Termos de uso</a>
              <a href="#">Privacidade</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App