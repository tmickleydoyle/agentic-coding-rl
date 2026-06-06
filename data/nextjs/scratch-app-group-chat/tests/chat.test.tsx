import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../app/page';
import { __reset } from '../lib/store';

beforeEach(() => { __reset(); });

describe('Group Chat Feature', () => {
  it('shows rooms list', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-rooms'));
    await waitFor(() => expect(screen.getByTestId('room-row-room1')).toBeTruthy());
    expect(screen.getByTestId('room-row-room2')).toBeTruthy();
    expect(screen.getByTestId('room-row-room3')).toBeTruthy();
  });

  it('shows member and message count per room', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-rooms'));
    await waitFor(() => screen.getByTestId('room-members-room1'));
    expect(screen.getByTestId('room-members-room1').textContent).toContain('3');
    expect(screen.getByTestId('room-messages-room1').textContent).toContain('2');
  });

  it('clicking room navigates to room page', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-rooms'));
    await waitFor(() => screen.getByTestId('room-link-room1'));
    fireEvent.click(screen.getByTestId('room-link-room1'));
    await waitFor(() => expect(screen.getByTestId('room-page')).toBeTruthy());
  });

  it('room page shows messages', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-rooms'));
    await waitFor(() => screen.getByTestId('room-link-room1'));
    fireEvent.click(screen.getByTestId('room-link-room1'));
    await waitFor(() => screen.getByTestId('message-m1'));
    expect(screen.getByTestId('msg-body-m1').textContent).toBe('Hello everyone!');
  });

  it('room page shows members list', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-rooms'));
    await waitFor(() => screen.getByTestId('room-link-room1'));
    fireEvent.click(screen.getByTestId('room-link-room1'));
    await waitFor(() => screen.getByTestId('members-list'));
    expect(screen.getByTestId('member-alice')).toBeTruthy();
  });

  it('send message error on empty body', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-rooms'));
    await waitFor(() => screen.getByTestId('room-link-room1'));
    fireEvent.click(screen.getByTestId('room-link-room1'));
    await waitFor(() => screen.getByTestId('send-btn'));
    fireEvent.click(screen.getByTestId('send-btn'));
    expect(screen.getByTestId('send-error')).toBeTruthy();
  });

  it('sends a message successfully', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-rooms'));
    await waitFor(() => screen.getByTestId('room-link-room3'));
    fireEvent.click(screen.getByTestId('room-link-room3'));
    await waitFor(() => screen.getByTestId('message-input'));
    fireEvent.change(screen.getByTestId('message-input'), { target: { value: 'Hello!' } });
    fireEvent.click(screen.getByTestId('send-btn'));
    await waitFor(() => screen.getByTestId('messages-list'));
  });
});
