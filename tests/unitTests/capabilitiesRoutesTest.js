const chai = require('chai');  
const expect = chai.expect;

// Test File
// Delete when done
describe('Capabilities', function() {
  describe('Name of Method', function() {
    it('Name of Test Success', function() {
      expect([1, 2, 3].indexOf(4)).equal(-1);
    });
    it('Name of Test Failure', function() {
      expect([1, 2, 3].indexOf(4)).equal(-1);
    });
  });
})