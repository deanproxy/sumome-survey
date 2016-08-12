import React from 'react';
import Bootstrap from 'bootstrap.native';

class Message extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const div = document.getElementById('modal');
    const modal = new Bootstrap.Modal(div);
    modal.open();
  }

  render() {
    return (
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-body">
            <h3 className="danger">{this.props.header}</h3>
            <p>{this.props.message}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" data-dismiss="modal">okay</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Message;
