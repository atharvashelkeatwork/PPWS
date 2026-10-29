# PLAN: Portfolio for Atharva Vilas Shelke ("Portfolio as a REST API")

> Instructions for the coding agent (OpenCode). Read this whole file, then implement it phase by phase. Do not ask for clarification unless something here is contradictory; make reasonable choices and note them in README.md.

## 1. Goal

Build a **professional, formal, minimalist** personal portfolio for a fresh Java backend developer, deployable on **GitHub Pages** with no build step.

**The unique twist:** the portfolio *is* a REST API. Navigation items are endpoints (`GET /profile`, `GET /projects`, ...). Every section has two views of the same data:

1. **Document view (default):** clean, human-readable layout for recruiters.
2. **Response view:** the same data as the HTTP response a real API would return (request line, status, headers, syntax-highlighted JSON body).

The twist must feel *quiet and refined*, not gimmicky. A recruiter who never touches the toggle must still get a perfect conventional portfolio.

## 2. Hard constraints

- Plain **HTML + CSS + vanilla JavaScript**. No frameworks, no bundler, no npm, no CDN, no external fonts, no external network requests of any kind.
- Must work when deployed at a sub-path (`https://<user>.github.io/<repo>/`): use **relative paths only**.
- Must also work when `index.html` is opened directly from disk (`file://`). Therefore store data in a classic script (`data.js` setting `window.PORTFOLIO = {...}`), **not** fetched JSON.
- Hash-based routing only, using plain hashes: `#profile`, `#projects`, `#skills`, `#contact`. No `#/path`, no query strings, no `pushState` paths.
- Wrap all `localStorage` access in try/catch and work correctly when it is unavailable.
- Accessible: semantic HTML, WCAG AA contrast, visible focus states, full keyboard use, `prefers-reduced-motion` respected, `lang="en"`.
- Responsive from 320px up. No horizontal page scroll; wide code blocks scroll inside their own container.
- Light and dark themes via `prefers-color-scheme`, with a manual toggle persisted in localStorage.

## 3. File structure

```
/
├── index.html
├── 404.html
├── .nojekyll
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── data.js        # window.PORTFOLIO (single source of truth)
│   ├── app.js         # router, rendering, view toggle, theme
│   └── highlight.js   # tiny JSON syntax highlighter (no library)
└── assets/
    ├── favicon.svg    # "AS" monogram
    └── Atharva_Shelke_Resume.pdf   # placeholder note in README: owner must add this file
```

## 4. Design system

**Tone:** formal, restrained, lots of whitespace, thin rules, no gradients, no shadows heavier than 1px borders, no emojis, no stock illustrations.

**Typography (system fonts only):**
- Headings and name: `Georgia, "Times New Roman", serif`
- Body/UI: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
- Endpoints, status codes, JSON: `ui-monospace, "SF Mono", Menlo, Consolas, monospace`
- Body 17px/1.65, content max-width ~720px (Response view may use ~860px).

**Color tokens (CSS variables on `:root`, redefined for dark):**

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#FAFAF8` | `#0E0F11` |
| `--surface` | `#FFFFFF` | `#15171A` |
| `--text` | `#111111` | `#EDEDED` |
| `--muted` | `#5F5F5A` | `#9A9CA1` |
| `--border` | `#E4E4E0` | `#26282C` |
| `--accent` | `#1F4E79` | `#7FB0E0` |
| `--ok` | `#2E7D32` | `#6FCF97` |

Use the accent sparingly: links, active nav item, the availability dot, JSON keys. JSON string/number/boolean colors should be low-saturation variations derived from the same palette, not a rainbow.

## 5. Layout and behavior

