const express = require('express');
const router = express.Router();
const boardService = require('../services/boardService');

// Get all boards
router.get('/', (req, res) => {
  const boards = boardService.getAllBoards();
  res.json(boards);
});

// Get a specific board
router.get('/:boardId', (req, res) => {
  const board = boardService.getBoard(req.params.boardId);
  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }
  res.json(board);
});

// Create a new board
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Board name is required' });
  }
  const board = boardService.createBoard(name);
  res.status(201).json(board);
});

// Delete a board
router.delete('/:boardId', (req, res) => {
  const deleted = boardService.deleteBoard(req.params.boardId);
  if (!deleted) {
    return res.status(404).json({ error: 'Board not found' });
  }
  res.status(204).send();
});

// Create a column
router.post('/:boardId/columns', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Column name is required' });
  }
  const column = boardService.createColumn(req.params.boardId, name);
  if (!column) {
    return res.status(404).json({ error: 'Board not found' });
  }
  res.status(201).json(column);
});

// Update a column
router.put('/:boardId/columns/:columnId', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Column name is required' });
  }
  const column = boardService.updateColumn(req.params.boardId, req.params.columnId, name);
  if (!column) {
    return res.status(404).json({ error: 'Board or column not found' });
  }
  res.json(column);
});

// Delete a column
router.delete('/:boardId/columns/:columnId', (req, res) => {
  const deleted = boardService.deleteColumn(req.params.boardId, req.params.columnId);
  if (!deleted) {
    return res.status(404).json({ error: 'Board or column not found' });
  }
  res.status(204).send();
});

// Create a ticket
router.post('/:boardId/columns/:columnId/tickets', (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Ticket content is required' });
  }
  const ticket = boardService.createTicket(
    req.params.boardId,
    req.params.columnId,
    content
  );
  if (!ticket) {
    return res.status(404).json({ error: 'Board or column not found' });
  }
  res.status(201).json(ticket);
});

// Update a ticket
router.put('/:boardId/columns/:columnId/tickets/:ticketId', (req, res) => {
  const updates = {};
  if (req.body.content !== undefined) updates.content = req.body.content;
  if (req.body.status !== undefined) updates.status = req.body.status;

  const ticket = boardService.updateTicket(
    req.params.boardId,
    req.params.columnId,
    req.params.ticketId,
    updates
  );
  if (!ticket) {
    return res.status(404).json({ error: 'Board, column, or ticket not found' });
  }
  res.json(ticket);
});

// Delete a ticket
router.delete('/:boardId/columns/:columnId/tickets/:ticketId', (req, res) => {
  const deleted = boardService.deleteTicket(
    req.params.boardId,
    req.params.columnId,
    req.params.ticketId
  );
  if (!deleted) {
    return res.status(404).json({ error: 'Board, column, or ticket not found' });
  }
  res.status(204).send();
});

// Move a ticket
router.post('/:boardId/tickets/:ticketId/move', (req, res) => {
  const { sourceColumnId, targetColumnId } = req.body;
  if (!sourceColumnId || !targetColumnId) {
    return res.status(400).json({ error: 'Source and target column IDs are required' });
  }
  const ticket = boardService.moveTicket(
    req.params.boardId,
    sourceColumnId,
    targetColumnId,
    req.params.ticketId
  );
  if (!ticket) {
    return res.status(404).json({ error: 'Board, columns, or ticket not found' });
  }
  res.json(ticket);
});

// Vote on a ticket
router.post('/:boardId/columns/:columnId/tickets/:ticketId/vote', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  const ticket = boardService.voteTicket(
    req.params.boardId,
    req.params.columnId,
    req.params.ticketId,
    userId
  );
  if (!ticket) {
    return res.status(404).json({ error: 'Board, column, or ticket not found' });
  }
  res.json(ticket);
});

// Unvote a ticket
router.delete('/:boardId/columns/:columnId/tickets/:ticketId/vote', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  const ticket = boardService.unvoteTicket(
    req.params.boardId,
    req.params.columnId,
    req.params.ticketId,
    userId
  );
  if (!ticket) {
    return res.status(404).json({ error: 'Board, column, or ticket not found' });
  }
  res.json(ticket);
});

module.exports = router;
