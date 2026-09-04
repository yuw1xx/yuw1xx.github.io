import GridLines from './components/GridLines'
import Sidebar from './components/Sidebar'
import Hero from './components/Hero'
import Info from './components/Info'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import './index.css'

export default function App() {
  return (
    <>
      <GridLines />
      <div className="shell">
        <Sidebar />
        <main className="content">
          <Hero />
          <Info />
          <Skills />
          <Projects />
          <Contact />
        </main>
      </div>
    </>
  )
}
