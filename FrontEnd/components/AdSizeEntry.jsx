import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { styles } from '../assets/cssObject.js';

var AdSizeEntry = React.createClass({

  propTypes: {
    sizeObj: React.PropTypes.object.isRequired,
    updateSize: React.PropTypes.func.isRequired,
    index: React.PropTypes.number.isRequired
  },

  updateSizeObj: function(){
      this.props.updateSize(this.refs.width.value, this.refs.height.value, this.props.index);
  },

  render: function() {
    return (
      <div>
        <p>Ad Unit {this.props.index + 1}</p>
        <div style={styles.lines}>
              <span style={styles.spans}>Width: </span><input onChange={this.updateSizeObj} value={this.props.sizeObj.width} ref="width" style={styles.inputs} type="number" /> <br/>
        </div>
        <br/>
        <div style={styles.lines}>
              <span style={styles.spans}>Height: </span><input onChange={this.updateSizeObj} value={this.props.sizeObj.height} ref="height" style={styles.inputs} type="number" /> <br/>
        </div>
      </div>       
    );
  }

});
 
module.exports = AdSizeEntry;