### 5.1 Header (sticky, minimal)
- Left: monogram + `atharva-shelke` wordmark in monospace.
- Nav items rendered as endpoints in monospace: `GET /profile`, `GET /projects`, `GET /skills`, `POST /contact`. Active item has an accent underline. On mobile, collapse into a simple horizontally scrollable row (no hamburger animation).
- Right: view toggle (`Document | Response`) as a segmented control, and a theme toggle (icon-free text button: `Light/Dark`).
- Keyboard shortcut: pressing `r` toggles Response view when focus is not in an input. Show this hint in the footer.

### 5.2 Hero (on `#profile`, also the default route)
- Name in serif, large: **Atharva Vilas Shelke**
- Subtitle: **Java Backend Developer**
- One line: Thane, Maharashtra
- Status line in monospace with a small green dot:
  `GET /status` -> `"availability": "AVAILABLE"`
  rendered in Document view as: `● Available for Java Software Developer roles`
- Links row: Email, LinkedIn, GitHub, Resume (PDF).

### 5.3 Routes / sections
Each route renders in a `<main>` region and updates `document.title` and focus (move focus to the `<h1>` for screen readers).

| Route | Endpoint shown | Document view | Response payload |
|---|---|---|---|
| `#profile` | `GET /profile` | Hero + summary + education + certification | profile object |
| `#projects` | `GET /projects` | Project list; each project is an expandable `<details>`-style card or simple stacked entry with tech chips | array of project objects |
| `#skills` | `GET /skills` | Grouped skill lists | skills object |
| `#contact` | `POST /contact` | Contact details + a simple form (name, email, message) | contact info + simulated response |

Education and certification live under `#profile` (they are part of `GET /profile`).

### 5.4 Response view
Render a bordered "terminal-like" panel, but stay minimal (surface color, 1px border, no fake window chrome, no glow):

```
GET /projects HTTP/1.1
Host: atharva.dev            <- use location.host, fall back to "localhost"

HTTP/1.1 200 OK
Content-Type: application/json
X-Response-Time: 12ms        <- small random 4-28ms, generated once per render
X-Powered-By: Java 17        <- tasteful nod, keep it

{ ...syntax-highlighted pretty-printed JSON... }
```

- Include a **Copy** button (clipboard API with graceful fallback) copying the JSON body only.
- JSON must be generated from the same `window.PORTFOLIO` data used by the Document view. No duplicated content anywhere.
- Highlighting via `highlight.js` (own tiny tokenizer: keys, strings, numbers, booleans, null, punctuation). Output must be HTML-escaped.
- When switching views, crossfade (150ms) unless reduced motion is on.
- The selected view persists in localStorage (try/catch) and can be linked with no URL change (hash stays a plain route).

### 5.5 Contact (`POST /contact`)
- Form fields: name, email, message, with proper labels and validation messages.
- No backend exists. On submit: validate, then open a `mailto:` link to `atharvashelkeatwork@gmail.com` with subject and body prefilled (URL-encoded), and display a simulated response below the form:
  `HTTP/1.1 202 Accepted` with body `{ "status": "opening mail client" }`.
- Add a plain-text note that this opens their email app, so nobody is misled into thinking a message was sent from the site.
- Also show direct links: email, phone, LinkedIn, GitHub.

### 5.6 `404.html`
Same header/footer styling. Shows:
```
HTTP/1.1 404 Not Found
{ "error": "Not Found", "message": "This endpoint does not exist.", "hint": "Try GET /profile" }
```
with a link back to `./index.html`. Uses relative paths and inline-safe CSS reference `css/styles.css` (works at repo sub-path).

### 5.7 Footer
`© 2026 Atharva Vilas Shelke` and the small hint: `Press r to toggle the API response`.

## 6. Content (single source of truth, put in `js/data.js`)

Use this content. Wording is lightly polished from the resume (fixed grammar, third-person-neutral, concise). Do not invent achievements, metrics, employers, or links beyond what is listed.

