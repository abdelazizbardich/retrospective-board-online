class Board {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.columns = [];
    this.createdAt = new Date();
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
}

module.exports = Board;
