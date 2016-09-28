const expect = require('chai').expect;

const ch = require('../index.js');

const auth = {
  token: '97841617075b4b5f8ea88c30a8d2aec7647b7181df2c483fa78138c8d58aed4d',
  workspaceId: '40b6195f-e4f7-4f95-b10e-75268d850988',
  nodeId: '854f0791-c120-4e4a-9264-6dd197cb922c'
};

/* global describe, it, beforeEach */

describe('ContactHub', () => {
  beforeEach(() => {
  });

  it('throws if required params are missing', () => {
    const wrongCall = () => { ch(); };
    expect(wrongCall).to.throw();
  });

  it('returns an object', () => {
    expect(ch(auth)).to.be.a('object');
  });


  describe('getCustomer', () => {
    it('finds an existing Customer', (done) => {
      const cid = 'e65a8339-1bb4-45dd-9b3d-2cd666945b0b';
      ch(auth).getCustomer(cid).then((res) => {
        expect(res.data.id).to.eql(cid);
        done();
      });
    });
  });
});
