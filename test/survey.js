var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

process.env.NODE_ENV = 'test';
var server = require('../app');
chai.use(chaiHttp);

describe('Survey', function() {
  let cookie;
  const agent = chai.request.agent(server);

  it('should not allow unauthorized peeps to login', done => {
    chai.request(server)
      .post('/login')
      .send({
        username: 'bob',
        password: 'thomas'
      })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('should not allow me to see admin page', done => {
    chai.request(server)
      .get('/admin')
      .end((err, res) => {
        res.should.redirect;
        done();
      });
  });

  it('should login properly and allow me to see admin page', done => {
    agent
      .post('/login')
      .send({
        username: 'admin',
        password: 'badpassword'
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.cookie;
        agent.get('/admin')
          .end((err, res) => {
            res.should.not.redirect;
            done();
          });
      });
  });

  it('should logout properly', done => {
    agent.get('/logout')
      .end((err, res) => {
        res.should.redirect;
        done();
      });
  });

  it('should allow me to post new question to admin page', done => {
    agent.post('/login')
      .send({
        username: 'admin',
        password: 'badpassword'
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.cookie;
        agent.post('/admin/question')
          .send({
            title: 'Some neat survey question.',
            options: [{
              title: 'Yes',
            }, {
              title: 'No'
            }]
          })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
  })

  it('should show a question on /question GET', done => {
    agent.get('/question')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('title');
        res.body.should.have.property('Options');
        done();
      });
  });

  it('should allow me to select an option', done => {
    agent.get('/question')
      .end((err, res) => {
        const questionId = res.body.id;
        const optionId = res.body.Options[0].id;
        agent.post(`/question/${questionId}`)
          .send({
            optionId: optionId
          })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
  });

});

