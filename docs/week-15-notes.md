# Week 15 Notes — SIET Branded Frontend

## What we built
Full professional result portal matching siet.ac.in design language.

### Login Page
- Real SIET banner image: NBA badge, shield logo, SRI SHAKTHI name,
  NAAC A gold badge, counselling code 2727
- Full screen campus building photo background (siet-building.jpg)
- 15-second crossfade slideshow between 2 campus photos
- Ken Burns slow zoom animation on background
- 12 floating gold stars scattered across background
- Glassmorphism login card with gold shimmer borders
- SIET shield logo with pulse animation in card header
- Green (#004d00 / #006400) and gold (#FFD700) theme throughout
- Scroll-triggered footer: Cloud Computing and Cyber Security
  Research Laboratory Team credit slides up on scroll
- Tab title: Sri Shakthi Result Portal
- Favicon: SIET shield logo

### Results Page
- Same SIET header banner — consistent identity
- Blue table header with SEM / SUBJECT CODE / SUBJECT NAME / GRADE / RESULT
- Color-coded result badges: PASS=green, RA=red, WH=orange, WH1=dark red
- Status legend matching real siet.ac.in portal
- Logout button redirecting to login

## Files changed
- frontend/src/pages/LoginPage.tsx — complete redesign
- frontend/src/pages/ResultsPage.tsx — SIET header + green theme
- frontend/public/siet-logo.png — real SIET banner image
- frontend/public/siet-building.jpg — campus background slide 1
- frontend/public/siet-campus.webp — campus background slide 2
- frontend/public/siet-shield.jpg — shield logo for card + favicon
- frontend/index.html — title + favicon updated

## What we learned
- Professional institutional portal design principles
- CSS animations: Ken Burns, float, shimmer, pulse, fadeSlideIn
- Glassmorphism: backdrop-filter blur + semi-transparent backgrounds
- React useEffect for scroll detection and slideshow timers
- CSS @keyframes inside template literals in React
- Image fallback handling with onError in img tags

