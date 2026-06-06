'use client';
import React, { useEffect, useState } from 'react';
import { Room } from '../../lib/types';
import { useApp } from '../../components/AppStateProvider';

export function RoomPage() {
  const { selectedRoomId, navigate, setSelectedUser } = useApp();
  const [room, setRoom] = useState<Room | null>(null);
  const [msgBody, setMsgBody] = useState('');
  const [author, setAuthor] = useState('guest');
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    if (selectedRoomId) {
      fetch(`/api/rooms/${selectedRoomId}`).then((r) => r.json()).then((d) => setRoom(d.room ?? null));
    }
  }, [selectedRoomId]);

  async function handleSend() {
    if (!msgBody.trim()) { setSendError('Message body is required'); return; }
    if (!room) return;
    const res = await fetch(`/api/rooms/${room.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, body: msgBody }),
    });
    const data = await res.json();
    setRoom((prev) => prev ? { ...prev, messages: [...prev.messages, data.message] } : prev);
    setMsgBody('');
    setSendError('');
  }

  if (!room) return <div data-testid="room-page"><p>No room selected.</p></div>;

  return (
    <div data-testid="room-page">
      <h1 data-testid="room-name">{room.name}</h1>
      <div data-testid="members-list">
        {room.members.map((m) => (
          <span key={m} data-testid={`member-${m}`}>{m}</span>
        ))}
      </div>
      <div data-testid="messages-list">
        {room.messages.map((msg) => (
          <div key={msg.id} data-testid={`message-${msg.id}`}>
            <button data-testid={`msg-author-${msg.id}`} onClick={() => { setSelectedUser(msg.author); navigate('profile'); }}>
              {msg.author}
            </button>
            <span data-testid={`msg-body-${msg.id}`}>{msg.body}</span>
          </div>
        ))}
      </div>
      <input data-testid="author-input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your name" />
      <input data-testid="message-input" value={msgBody} onChange={(e) => { setMsgBody(e.target.value); setSendError(''); }} placeholder="Message..." />
      {sendError && <span data-testid="send-error">{sendError}</span>}
      <button data-testid="send-btn" onClick={handleSend}>Send</button>
    </div>
  );
}
