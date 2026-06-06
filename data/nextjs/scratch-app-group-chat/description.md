# scratch-app-group-chat

A group chat application with multiple rooms, message history, member management, and user profiles.

## Routes
- **Home** (`home`) — landing page showing total rooms, total messages, and active members count
- **Rooms** (`rooms`) — list of all chat rooms with name, description, member count, message count
- **Room** (`room`) — selected room's message history and a send message form; also shows member list
- **Profile** (`profile`) — selected user's message history across all rooms

## Seed Data
Three rooms:
1. id:"room1", name:"General", description:"General chat", members:["alice","bob","carol"], messages:[{id:"m1",author:"alice",body:"Hello everyone!",sentAt:"2024-01-01T10:00:00Z"},{id:"m2",author:"bob",body:"Hi Alice!",sentAt:"2024-01-01T10:01:00Z"}]
2. id:"room2", name:"Tech Talk", description:"Tech discussions", members:["alice","bob"], messages:[{id:"m3",author:"bob",body:"Anyone know TypeScript?",sentAt:"2024-01-02T10:00:00Z"}]
3. id:"room3", name:"Off-Topic", description:"Random stuff", members:["carol"], messages:[]

## Behaviors
- **List rooms**: GET /api/rooms → 200 [{...rooms}]
- **Get room**: GET /api/rooms/[id] → 200 {room} or 404
- **Send message**: POST /api/rooms/[id]/messages body {author,body} → 201 {message}; missing fields → 400
- **Join room**: POST /api/rooms/[id]/join body {username} → 200 {members}; missing username → 400
- Home stats: room count, total messages, distinct members count
- Room page: messages list (data-testid="messages-list"), member list (data-testid="members-list"), send form with author + body inputs
- Send message clears input after success
- Clicking room row navigates to room route and sets selectedRoomId in context
- Clicking message author navigates to profile route and sets selectedUser

## Edge Cases
- Sending message with empty body shows inline error (data-testid="send-error")
- GET /api/rooms/[id] unknown id returns 404 {error:"not found"}
- Join adds username to members if not already present (idempotent)
