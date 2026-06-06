'use client';
import React, { useEffect, useState } from 'react';
import { Link } from '../../lib/types';

export function HomePage() {
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    fetch('/api/links').then((r) => r.json()).then(setLinks);
  }, []);

  const totalComments = links.reduce((s, l) => s + l.comments.length, 0);
  const top = links[0];

  return (
    <div data-testid="home-page">
      <h1>Link Sharing</h1>
      <div data-testid="stat-links">Links: {links.length}</div>
      <div data-testid="stat-comments">Comments: {totalComments}</div>
      <div data-testid="stat-top">{top ? top.title : 'None'}</div>
    </div>
  );
}
