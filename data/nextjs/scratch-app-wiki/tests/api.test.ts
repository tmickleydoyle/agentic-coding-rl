import { describe, it, expect, beforeEach } from 'vitest';
import { __reset, getArticles, createArticle, editArticle, getArticle } from '../lib/store';

beforeEach(() => { __reset(); });

describe('Wiki API (store layer)', () => {
  it('getArticles returns 3 seed articles', () => {
    expect(getArticles().length).toBe(3);
  });

  it('getArticles returns newest updatedAt first', () => {
    const articles = getArticles();
    expect(articles[0].id).toBe('a3');
    expect(articles[2].id).toBe('a1');
  });

  it('createArticle adds article with initial revision', () => {
    const a = createArticle({ title: 'New', body: 'Body', author: 'dave', tags: ['test'] });
    expect(a.revisions.length).toBe(1);
    expect(a.revisions[0].editedBy).toBe('dave');
  });

  it('getArticles length increases after create', () => {
    createArticle({ title: 'X', body: 'Y', author: 'z', tags: [] });
    expect(getArticles().length).toBe(4);
  });

  it('editArticle appends revision', () => {
    editArticle('a1', { body: 'Updated body', editedBy: 'bob' });
    const a = getArticle('a1')!;
    expect(a.revisions.length).toBe(2);
    expect(a.body).toBe('Updated body');
  });

  it('editArticle on unknown id returns null', () => {
    expect(editArticle('unknown', { body: 'x', editedBy: 'y' })).toBeNull();
  });

  it('getArticle returns undefined for unknown id', () => {
    expect(getArticle('unknown')).toBeUndefined();
  });

  it('createArticle parses tags correctly', () => {
    const a = createArticle({ title: 'T', body: 'B', author: 'a', tags: ['one', 'two'] });
    expect(a.tags).toEqual(['one', 'two']);
  });
});
