# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-page application (SPA) called "개미 마을" (Ant Village) - a Korean investment portfolio management tool. The application is structured with separated HTML, CSS, and JavaScript files for better maintainability.

**Purpose**: Help individual investors ("ants" in Korean stock market terminology) organize and monitor their investment portfolios by grouping assets into thematic "villages" and receive daily audio briefings about their investments.

## File Structure

```
front/
├── index.html          # Main HTML structure with all page sections
├── css/
│   └── styles.css      # All styles, animations, and responsive design
├── js/
│   └── app.js          # Application logic, data management, event handlers
├── ant-village.html    # Legacy single-file version (can be removed)
└── CLAUDE.md          # This file
```

## Architecture

### Core Structure
- **No build system**: Direct browser execution
- **No external dependencies**: Uses only browser APIs and Google Fonts CDN
- **SPA Navigation**: JavaScript-controlled page visibility without URL changes
- **Client-side storage**: LocalStorage API for data persistence

### Key Components

#### 1. Page System
**Location**: `index.html` (HTML structure), `js/app.js` (showPage function)

- Single-page navigation with multiple `.page` divs
- JavaScript controls visibility via `showPage(pageName)` function
- Pages:
  - `main`: Home page with world map visualization
  - `villages`: Portfolio management dashboard
  - `briefing`: Morning market briefing
  - `dailyBriefing`: Village-specific daily updates
  - `neighbors`: Portfolio diversification recommendations

#### 2. Data Layer
**Location**: `js/app.js` (sampleData, loadData, saveData functions)

- `sampleData` object contains default data structure
- LocalStorage API for persistence
- Data structure:
  - `user_profile`: name, theme preferences
  - `villages`: array of investment portfolios with:
    - id, name, icon (emoji)
    - assets (array of ticker symbols or Korean stock names)
    - type, goal, totalValue, returnRate, allocation
  - `settings`: briefing_time, voice_speed

