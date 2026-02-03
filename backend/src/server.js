const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const boardRoutes = require('./routes/boards');
const boardService = require('./services/boardService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/boards', boardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-board', (boardId) => {
    socket.join(boardId);
    console.log(`User ${socket.id} joined board ${boardId}`);
  });

  socket.on('set-admin', ({ boardId, userId }) => {
    const board = boardService.setAdmin(boardId, userId);
    if (board) {
      io.to(boardId).emit('admin-set', { boardId, adminUserId: board.adminUserId });
    }
  });

  socket.on('leave-board', (boardId) => {
    socket.leave(boardId);
    console.log(`User ${socket.id} left board ${boardId}`);
  });

  socket.on('create-column', ({ boardId, name }) => {
    const column = boardService.createColumn(boardId, name);
    if (column) {
      io.to(boardId).emit('column-created', { boardId, column });
    }
  });

  socket.on('update-column', ({ boardId, columnId, name }) => {
    const column = boardService.updateColumn(boardId, columnId, name);
    if (column) {
      io.to(boardId).emit('column-updated', { boardId, column });
    }
  });

  socket.on('delete-column', ({ boardId, columnId }) => {
    const deleted = boardService.deleteColumn(boardId, columnId);
    if (deleted) {
      io.to(boardId).emit('column-deleted', { boardId, columnId });
    }
  });

  socket.on('create-ticket', ({ boardId, columnId, content, createdBy, createdByName }) => {
    const ticket = boardService.createTicket(boardId, columnId, content, createdBy, createdByName);
    if (ticket) {
      io.to(boardId).emit('ticket-created', { boardId, columnId, ticket });
    }
  });

  socket.on('update-ticket', ({ boardId, columnId, ticketId, updates }) => {
    const ticket = boardService.updateTicket(boardId, columnId, ticketId, updates);
    if (ticket) {
      io.to(boardId).emit('ticket-updated', { boardId, columnId, ticket });
    }
  });

  socket.on('delete-ticket', ({ boardId, columnId, ticketId }) => {
    const deleted = boardService.deleteTicket(boardId, columnId, ticketId);
    if (deleted) {
      io.to(boardId).emit('ticket-deleted', { boardId, columnId, ticketId });
    }
  });

  socket.on('move-ticket', ({ boardId, sourceColumnId, targetColumnId, ticketId }) => {
    const ticket = boardService.moveTicket(boardId, sourceColumnId, targetColumnId, ticketId);
    if (ticket) {
      io.to(boardId).emit('ticket-moved', { 
        boardId, 
        sourceColumnId, 
        targetColumnId, 
        ticket 
      });
    }
  });

  socket.on('vote-ticket', ({ boardId, columnId, ticketId, userId, userName }) => {
    const ticket = boardService.voteTicket(boardId, columnId, ticketId, userId, userName);
    if (ticket) {
      io.to(boardId).emit('ticket-voted', { boardId, columnId, ticket });
    }
  });

  socket.on('unvote-ticket', ({ boardId, columnId, ticketId, userId, userName }) => {
    const ticket = boardService.unvoteTicket(boardId, columnId, ticketId, userId, userName);
    if (ticket) {
      io.to(boardId).emit('ticket-unvoted', { boardId, columnId, ticket });
    }
  });

  socket.on('start-retro', ({ boardId, userId }) => {
    const result = boardService.startRetro(boardId, userId);
    if (result && !result.error) {
      io.to(boardId).emit('retro-started', { boardId, retroState: result.retroState });
    } else {
      socket.emit('retro-error', { error: result?.error || 'Failed to start retro' });
    }
  });

  socket.on('stop-retro', ({ boardId, userId }) => {
    const result = boardService.stopRetro(boardId, userId);
    if (result && !result.error) {
      io.to(boardId).emit('retro-stopped', { boardId, retroState: result.retroState });
    } else {
      socket.emit('retro-error', { error: result?.error || 'Failed to stop retro' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };
