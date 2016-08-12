import React from 'react';
import ReactDOM from 'react-dom';

import Message from './react-main';

import Rest from 'rest';
import Mime from 'rest/interceptor/mime';
import ErrorCode from 'rest/interceptor/errorCode';

import _ from 'lodash';

class Thanks extends React.Component {
  render() {
    return (
      <div className="thanks">
        <h2 className="text-success">thanks for taking our survey.</h2>
        <h3>you were great. best survey taker in the word.</h3>
      </div>
    );
  }
}

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      question: {
        Options: []
      }
    };
    
    this.select = this.select.bind(this);
    this.submit = this.submit.bind(this);
    this.rest = Rest.wrap(Mime, {mime: 'application/json'}).wrap(ErrorCode);
  }

  componentDidMount() {
    this.rest({
      path: '/question'      
    }).then(response => {
      this.setState({question: response.entity});
    });
  }

  select(evt) {
    evt.preventDefault();
    const option = evt.target;
    /* remove the selected class from any other selected options. */
    _.each(document.querySelectorAll('a.selected'), option => {
      option.className = option.className.replace(/\bselected\b/, '');
      option.removeChild(option.lastChild);
    });
    option.className = option.className +  ' selected';
    const i = document.createElement('i');
    i.className = 'fa fa-check';
    option.appendChild(i);
  }

  submit(evt) {
    evt.preventDefault();

    const selectedOption = document.querySelector('a.selected');
    if (!selectedOption) {
      ReactDOM.render(<Message header="oops" message="you like, totaly have to select an option. k?"/>,
        document.getElementById('modal'));
      return;
    }

    const btn = evt.target;
    btn.setAttribute('disabled', 'disabled');
    btn.innerHTML = 'please wait...';
    this.rest({
      method: 'post',
      path: '/question/' + this.state.question.id,
      entity: {optionId: selectedOption.dataset.optionId}
    }).then(response => {
      this.rest({
        path: '/question'
      })
      .then(response => {
        btn.innerHTML = 'submit';
        btn.removeAttribute('disabled');
        this.setState({question: response.entity});
      });
    }, error => {
      btn.innerHTML = 'submit';
      btn.removeAttribute('disabled');
      ReactDOM.render(<Message header="error" message="sorry. something crazy happened..."/>,
        document.getElementById('modal'));
    });
  }

  render() {
    if (this.state.question.title) {
      let options = this.state.question.Options.map(option => {
        return <li key={option.id}><a href onClick={this.select} data-option-id={option.id}>{option.title}</a></li>;
      });
      return (
        <div className="question">
          <h2>{this.state.question.title}</h2>
          <ul>
            {options}
          </ul>
          <button className="btn btn-primary" onClick={this.submit}>Submit</button>
        </div>
      );
    } else {
      return (
        <div className="question">
          <h2 className="text-info">sorry...</h2>
          <h4>there doesn't appear to be anymore survey questions for you right now.</h4>
        </div>
      );
    }
  }
}

ReactDOM.render(<Index/>, document.getElementById('react'));
