import { describe, it, expect } from 'vitest';
import { compile, match } from '../lib/route';

describe('route matching', () => {
  it('matches static segments exactly', () => {
    expect(match('/a/b', '/a/b')).toEqual({});
    expect(match('/a/b', '/a/c')).toBeNull();
    expect(match('/a/b', '/a')).toBeNull();
    expect(match('/a', '/a/b')).toBeNull();
  });

  it('captures a single param', () => {
    expect(match('/users/:id', '/users/42')).toEqual({ id: '42' });
    expect(match('/users/:id', '/users')).toBeNull();
    expect(match('/users/:id', '/users/42/x')).toBeNull();
  });

  it('captures multiple params', () => {
    expect(match('/u/:uid/p/:pid', '/u/7/p/9')).toEqual({ uid: '7', pid: '9' });
  });

  it('treats leading slash as optional', () => {
    expect(match('users/:id', 'users/5')).toEqual({ id: '5' });
    expect(match('/users/:id', 'users/5')).toEqual({ id: '5' });
  });

  it('ignores a trailing slash on the path', () => {
    expect(match('/users/:id', '/users/1/')).toEqual({ id: '1' });
  });

  it('matches the root pattern', () => {
    expect(match('/', '/')).toEqual({});
    expect(match('/', '')).toEqual({});
    expect(match('/', '/x')).toBeNull();
  });

  it('wildcard tail captures the rest joined by slash', () => {
    expect(match('/files/:path*', '/files/a/b/c.txt')).toEqual({
      path: 'a/b/c.txt',
    });
    expect(match('/files/:path*', '/files/one')).toEqual({ path: 'one' });
  });

  it('wildcard tail with no remaining segments captures empty string', () => {
    expect(match('/files/:path*', '/files')).toEqual({ path: '' });
  });

  it('optional param present and absent', () => {
    expect(match('/posts/:id?', '/posts/5')).toEqual({ id: '5' });
    expect(match('/posts/:id?', '/posts')).toEqual({});
  });

  it('optional in the middle still matches a trailing required segment', () => {
    expect(match('/a/:x?/b', '/a/b')).toEqual({});
    expect(match('/a/:x?/b', '/a/mid/b')).toEqual({ x: 'mid' });
  });

  it('URL-decodes captured params', () => {
    expect(match('/u/:name', '/u/john%20doe')).toEqual({ name: 'john doe' });
    expect(match('/files/:path*', '/files/a%2Fb/c')).toEqual({
      path: 'a/b/c',
    });
  });

  it('compile returns a reusable matcher', () => {
    const r = compile('/x/:id');
    expect(r.match('/x/1')).toEqual({ id: '1' });
    expect(r.match('/x/2')).toEqual({ id: '2' });
    expect(r.match('/y/1')).toBeNull();
  });
});
