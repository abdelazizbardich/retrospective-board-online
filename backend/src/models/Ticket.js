class Ticket {
  constructor(id, content, columnId) {
    this.id = id;
    this.content = content;
    this.columnId = columnId;
    this.status = 'created'; // created, taken, done, rejected
    this.votes = 0;
    this.voters = []; // Track who voted
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateStatus(status) {
    const validStatuses = ['created', 'taken', 'done', 'rejected'];
    if (validStatuses.includes(status)) {
      this.status = status;
      this.updatedAt = new Date();
    }
  }

  addVote(userId) {
    if (!this.voters.includes(userId)) {
      this.voters.push(userId);
      this.votes++;
      this.updatedAt = new Date();
      return true;
    }
    return false;
  }

  removeVote(userId) {
    const index = this.voters.indexOf(userId);
    if (index > -1) {
      this.voters.splice(index, 1);
      this.votes--;
      this.updatedAt = new Date();
      return true;
    }
    return false;
  }
}

module.exports = Ticket;
