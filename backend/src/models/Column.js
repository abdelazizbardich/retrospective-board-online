class Column {
  constructor(id, name, boardId) {
    this.id = id;
    this.name = name;
    this.boardId = boardId;
    this.tickets = [];
    this.createdAt = new Date();
  }

  addTicket(ticket) {
    this.tickets.push(ticket);
  }

  removeTicket(ticketId) {
    this.tickets = this.tickets.filter(t => t.id !== ticketId);
  }

  getTicket(ticketId) {
    return this.tickets.find(t => t.id === ticketId);
  }
}

module.exports = Column;
