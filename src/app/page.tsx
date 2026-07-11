import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import BlogSection from "@/components/sections/BlogSection";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import VisitorCounter from "@/components/premium/VisitorCounter";
import GitHubContributions from "@/components/premium/GitHubContributions";

export default function Home() {
  return (
    <>
      <VisitorCounter />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Services />
      <Testimonials />
      <GitHubContributions />
      <BlogSection />
      <Contact />
      <Footer />
    </>
  );
}
