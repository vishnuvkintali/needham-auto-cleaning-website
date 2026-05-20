const fs = require('fs');
const path = require('path');

var passed = 0;
var failed = 0;
var html = '';

function test(name, condition) {
  if (condition) {
    console.log('  PASS  ' + name);
    passed++;
  } else {
    console.log('  FAIL  ' + name);
    failed++;
  }
}

function section(name) {
  console.log('\n--- ' + name + ' ---');
}

// Load file
var filePath = path.join(__dirname, '../output/index.html');
if (!fs.existsSync(filePath)) {
  console.log('  FAIL  output/index.html not found — aborting');
  process.exit(1);
}
html = fs.readFileSync(filePath, 'utf8');

// ===== FILE & STRUCTURE =====
section('File & Structure');
test('File exists', fs.existsSync(filePath));
test('File is at least 15KB', fs.statSync(filePath).size >= 15000);
test('Single file (no external style.css link)', !html.includes('href="style.css"'));
test('Single file (no external script.js link)', !html.includes('src="script.js"'));
test('Has DOCTYPE', html.trim().startsWith('<!DOCTYPE html>'));
test('Has meta charset UTF-8', html.includes('charset="UTF-8"'));
test('Has viewport meta tag', html.includes('name="viewport"'));
test('Has correct title', html.includes('<title>Needham Auto Cleaning</title>'));
test('Has inline <style> block', html.includes('<style>'));
test('Has inline <script> block', html.includes('<script>'));

// ===== REQUIRED SECTIONS =====
section('Required Sections');
test('Has hero section',        html.includes('id="hero"'));
test('Has services section',    html.includes('id="services"'));
test('Has gallery section',     html.includes('id="gallery"'));
test('Has pricing section',     html.includes('id="pricing"'));
test('Has testimonials section',html.includes('id="testimonials"'));
test('Has contact section',     html.includes('id="contact"'));
test('Has navbar',              html.includes('id="navbar"'));
test('Has footer',              html.includes('<footer>'));
test('Has mobile menu',         html.includes('id="mobileMenu"'));
test('Has bubble canvas',       html.includes('id="bubbleCanvas"'));
test('Has loader',              html.includes('id="loader"'));

// ===== REAL CONTENT (no stale placeholders) =====
section('Real Content');
test('Has business name in hero',      html.includes('Needham Auto Cleaning'));
test('Has real email',                 html.includes('needham.auto.cleaning@gmail.com'));
test('Has real address',               html.includes('Sunnyside Road'));
test('Has near Cricket Field note',    html.includes('Cricket Field'));
test('Has real hours (9:30)',          html.includes('9:30'));
test('Has Saturday & Sunday hours',    html.includes('Saturday'));
test('Has Silver price ($15)',         html.includes('$15'));
test('Has Gold price ($20)',           html.includes('$20'));
test('Has Sedan price ($40)',          html.includes('$40'));
test('Has SUV price ($50)',            html.includes('$50'));
test('Has Bundle price ($60)',         html.includes('$60'));
test('Has Instagram link',             html.includes('needham_auto_cleaning'));
test('Has Cash & Venmo info',          html.includes('Venmo'));
test('No stale $XX prices',           !html.includes('$XX'));
test('No stale [Phone Number]',       !html.includes('[Phone Number]'));
test('No stale [Email Address]',      !html.includes('[Email Address]'));
test('No stale [Address, Needham]',   !html.includes('[Address, Needham'));
test('No stale [Hours placeholder]',  !html.includes('[Hours placeholder]'));
test('No stale [X]am placeholders',   !html.includes('[X]am'));

