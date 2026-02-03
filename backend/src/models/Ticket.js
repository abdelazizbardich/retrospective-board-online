class Ticket {
  constructor(id, content, columnId, createdBy = null, createdByName = null) {
    this.id = id;
    this.content = content;
    this.columnId = columnId;
    this.status = 'created'; // created, taken, done, rejected
    this.votes = 0;
    this.voters = []; // Track who voted (userId)
    this.voterNames = []; // Track voter names
    this.createdBy = createdBy; // User ID of creator
    this.createdByName = createdByName; // Username of creator
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

  addVote(userId, userName = null) {
    if (!this.voters.includes(userId)) {
      this.voters.push(userId);
      if (userName) {
        this.voterNames.push(userName);
      }
      this.votes++;
      this.updatedAt = new Date();
      return true;
    }
    return false;
  }

  removeVote(userId, userName = null) {
    const index = this.voters.indexOf(userId);
    if (index > -1) {
      this.voters.splice(index, 1);
      if (userName && this.voterNames.includes(userName)) {
        const nameIndex = this.voterNames.indexOf(userName);
        if (nameIndex > -1) {
          this.voterNames.splice(nameIndex, 1);
        }
      }
      this.votes--;
      this.updatedAt = new Date();
      return true;
    }
    return false;
  }
}

module.exports = Ticket;
