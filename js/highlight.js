/*
 * Minimal JSON syntax highlighter.
 * Tokenizes the pretty-printed JSON produced by JSON.stringify, escapes every
 * character of user-visible text, and wraps tokens in span elements.
 */
(function () {
  'use strict';

  var TOKEN = /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"\s*:)|("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*")|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b/g;

  var ESCAPES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return ESCAPES[character];
    });
  }

  function highlightJSON(json) {
    var source = String(json);
    var output = '';
    var lastIndex = 0;
    var match;

    TOKEN.lastIndex = 0;

    while ((match = TOKEN.exec(source)) !== null) {
      if (match.index > lastIndex) {
        output += escapeHtml(source.slice(lastIndex, match.index));
      }

      if (match[1]) {
        var key = match[1];
        var colonIndex = key.lastIndexOf(':');
        output += '<span class="tok-key">' + escapeHtml(key.slice(0, colonIndex)) + '</span>' +
          escapeHtml(key.slice(colonIndex));
      } else if (match[2]) {
        output += '<span class="tok-string">' + escapeHtml(match[2]) + '</span>';
      } else if (match[3]) {
        output += '<span class="tok-number">' + escapeHtml(match[3]) + '</span>';
      } else if (match[4]) {
        var className = match[4] === 'null' ? 'tok-null' : 'tok-boolean';
        output += '<span class="' + className + '">' + escapeHtml(match[4]) + '</span>';
      }

      lastIndex = TOKEN.lastIndex;
      if (match[0] === '') {
        TOKEN.lastIndex += 1;
      }
    }

    output += escapeHtml(source.slice(lastIndex));
    return output;
  }

  window.highlightJSON = highlightJSON;
})();
