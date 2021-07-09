const chai = require('chai');

const { expect } = chai;

// Test File
// Delete when done
describe('Capabilities', () => {
  describe('Name of Method', () => {
    it('Name of Test Success', () => {
      expect([1, 2, 3].indexOf(4)).equal(-1);
    });
    it('Name of Test Failure', () => {
      expect([1, 2, 3].indexOf(4)).equal(-1);
    });
  });
});
