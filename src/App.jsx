import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import StatusStrip from './components/StatusStrip'
import Skills from './components/Skills'
import Work from './components/Work'
import Achievements from './components/Achievements'
import Contact from './components/Contact'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import { MailConfirmProvider } from './context/MailConfirm'
import { ResumeConfirmProvider } from './context/ResumeConfirm'

export default function App() {
  return (
    <MailConfirmProvider>
    <ResumeConfirmProvider>
      <div className="relative w-full">
        <div className="intro-veil" aria-hidden="true">
          <span />
        </div>
        <div className="liquid-bg" aria-hidden="true">
          <span className="b1" />
          <span className="b2" />
          <span className="b3" />
          <span className="b4" />
          <div className="grain" />
        </div>
        <ScrollProgress />
        <Nav />
        <main>
          <Hero />
          <About />
          <StatusStrip />
          <Skills />
          <Work />
          <Achievements />
          <Contact />
        </main>
        <BackToTop />
      </div>
    </ResumeConfirmProvider>
    </MailConfirmProvider>
  )
}