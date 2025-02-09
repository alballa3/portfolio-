import Navbar from "@/components/pages/index/navbar"
import Hero from "@/components/pages/index/hero"
import Projects from "@/components/pages/index/projects"
import Skills from "@/components/pages/index/skills"
import Contact from "@/components/pages/index/contact"
import Footer from "@/components/pages/index/footer"
import { BackToTop } from "@/components/pages/index/back-to-top"
import About from "@/components/pages/index/aboutus"

export default function Home() {
  return (  
      
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Projects />
        <Skills />
        <About/>
        <Contact />
        <Footer />
      </div>
      <BackToTop />
      
    </div>
  )
}

