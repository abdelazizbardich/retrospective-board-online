class Board {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.columns = [];
    this.createdAt = new Date();
    this.adminUserId = null; // Track the admin user
    this.retroState = 'not-started'; // not-started, in-progress, stopped
  }

  addColumn(column) {
    this.columns.push(column);
  }

  removeColumn(columnId) {
    this.columns = this.columns.filter(c => c.id !== columnId);
  }

  getColumn(columnId) {
    return this.columns.find(c => c.id === columnId);
  }

  setAdmin(userId) {
    this.adminUserId = userId;
  }

  isAdmin(userId) {
    return this.adminUserId === userId;
  }

  startRetro() {
    if (this.retroState === 'not-started') {
      this.retroState = 'in-progress';
      return true;
    }
    return false;
  }

  stopRetro() {
    if (this.retroState === 'in-progress') {
      this.retroState = 'stopped';
      return true;
    }
    return false;
  }
}

module.exports = Board;
