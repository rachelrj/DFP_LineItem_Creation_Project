//TODO: Combine this & CreativesEntry into generic component. These contain repeated code.

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import AdSizeEntry from './AdSizeEntry.jsx';

var AdSizesEntry = React.createClass({

  propTypes: {
    sizesArray: React.PropTypes.array.isRequired,
    updateSize: React.PropTypes.func.isRequired
  },

  render: function() {
    var sizesEntry = this.props.sizesArray.map(function(sizeObj, i) {
      return (
        <AdSizeEntry sizeObj={sizeObj} updateSize={this.props.updateSize} key={i} index={i}/>
      );
    }, this);
    return (
      <div>
        {sizesEntry}
      </div>
    );
  }

});
 
module.exports = AdSizesEntry;