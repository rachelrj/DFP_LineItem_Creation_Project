import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
var imgSrc = '../assets/new-credentials.png';
import { styles } from '../assets/cssObject.js';

var Welcome = React.createClass({

  propTypes: {
    completeWelcomeInstructions: React.PropTypes.func.isRequired
  },

  render: function(){

    var link = "https://console.developers.google.com/project";
    return (
      <div style={styles.pageStyle}>
          <p>
              Welcome to the DFP Line Item Creation tool. First you will need to create a Google project and authorize this project to access your DFP accounts. To create a project, go to <a target="_blank" href={link}> https://console.developers.google.com/project </a>
          </p>
          <p>
              Next, click on the three bar icon in the upper left of the screen and navigate to API Manager. Then, click on Credentials in the left panel of the screen.
          </p>
          <div>
            <img style={styles.imgStyle} src={imgSrc} />
          </div>
          <p>
              In the dropdown, click OAuth Client ID. If prompted, select “Configure Consent Screen” and enter a product name (EX: DFP-API-Product)
          </p>
          <p>
              From the Create Client ID screen, select “other” and enter a name (EX: DFP-API-Client) You will see a box with a “Client ID” and “Client Secret”. Save these. You will need them in the next step. Click OK.
          </p>
          <div style={styles.lines}>
              <a style={styles.linkStyle} onClick={this.props.completeWelcomeInstructions}>Continue</a>
          </div>
      </div>
    );
  }
});
 
module.exports = Welcome;