```js
window.PORTFOLIO = {
  profile: {
    name: "Atharva Vilas Shelke",
    title: "Java Backend Developer",
    location: "Thane, Maharashtra, India",
    availability: "AVAILABLE",
    openTo: "Java Software Developer roles",
    summary: "Computer Engineering graduate with a strong foundation in Core Java, OOP, SQL and Java backend development. Hands-on experience with JDBC, Servlets, Hibernate/JPA and Spring Boot, with project experience in REST APIs and relational databases. Seeking a Java Software Developer role to apply and strengthen backend development skills in a production environment.",
    links: {
      email: "atharvashelkeatwork@gmail.com",
      phone: "+91 9820197485",
      linkedin: "https://linkedin.com/in/atharvashelkeatwork",
      github: "https://github.com/atharvashelkeatwork",
      resume: "assets/Atharva_Shelke_Resume.pdf"
    },
    education: [
      {
        institution: "Dilkap Research Institute of Engineering and Management Studies, University of Mumbai",
        credential: "Bachelor of Engineering (B.E.) in Computer Engineering",
        period: "2021 - 2026",
        result: "CGPA 7.72",
        location: "Thane, Maharashtra"
      },
      {
        institution: "G.E.I.'s M. H. High School & Junior College, University of Mumbai",
        credential: "Higher Secondary Certificate (HSC), Bifocal Computer Science",
        period: "2019 - 2021",
        result: "75.83%",
        location: "Thane, Maharashtra"
      },
      {
        institution: "IRA Global School",
        credential: "International General Certificate of Secondary Education (IGCSE)",
        period: "2018 - 2019",
        result: "60.43%",
        location: "Dombivli, Maharashtra"
      }
    ],
    certifications: [
      { name: "Java Full Stack Developer", issuer: "QSpider" }
    ]
  },

  projects: [
    {
      id: "online-movie-booking-system",
      name: "Online Movie Booking System",
      type: "RESTful backend API",
      summary: "A RESTful backend where customers browse movies and showtimes, check seat availability, purchase tickets and cancel purchases, while admins manage movies, theatres, screens and showtimes.",
      highlights: [
        "Stateless JWT authentication with BCrypt password hashing and role-based authorization (Customer and Admin); customers can view only their own booking details.",
        "Per-show seat reservation (ShowSeat) with transactional booking and cancellation, backed by database constraint checks that prevent duplicate bookings."
      ],
      stack: ["Java", "Spring Boot", "Spring MVC", "Spring Data JPA (Hibernate)", "Spring Security", "JWT", "ModelMapper", "PostgreSQL", "Maven", "Swagger/OpenAPI", "JUnit", "Mockito"],
      links: { repo: null, demo: null }
    },
    {
      id: "jnativekit",
      name: "JNativeKit (JNK)",
      type: "Cross-platform Java library",
      summary: "An OS-agnostic Java library exposing one common interface across Windows, macOS and Linux for native desktop capabilities: notifications, system tray, auto-start and credentials management.",
      highlights: [
        "Maven multi-module structure: a common API library plus OS-specific provider implementations selected at runtime through Java SPI (ServiceLoader).",
        "Capability/result model with explicit result codes (AVAILABLE, UNSUPPORTED, MISSING_DEPENDENCY, PERMISSION_DENIED) to report failures in unsupported environments, validated with a GitHub Actions CI matrix."
      ],
      stack: ["Java 17", "JNA", "Maven (multi-module)", "Service Loader (SPI)", "JUnit 5", "GitHub Actions", "Git/GitHub", "Linux"],
      links: { repo: null, demo: null }
    },
    {
      id: "employee-management-system",
      name: "Employee Management System",
      type: "Java web application",
      summary: "A Java web application for managing employee information, with server-side rendering through JSP and request handling through Jakarta Servlets.",
      highlights: [
        "Full CRUD (add, view, edit, delete) driven by a single JSP form; employee IDs are generated automatically by the database, and deletion requires a confirmation prompt.",
        "HTTP Session tracks the most recently updated employee; a cookie stores the default department."
      ],
      stack: ["Java", "JSP", "Jakarta Servlets", "Hibernate (JPA)", "PostgreSQL", "Apache Maven", "Apache Tomcat"],
      links: { repo: null, demo: null }
    }
  ],

  skills: {
    "core-java": ["OOP", "Collections", "Exception Handling", "Multithreading"],
    "advanced-java": ["JDBC", "Hibernate with JPA", "Servlets", "JSP"],
    "frameworks": ["Spring Framework", "Spring MVC", "Spring Boot", "Spring Security"],
    "rest-api": ["REST API development", "JSON", "Postman"],
    "frontend": ["HTML5", "CSS3", "JavaScript"],
    "databases": ["Oracle SQL", "PostgreSQL"],
    "tools-and-platforms": ["Eclipse IDE", "Maven", "Git/GitHub", "Linux"],
    "testing": ["JUnit", "Mockito", "Manual Testing"]
  }
};
```

