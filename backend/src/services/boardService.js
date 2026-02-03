const { v4: uuidv4 } = require('uuid');
const Board = require('../models/Board');
const Column = require('../models/Column');
const Ticket = require('../models/Ticket');

class BoardService {
  constructor() {
    this.boards = new Map();
    this.initializeDefaultBoard();
  }

  initializeDefaultBoard() {
    const boardId = uuidv4();
    const board = new Board(boardId, 'My Retrospective Board');
    
    // Add default columns
    const defaultColumns = [
      'What went well',
      'What could be improved',
      'Action items'
    ];

    defaultColumns.forEach(columnName => {
      const columnId = uuidv4();
      const column = new Column(columnId, columnName, boardId);
      board.addColumn(column);
    });

    this.boards.set(boardId, board);
  }

  getAllBoards() {
    return Array.from(this.boards.values());
  }

  getBoard(boardId) {
    return this.boards.get(boardId);
  }

  createBoard(name) {
    const boardId = uuidv4();
    const board = new Board(boardId, name);
    this.boards.set(boardId, board);
    return board;
  }

  deleteBoard(boardId) {
    return this.boards.delete(boardId);
  }

  // Column operations
  createColumn(boardId, name) {
    const board = this.boards.get(boardId);
    if (!board) return null;

    const columnId = uuidv4();
    const column = new Column(columnId, name, boardId);
    board.addColumn(column);
    return column;
  }

  deleteColumn(boardId, columnId) {
    const board = this.boards.get(boardId);
    if (!board) return false;

    board.removeColumn(columnId);
    return true;
  }

  updateColumn(boardId, columnId, name) {
    const board = this.boards.get(boardId);
    if (!board) return null;

    const column = board.getColumn(columnId);
    if (!column) return null;

    column.name = name;
    return column;
  }

  // Ticket operations
  createTicket(boardId, columnId, content, createdBy = null, createdByName = null) {
    const board = this.boards.get(boardId);
    if (!board) return null;

    const column = board.getColumn(columnId);
    if (!column) return null;

    const ticketId = uuidv4();
    const ticket = new Ticket(ticketId, content, columnId, createdBy, createdByName);
    column.addTicket(ticket);
    return ticket;
  }

  updateTicket(boardId, columnId, ticketId, updates) {
    const board = this.boards.get(boardId);
    if (!board) return null;

    const column = board.getColumn(columnId);
    if (!column) return null;

    const ticket = column.getTicket(ticketId);
    if (!ticket) return null;

    if (updates.content !== undefined) {
      ticket.content = updates.content;
    }
    if (updates.status !== undefined) {
      ticket.updateStatus(updates.status);
    }
    ticket.updatedAt = new Date();
    return ticket;
  }

  deleteTicket(boardId, columnId, ticketId) {
    const board = this.boards.get(boardId);
    if (!board) return false;

    const column = board.getColumn(columnId);
    if (!column) return false;

    column.removeTicket(ticketId);
    return true;
  }

  moveTicket(boardId, sourceColumnId, targetColumnId, ticketId) {
    const board = this.boards.get(boardId);
    if (!board) return null;

    const sourceColumn = board.getColumn(sourceColumnId);
    const targetColumn = board.getColumn(targetColumnId);
    
    if (!sourceColumn || !targetColumn) return null;

    const ticket = sourceColumn.getTicket(ticketId);
    if (!ticket) return null;

    sourceColumn.removeTicket(ticketId);
    ticket.columnId = targetColumnId;
    ticket.updatedAt = new Date();
    targetColumn.addTicket(ticket);
    
    return ticket;
  }

  voteTicket(boardId, columnId, ticketId, userId, userName = null) {
    const board = this.boards.get(boardId);
    if (!board) return null;

    const column = board.getColumn(columnId);
    if (!column) return null;

    const ticket = column.getTicket(ticketId);
    if (!ticket) return null;

    ticket.addVote(userId, userName);
    return ticket;
  }

  unvoteTicket(boardId, columnId, ticketId, userId, userName = null) {
    const board = this.boards.get(boardId);
    if (!board) return null;

    const column = board.getColumn(columnId);
    if (!column) return null;

    const ticket = column.getTicket(ticketId);
    if (!ticket) return null;

    ticket.removeVote(userId, userName);
    return ticket;
  }

  // Admin operations
  setAdmin(boardId, userId) {
    const board = this.boards.get(boardId);
    if (!board) return null;

    board.setAdmin(userId);
    return board;
  }

  startRetro(boardId, userId) {
    const board = this.boards.get(boardId);
    if (!board) return null;

    if (!board.isAdmin(userId)) {
      return { error: 'Only admin can start retro' };
    }

    if (board.startRetro()) {
      return board;
    }
    return { error: 'Retro already started' };
  }

  stopRetro(boardId, userId) {
    const board = this.boards.get(boardId);
    if (!board) return null;

    if (!board.isAdmin(userId)) {
      return { error: 'Only admin can stop retro' };
    }

    if (board.stopRetro()) {
      return board;
    }
    return { error: 'Retro not in progress' };
  }
}

module.exports = new BoardService();