// ===== FORM =====
section('Contact Form');
test('Form has netlify attribute',          html.includes('netlify'));
test('Form has name="contact"',             html.includes('name="contact"'));
test('Form has method="POST"',              html.includes('method="POST"'));
test('Form has hidden form-name input',     html.includes('name="form-name"'));
test('Form has name input',                 html.includes('name="name"'));
test('Form has phone input',                html.includes('name="phone"'));
test('Form has car input',                  html.includes('name="car"'));
test('Form has service select',             html.includes('name="service"'));
test('Form has message textarea',           html.includes('name="message"'));
test('Form has Silver option',              html.includes('Silver ($15)'));
test('Form has Gold option',                html.includes('Gold ($20)'));
test('Form has Bundle option',              html.includes('Gold + Interior Bundle ($60)'));

// ===== UI FEATURES =====
section('UI Features');
test('Has dark mode toggle button',         html.includes('id="darkBtn"'));
test('Has share button',                    html.includes('id="shareBtn"'));
test('Has hamburger button',                html.includes('id="hamburger"'));
test('Has testimonial track',               html.includes('id="testimonialTrack"'));
test('Has testimonial dots',                html.includes('class="dot active"'));
test('Has 3 testimonial cards',            (html.match(/class="testimonial-card"/g) || []).length === 3);
test('Has 3 testimonial dots',             (html.match(/class="dot/g) || []).length >= 3);
test('Has 4 service cards',               (html.match(/class="service-card reveal"/g) || []).length === 4);
test('Has 3 pricing cards',               (html.match(/class="pricing-card/g) || []).length === 3);
test('Has popular pricing card',           html.includes('class="pricing-card popular reveal"'));
test('All book-btn have data-service',     (function() {
  var btns = html.match(/class="[^"]*book-btn[^"]*"/g) || [];
  var withService = html.match(/data-service=/g) || [];
  return btns.length > 0 && btns.length === withService.length;
})());

// ===== CSS =====
section('CSS');
test('Has :root CSS variables',      html.includes(':root {'));
test('Has --cyan variable',          html.includes('--cyan:'));
test('Has --bg variable',            html.includes('--bg:'));
test('Has light-mode class',         html.includes('body.light-mode'));
test('Has responsive media query',   html.includes('@media (max-width: 768px)'));
test('Has reveal class',             html.includes('.reveal {'));
test('Has reveal.visible class',     html.includes('.reveal.visible'));
test('Has glowPulse animation',      html.includes('@keyframes glowPulse'));
test('Has fadeUp animation',         html.includes('@keyframes fadeUp'));
test('Has spin animation',           html.includes('@keyframes spin'));
test('Has gallery-placeholder style',html.includes('.gallery-placeholder'));
test('Has toolbar styles',           html.includes('.toolbar'));
test('Has tool-pill styles',         html.includes('.tool-pill'));

// ===== JAVASCRIPT =====
section('JavaScript');

// Extract all inline script content (no src attribute)
var js = '';
var scriptRe = /<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g;
var scriptMatch;
while ((scriptMatch = scriptRe.exec(html)) !== null) { js += scriptMatch[1]; }

test('Has JS content', js.length > 100);
test('Has loader hide code',          js.includes("'loader'"));
test('Has dark mode toggle logic',    js.includes('light-mode'));
test('Has share clipboard logic',     js.includes('clipboard'));
test('Has scroll shrink logic',       js.includes('scrolled'));
test('Has hamburger toggle logic',    js.includes("'mobileMenu'"));
test('Has Escape key handler',        js.includes("'Escape'"));
test('Has bubble canvas draw loop',   js.includes('drawBubbles'));
test('Has IntersectionObserver',      js.includes('IntersectionObserver'));
test('Has BA slider logic',           js.includes('ba-slider'));
test('Has testimonial rotator',       js.includes('goTo'));
test('Has book-btn pre-select',       js.includes('book-btn'));
test('Has Netlify fetch call',        js.includes("fetch('/'")||js.includes('fetch("/'));
test('Uses var (not let/const)',      !js.includes('const ') && !js.includes('let '));

// JS syntax: balanced braces
var openBraces  = (js.match(/\{/g) || []).length;
var closeBraces = (js.match(/\}/g) || []).length;
test('Balanced JS braces { }', openBraces === closeBraces);

var openParens  = (js.match(/\(/g) || []).length;
var closeParens = (js.match(/\)/g) || []).length;
test('Balanced JS parentheses ( )', openParens === closeParens);

// ===== NAV LINKS =====
section('Navigation');
test('Nav links to #services',     html.includes('href="#services"'));
test('Nav links to #gallery',      html.includes('href="#gallery"'));
test('Nav links to #pricing',      html.includes('href="#pricing"'));
test('Nav links to #testimonials', html.includes('href="#testimonials"'));
test('Nav links to #contact',      html.includes('href="#contact"'));
test('Hero Book Now links to #contact', html.includes('href="#contact" class="btn-glow"'));

// ===== ANNOUNCEMENT SECTION (index.html) =====
section('Announcement Section');
test('Has announcement div',                html.includes('id="announcement"'));
test('Has announcement box',                html.includes('class="announcement-box reveal"'));
test('Has Latest Update label',             html.includes('Latest Update'));
test('Has All Updates button',              html.includes('All Updates'));
test('All Updates links to announcements',  html.includes('href="announcements.html"'));
test('Has announcement date',               html.includes('April'));
test('Has announcement CSS styles',         html.includes('.announcement-box'));
test('Has announcement label style',        html.includes('.announcement-label'));

// ===== ANNOUNCEMENTS PAGE =====
section('Announcements Page');
var annPath = path.join(__dirname, '../output/announcements.html');
test('announcements.html exists', fs.existsSync(annPath));

if (fs.existsSync(annPath)) {
  var ann = fs.readFileSync(annPath, 'utf8');
  test('Ann page has correct title',          ann.includes('Needham Auto Cleaning'));
  test('Ann page has page title heading',     ann.includes('Announcements'));
  test('Ann page has back link to index',     ann.includes('href="index.html"'));
  test('Ann page has NAC logo',               ann.includes('nav-logo'));
  test('Ann page has announcement cards',    (ann.match(/class="ann-card"/g) || []).length >= 3);
  test('Ann page has Latest tag',             ann.includes('Latest'));
  test('Ann page has dates',                  ann.includes('2026'));
  test('Ann page has ann-title elements',    (ann.match(/class="ann-title"/g) || []).length >= 3);
  test('Ann page has ann-body elements',     (ann.match(/class="ann-body"/g) || []).length >= 3);
  test('Ann page has footer',                 ann.includes('<footer>'));
  test('Ann page has meta charset',           ann.includes('charset="UTF-8"'));
  test('Ann page has viewport meta',          ann.includes('name="viewport"'));
  test('Ann page has same fonts as main',     ann.includes('Orbitron'));
  test('Ann page matches color scheme',       ann.includes('--cyan: #00cfff'));
  test('Ann page is responsive',              ann.includes('@media (max-width: 768px)'));
}

// ===== OWNER LOGIN =====
section('Owner Login');
test('Has owner login button',              html.includes('id="ownerLoginBtn"'));
test('Has login modal',                     html.includes('id="loginModal"'));
test('Has dashboard modal',                 html.includes('id="dashboardModal"'));
test('Has password input',                  html.includes('id="loginInput"'));
test('Has login submit button',             html.includes('id="loginSubmit"'));
test('Has owner dashboard title',           html.includes('Owner Dashboard'));
test('Has logout button',                   html.includes('id="dashLogout"'));
test('Login JS is present',                 js.includes('signInWithEmailAndPassword'));
test('Escape closes login modal',           js.includes('loginModal'));
test('Has shake animation',                 html.includes('@keyframes shake'));

// ===== SUMMARY =====
console.log('\n==============================');
console.log('PASSED: ' + passed);
console.log('FAILED: ' + failed);
console.log('TOTAL:  ' + (passed + failed));
console.log('==============================\n');
process.exit(failed > 0 ? 1 : 0);