#### 3. Village Management
**Location**: `js/app.js` (renderVillages function), `index.html` (#villagesPage)

- Villages represent thematic investment portfolios
  - Examples: "미장마을" (US stocks), "배당마을" (dividend stocks), "레버리지마을" (leveraged ETFs)
- Each village tracks:
  - Total asset value in KRW
  - Return rate percentage (positive/negative styling)
  - Portfolio allocation percentage (visual progress bar)
- Dynamic card rendering from localStorage data

#### 4. Text-to-Speech Briefing
**Location**: `js/app.js` (playBriefing, stopBriefing, playDailyBriefing functions)

- Uses Web Speech API (`SpeechSynthesisUtterance`)
- Korean language support (`ko-KR` locale)
- Reads briefing content aloud for hands-free listening
- Controls: play, stop functionality

#### 5. Recommendation System
**Location**: `index.html` (#neighborsPage), `js/app.js` (addVillage function)

- Suggests new investment villages based on portfolio gaps
- Shows correlation values to demonstrate diversification benefits
- Three default recommendations:
  - 원자재 마을 (Commodities: GLD, SLV, USO)
  - 신흥국 마을 (Emerging markets: India, Vietnam, Brazil)
  - 채권 마을 (Bonds: AGG, TLT, HYG)

## Development Commands

### Running the Application
```bash
# Option 1: Open directly in browser (Windows)
start index.html

# Option 2: Use a simple HTTP server
python -m http.server 8000
# Then navigate to http://localhost:8000/

# Option 3: Node.js http-server (if installed)
npx http-server
```

### Testing
No automated tests exist. Manual testing workflow:
1. Open `index.html` in browser
2. Test navigation between pages (홈, 마을 관리, 아침 브리핑, 이웃 개미)
3. Test LocalStorage persistence:
   - Add a village from recommendations
   - Refresh page
   - Verify village persists in 마을 관리
4. Test TTS audio playback (requires browser permissions)
5. Test modal interactions (click map regions, close with X or outside click)
6. Test responsive design (resize browser to mobile width)

## Code Style Patterns

### CSS (css/styles.css)

**CSS Custom Properties**
- Theme colors defined in `:root` variables
- Primary palette: `--primary` (#FF6B35), `--secondary` (#F7931E), `--accent` (#FFD23F)
- Semantic colors: `--success`, `--danger`, `--text`, `--text-light`
- When modifying colors, update these variables rather than hardcoding

**Animation Patterns**
- `fadeIn`: Page transitions (0.5s ease-in)
- `slideDown`: Hero title entrance (1s ease-out)
- `bounce`: Ant character animation (2s infinite)
- `modalSlideIn`: Modal appearance (0.3s ease)
- Hover effects: `transform: translateY()` for lift effect

**Responsive Design**
- Mobile breakpoint: 768px
- Grid layouts use `auto-fit` with `minmax()` for flexibility
- Flexible navigation wrapping on small screens

**Visual Patterns**
- Card-based design: `.village-card`, `.recommendation-card`, `.briefing-container`
- Consistent border-radius: 15-25px for rounded corners
- Shadow pattern: `box-shadow: 0 10px 30px rgba(0,0,0,0.1)` for depth
- Gradient accents on cards and buttons

### JavaScript (js/app.js)

**Korean Language**
- All UI text is in Korean
- Maintain Korean naming for villages and features
- TTS uses `ko-KR` locale

**Data Patterns**
- Always use `loadData()` and `saveData()` for persistence
- Keep `sampleData` as fallback for first-time users
- Use `.toLocaleString()` for number formatting (adds commas)

**Event Handling**
- Inline `onclick` attributes in HTML for simplicity
- Global functions defined in `app.js`
- Modal close on outside click via `window.onclick` handler

### HTML (index.html)

**Page Structure**
- Each page is a `<div class="page">` with unique id
- Only one page has `.active` class at a time
- Common header stays visible across all pages

**ID Naming Convention**
- Pages: `mainPage`, `villagesPage`, `briefingPage`, etc.
- Content areas: `villageGrid`, `briefingContent`, `modalContent`
- Navigation: Handled by `onclick` attributes calling `showPage()`

## Common Modifications

### Adding a New Village Type

**Location**: `js/app.js`

1. Add to `sampleData.villages` array:
```javascript
{
    id: "v5",
    name: "새마을",
    icon: "🌟",
    assets: ["ASSET1", "ASSET2"],
    type: "new-type",
    goal: "new-goal",
    totalValue: 1000000,
    returnRate: 5.0,
    allocation: 10
}
```
2. The village will auto-render via `renderVillages()` on page load
3. Consider adding to recommendations if it's a common portfolio gap

### Adding a New Page

**Locations**: `index.html`, `js/app.js`

1. **HTML** (`index.html`): Add page structure
```html
<div id="newPage" class="page">
    <div class="container">
        <h1 class="page-title">새 페이지 제목</h1>
        <p class="page-subtitle">부제목</p>
        <!-- Page content -->
    </div>
</div>
```

2. **Navigation** (`index.html` header): Add button
```html
<button onclick="showPage('new')">새 메뉴</button>
```

3. **JavaScript** (`js/app.js`): Update `pageMap` in `showPage()` function
```javascript
const pageMap = {
    'main': 'mainPage',
    'villages': 'villagesPage',
    'briefing': 'briefingPage',
    'daily': 'dailyBriefingPage',
    'neighbors': 'neighborsPage',
    'new': 'newPage'  // Add this
};
```

4. Add page-specific initialization if needed:
```javascript
if (pageName === 'new') {
    initializeNewPage();
}
```

### Modifying Briefing Content

**Location**: `index.html`

- **Morning briefing**: Edit `<div id="briefingContent">` content
- **Village-specific briefing**: Edit `<div id="dailyBriefingContent">` content
- Content is read aloud as-is by TTS, so:
  - Keep natural Korean language formatting
  - Avoid special characters that don't pronounce well
  - Use clear section headers with emojis

### Styling Updates

**Location**: `css/styles.css`

**Adding New Colors**
```css
:root {
    --new-color: #hexcode;
}
```

**Creating New Card Types**
```css
.new-card {
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

.new-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
}
```

**Responsive Adjustments**
- Add rules inside `@media (max-width: 768px)` block
- Test on mobile viewport before committing

### LocalStorage Schema Changes

**Location**: `js/app.js`

When adding new data fields:
1. Update `sampleData` object with new field and default value
2. Ensure backward compatibility in `loadData()`:
```javascript
function loadData() {
    const data = localStorage.getItem('antVillageData');
    if (!data) return sampleData;

    const parsed = JSON.parse(data);
    // Migration logic if needed
    if (!parsed.newField) {
        parsed.newField = defaultValue;
    }
    return parsed;
}
```
3. Update `saveData()` calls if new data needs immediate persistence

## Performance Considerations

- **LocalStorage**: Limited to ~5-10MB per origin. Current data structure is minimal.
- **TTS**: Web Speech API loads on demand. No preloading needed.
- **Animations**: CSS transitions/animations are GPU-accelerated. Avoid animating layout properties.
- **No bundler**: Direct file loading means no minification. Keep JS/CSS reasonably sized.

## Browser Compatibility

- **Required**: Modern browsers with ES6+ support
- **TTS**: Chrome, Edge, Safari (Firefox support limited)
- **LocalStorage**: All modern browsers
- **CSS Grid/Flexbox**: IE11 not supported
