// import React, { useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { BRANDS } from "./brandsData";

// // UI components
// import Header from "./components/ui/Header";
// import Footer from "./components/ui/Footer";
// import ProgressCircle from "./components/ui/ProgressCircle";
// import About from "./components/ui/About";
// import Hero from "./components/ui/Hero";
// import Brands from "./components/ui/Brands";
// import Marquee from "./components/ui/Marquee"; // ⬅️ nuevo

// if (typeof window !== "undefined" && gsap && !gsap.core.globals()["ScrollTrigger"]) {
//   gsap.registerPlugin(ScrollTrigger);
// }

// const FEATHER_ACCENT = {
//   hex: "#B79C7B",
//   rgb: "183,156,123",
//   spot: "rgba(183,156,123,.18)",
//   spotStrong: "rgba(183,156,123,.28)",
// };

// const NOISE_BG = `url("data:image/svg+xml,${encodeURIComponent(
//   '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.6"/></svg>'
// )}")`;

// export default function HoldingLandingGSAP() {
//   const rootRef = useRef(null);

//   return (
//     <main
//       ref={rootRef}
//       className="min-h-svh bg-neutral-950 text-neutral-100 antialiased selection:bg-white/20"
//       style={{ ["--accent"]: FEATHER_ACCENT.hex, ["--accent-rgb"]: FEATHER_ACCENT.rgb }}
//     >
//       {/* noise */}
//       <div className="pointer-events-none fixed inset-0 z-0" style={{ backgroundImage: NOISE_BG, opacity: 0.06 }} />

//       <Header brand="737LAB" links={[{ label: "Marcas", href: "#brands" }, { label: "Nosotros", href: "#about" }]} />
//       <ProgressCircle />
//       <Hero />

//       {/* MARQUEE componetizado */}
//       <Marquee
//         items={BRANDS.map((b) => b.name)}
//         speed={20}
//         direction="left"
//         gapClass="gap-10 md:gap-16"
//       />

//       {/* BRANDS componetizado */}
//       <Brands />

//       {/* ABOUT */}
//       <About />

//       <Footer brand="737LAB" />
//     </main>
//   );
// }
