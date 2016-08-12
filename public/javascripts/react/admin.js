import React from 'react';
import ReactDOM from 'react-dom';

import Message from './react-main';

import Rest from 'rest';
import Mime from 'rest/interceptor/mime';
import ErrorCode from 'rest/interceptor/errorCode';

import Bootstrap from 'bootstrap.native';

import _ from 'lodash';

const rest = Rest.wrap(Mime, {mime: 'application/json'}).wrap(ErrorCode);

class CreateSurvey extends React.Component {
    constructor(props) {
      super(props);

      if (props.question) {
        this.state = {
          question: props.question
        }
      } else {
        this.state = {
          question: {
            title: '',
            Options: []
          }
        }
      }
      this.addOption = this.addOption.bind(this);
      this.change = this.change.bind(this);
      this.save = this.save.bind(this);
    }

    componentDidMount() {
      const div = document.getElementById('modal');
      const modal = new Bootstrap.Modal(div);
      modal.open();
    }

    change(evt) {
      const input = evt.target;
      if (input.name === 'title') {
        this.state.question.title = input.value;
      } else {
        this.state.question.Options[input.dataset.optionIdx].title = input.value;
      }
      this.setState({question: this.state.question});
    }

    addOption(evt) {
      evt.preventDefault();
      const div = document.getElementById('add-question');
      const li = document.createElement('li');
      const input = document.createElement('input');

      input.setAttribute('type', 'text');
      input.setAttribute('name', 'options[]');
      input.setAttribute('placeholder', 'another answer');
      input.setAttribute('required', 'required');
      li.appendChild(input);
      div.appendChild(li);
    }

    save(evt) {
      evt.preventDefault();
      const form = evt.target;
      if (!form.checkValidity()) {
        return;
      }

      const entity = {
        title: form[0].value,
        options: []
      };
      
      /* serialize the form */
      _.each(form, input => {
        if (input.name === 'options[]') {
          const option = {
            title: input.value
          };
          if (input.dataset.optionId) {
            option.id = input.dataset.optionId;
          }
          entity.options.push(option);
        }
      });

      /* set the path and method base on if we're editing */
      let path = '/admin/question';
      let method = 'post';
      if (this.state.question.id) {
        path = path + `/${this.state.question.id}`;
        method = 'put';
      } 

      rest({
        method: method,
        path: path,
        entity: entity
      }).then(response => {
        window.location = '/admin';
      });
    }

    render() {
      const options = this.state.question.Options.map((o, i) => {
        return (
          <li key={o.id}>
            <input type="text" name="options[]" value={o.title} 
              data-option-id={o.id} data-option-idx={i} onChange={this.change} placeholder="another option"/>
          </li>
        );
      });
      return (
        <div className="modal-dialog">
          <form onSubmit={this.save}>
            <div className="modal-body">
              <h2>create a survey</h2>
              <ul id="add-question">
                <li>
                  <input type="text" name="title" placeholder="survey title" tabIndex="1" 
                    onChange={this.change} value={this.state.question.title} required/>
                </li>
                <li>
                  <a href onClick={this.addOption}>add answer</a>
                </li>
                {options}
              </ul>
            </div>
            <div className="modal-footer">
              <button data-dismiss="modal" className="btn btn-default">close</button>
              <button type="submit" className="btn btn-primary">save</button>
            </div>
          </form>
        </div>
      );
  }
}

class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: []
    }

    this.delete = this.delete.bind(this);
    this.edit = this.edit.bind(this);
  }

  componentDidMount() {
    rest({
      path: '/admin/questions'
    })
    .then(response => {
      this.setState({questions: response.entity});
    });
  }

  delete(evt) {
    evt.preventDefault();
    const questionId = evt.target.dataset.questionId;
    rest({
      method:'delete',
      path: `/admin/question/${questionId}`
    })
    .then(response => {
      const questions = document.querySelectorAll(`li.question`);
      const question = _.find(questions, q => q.dataset.questionId === questionId);
      document.getElementById('questions').removeChild(question);
    });
  }

  create(evt) {
    evt.preventDefault();
    const modal = document.getElementById('modal');
    modal.innerHTML = '';
    ReactDOM.render(<CreateSurvey/>, modal);
  }

  edit(evt) {
    evt.preventDefault();
    const id = parseInt(evt.target.dataset.questionId, 10);
    const question = this.state.questions.find(q => q.id === id)
    const anySelected = question.Options.find(opt => opt.selected > 0);

    const modal = document.getElementById('modal');
    modal.innerHTML = '';
    if (!anySelected) {
      ReactDOM.render(<CreateSurvey question={question}/>, modal);
    } else {
      ReactDOM.render(<Message header="sorry" 
        message="you can't edit this one since this survey has already been taken. try removing it instead."/>,
        modal);
    }
  }

  render() {
    let questions = this.state.questions.map(q => {
      const totalSelected = q.Options.reduce((p, i) => p + i.selected, 0);
      const options = q.Options.map(o => {
        let percent = 0;
        if (o.selected !== 0) {
          percent = Math.round(o.selected/totalSelected*100);
        }
        return (
          <li key={o.id}>
            <span>{o.title}</span> 
            <div className="progress">
              <div className="progress-bar" role="progressbar" aria-valuenow={percent} aria-valuemin="0" 
                aria-valuemax="100" style={{width: percent + '%'}}>
                {percent}%
              </div>
            </div>
            <span className="total">{o.selected} total votes</span>
          </li>
        );
      });
      return (
        <li key={q.id} data-question-id={q.id} className="question">
          <a className="delete text-danger" href onClick={this.delete} data-question-id={q.id}>&times;</a>
          <h2><a href onClick={this.edit} data-question-id={q.id}>{q.title}</a></h2>
          <ul className="options">
            {options}
          </ul>
        </li>
      );
    });

    if (questions.length === 0) {
      questions = <li>yar... there be no survey's here...</li>;
    }
    return (
      <div className="admin container">
        <button className="btn btn-primary" onClick={this.create}>add survey</button>
        <ul id="questions">
          {questions}
        </ul>
      </div>
    );
  }
}

ReactDOM.render(<Admin/>, document.getElementById('react'));
