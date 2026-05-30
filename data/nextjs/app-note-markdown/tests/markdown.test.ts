import { it, expect } from 'vitest'
import { renderMarkdown, wordCount } from '../lib/markdown'

it('renders an h1 heading', () => {
  expect(renderMarkdown('# Title')).toBe('<h1>Title</h1>')
})

it('renders h2 and h3 headings', () => {
  expect(renderMarkdown('## Two')).toBe('<h2>Two</h2>')
  expect(renderMarkdown('### Three')).toBe('<h3>Three</h3>')
})

it('renders a bullet list wrapped in a single ul', () => {
  expect(renderMarkdown('- one\n- two')).toBe('<ul><li>one</li><li>two</li></ul>')
})

it('joins consecutive plain lines into one paragraph', () => {
  expect(renderMarkdown('hello\nworld')).toBe('<p>hello world</p>')
})

it('separates paragraphs on blank lines', () => {
  expect(renderMarkdown('one\n\ntwo')).toBe('<p>one</p><p>two</p>')
})

it('renders inline bold', () => {
  expect(renderMarkdown('a **b** c')).toBe('<p>a <strong>b</strong> c</p>')
})

it('renders inline code', () => {
  expect(renderMarkdown('use `x` now')).toBe('<p>use <code>x</code> now</p>')
})

it('renders bold and code together in one line', () => {
  expect(renderMarkdown('**hi** and `yo`')).toBe('<p><strong>hi</strong> and <code>yo</code></p>')
})

it('escapes raw angle brackets in text', () => {
  expect(renderMarkdown('a < b')).toBe('<p>a &lt; b</p>')
})

it('counts words', () => {
  expect(wordCount('one two three')).toBe(3)
  expect(wordCount('  spaced   out  ')).toBe(2)
})

it('counts zero words for empty or whitespace', () => {
  expect(wordCount('')).toBe(0)
  expect(wordCount('   ')).toBe(0)
})
