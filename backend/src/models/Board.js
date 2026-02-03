class Board {
  constructor(id, name, roomCode = null) {
    this.id = id;
    this.name = name;
    this.roomCode = roomCode; // 6-character alphanumeric code for joining
    this.columns = [];
    this.createdAt = new Date();
    this.adminUserId = null; // Track the admin user
    this.retroState = 'not-started'; // not-started, in-progress, stopped
    this.showUserNames = true; // Toggle for showing/hiding usernames (default: visible)
    this.sessionPhase = 'setup'; // setup, creating, voting, review, ended
    this.timer = null; // { type: 'creating'|'voting', duration: ms, startTime: timestamp }
    this.participants = []; // Array of {userId, username}
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

  toggleUserNames(userId) {
    if (!this.isAdmin(userId)) {
      return { error: 'Only admin can toggle username visibility' };
    }
    this.showUserNames = !this.showUserNames;
    return true;
  }

  addParticipant(userId, username) {
    if (!this.participants.find(p => p.userId === userId)) {
      this.participants.push({ userId, username, joinedAt: new Date() });
    }
  }

  startTimer(type, durationMinutes, userId) {
    if (!this.isAdmin(userId)) {
      return { error: 'Only admin can start timer' };
    }
    this.timer = {
      type, // 'creating' or 'voting'
      duration: durationMinutes * 60 * 1000, // Convert to ms
      startTime: Date.now()
    };
    return true;
  }

  stopTimer(userId) {
    if (!this.isAdmin(userId)) {
      return { error: 'Only admin can stop timer' };
    }
    this.timer = null;
    return true;
  }

  setSessionPhase(phase, userId) {
    if (!this.isAdmin(userId)) {
      return { error: 'Only admin can change session phase' };
    }
    const validPhases = ['setup', 'creating', 'voting', 'review', 'ended'];
    if (validPhases.includes(phase)) {
      this.sessionPhase = phase;
      return true;
    }
    return { error: 'Invalid session phase' };
  }

  endSession(userId) {
    if (!this.isAdmin(userId)) {
      return { error: 'Only admin can end session' };
    }
    this.sessionPhase = 'ended';
    this.timer = null;
    this.retroState = 'stopped';
    return true;
  }
}

module.exports = Board;
