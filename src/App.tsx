import ReactiveBackground from './components/ReactiveBackground'
import Shapes from './components/Shapes'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import './index.css'

export default function App() {
  return (
    <>
      <ReactiveBackground />
      <Shapes />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>
  )
}
