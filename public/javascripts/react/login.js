import React from 'react';
import ReactDOM from 'react-dom';

import Rest from 'rest';
import Mime from 'rest/interceptor/mime';
import ErrorCode from 'rest/interceptor/errorCode';

import Message from './react-main';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);

    this.rest = Rest.wrap(Mime, {mime: 'application/json'}).wrap(ErrorCode);
  }

  login(evt) {
    evt.preventDefault();
    const form = evt.target;
    const user = {
      username: form[0].value,
      password: form[1].value
    };

    if (form.checkValidity()) {
      const btn = document.getElementById('login-btn');
      btn.setAttribute('disabled', 'disabled');
      btn.innerHTML = 'please wait...';
      this.rest({
        method: 'post',
        path: '/login',
        entity: user
      }).then(response => {
        window.location = '/admin';
      }, response => {
        // document.getElementById('message').innerHTML = 'Invalid username or password';
        ReactDOM.render(<Message header="alert" message="invalid username or password"/>, 
          document.getElementById('modal'));
        btn.innerHTML = 'login';
        btn.removeAttribute('disabled');
      });
    }
  }

  render() {
    return (
      <div className="login">
        <h2>to the admin panel..</h2>
        <p>login is <em>admin/badpassword</em> unless you changed it.</p>
        <div id="message"></div>
        <form action="/login" method="post" onSubmit={this.login}>
          <ul>
            <li>
              <input type="text" name="username" placeholder="Username" required/>
            </li>
            <li>
              <input type="password" name="password" placeholder="Password" required/>
            </li>
          </ul>
          <button id="login-btn" type="submit" className="btn btn-primary">login</button>
        </form>
      </div>
    );
  }
}

ReactDOM.render(<Login/>, document.getElementById('react'));
