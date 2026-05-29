import { describe, it, expect } from 'vitest';
import { render } from '../lib/template';

describe('render', () => {
  it('interpolates a simple variable', () => {
    expect(render('Hi {{name}}', { name: 'A' })).toBe('Hi A');
    expect(render('{{ name }}', { name: 'B' })).toBe('B');
  });

  it('resolves dotted paths', () => {
    expect(render('{{a.b}}', { a: { b: 1 } })).toBe('1');
    expect(render('{{a.b.c}}', { a: { b: { c: 'deep' } } })).toBe('deep');
  });

  it('escapes HTML by default and not in triple braces', () => {
    expect(render('{{x}}', { x: '<b>&"' })).toBe('&lt;b&gt;&amp;&quot;');
    expect(render('{{{x}}}', { x: '<b>' })).toBe('<b>');
  });

  it('missing paths render as empty string', () => {
    expect(render('[{{nope}}]', {})).toBe('[]');
    expect(render('[{{a.b.c}}]', { a: {} })).toBe('[]');
  });

  it('renders if blocks when truthy', () => {
    expect(render('{{#if ok}}Y{{/if}}', { ok: true })).toBe('Y');
    expect(render('{{#if ok}}Y{{/if}}', { ok: false })).toBe('');
    expect(render('{{#if n}}Y{{/if}}', { n: 0 })).toBe('');
    expect(render('{{#if s}}Y{{/if}}', { s: '' })).toBe('');
  });

  it('treats empty arrays as falsy in if', () => {
    expect(render('{{#if xs}}Y{{/if}}', { xs: [] })).toBe('');
    expect(render('{{#if xs}}Y{{/if}}', { xs: [1] })).toBe('Y');
  });

  it('iterates arrays with this and @index', () => {
    expect(
      render('{{#each xs}}[{{@index}}:{{this}}]{{/each}}', { xs: ['a', 'b'] }),
    ).toBe('[0:a][1:b]');
  });

  it('each over objects resolves item fields', () => {
    const tpl = '{{#each users}}{{name}}({{age}}) {{/each}}';
    const data = {
      users: [
        { name: 'Al', age: 30 },
        { name: 'Bo', age: 25 },
      ],
    };
    expect(render(tpl, data)).toBe('Al(30) Bo(25) ');
  });

  it('each over a missing or non-array renders nothing', () => {
    expect(render('x{{#each xs}}Y{{/each}}z', {})).toBe('xz');
    expect(render('x{{#each xs}}Y{{/each}}z', { xs: 'nope' })).toBe('xz');
  });

  it('nests each inside if', () => {
    const tpl = '{{#if show}}{{#each xs}}{{this}}{{/each}}{{/if}}';
    expect(render(tpl, { show: true, xs: [1, 2, 3] })).toBe('123');
    expect(render(tpl, { show: false, xs: [1, 2, 3] })).toBe('');
  });

  it('nests if inside each', () => {
    const tpl = '{{#each xs}}{{#if this}}[{{this}}]{{/if}}{{/each}}';
    expect(render(tpl, { xs: [1, 0, 2] })).toBe('[1][2]');
  });

  it('throws on mismatched or unterminated blocks', () => {
    expect(() => render('{{#if a}}x', {})).toThrow();
    expect(() => render('{{#each a}}x{{/if}}', {})).toThrow();
    expect(() => render('x{{/if}}', {})).toThrow();
  });

  it('emits literal text verbatim', () => {
    expect(render('plain text no tags', {})).toBe('plain text no tags');
  });
});
