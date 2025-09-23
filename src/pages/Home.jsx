// Home = Hero + Marquee + Brands + About
import React from "react";
import Hero from "../components/ui/Hero";
import Marquee from "../components/ui/Marquee";
import Brands from "../components/ui/Brands";
import About from "../components/ui/About";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Brands />
      <About />
    </>
  );
}
