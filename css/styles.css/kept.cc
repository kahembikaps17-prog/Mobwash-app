body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: #8091a3a1; /* Elegant off-white base */

  /* THE BRAND MAPPING: Mobwash + Laundry Icons */
  background-image:
    url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23919eab' fill-opacity='0.8' font-family='Arial, sans-serif' font-size='8'%3E%3Ctext x='10' y='20'%3EMobwash%3C/text%3E%3Cpath d='M80 15h10v10H80z' opacity='0.5'/%3E%3C!-- Washing Machine Icon --%3E%3Ccircle cx='85' cy='20' r='3' fill='none' stroke='%23919eab' stroke-width='0.5'/%3E%3C!-- Hanger Icon --%3E%3Cpath d='M30 70 l10 -10 l10 10' fill='none' stroke='%23919eab' stroke-width='0.5'/%3E%3Ctext x='60' y='80' font-size='6'%3ELaundry Care%3C/text%3E%3C!-- Iron Icon --%3E%3Cpath d='M20 100 h15 v-5 q0 -5 -10 -5 h-5 z' fill='none' stroke='%23919eab' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E"),
    /* Layer 1: The subtle noise grain */
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.8'/%3E%3C/svg%3E"),
    /* Layer 2: The Mobwash Brand Mapping (from step 1) */
    url("data:image/svg+xml,...(insert the svg code here)...");

  /* This controls how "zoomed in" the pattern is */
  background-size: 180px 180px;
  background-attachment: fixed;
}











body {
  font-family: "Inter", "Segoe UI", sans-serif; /* Professional clean font */
  background-color: var(--obsidian-black);
  color: var(--text-light);
  line-height: 1.6;
  overflow-x: hidden; /* Prevents awkward side-scrolling on gadgets */
}

/* --- 2. RESPONSIVE CONTAINERS --- */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* --- 3. GLOBAL RESPONSIVITY (Gadget Scaling) --- */
html {
  font-size: 16px; /* Base size */
}

@media (max-width: 1024px) {
  html {
    font-size: 15px;
  } /* Scales everything down for Tablets */
}

@media (max-width: 768px) {
  html {
    font-size: 14px;
  } /* Scales for Mobile */

  .hide-on-mobile {
    display: none !important;
  }
}

/* --- 4. SHARED UI ELEMENTS --- */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  text-decoration: none;
  color: inherit;
  transition: var(--transition-smooth);
}

/* Utility for smooth lifting animations we used earlier */
.animated-up:hover {
  transform: translateY(-8px);
}
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: #f8f9fa;

  /* THE LARGE SCALE MAPPING */
  background-image:
    url("data:image/svg+xml,%3Csvg width='500' height='500' viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23919eab' fill-opacity='0.8' font-family='Arial, sans-serif' font-weight='bold'%3E%3C!-- Dispersed Names --%3E%3Ctext x='50' y='80' font-size='35' transform='rotate(-15 50 80)'%3EMobwash%3C/text%3E%3Ctext x='300' y='400' font-size='45' transform='rotate(10 300 400)'%3EMobwash%3C/text%3E%3Ctext x='150' y='250' font-size='25' opacity='0.6'%3ELaundry Care%3C/text%3E%3C!-- Large Mapped Icons --%3E%3Cpath d='M400 100 l20 -20 l20 20 v30 h-40 z' fill='none' stroke='%23919eab' stroke-width='1' transform='rotate(20 420 110)'/%3E%3C!-- Hanger --%3E%3Ccircle cx='100' cy='400' r='40' fill='none' stroke='%23919eab' stroke-width='1' opacity='0.4'/%3E%3C!-- Washing Machine --%3E%3Cpath d='M250 50 h40 v50 h-40 z M260 60 h20 v10 h-20 z' fill='none' stroke='%23919eab' stroke-width='1' transform='rotate(-5 270 75)'/%3E%3C!-- Clothing/Iron --%3E%3C/g%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.8'/%3E%3C/svg%3E"),
    url("data:image/svg+xml,...(the large Mobwash SVG above)...");

  /* Scaled up for large gadgets */
  background-size: 600px 600px;
  background-attachment: fixed;
  background-repeat: repeat;
}














body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: #fdfdfd; /* Clean, paper-like white */

  /* THE HAND-DRAWN CANVAS */
  background-image: url("data:image/svg+xml,%3Csvg width='600' height='600' viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%234a5568' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' opacity='0.8'%3E%3C!-- HANDWRITTEN MOBWASH --%3E%3Cpath d='M50 100 c5,-10 15,-10 20,0 s15,20 25,0' transform='rotate(-5 50 100)'/%3E%3Ctext x='50' y='105' font-family='cursive, Comic Sans MS' font-size='32' fill='%234a5568' stroke='none' transform='rotate(-5 50 105)'%3EMobwash%3C/text%3E%3C!-- DETAILED HAND-DRAWN WASHER --%3E%3Cpath d='M400 350 h60 v70 h-60 z M410 365 q15,-5 30,0 v35 q-15,5 -30,0 z' transform='rotate(12 430 385)'/%3E%3Ccircle cx='430' cy='385' r='18' stroke-dasharray='4 2' transform='rotate(12 430 385)'/%3E%3C!-- HAND-DRAWN HANGER --%3E%3Cpath d='M150 450 l40 -30 l40 30 M190 420 v-10 q0,-10 10,-10' transform='rotate(-15 190 430)'/%3E%3C!-- SCRATCHY 'LAUNDRY CARE' TEXT --%3E%3Ctext x='350' y='150' font-family='cursive' font-size='20' fill='%234a5568' stroke='none' transform='rotate(8 350 150)'%3Elaundry care...%3C/text%3E%3C!-- HAND-DRAWN IRON --%3E%3Cpath d='M100 250 h50 q10,0 10,10 v15 h-70 v-15 q0,-10 10,-10 M110 250 v-10 h30 v10' transform='rotate(25 125 260)'/%3E%3C/g%3E%3C/svg%3E");

  background-size: 700px 700px;
  background-attachment: fixed;
}
body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  /* This creates the 'paper grain' that interacts with the drawings */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.8'/%3E%3C/svg%3E");
  pointer-events: none;
}
