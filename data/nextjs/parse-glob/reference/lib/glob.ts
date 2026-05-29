function escapeLiteral(ch: string): string {
  // Escape regex metacharacters so the char matches literally.
  if (/[.+^$(){}|\\[\]]/.test(ch)) return '\\' + ch;
  return ch;
}

export function globToRegExp(pattern: string): RegExp {
  let re = '';
  let i = 0;
  const n = pattern.length;

  while (i < n) {
    const c = pattern[i];
    if (c === '*') {
      if (pattern[i + 1] === '*') {
        // ** : match anything including /.
        // Special-case a "/**/" (or leading "**/" / trailing "/**") segment so
        // it can collapse to nothing, letting `a/**/b` match `a/b`.
        const prevSlash = i === 0 || pattern[i - 1] === '/';
        const after = i + 2;
        const nextSlash = after < n && pattern[after] === '/';
        if (prevSlash && nextSlash) {
          // consume the trailing slash too; match zero-or-more whole segments
          re += '(?:.*/)?';
          i = after + 1;
        } else {
          re += '.*';
          i += 2;
        }
      } else {
        // * : match any run of non-/ characters
        re += '[^/]*';
        i += 1;
      }
    } else if (c === '?') {
      re += '[^/]';
      i += 1;
    } else if (c === '[') {
      // character class
      let j = i + 1;
      let negate = false;
      if (pattern[j] === '!' || pattern[j] === '^') {
        negate = true;
        j++;
      }
      let body = '';
      while (j < n && pattern[j] !== ']') {
        const cc = pattern[j];
        // Escape regex-special chars inside a class (\ ] already handled).
        if (cc === '\\') {
          body += '\\\\';
        } else if (cc === ']') {
          break;
        } else {
          body += cc;
        }
        j++;
      }
      if (j >= n) {
        // Unterminated class: treat '[' literally.
        re += '\\[';
        i += 1;
        continue;
      }
      // Never match '/'. Build a negated-or-positive class.
      if (negate) {
        re += `[^/${body}]`;
      } else {
        re += `(?![/])[${body}]`;
      }
      i = j + 1;
    } else if (c === '{') {
      // alternation: collect comma-separated alternatives until matching }
      let j = i + 1;
      const alts: string[] = [];
      let cur = '';
      while (j < n && pattern[j] !== '}') {
        if (pattern[j] === ',') {
          alts.push(cur);
          cur = '';
        } else {
          cur += pattern[j];
        }
        j++;
      }
      if (j >= n) {
        re += '\\{';
        i += 1;
        continue;
      }
      alts.push(cur);
      const compiled = alts.map((a) => globFragment(a));
      re += '(?:' + compiled.join('|') + ')';
      i = j + 1;
    } else {
      re += escapeLiteral(c);
      i += 1;
    }
  }

  return new RegExp('^' + re + '$');
}

// Compile a glob fragment to a regex body (no anchors). Used inside alternation.
function globFragment(frag: string): string {
  const compiled = globToRegExp(frag).source;
  // strip leading ^ and trailing $
  return compiled.slice(1, compiled.length - 1);
}

export function matchGlob(pattern: string, path: string): boolean {
  return globToRegExp(pattern).test(path);
}
