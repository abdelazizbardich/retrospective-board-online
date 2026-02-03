# Retrospective Board Online

A real-time collaborative retrospective board application built with Node.js and Angular, similar to Trello, designed for managing agile retrospective meetings.

## Features

- 🎯 **Dynamic Columns**: Add and remove columns as needed (e.g., "What went well", "What could be improved", "Action items", etc.)
- 🎫 **Ticket Management**: Create, edit, and delete tickets with drag-and-drop support
- 📊 **Status Tracking**: Track ticket status (Created, Taken, Done, Rejected)
- 👥 **Real-time Collaboration**: Multiple users can work simultaneously with WebSocket synchronization
- 👍 **Voting System**: Users can vote on tickets they find relevant
- 🎨 **Modern UI**: Clean and intuitive interface inspired by Trello

## Tech Stack

### Backend
- Node.js
- Express.js
- Socket.IO (for real-time communication)
- In-memory storage (can be extended to use a database)

### Frontend
- Angular 19
- Angular CDK (for drag-and-drop)
- Socket.IO Client
- Standalone Components

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/abdelazizbardich/retrospective-board-online.git
cd retrospective-board-online
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install --legacy-peer-deps
cd ..
```

## Running the Application

### Start the Backend Server
```bash
npm start
```
The backend server will run on `http://localhost:3000`

### Start the Frontend (in a new terminal)
```bash
cd frontend
npm start
```
The frontend will be available at `http://localhost:4200`

## Usage

1. Open your browser and navigate to `http://localhost:4200`
2. The application will load with a default board and three starter columns
3. You can:
   - **Add new columns** using the "+ Add another column" button
   - **Add tickets** to columns using the "+ Add a ticket" button
   - **Drag tickets** between columns
   - **Change ticket status** using the dropdown (Created, Taken, Done, Rejected)
   - **Vote on tickets** by clicking the thumbs up button
   - **Delete tickets or columns** using the × button

## Real-time Collaboration

Multiple users can access the board simultaneously. All changes (creating tickets, voting, moving tickets, etc.) are synchronized in real-time across all connected users via WebSocket.

## API Endpoints

### Boards
- `GET /api/boards` - Get all boards
- `GET /api/boards/:boardId` - Get a specific board
- `POST /api/boards` - Create a new board
- `DELETE /api/boards/:boardId` - Delete a board

### Columns
- `POST /api/boards/:boardId/columns` - Create a column
- `PUT /api/boards/:boardId/columns/:columnId` - Update a column
- `DELETE /api/boards/:boardId/columns/:columnId` - Delete a column

### Tickets
- `POST /api/boards/:boardId/columns/:columnId/tickets` - Create a ticket
- `PUT /api/boards/:boardId/columns/:columnId/tickets/:ticketId` - Update a ticket
- `DELETE /api/boards/:boardId/columns/:columnId/tickets/:ticketId` - Delete a ticket
- `POST /api/boards/:boardId/tickets/:ticketId/move` - Move a ticket between columns
- `POST /api/boards/:boardId/columns/:columnId/tickets/:ticketId/vote` - Vote on a ticket
- `DELETE /api/boards/:boardId/columns/:columnId/tickets/:ticketId/vote` - Remove vote

## WebSocket Events

The application uses Socket.IO for real-time communication. Events include:
- `join-board`, `leave-board`
- `create-column`, `update-column`, `delete-column`
- `create-ticket`, `update-ticket`, `delete-ticket`, `move-ticket`
- `vote-ticket`, `unvote-ticket`

## Project Structure

```
retrospective-board-online/
├── backend/
│   └── src/
│       ├── models/          # Data models
│       ├── routes/          # API routes
│       ├── services/        # Business logic
│       └── server.js        # Main server file
├── frontend/
│   └── src/
│       └── app/
│           ├── components/  # Angular components
│           ├── models/      # TypeScript interfaces
│           └── services/    # Angular services
├── package.json             # Backend dependencies
└── README.md
```

## Future Enhancements

- User authentication and authorization
- Persistent storage (MongoDB, PostgreSQL)
- Multiple boards per user
- Export retrospective data
- Timer for time-boxed discussions
- Anonymous voting mode
- Customizable color schemes

## License

ISC

## Author

Abdelaziz Bardich
