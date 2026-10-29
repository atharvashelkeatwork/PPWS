/*
 * Portfolio router and renderers.
 * Both views are rendered from window.PORTFOLIO; no content is duplicated.
 */
(function () {
  'use strict';

  var THEME_KEY = 'portfolio.theme';
  var VIEW_KEY = 'portfolio.view';

  var data = window.PORTFOLIO || {};
  var documentView = document.getElementById('document-view');
  var responseView = document.getElementById('response-view');
  var viewButtons = Array.prototype.slice.call(document.querySelectorAll('[data-view]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a'));
  var themeButton = document.getElementById('theme-toggle');
  var mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  var currentView = 'document';
  var currentJSON = '';
  var SIMULATED_SUBMIT = { status: 'opening mail client' };

  var ROUTES = {
    profile: {
      method: 'GET',
      path: '/profile',
      title: 'Atharva Vilas Shelke — Java Backend Developer'
    },
    projects: {
      method: 'GET',
      path: '/projects',
      title: 'Projects — Atharva Vilas Shelke'
    },
    skills: {
      method: 'GET',
      path: '/skills',
      title: 'Skills — Atharva Vilas Shelke'
    },
    contact: {
      method: 'POST',
      path: '/contact',
      title: 'Contact — Atharva Vilas Shelke'
    }
  };

  var SKILL_LABELS = {
    'core-java': 'Core Java',
    'advanced-java': 'Advanced Java',
    'frameworks': 'Frameworks',
    'rest-api': 'REST API',
    'frontend': 'Frontend',
    'databases': 'Databases',
    'tools-and-platforms': 'Tools and Platforms',
    'testing': 'Testing'
  };

  var ESCAPES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return ESCAPES[character];
    });
  }

  function readStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      /* Storage is optional; the page keeps working without it. */
    }
  }

  function profile() {
    return data.profile || {};
  }

  function profileLinks() {
    return profile().links || {};
  }

  function externalLink(url, label) {
    return '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + '</a>';
  }

  function skillLabel(key) {
    if (SKILL_LABELS[key]) {
      return SKILL_LABELS[key];
    }

    return String(key).split('-').map(function (word) {
      if (word === 'and') {
        return 'and';
      }
      if (word === 'api') {
        return 'API';
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  /* ---------- Document view ---------- */

  function renderProfileDocument() {
    var person = profile();
    var links = profileLinks();
    var education = Array.isArray(person.education) ? person.education : [];
    var certifications = Array.isArray(person.certifications) ? person.certifications : [];
    var actions = [];

    if (links.email) {
      actions.push('<li><a href="mailto:' + esc(links.email) + '">Email</a></li>');
    }
    if (links.linkedin) {
      actions.push('<li>' + externalLink(links.linkedin, 'LinkedIn') + '</li>');
    }
    if (links.github) {
      actions.push('<li>' + externalLink(links.github, 'GitHub') + '</li>');
    }
    if (links.resume) {
      actions.push('<li><a href="' + esc(links.resume) + '" target="_blank" rel="noopener noreferrer">Resume (PDF)</a></li>');
    }

    var educationItems = education.map(function (entry) {
      var meta = [entry.period, entry.result, entry.location].filter(Boolean).map(esc);
      return '<li class="entry">' +
        '<h3 class="entry-title">' + esc(entry.institution) + '</h3>' +
        '<p class="entry-credential">' + esc(entry.credential) + '</p>' +
        '<p class="entry-meta">' + meta.join(' · ') + '</p>' +
        '</li>';
    }).join('');

    var certificationItems = certifications.map(function (entry) {
      return '<li class="entry">' +
        '<h3 class="entry-title">' + esc(entry.name) + '</h3>' +
        '<p class="entry-meta">' + esc(entry.issuer) + '</p>' +
        '</li>';
    }).join('');

    return '<article class="sheet">' +
      '<p class="route-label">GET /profile</p>' +
      '<h1 id="page-title" tabindex="-1">' + esc(person.name) + '</h1>' +
      '<p class="profile-title">' + esc(person.title) + '</p>' +
      '<p class="profile-location">' + esc(person.location) + '</p>' +
      '<p class="status"><span class="status-dot" aria-hidden="true"></span>' +
        '<span>Available for ' + esc(person.openTo) + '</span></p>' +
      '<p class="summary">' + esc(person.summary) + '</p>' +
      '<ul class="actions" aria-label="Contact links">' + actions.join('') + '</ul>' +
      '<hr class="rule">' +
      '<section class="block" aria-labelledby="education-heading">' +
        '<h2 id="education-heading">Education</h2>' +
        '<ol class="entries">' + educationItems + '</ol>' +
      '</section>' +
      '<section class="block" aria-labelledby="certifications-heading">' +
        '<h2 id="certifications-heading">Certifications</h2>' +
        '<ol class="entries">' + certificationItems + '</ol>' +
      '</section>' +
      '</article>';
  }

  function renderProjectsDocument() {
    var projects = Array.isArray(data.projects) ? data.projects : [];

    var items = projects.map(function (project) {
      var links = project.links || {};
      var highlights = Array.isArray(project.highlights) ? project.highlights : [];
      var stack = Array.isArray(project.stack) ? project.stack : [];
      var projectLinks = [];

      if (links.repo) {
        projectLinks.push('<li>' + externalLink(links.repo, 'Repository') + '</li>');
      }
      if (links.demo) {
        projectLinks.push('<li>' + externalLink(links.demo, 'Live demo') + '</li>');
      }

      return '<article class="project" aria-labelledby="project-' + esc(project.id) + '">' +
        '<header class="project-header">' +
          '<h2 id="project-' + esc(project.id) + '">' + esc(project.name) + '</h2>' +
          '<p class="project-type">' + esc(project.type) + '</p>' +
        '</header>' +
        '<p class="project-summary">' + esc(project.summary) + '</p>' +
        (highlights.length ? '<ul class="highlights">' + highlights.map(function (item) {
          return '<li>' + esc(item) + '</li>';
        }).join('') + '</ul>' : '') +
        (stack.length ? '<ul class="chips" aria-label="Technology stack">' + stack.map(function (item) {
          return '<li>' + esc(item) + '</li>';
        }).join('') + '</ul>' : '') +
        (projectLinks.length ? '<ul class="actions project-links">' + projectLinks.join('') + '</ul>' : '') +
        '</article>';
    }).join('');

    return '<article class="sheet">' +
      '<p class="route-label">GET /projects</p>' +
      '<h1 id="page-title" tabindex="-1">Projects</h1>' +
      items +
      '</article>';
  }

  function renderSkillsDocument() {
    var skills = data.skills || {};
    var keys = Object.keys(skills);

    var groups = keys.map(function (key) {
      var values = Array.isArray(skills[key]) ? skills[key] : [];
      var label = skillLabel(key);
      return '<section class="skill-group" aria-labelledby="skill-' + esc(key) + '">' +
        '<h2 id="skill-' + esc(key) + '">' + esc(label) + '</h2>' +
        '<ul class="chips" aria-label="' + esc(label) + ' skills">' + values.map(function (value) {
          return '<li>' + esc(value) + '</li>';
        }).join('') + '</ul>' +
        '</section>';
    }).join('');

    return '<article class="sheet">' +
      '<p class="route-label">GET /skills</p>' +
      '<h1 id="page-title" tabindex="-1">Skills</h1>' +
      '<div class="skill-groups">' + groups + '</div>' +
      '</article>';
  }

  function renderContactDocument() {
    var links = profileLinks();
    var rows = [];

    if (links.email) {
      rows.push('<div><dt>Email</dt><dd><a href="mailto:' + esc(links.email) + '">' + esc(links.email) + '</a></dd></div>');
    }
    if (links.phone) {
      rows.push('<div><dt>Phone</dt><dd><a href="tel:' + esc(links.phone.replace(/\s+/g, '')) + '">' + esc(links.phone) + '</a></dd></div>');
    }
    if (links.linkedin) {
      rows.push('<div><dt>LinkedIn</dt><dd>' + externalLink(links.linkedin, links.linkedin.replace(/^https?:\/\//, '')) + '</dd></div>');
    }
    if (links.github) {
      rows.push('<div><dt>GitHub</dt><dd>' + externalLink(links.github, links.github.replace(/^https?:\/\//, '')) + '</dd></div>');
    }

    return '<article class="sheet">' +
      '<p class="route-label">POST /contact</p>' +
      '<h1 id="page-title" tabindex="-1">Contact</h1>' +
      '<p class="section-intro">For Java Software Developer roles, email is the most direct way to get in touch.</p>' +
      '<h2 class="contact-heading">Direct contact</h2>' +
      '<dl class="contact-list">' + rows.join('') + '</dl>' +
      '<h2 class="contact-heading">Send a message</h2>' +
      '<form id="contact-form" novalidate>' +
        '<div class="field">' +
          '<label for="contact-name">Name</label>' +
          '<input id="contact-name" name="name" type="text" autocomplete="name" required aria-describedby="contact-name-error">' +
          '<p class="field-error" id="contact-name-error" hidden></p>' +
        '</div>' +
        '<div class="field">' +
          '<label for="contact-email">Email</label>' +
          '<input id="contact-email" name="email" type="email" autocomplete="email" required aria-describedby="contact-email-error">' +
          '<p class="field-error" id="contact-email-error" hidden></p>' +
        '</div>' +
        '<div class="field">' +
          '<label for="contact-message">Message</label>' +
          '<textarea id="contact-message" name="message" rows="5" required aria-describedby="contact-message-error"></textarea>' +
          '<p class="field-error" id="contact-message-error" hidden></p>' +
        '</div>' +
        '<button class="button" type="submit">Send message</button>' +
      '</form>' +
      '<p class="form-note">Submitting this form opens your email application with the message prefilled. Nothing is sent from this website.</p>' +
      '<div id="contact-result" class="contact-result" aria-live="polite"></div>' +
      '</article>';
  }

  /* ---------- Response view ---------- */

  function payloadFor(route) {
    if (route === 'profile') {
      return data.profile || {};
    }
    if (route === 'projects') {
      return Array.isArray(data.projects) ? data.projects : [];
    }
    if (route === 'skills') {
      return data.skills || {};
    }

    var links = profileLinks();
    var contact = {};
    ['email', 'phone', 'linkedin', 'github'].forEach(function (key) {
      if (links[key]) {
        contact[key] = links[key];
      }
    });
    return contact;
  }

  function renderResponsePanel(method, path, status, statusText, payload) {
    var host = window.location.host || 'localhost';
    var responseTime = 4 + Math.floor(Math.random() * 25);
    var json = JSON.stringify(payload, null, 2);
    var statusClass = status >= 400 ? ' is-error' : '';

    currentJSON = json;

    return '<h1 class="visually-hidden" tabindex="-1">' +
        esc(method + ' ' + path + ' — API response') + '</h1>' +
      '<div class="response">' +
        '<div class="response-bar">' +
          '<p class="response-title">HTTP response</p>' +
          '<button type="button" class="copy-button" aria-describedby="copy-status">Copy JSON</button>' +
        '</div>' +
        '<pre class="code-panel response-panel" tabindex="0" aria-label="HTTP response"><code>' +
          '<span class="http-request">' + esc(method + ' ' + path + ' HTTP/1.1') + '</span>\n' +
          'Host: ' + esc(host) + '\n\n' +
          '<span class="http-status' + statusClass + '">' + esc('HTTP/1.1 ' + status + ' ' + statusText) + '</span>\n' +
          'Content-Type: application/json\n' +
          'X-Response-Time: ' + responseTime + 'ms\n' +
          'X-Powered-By: Java 17\n\n' +
          window.highlightJSON(json) +
        '</code></pre>' +
        '<p class="copy-status" id="copy-status" aria-live="polite"></p>' +
      '</div>';
  }

  function renderSimulatedSubmitPanel() {
    var host = window.location.host || 'localhost';
    var json = JSON.stringify(SIMULATED_SUBMIT, null, 2);

    return '<div class="response secondary-response">' +
        '<div class="response-bar">' +
          '<p class="response-title">Simulated form submission</p>' +
        '</div>' +
        '<pre class="code-panel response-panel" tabindex="0" aria-label="Simulated form submission response"><code>' +
          '<span class="http-request">' + esc('POST /contact HTTP/1.1') + '</span>\n' +
          'Host: ' + esc(host) + '\n\n' +
          '<span class="http-status">' + esc('HTTP/1.1 202 Accepted') + '</span>\n' +
          'Content-Type: application/json\n\n' +
          window.highlightJSON(json) +
        '</code></pre>' +
      '</div>';
  }

  function renderKnownRoute(route) {
    var meta = ROUTES[route];
    var documentMarkup;
    var responseMarkup;

    if (route === 'profile') {
      documentMarkup = renderProfileDocument();
    } else if (route === 'projects') {
      documentMarkup = renderProjectsDocument();
    } else if (route === 'skills') {
      documentMarkup = renderSkillsDocument();
    } else {
      documentMarkup = renderContactDocument();
    }

    responseMarkup = renderResponsePanel(meta.method, meta.path, 200, 'OK', payloadFor(route));
    if (route === 'contact') {
      responseMarkup += renderSimulatedSubmitPanel();
    }

    return {
      document: documentMarkup,
      response: responseMarkup,
      title: meta.title
    };
  }

  function renderNotFound(route) {
    var requested = String(route || '').replace(/^\/+/, '');
    var path = '/' + (requested || '404');
    var payload = {
      error: 'Not Found',
      message: 'This endpoint does not exist.',
      hint: 'Try GET /profile'
    };

    return {
      document: '<article class="sheet">' +
        '<p class="route-label">GET ' + esc(path) + '</p>' +
        '<h1 id="page-title" tabindex="-1">404 — Not Found</h1>' +
        '<p>This endpoint does not exist.</p>' +
        '<p><a href="#profile">Try GET /profile</a></p>' +
        '</article>',
      response: renderResponsePanel('GET', path, 404, 'Not Found', payload),
      title: '404 Not Found — Atharva Vilas Shelke'
    };
  }

  /* ---------- View, theme, router ---------- */

  function setView(view, options) {
    var settings = options || {};
    var next = view === 'response' ? 'response' : 'document';

    currentView = next;
    documentView.hidden = next !== 'document';
    responseView.hidden = next !== 'response';

    viewButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-view') === next ? 'true' : 'false');
    });

    if (settings.persist) {
      writeStorage(VIEW_KEY, next);
    }
  }

  function effectiveTheme() {
    var attribute = document.documentElement.getAttribute('data-theme');
    if (attribute === 'light' || attribute === 'dark') {
      return attribute;
    }
    return mediaQuery && mediaQuery.matches ? 'dark' : 'light';
  }

  function syncThemeUI() {
    var theme = effectiveTheme();
    var next = theme === 'dark' ? 'light' : 'dark';
    var color = theme === 'dark' ? '#0E0F11' : '#FAFAF8';

    if (themeButton) {
      themeButton.textContent = next === 'dark' ? 'Dark' : 'Light';
      themeButton.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    }

    Array.prototype.forEach.call(document.querySelectorAll('meta[name="theme-color"]'), function (meta) {
      meta.setAttribute('content', color);
    });
  }

  function setTheme(theme, persist) {
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    if (persist) {
      writeStorage(THEME_KEY, theme);
    }

    syncThemeUI();
  }

  function render(route, options) {
    var settings = options || {};
    var result = ROUTES[route] ? renderKnownRoute(route) : renderNotFound(route);

    documentView.innerHTML = result.document;
    responseView.innerHTML = result.response;
    document.title = result.title;

    navLinks.forEach(function (link) {
      if (link.getAttribute('data-route') === route) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    if (ROUTES[route] && route === 'contact') {
      initContactForm();
    }

    if (settings.focus) {
      var container = currentView === 'response' ? responseView : documentView;
      var heading = container.querySelector('h1');
      if (heading) {
        heading.focus({ preventScroll: true });
      }
      window.scrollTo(0, 0);
    }
  }

  function currentRoute() {
    var raw = String(window.location.hash || '').replace(/^#/, '');
    return raw || 'profile';
  }

  /* ---------- Contact form ---------- */

  function setFieldError(field, message) {
    var error = document.getElementById(field.id + '-error');
    if (!error) {
      return;
    }

    if (message) {
      error.textContent = message;
      error.hidden = false;
      field.setAttribute('aria-invalid', 'true');
    } else {
      error.textContent = '';
      error.hidden = true;
      field.removeAttribute('aria-invalid');
    }
  }

  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) {
      return;
    }

    var name = document.getElementById('contact-name');
    var email = document.getElementById('contact-email');
    var message = document.getElementById('contact-message');
    var result = document.getElementById('contact-result');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('input', function (event) {
      if (event.target && event.target.getAttribute && event.target.getAttribute('aria-invalid') === 'true') {
        setFieldError(event.target, '');
      }
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var firstInvalid = null;
      var links = profileLinks();

      if (!name.value.trim()) {
        setFieldError(name, 'Enter your name.');
        firstInvalid = firstInvalid || name;
      } else {
        setFieldError(name, '');
      }

      if (!emailPattern.test(email.value.trim())) {
        setFieldError(email, 'Enter a valid email address.');
        firstInvalid = firstInvalid || email;
      } else {
        setFieldError(email, '');
      }

      if (!message.value.trim()) {
        setFieldError(message, 'Enter a message.');
        firstInvalid = firstInvalid || message;
      } else {
        setFieldError(message, '');
      }

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      var subject = 'Portfolio contact from ' + name.value.trim();
      var body = 'Name: ' + name.value.trim() + '\n' +
        'Email: ' + email.value.trim() + '\n\n' +
        message.value.trim();
      var mailto = 'mailto:' + links.email +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      if (result) {
        result.innerHTML = '<div class="simulated-response">' +
          '<p class="simulated-label">Simulated API response</p>' +
          '<pre class="code-panel"><code>' +
            '<span class="http-status">HTTP/1.1 202 Accepted</span>\n' +
            'Content-Type: application/json\n\n' +
            window.highlightJSON(JSON.stringify(SIMULATED_SUBMIT, null, 2)) +
          '</code></pre>' +
          '</div>';
      }

      window.setTimeout(function () {
        window.location.href = mailto;
      }, 0);
    });
  }

  /* ---------- Copy to clipboard ---------- */

  function legacyCopy(text, done) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();

    var copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (error) {
      copied = false;
    }

    document.body.removeChild(area);
    done(copied);
  }

  function copyText(text, statusElement) {
    function done(copied) {
      if (statusElement) {
        statusElement.textContent = copied ?
          'Copied JSON to clipboard.' :
          'Copy failed — select the JSON and copy it manually.';
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        done(true);
      }, function () {
        legacyCopy(text, done);
      });
    } else {
      legacyCopy(text, done);
    }
  }

  /* ---------- Initialization ---------- */

  var storedTheme = readStorage(THEME_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', storedTheme);
  }
  syncThemeUI();

  if (mediaQuery) {
    var onSchemeChange = function () {
      if (!readStorage(THEME_KEY)) {
        syncThemeUI();
      }
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', onSchemeChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(onSchemeChange);
    }
  }

  if (themeButton) {
    themeButton.addEventListener('click', function () {
      setTheme(effectiveTheme() === 'dark' ? 'light' : 'dark', true);
    });
  }

  viewButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      setView(button.getAttribute('data-view'), { persist: true });
    });
  });

  responseView.addEventListener('click', function (event) {
    var button = event.target.closest ? event.target.closest('.copy-button') : null;
    if (!button) {
      return;
    }
    copyText(currentJSON, document.getElementById('copy-status'));
  });

  document.addEventListener('keydown', function (event) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.repeat) {
      return;
    }
    if (event.key !== 'r' && event.key !== 'R') {
      return;
    }

    var target = event.target;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' || target.isContentEditable)) {
      return;
    }

    event.preventDefault();
    setView(responseView.hidden ? 'response' : 'document', { persist: true });
  });

  var skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function (event) {
      event.preventDefault();
      var target = currentView === 'response' ?
        responseView.querySelector('.response-panel') :
        documentView.querySelector('h1');
      if (target) {
        target.focus();
      }
    });
  }

  window.addEventListener('hashchange', function () {
    render(currentRoute(), { focus: true });
  });

  render(currentRoute(), { focus: false });
  setView(readStorage(VIEW_KEY) === 'response' ? 'response' : 'document', { persist: false });
})();
