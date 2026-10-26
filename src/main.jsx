import { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { Aperture, ArrowDownRight, ArrowUp, ArrowUpRight, AtSign, BriefcaseBusiness, Check, ChevronDown, ExternalLink, Menu, Minus, Pause, Play, Plus, Volume2, X } from 'lucide-react'
import { projects, services, tools } from './data'
import measuredGrace from './assets/measured-grace.mp3'
import './styles.css'

gsap.registerPlugin(ScrollTrigger)

const categories = ['All', 'Photography', 'Editing', 'Color', 'Cinematics', 'Podcast']

function Reveal({ children, className = '', delay = 0 }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}

function App() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeProject, setActiveProject] = useState(null)
  const [activeService, setActiveService] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [gradePosition, setGradePosition] = useState(57)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [formState, setFormState] = useState('idle')
  const [formValues, setFormValues] = useState({ name: '', email: '', whatsapp: '', service: '', message: '' })
  const pageRef = useRef(null)
  const heroMediaRef = useRef(null)
  const musicRef = useRef(null)
  const spotlightX = useMotionValue('50%')
  const spotlightY = useMotionValue('20%')
  const springX = useSpring(spotlightX, { stiffness: 55, damping: 24 })
  const springY = useSpring(spotlightY, { stiffness: 55, damping: 24 })

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ duration: reducedMotion ? 0 : 1.1, smoothWheel: !reducedMotion })
    // Lenis owns the smooth-scroll position, so subscribe to it directly.
    // Relying only on the native window scroll event can leave this control
    // hidden even after the visitor has reached the bottom of the page.
    const updateBackToTopFromLenis = ({ scroll }) => setShowBackToTop(scroll > 400)
    lenis.on('scroll', updateBackToTopFromLenis)
    updateBackToTopFromLenis({ scroll: lenis.scroll })
    let frame
    const raf = (time) => { lenis.raf(time); frame = requestAnimationFrame(raf) }
    frame = requestAnimationFrame(raf)
    const ctx = gsap.context(() => {
      if (reducedMotion) return
      gsap.to(heroMediaRef.current, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.utils.toArray('.service-row').forEach((row, index) => gsap.from(row, { x: index % 2 ? 30 : -30, opacity: 0, duration: 0.8, scrollTrigger: { trigger: row, start: 'top 88%' } }))
    }, pageRef)
    return () => { cancelAnimationFrame(frame); lenis.off('scroll', updateBackToTopFromLenis); lenis.destroy(); ctx.revert() }
  }, [])

  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') setActiveProject(null) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    const updateBackToTopVisibility = () => setShowBackToTop((window.scrollY || document.documentElement.scrollTop) > 400)
    updateBackToTopVisibility()
    window.addEventListener('scroll', updateBackToTopVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateBackToTopVisibility)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })

  const toggleMusic = async () => {
    const music = musicRef.current
    if (!music) return
    if (music.paused) {
      try { await music.play(); setIsMusicPlaying(true) } catch { setIsMusicPlaying(false) }
    } else {
      music.pause()
      setIsMusicPlaying(false)
    }
  }

  const filteredProjects = useMemo(() => activeCategory === 'All' ? projects : projects.filter((project) => project.category === activeCategory), [activeCategory])

  const updateForm = (event) => setFormValues({ ...formValues, [event.target.name]: event.target.value })
  const submitForm = async (event) => {
    event.preventDefault()
    if (!formValues.name || !formValues.email || !formValues.service || !formValues.message) { setFormState('error'); return }
    const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT
    if (endpoint) {
      try { await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formValues) }); setFormState('success') } catch { setFormState('error') }
    } else {
      const subject = encodeURIComponent(`Project inquiry from ${formValues.name}`)
      const body = encodeURIComponent(`Service: ${formValues.service}\nWhatsApp: ${formValues.whatsapp}\n\n${formValues.message}`)
      window.location.href = `mailto:bysahil.studio@gmail.com?subject=${subject}&body=${body}`
      setFormState('success')
    }
  }

  return (
    <main ref={pageRef} style={{ '--spot-x': springX, '--spot-y': springY }} onPointerMove={(event) => { spotlightX.set(`${(event.clientX / window.innerWidth) * 100}%`); spotlightY.set(`${(event.clientY / window.innerHeight) * 100}%`) }}>
      <audio ref={musicRef} src={measuredGrace} loop preload="metadata" volume={0.03} onEnded={() => setIsMusicPlaying(false)} />
      <div className="grain" aria-hidden="true" />
      <div className="ambient-light" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="M Sahil home"><span className="mark">M</span><span>M Sahil<span className="dot">.</span></span></a>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
          {['work', 'services', 'tools', 'contact'].map((item) => <a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)}>{item}</a>)}
        </nav>
        <a className="header-cta" href="#contact">Let’s talk <ArrowUpRight size={15} /></a>
        <button className="menu-button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </header>

      <button className={isMusicPlaying ? 'music-toggle playing' : 'music-toggle'} type="button" onClick={toggleMusic} aria-label={isMusicPlaying ? 'Pause background music' : 'Play background music'} aria-pressed={isMusicPlaying}>
        {isMusicPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}<span>{isMusicPlaying ? 'Pause music' : 'Play music'}</span><Volume2 size={14} />
      </button>

      <section className="hero section-pad" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> Visual artist / post-production</p>
          <h1>Images with<br /><em>aftertaste.</em></h1>
          <p className="hero-intro">I shape light, color, and motion into work that stays with you long after the screen goes dark.</p>
          <div className="hero-actions"><a className="button button-fill" href="#work">Explore the work <ArrowDownRight size={17} /></a><a className="text-link" href="#services">What I do <ArrowDownRight size={15} /></a></div>
        </div>
        <div className="hero-visual">
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
          <div className="hero-image-wrap" ref={heroMediaRef}><img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=1300&q=90" alt="Portrait in a cinematic shadow" /><div className="hero-image-wash" /></div>
          <div className="hero-index"><span>01</span><Minus size={22} /><span>04</span></div>
          <div className="scroll-cue"><span>Scroll to explore</span><ArrowDownRight size={16} /></div>
        </div>
      </section>

      <div className="ticker" aria-label="Services marquee"><div className="ticker-track">{[...services, ...services].map((service, index) => <span key={`${service.id}-${index}`}>{service.title}<i>✦</i></span>)}</div></div>

      <section className="intro section-pad"><Reveal><div className="section-kicker"><span>01</span><span>Perspective</span></div></Reveal><div className="intro-grid"><Reveal><h2>Make it feel<br /><em>like something.</em></h2></Reveal><Reveal delay={0.1}><div className="intro-copy"><p>Good visuals do more than look polished. They create a temperature, pull you closer, and give a story somewhere to live.</p><a className="text-link" href="#contact">Start a conversation <ArrowUpRight size={15} /></a></div></Reveal></div></section>

      <section className="work section-pad" id="work"><Reveal><div className="section-heading"><div><div className="section-kicker"><span>02</span><span>Selected work</span></div><h2>A few things<br /><em>made recently.</em></h2></div><p className="heading-note">A moving collection of frames, grades, and stories. More coming as the archive grows.</p></div></Reveal><div className="filter-bar" role="tablist" aria-label="Filter portfolio">{categories.map((category) => <button key={category} className={activeCategory === category ? 'filter active' : 'filter'} onClick={() => setActiveCategory(category)} role="tab" aria-selected={activeCategory === category}>{category}</button>)}</div><motion.div layout className="project-grid">{filteredProjects.map((project, index) => <motion.button layout key={project.slug} className={`project-card card-${index % 3}`} onClick={() => setActiveProject(project)} whileHover={{ y: -8 }} transition={{ duration: 0.35 }}><span className="project-image"><img src={project.image} alt={project.title} loading="lazy" /><span className="project-overlay"><ExternalLink size={18} /></span></span><span className="project-meta"><span><strong>{project.title}</strong><small>{project.service}</small></span><span className="project-year">{project.year}</span></span></motion.button>)}</motion.div></section>

      <section className="services section-pad" id="services"><Reveal><div className="section-heading"><div><div className="section-kicker"><span>03</span><span>Capabilities</span></div><h2>From first frame<br /><em>to final cut.</em></h2></div><p className="heading-note">A flexible creative practice built for images, films, brands, and the details that make them yours.</p></div></Reveal><div className="service-list">{services.map((service) => <button className={`service-row ${activeService === service.id ? 'expanded' : ''}`} key={service.id} onClick={() => setActiveService(activeService === service.id ? null : service.id)}><span className="service-number">{service.number}</span><span className="service-title">{service.title}</span><span className="service-kind">{service.kind}</span><span className="service-detail">{service.text}</span><span className="service-toggle">{activeService === service.id ? <Minus size={20} /> : <Plus size={20} />}</span></button>)}</div></section>

      <section className="grade-section section-pad"><div className="grade-frame"><Reveal><div className="grade-copy"><div className="section-kicker"><span>04</span><span>Color lab</span></div><h2>Color is<br /><em>character.</em></h2><p>Small shifts can change the whole emotional register. Explore the difference between a clean capture and a considered finish.</p><a className="button button-outline" href="#contact">Grade something <ArrowUpRight size={16} /></a></div></Reveal><Reveal delay={0.15}><div className="grade-slider"><div className="grade-image grade-before"><img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1100&q=85" alt="Portrait before color grade" /></div><div className="grade-image grade-after" style={{ width: `${gradePosition}%` }}><img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1100&q=85" alt="Portrait after color grade" /></div><div className="grade-divider" style={{ left: `${gradePosition}%` }} aria-hidden="true"><span>↔</span></div><input className="grade-range" type="range" min="8" max="92" value={gradePosition} onChange={(event) => setGradePosition(event.target.value)} aria-label="Compare before and after color grade" /><span className="grade-label before-label">Before</span><span className="grade-label after-label">After</span></div></Reveal></div></section>

      <section className="showreel section-pad" id="showreel"><Reveal><div className="showreel-card"><img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=85" alt="Cinematic video still" /><div className="showreel-scrim" /><div className="showreel-top"><span>05 / Showreel</span><span>2023 — 2025</span></div><div className="showreel-center"><button className="play-button" onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? 'Pause showreel preview' : 'Play showreel preview'}>{isPlaying ? <Minus size={25} /> : <Play size={25} fill="currentColor" />}</button><span>{isPlaying ? 'Preview active' : 'Play the reel'}</span></div><div className="showreel-bottom"><span>Light / movement / story</span><span>Sound on preferred</span></div>{isPlaying && <div className="reel-status"><span /> Preview mode — connect your reel video in content data</div>}</div></Reveal></section>

      <section className="tools section-pad" id="tools"><Reveal><div className="section-heading"><div><div className="section-kicker"><span>06</span><span>Creative stack</span></div><h2>The tools behind<br /><em>the mood.</em></h2></div><p className="heading-note">The right tool is invisible in the final image. The feeling is what remains.</p></div></Reveal><div className="tool-grid">{tools.map((tool, index) => <Reveal key={tool.name} delay={index * 0.04}><article className="tool-card"><span className="tool-tag">{tool.tag}</span><div className="tool-icon">{tool.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><h3>{tool.name}</h3><p>{tool.text}</p><div className="tool-service-list">{tool.services.map((item) => <span key={item}>{item}</span>)}</div></article></Reveal>)}</div></section>

      <section className="contact section-pad" id="contact"><div className="contact-shell"><Reveal><div className="section-kicker"><span>07</span><span>Let’s make something</span></div><h2>Have a feeling<br /><em>in mind?</em></h2><p>Tell me what you’re building, what it needs to say, and when it needs to exist. I’ll get back to you with a useful next step.</p><div className="contact-direct"><a href="mailto:bysahil.studio@gmail.com">bysahil.studio@gmail.com <ArrowUpRight size={16} /></a><a href="https://wa.me/923000000000" target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={16} /></a></div></Reveal><Reveal delay={0.1}><form className="contact-form" onSubmit={submitForm} noValidate><label>Your name<input name="name" value={formValues.name} onChange={updateForm} placeholder="M Sahil" /></label><label>Email address<input type="email" name="email" value={formValues.email} onChange={updateForm} placeholder="you@example.com" /></label><label>WhatsApp / phone<input name="whatsapp" value={formValues.whatsapp} onChange={updateForm} placeholder="Optional" /></label><label>What do you need?<div className="select-wrap"><select name="service" value={formValues.service} onChange={updateForm}><option value="">Select a service</option>{services.map((service) => <option key={service.id}>{service.title}</option>)}</select><ChevronDown size={16} /></div></label><label className="full-field">A little about the project<textarea name="message" value={formValues.message} onChange={updateForm} placeholder="The idea, the feeling, the deadline..." rows="4" /></label><button className="button button-fill form-submit" type="submit">{formState === 'success' ? <>Message ready <Check size={16} /></> : <>Send inquiry <ArrowUpRight size={16} /></>}</button>{formState === 'error' && <span className="form-message error">Please complete the required fields.</span>}{formState === 'success' && <span className="form-message">Your email draft is ready — thank you.</span>}</form></Reveal></div></section>

      <footer className="site-footer"><div className="footer-top"><a className="wordmark" href="#top"><span className="mark">M</span><span>M Sahil<span className="dot">.</span></span></a><p>Photography, post-production<br />and moving images.</p><div className="socials"><a href="mailto:bysahil.studio@gmail.com" aria-label="Email M Sahil"><AtSign size={18} /></a><a href="#contact" aria-label="Project inquiry"><BriefcaseBusiness size={18} /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} M Sahil</span><span>Made with intention</span><a href="#top">Back to top <ArrowUpRight size={14} /></a></div></footer>

      <AnimatePresence>{showBackToTop && <motion.button className="back-to-top" type="button" onClick={scrollToTop} aria-label="Back to top" aria-describedby="back-to-top-tooltip" initial={{ opacity: 0, y: 12, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .9 }} transition={{ duration: .2 }}><Aperture size={22} strokeWidth={1.4} aria-hidden="true" /><ArrowUp className="back-to-top-arrow" size={10} strokeWidth={2.5} aria-hidden="true" /><span className="back-to-top-tooltip" id="back-to-top-tooltip" role="tooltip">Back to top</span></motion.button>}</AnimatePresence>

      <AnimatePresence>{activeProject && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveProject(null)}><motion.div className="project-modal" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={activeProject.title}><button className="modal-close" onClick={() => setActiveProject(null)} aria-label="Close project"><X size={20} /></button><img src={activeProject.image} alt={activeProject.title} /><div className="modal-copy"><span className="eyebrow">{activeProject.category} / {activeProject.year}</span><h2>{activeProject.title}</h2><p>{activeProject.description}</p><a className="text-link" href="#contact" onClick={() => setActiveProject(null)}>Work on something similar <ArrowUpRight size={15} /></a></div></motion.div></motion.div>}</AnimatePresence>
    </main>
  )
}

export default App

createRoot(document.getElementById('root')).render(<App />)