Notes for the agent:
- Project `links.repo` and `links.demo` are `null` for now. Render a link only when non-null; the owner will fill in real GitHub URLs later (document this in README).
- Display skill group keys as human labels in Document view (e.g. `core-java` -> "Core Java"), keep raw keys in Response view.
- Project order matters: Movie Booking first (strongest), JNativeKit second, Employee Management third.

## 7. Implementation phases

**Phase 1: Skeleton.** Create the file structure, `index.html` with semantic landmarks (`header`, `nav`, `main`, `footer`), skip link, meta tags (description, theme-color, Open Graph title/description, no image), inline SVG favicon, `.nojekyll`.

**Phase 2: Design system.** Write `styles.css` with tokens, typography, light/dark, layout, nav, segmented toggle, cards, chips, code panel, form, focus styles, print stylesheet (print Document view only, hide nav and toggles).

**Phase 3: Data and rendering.** Create `data.js`, then `app.js` with hash router (default `#profile`, unknown hash shows the in-app 404 response), Document renderers per route, and the Response renderer that builds request line, status, headers and JSON from the same data.

**Phase 4: Response view polish.** `highlight.js`, copy button, response-time header, crossfade, persisted view and theme, `r` shortcut.

**Phase 5: Contact, 404, a11y pass.** Form validation, mailto flow, simulated 202 response, `404.html`, aria attributes (`aria-current="page"` on active nav, `aria-pressed` on toggles, `aria-live="polite"` for copy confirmation), reduced-motion handling.

**Phase 6: Docs and deployment.** Write `README.md` containing: what the site is, how to edit content (only `data.js`), where to place the resume PDF, how to run locally (open `index.html` or `python3 -m http.server`), and GitHub Pages deployment steps (create repo, push to `main`, Settings -> Pages -> Deploy from branch -> `main` / root, wait, open the URL). Mention that `.nojekyll` is intentional.

## 8. Acceptance checklist (verify before finishing)

- [ ] Opens correctly from `file://` and from a local static server.
- [ ] All asset paths are relative; works under a repo sub-path.
- [ ] Every route renders in both Document and Response views; content is identical in both (single data source).
- [ ] No console errors; no network requests to other origins.
- [ ] Keyboard: tab order is logical, all controls operable, `r` toggles Response view, focus moves to the heading on route change.
- [ ] Contrast meets WCAG AA in both themes.
- [ ] Works at 320px, 768px and 1280px widths with no horizontal page scroll.
- [ ] Theme and view persist across reloads; site still works if localStorage throws.
- [ ] Phone shown as `+91 9820197485`; email, LinkedIn and GitHub links are correct and open in a new tab with `rel="noopener noreferrer"`.
- [ ] No invented content, metrics, or links.
- [ ] Lighthouse (if available): Performance, Accessibility, Best Practices, SEO all 95+.
- [ ] Typographic quality: use curly quotes and a proper apostrophe in visible text; keep straight quotes in code and JSON.

## 9. Out of scope

No backend, no analytics, no cookies, no blog, no animations beyond subtle fades, no stock imagery, no third-party scripts.
