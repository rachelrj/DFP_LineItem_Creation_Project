import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Authenticate from './Authenticate.jsx';
import Create from './Create.jsx';
import { styles } from '../assets/cssObject.js';
var promise = require('bluebird');
var successSrc = '../assets/hell-yeah.jpg';

var Doer = React.createClass({

	getInitialState: function(){
	    return {
	        authenticationComplete: false
	    }
	},
  componentDidUpdate: function(prevProps, prevState) {
      
  },
	authenticationComplete: function() {
      this.setState({
          authenticationComplete: true
      });
	},
    render: function(){
    	var authComponent = '';
      var createComponent = '';
    	if(!this.state.authenticationComplete){
       		authComponent = <Authenticate store={this.props.store} authenticationComplete={this.authenticationComplete}/>;
      }
      else {
          createComponent = <Create store={this.props.store}/>;
      }

    	return (
	      	<div style={styles.pageStyle}>
	          	<h1 style={styles.h1Style} >DFP Line Item Generator</h1>
      			   {authComponent}
               {createComponent}
      		</div>
    	);
  	}
});

module.exports = Doer;