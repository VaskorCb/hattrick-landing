import { BackgroundFx } from "@/components/BackgroundFx";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { PlayerSearch } from "@/components/sections/PlayerSearch";
import { LogosBar } from "@/components/sections/LogosBar";
import { Stats } from "@/components/sections/Stats";
import { Problem } from "@/components/sections/Problem";
import { Features } from "@/components/sections/Features";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <BackgroundFx />
      <Navbar />
      <main className="relative">
        <Hero />
        <PlayerSearch />
        <LogosBar />
        <Stats />
        <Problem />
        <Features />
        <Pricing />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
