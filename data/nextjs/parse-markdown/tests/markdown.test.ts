import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '../lib/markdown';

describe('renderMarkdown', () => {
  it('renders ATX headings of every level', () => {
    expect(renderMarkdown('# Title')).toBe('<h1>Title</h1>');
    expect(renderMarkdown('###### Deep')).toBe('<h6>Deep</h6>');
  });

  it('treats 7+ hashes as a paragraph', () => {
    expect(renderMarkdown('####### nope')).toBe('<p>####### nope</p>');
  });

  it('wraps loose text in a paragraph and joins wrapped lines', () => {
    expect(renderMarkdown('hello world')).toBe('<p>hello world</p>');
    expect(renderMarkdown('one\ntwo')).toBe('<p>one two</p>');
  });

  it('renders bold and italic', () => {
    expect(renderMarkdown('a **b** c')).toBe('<p>a <strong>b</strong> c</p>');
    expect(renderMarkdown('a *b* c')).toBe('<p>a <em>b</em> c</p>');
  });

  it('renders inline code without further formatting inside', () => {
    expect(renderMarkdown('use `a*b*c` ok')).toBe(
      '<p>use <code>a*b*c</code> ok</p>',
    );
  });

  it('renders unordered lists', () => {
    expect(renderMarkdown('- one\n- two')).toBe(
      '<ul><li>one</li><li>two</li></ul>',
    );
  });

  it('lists support inline formatting in items', () => {
    expect(renderMarkdown('- **a**\n- `b`')).toBe(
      '<ul><li><strong>a</strong></li><li><code>b</code></li></ul>',
    );
  });

  it('escapes HTML special characters', () => {
    expect(renderMarkdown('1 < 2 & 3 > 0')).toBe('<p>1 &lt; 2 &amp; 3 &gt; 0</p>');
  });

  it('escapes content inside code spans too', () => {
    expect(renderMarkdown('`<div>`')).toBe('<p><code>&lt;div&gt;</code></p>');
  });

  it('renders links with escaped urls and formatted labels', () => {
    expect(renderMarkdown('[go](/x)')).toBe('<p><a href="/x">go</a></p>');
    expect(renderMarkdown('[**b**](u)')).toBe(
      '<p><a href="u"><strong>b</strong></a></p>',
    );
  });

  it('separates blocks split by blank lines and ignores extra blanks', () => {
    expect(renderMarkdown('\n\n# H\n\n\npara\n\n')).toBe('<h1>H</h1><p>para</p>');
  });

  it('returns empty string for blank input', () => {
    expect(renderMarkdown('')).toBe('');
    expect(renderMarkdown('   \n\n  ')).toBe('');
  });

  it('handles a mixed multi-block document', () => {
    const md = '# Heading\n\nA *para* line.\n\n- item one\n- item two';
    expect(renderMarkdown(md)).toBe(
      '<h1>Heading</h1><p>A <em>para</em> line.</p><ul><li>item one</li><li>item two</li></ul>',
    );
  });
});
