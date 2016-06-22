import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { setNewApplicationTokensAsync, setNewApplicationCredsAsync, setNewApplicationCreds, setNewAuthorizationCode } from '../actions/actions.js';
import Welcome from './Welcome.jsx';
var imgSrc = '../assets/authentication-screen.png';
var successSrc = '../assets/hell-yeah.jpg';
var promise = require('bluebird');
import { styles } from '../assets/cssObject.js';

var Authenticate = React.createClass({

  getInitialState: function(){
     return {
        authenticationUrlAvailable: false,
        authenticationAttempted: false,
        hasBeenWelcomed: false,
        authenticationComplete: false,
        authenticationSuccessful: false
     }
  },
  propTypes: {
      authenticationComplete: React.PropTypes.func.isRequired
  },
  completeWelcomeInstructions: function(){
      this.setState({
          hasBeenWelcomed: true
      });
  },
  sendCreds: function(){
    var installed = {};

    var clientIDinput = this.refs.clientID;
    var clientIDinputValue = clientIDinput.value;
    var clientSecretinput = this.refs.clientSecret;
    var clientSecretinputValue = clientSecretinput.value;
    var projectNameinput = this.refs.projectName;
    var projectNameinputValue = projectNameinput.value;

    installed.client_id = clientIDinputValue;
    installed.client_secret = clientSecretinputValue;
    installed.project_name = projectNameinputValue;
    installed.redirect_uris = "urn:ietf:wg:oauth:2.0:oob";
    installed.version = "v201511";

    this.getAuthenticationURL(installed);
  },
  attemptAuthentication: function(){
      this.setState({
          authenticationAttempted: true
      });
  },
  getAuthenticationURL: function(credentials){

    var self = this;

    this.props.store.dispatch(setNewApplicationCredsAsync(credentials))
        .then(function(i){
            self.setState({
                authenticationUrlAvailable: true
            })
        });
  },
  clearState: function() {
    this.props.store.dispatch(setNewApplicationCreds('','',false));
    this.setState({
        authenticationAttempted: false,
        authenticationUrlAvailable: false,
        authenticationComplete: false,
        authenticationAttempted: false,
        authenticationSuccessful: false
    });   
  },
  authenticationComplete: function() {
      var authCode = this.refs.authCode.value;
      this.props.store.dispatch(setNewAuthorizationCode(authCode));

      var self = this;
      var store = this.props.store.getState();
      var code = store.applicationCode[0].code;
      var client_id = store.applicationCredentials[0].creds.client_id;
      var client_secret = store.applicationCredentials[0].creds.client_secret;

      this.props.store.dispatch(setNewApplicationTokensAsync(code, client_id, client_secret))
      .then(function(){
          self.setState({
              authenticationComplete: true
          });
          var store = self.props.store.getState();
          if(store.applicationTokens[0].status == true){
            self.setState({
                authenticationSuccessful: true
            });
          }
      });
  },
  render: function(){

    var link = '';
    var store = this.props.store.getState();
    var authenticationUrlGenerationError = false;
    if(this.state.authenticationUrlAvailable){
        if(store.applicationCredentials[0].status){
            link = store.applicationCredentials[0].message;
        }
        else {
            authenticationUrlGenerationError = true;
        }
    }

    return (
      <div style={styles.pageStyle}>
          {!this.state.hasBeenWelcomed &&
              <Welcome completeWelcomeInstructions={this.completeWelcomeInstructions}/>
          }
          {this.state.hasBeenWelcomed && !this.state.authenticationUrlAvailable &&
            <div>
              <div style={styles.lines}>
                  <span style={styles.spans}>Client ID: </span><input ref="clientID" style={styles.inputs} type="text" /> <br/>
              </div>
              <div style={styles.lines}>
                  <span style={styles.spans}>Client Secret: </span><input ref="clientSecret" style={styles.inputs} type="text" /> <br/>
              </div>
              <div style={styles.lines}>
                  <span style={styles.spans}>Project Name: </span><input ref="projectName" style={styles.inputs} type="text" /> <br/>
              </div>
              <div style={styles.lines}>
                <button style={styles.buttonStyle} onClick={this.sendCreds} type="button">Generate</button>
              </div>
            </div>
          }
          {this.state.authenticationUrlAvailable && !this.state.authenticationAttempted &&
              <div style={styles.textArea}>
              {!authenticationUrlGenerationError &&
                  <div>
                      <p>
                        Click on the link below to authenticate your client. After choosing your account, you should be directed to a page similiar to the screenshot below.
                      </p>
                      <img style={styles.imgStyle} src={imgSrc} />
                      <div style={styles.buttonLine}>
                        <a style={styles.linkStyle} target="_blank" href={link} onClick={this.attemptAuthentication}>Authenticate your client</a>
                      </div>
                  </div>
              }
              {authenticationUrlGenerationError &&
                  <div>
                      <p style={styles.red}>
                          The application was unable to generate the authentication URL.
                      </p>
                      <p style={styles.red}>
                          The server may be down. Or, your request was rejected by the server.
                      </p>
                      <p style={styles.red}>
                          Please notify the appropriate sovrn contact.
                      </p>
                  </div>
              }
              </div>
          }
          {this.state.authenticationAttempted && !this.state.authenticationComplete &&
              <div style={styles.textArea}>
                <p>
                  If you were able to authenticate your product successfully, enter your authorization code below and click continue. Else, please resubmit your credentials and try again.
                </p>
                <div style={styles.lines}>
                  <span style={styles.spans}>Auth Code: </span><input ref="authCode" style={styles.inputs} type="text" /> <br/>
                </div>
                <br/>
                <br/>
                <div style={styles.inlineLeftStyle}>
                  <a style={styles.resubmitSyle} onClick={this.clearState}>Resubmit</a>
                </div>
                <div style={styles.inlineRightStyle}>
                  <button onClick={this.authenticationComplete} style={styles.buttonStyle} type="button">Continue</button>
                </div>
              </div>
          }
          {this.state.authenticationComplete && !this.state.authenticationSuccessful &&
            <div style={styles.textArea}>
                <p>
                    You were not authorized.
                </p>
                <p>
                    The authorization error message is <b>{store.applicationTokens[0].message}</b>.
                </p>
                <p>
                    Please try again.
                </p>
                <div style={styles.lines}>
                  <a style={styles.buttonStyle} onClick={this.clearState}>Try Again</a>
                </div>
            </div>
          }
          {this.state.authenticationComplete && this.state.authenticationSuccessful &&
            <div style={styles.textArea}>
              <img style={styles.imgStyle} src={successSrc} />
              <p>
                  You have been authorized!
              </p>
              <div style={styles.lines}>
                  <button onClick={this.props.authenticationComplete} style={styles.buttonStyle} type="button">Continue</button>
              </div>
            </div>
          }
      </div>
    );
  }
});
 
module.exports = Authenticate;