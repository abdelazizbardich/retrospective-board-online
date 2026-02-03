/**
 * Generate a random 6-character alphanumeric room code
 * Format: ABC123 (3 uppercase letters + 3 digits)
 */
function generateRoomCode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let code = '';
  
  // Generate 3 random letters
  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Generate 3 random numbers
  for (let i = 0; i < 3; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return code;
}

/**
 * Check if a room code is valid format
 */
function isValidRoomCode(code) {
  if (!code || typeof code !== 'string') return false;
  // Should be 6 characters: 3 letters + 3 numbers
  return /^[A-Z]{3}[0-9]{3}$/.test(code.toUpperCase());
}

module.exports = {
  generateRoomCode,
  isValidRoomCode
};
