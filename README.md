# Atharva Vilas Shelke — Portfolio

A professional, minimalist portfolio for a Java backend developer, presented as a small REST API. Navigation items are endpoints, and every section has two views of the same data:

- **Document** (default): a conventional portfolio for recruiters.
- **Response**: the same data rendered as an HTTP response with status, headers and syntax-highlighted JSON.

The site is plain HTML, CSS and vanilla JavaScript. There is no build step, no framework, no package manager and no external network request.

## Contents

```
index.html
404.html
.nojekyll
README.md
css/styles.css
js/data.js          # all content (single source of truth)
js/app.js           # router, renderers, view/theme handling
js/highlight.js     # tiny JSON syntax highlighter
assets/favicon.svg
assets/Atharva_Shelke_Java_Developer.pdf
```

## Editing content

Edit **`js/data.js`** only. Both the Document and Response views render from `window.PORTFOLIO`, so content never needs to be duplicated.

- **Resume:** the link currently points to `assets/Atharva_Shelke_Java_Developer.pdf`. Keep that file in `assets/`, or rename it and update `profile.links.resume` in `data.js`.
- **Project links:** `links.repo` and `links.demo` are `null` for now, so no link is rendered. Set either value to a URL and a Repository or Live demo link will appear.
- **Skill groups:** keys in `data.skills` are shown as human labels in the Document view (for example `core-java` becomes "Core Java"). Raw keys appear in the Response view.

## Running locally

Either open `index.html` directly from disk, or serve the folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

All paths are relative, so the site works both from `file://` and from a GitHub Pages repository sub-path (`https://<user>.github.io/<repo>/`).

## Deploying to GitHub Pages

1. Create a repository on GitHub (for example `atharvashelkeatwork.github.io` for a user site, or any name for a project site).
2. Put the contents of this folder at the repository root. Do not put them inside an extra subfolder.
3. Commit and push to the `main` branch.
4. On GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
6. Save and wait for GitHub to publish. The URL appears on the same settings page.
7. Later pushes to `main` update the site automatically.

`.nojekyll` is intentional. It tells GitHub Pages to skip Jekyll processing, which keeps all files and paths exactly as they are.

## Notes and decisions

- **Routing** uses plain hashes only: `#profile`, `#projects`, `#skills`, `#contact`. An unknown hash shows an in-app 404 response. Empty hash shows `#profile`.
- **Keyboard:** press `r` to toggle Document/Response when focus is not in a form field. Every control is keyboard operable and route changes move focus to the heading.
- **Persistence:** theme and view are saved in `localStorage` inside `try/catch`. If storage is unavailable, the site falls back to the document view and the operating system theme.
- **Theme:** light and dark follow `prefers-color-scheme` until the manual toggle is used. The toggle always switches to the opposite explicit theme.
- **Contact:** there is no backend. Submitting the form validates the fields, opens a prefilled `mailto:` message to `atharvashelkeatwork@gmail.com`, and shows a simulated `202 Accepted` response. The page states clearly that the email application opens and nothing is sent from the site. The Response view shows the contact details with `200 OK` plus a simulated `202 Accepted` form-submission block.
- **404 page:** `404.html` uses relative paths. For a 404 requested at a deeply nested URL, the browser may resolve `css/styles.css` relative to that nested path; a small inline fallback keeps the page readable. GitHub Pages normally serves this file for missing routes under the repository.
- **Print:** printing always produces the Document view, with navigation and toggles hidden.
