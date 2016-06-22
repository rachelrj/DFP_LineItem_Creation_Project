import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { styles } from '../assets/cssObject.js';

var CreativeEntry = React.createClass({

  propTypes: {
    creativeId: React.PropTypes.string.isRequired,
    updateCreative: React.PropTypes.func.isRequired,
    index: React.PropTypes.number.isRequired
  },

  updateCreativeId: function(){
      this.props.updateCreative(this.refs.creativeid.value, this.props.index);
  },

  render: function() {
    return (
      <div>
        <p>Creative {this.props.index + 1}</p>
        <div style={styles.lines}>
              <span style={styles.spans}>ID: </span><input onChange={this.updateCreativeId} value={this.props.creativeId} ref="creativeid" style={styles.inputs} type="number" /> <br/>
        </div>
        <br/>
      </div>       
    );
  }

});
 
module.exports = CreativeEntry;