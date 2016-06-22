//TODO: Combine this & AdSizesEntry into generic component. These contain repeated code.

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import CreativeEntry from './CreativeEntry.jsx';

var CreativesEntry = React.createClass({

  propTypes: {
    creativesArray: React.PropTypes.array.isRequired,
    updateCreative: React.PropTypes.func.isRequired
  },

  render: function() {
    var creativesEntry = this.props.creativesArray.map(function(creativeId, i) {
      return (
        <CreativeEntry creativeId={creativeId} updateCreative={this.props.updateCreative} key={i} index={i}/>
      );
    }, this);
    return (
      <div>
        {creativesEntry}
      </div>
    );
  }

});
 
module.exports = CreativesEntry;