const chai = require('chai');

const { expect } = chai;
const sinon = require('sinon');
const request = require('supertest');

const app = require('../../../app');
const dbCommandsAdmin = require('../../../model/dbCommandsAdmin');

const DatabaseError = require('../../../errors/DatabaseError');

describe('Delete', () => {
  describe('role', () => {
    it('Should return 200 with success message if role deleted', async () => {
      const RoleName = 'FakeRole';
      const deleteARoleStub = sinon.stub(dbCommandsAdmin, 'deleteARole');
      await request(app)
        .delete('/delete/role')
        .set('Accept', 'application/json')
        .expect(200)
        .send({ RoleName })
        .then((response) => {
          expect(response.body.success).to.equal(true);
          expect(response.body.message).to.equal(`${RoleName} Successfully Deleted`);
        });
      deleteARoleStub.restore();
    });
    it('Should return 500 if there is a database error', () => {
      const roleName = 'FakeRole';
      const deleteARoleStub = sinon.stub(dbCommandsAdmin, 'deleteARole');
      deleteARoleStub.throws(new DatabaseError());
      request(app)
        .delete('/delete/role')
        .set('Accept', 'application/json')
        .send({ roleName })
        .expect(500)
        .then((response) => {
          expect(response.text).equal('Database Error');
        });
      deleteARoleStub.restore();
    });
  });
});
