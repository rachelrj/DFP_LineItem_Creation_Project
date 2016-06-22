//TODO: Break this component up.

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import AdSizesEntry from './AdSizesEntry.jsx';
import CreativesEntry from './CreativesEntry.jsx';
var promise = require('bluebird');
var networkSrc = '../assets/network-code.png';
var apiSrc = '../assets/enable-api.png';
var creativeSnippet = '../assets/creative-script.png';
var creativeIds = '../assets/creative-ids.png';
var youDidIt = '../assets/you-did-it.jpg';
var loader = '../assets/loader.gif';
import { ApiWhiteListed, setLineItemsAsync, setNetNetworkCode, setAdvertiserAsync, setUserAsync, setOrderAsync, setPlacementAsync, setSizes, setCreativesAsync } from '../actions/actions.js';
import { styles } from '../assets/cssObject.js';

var Create = React.createClass({

  getInitialState: function(){
     return {
        obtainedNetworkCode: false,
        advertiserSent: false,
        advertiserVerified: false,
        advertiserError: false,
        orderSent: false,
        orderVerified: false,
        orderError: false,
        placementSent: false,
        placementVerified: false,
        placementError: false,
        sizesArray: [],
        sizesError: false,
        sizesVerified: false,
        lineItemsSent: false,
        lineItemsVerified: false,
        lineItemGeneralError: false,
        lineItem450Error: false,
        creativesSent: false,
        creativesAssociated: false,
        creativeAssociationError: false,
        creativesError: false,
        creativesArray: [],
        apiWhiteListed: true
     }
  },
  setNetworkCode: function() {
      this.props.store.dispatch(setNetNetworkCode(this.refs.networkCode.value));
      this.setState({
          obtainedNetworkCode: true
      });
  },
  componentDidUpdate: function(prevProps, prevState){
      if(prevState.obtainedNetworkCode !== this.state.obtainedNetworkCode){
          var settings = this.buildSettings();
          this.props.store.dispatch(setUserAsync(settings));
      }
  },
  buildSettings: function() {
      var store = this.props.store.getState();
      var settings = {};
      settings.network_code = store.networkCode[0].code;
      settings.app_name = store.applicationCredentials[0].creds.project_name;
      settings.client_id = store.applicationCredentials[0].creds.client_id;
      settings.client_secret = store.applicationCredentials[0].creds.client_secret;
      settings.refresh_token = store.applicationTokens[0].tokens.refresh_token;
      return settings;
  },
  sendAdvertiser: function() {
      this.setState({
          advertiserSent: true
      });
      var self = this;
      var settings = this.buildSettings();
      this.props.store.dispatch(setAdvertiserAsync(settings, self.refs.advertiser.value))
        .then(function(i){
            var store = self.props.store.getState();
            if(store && store.advertiser && store.advertiser[0] && store.advertiser[0].advertiser && store.advertiser[0].advertiser.id){
              self.setState({
                  advertiserVerified: true
              });
            }
            else {
              self.checkApiWhiteListed();
              self.setState({
                  advertiserError: true
              });              
            }
        });
  },
  sendOrder: function() {
      this.setState({
          orderSent: true
      });
      var self = this;
      var settings = this.buildSettings();
      var store = this.props.store.getState();
      var advertiserId = store.advertiser[0].advertiser.id;
      var userId = store.user[0].user.id;
      this.props.store.dispatch(setOrderAsync(settings, advertiserId, userId, self.refs.order.value))
        .then(function(i){
            var store = self.props.store.getState();
            if(store && store.order && store.order[0].order && store.order[0].order.id){
                self.setState({
                    orderVerified: true
                });
            }
            else {
                self.setState({
                    orderError: true
                });              
            }
        });
  },
  sendPlacement: function() {
      this.setState({
          placementSent: true
      });
      var self = this;
      var settings = this.buildSettings();
      this.props.store.dispatch(setPlacementAsync(settings, self.refs.placement.value))
      .then(function(i){
          var store = self.props.store.getState();
          if(store && store.placement && store.placement[0].placement && store.placement[0].placement.targetedPlacementIds){
              self.setState({
                  placementVerified: true
              });
          }
          else {
                self.setState({
                    placementError: true
                });             
          }
      });
  },
  updateSize: function(width, height, index) {
      var sizesArray = this.state.sizesArray;
      sizesArray[index] = {width: width, height: height};
      this.setState({
          sizesArray: sizesArray
      });
  },
  updateNumberOfSizes: function(){
      var num = this.refs.numberofsizes.value;
      var sizesArray = this.state.sizesArray;
      var newSizesArray = [];
      for(var i=0; i<num; i++) {
          if(sizesArray[i]){
              newSizesArray[i] = sizesArray[i];
          }
          else {
              newSizesArray[i] = {};
              newSizesArray[i].width = '';
              newSizesArray[i].height = '';
          }
      }
      this.setState({
          sizesArray: newSizesArray
      });
  },
  updateCreative: function(id, index) {
      var creativesArray = this.state.creativesArray;
      creativesArray[index] = id;
      this.setState({
          creativesArray: creativesArray
      });
  },
  updateNumberOfCreatives: function() {
      var num = this.refs.numberofcreatives.value;
      var creativesArray = this.state.creativesArray;
      var newCreativesArray = [];
      for(var i=0; i<num; i++) {
          if(creativesArray[i]){
              newCreativesArray[i] = creativesArray[i];
          }
          else {
              newCreativesArray[i] = '';
          }
      }
      this.setState({
          creativesArray: newCreativesArray
      });
  },
  sendSizes: function() {
      var num = this.refs.numberofsizes.value;
      var sizesArray = this.state.sizesArray;
      var validSizes = true;
      for(var i=0; i<num; i++) {
          if(!sizesArray[i] || !sizesArray[i].width || !sizesArray[i].height){
              validSizes = false;
          }
      }
      if(validSizes){
          this.props.store.dispatch(setSizes(this.state.sizesArray));
          this.setState({
              sizesVerified: true,
              sizesError: false
          });       
      }    
      else {
          this.setState({
              sizesError: true
          });
      }  
  },
  sendCreatives: function() {
      var num = this.refs.numberofcreatives.value;
      var creativesArray = this.state.creativesArray;
      var self = this;
      var settings = this.buildSettings();
      var store = this.props.store.getState();
      var sizes = store.sizes[0].sizes;
      var lineitems = store.lineitems[0].lineitems;
      var validCreatives = true;
      for(var i=0; i<num; i++){
          if(!creativesArray[i]) {
              validCreatives = false;
          }
      }
      if(validCreatives) {
          this.setState({
              creativesError: false,
              creativesSent: true
          });
          this.props.store.dispatch(setCreativesAsync(settings, this.state.creativesArray, sizes, lineitems))
          .then(function(i){
            var store = self.props.store.getState();
            if(store && store.creativeassociations && store.creativeassociations[0].creativeassociations){
                self.setState({
                    creativesAssociated: true,
                    creativeAssociationError: false
                });
            }
            else {
                self.setState({
                    creativeAssociationError: true
                });              
            }              
          });
      }
      else {
          this.setState({
              creativesError: true
          });
      }
  },
  checkCpmRange: function(start, end) {
      if(start > end){
          this.setState({
              lineItem450Error: true
          });
          return false;       
      }
      if((end - start) > 450){
          this.setState({
              lineItem450Error: true
          });
          return false;          
      }
      this.setState({
          lineItem450Error: false
      });

      return true;         
  },
  sendLineItems: function() {
      var self = this;
      var start = this.refs.cpmStart.value;
      var end = this.refs.cpmEnd.value;
      var rangeOkay = this.checkCpmRange(start, end);
      if(!rangeOkay){
          return;
      }
      this.setState({
          lineItemsSent: true
      });
      var settings = this.buildSettings();
      var store = this.props.store.getState();
      var advertiserName = store.advertiser[0].advertiser.name;
      var orderId = store.order[0].order.id;
      var sizes = store.sizes[0].sizes;
      var placement = store.placement[0].placement;
      this.props.store.dispatch(setLineItemsAsync(settings, start, end, advertiserName, orderId, sizes, placement))
        .then(function(i){
            var store = self.props.store.getState();
            if(store && store.lineitems && store.lineitems[0].lineitems && store.lineitems[0].lineitems.length){
                self.setState({
                    lineItemsVerified: true
                });
            }
            else {
                self.setState({
                    lineItemGeneralError: true
                });              
            }
        });
  },
  setApiWhiteListed: function() {
      this.props.store.dispatch(ApiWhiteListed(true));
      this.setState({
          apiWhiteListed: true
      });
  },
  propTypes: {

  },
  checkApiWhiteListed: function() {
      var store = this.props.store.getState();
      if(store.apiWhiteListed === false){
          this.setState({
              apiWhiteListed: false
          });            
      }
  },
  render: function(){

    var loading = false;
    if(this.state.advertiserSent && !this.state.advertiserVerified && !this.state.advertiserError){
        loading = true;
    }
    if(this.state.orderSent && !this.state.orderVerified && !this.state.orderError){
        loading = true;
    }
    if(this.state.placementSent && !this.state.placementVerified && !this.state.placementError){
        loading = true;
    }
    if(this.state.lineItemsSent && !this.state.lineItem450Error && !this.state.lineItemsVerified && !this.state.lineItemGeneralError){
        loading = true;
    }
    if(this.state.creativesSent && !this.state.creativeAssociationError && !this.state.creativesAssociated && !this.state.creativesError){
        loading = true;
    }

    return (
      <div style={styles.pageStyle}>
          {!this.state.apiWhiteListed &&
            <div>
                <p style={styles.red}>
                    Your DFP Network is not whitelisted for API access.
                </p>
                <p>
                    Navigate to Admin > All Network Settings within your DFP account
                </p>
                <p>
                    Then, follow the instructions in the below screenshot.
                </p>
                <div>
                    <img style={styles.imgStyle} src={apiSrc} />
                </div>
                <p>
                    Once completed, click to continue.
                </p>
                <div style={styles.lines}>
                    <button onClick={this.setApiWhiteListed} style={styles.buttonStyle} type="button">Continue</button>
                </div>                
            </div>
          }
          {!this.state.obtainedNetworkCode && this.state.apiWhiteListed &&
            <div>
              <p>
                  You are now ready to beginning creating DFP line items.
              </p>
              <p>
                  Please navigate to your DFP account and find your network code.
              </p>
              <div style={styles.lines}>
                  <span style={styles.spans}>Network Code: </span><input ref="networkCode" style={styles.inputs} type="text" /> <br/>
              </div>
              <br/>
              <div>
                  <img style={styles.imgStyle} src={networkSrc} />
              </div>
              <p>
                  Also, if you havent done so already, enable the DFP account for API access.
              </p>
              <div>
                  <img style={styles.imgStyle} src={apiSrc} />
              </div>
              <div style={styles.lines}>
                  <button onClick={this.setNetworkCode} style={styles.buttonStyle} type="button">Continue</button>
              </div>
            </div>
          }
          {loading && this.state.apiWhiteListed &&
            <div>
                  <img src={loader} />
            </div>
          }
          {this.state.obtainedNetworkCode && !this.state.advertiserVerified && !loading && this.state.apiWhiteListed &&
            <div>
                  {this.state.advertiserError &&
                      <p style={styles.red}>
                        Unable to create/obtain the advertiser. Please try again.
                      </p>
                  }
                  <p>
                      Enter the advertiser for the order.
                  </p>
                  <p>
                      If the advertiser entered does not exist within the DFP account, it will be created.
                  </p>
                  <div style={styles.lines}>
                      <span style={styles.spans}>Advertiser: </span><input ref="advertiser" style={styles.inputs} type="text" /> <br/>
                  </div>
                  <div style={styles.lines}>
                      <button onClick={this.sendAdvertiser} style={styles.buttonStyle} type="button">Continue</button>
                  </div>
            </div>
          }
          {this.state.advertiserVerified && !this.state.orderVerified && !loading && this.state.apiWhiteListed &&
            <div>
                {this.state.orderError &&
                    <p style={styles.red}>
                        Unable to create/obtain the order. Remember that if the order already exists, the advertiser entered in the previous step must match the advertiser set for the existing order.
                    </p>
                }
                <p>
                      Enter the name of the order.
                </p>
                <p>
                      If the order entered does not exist within the DFP account, it will be created.
                </p>
                <div style={styles.lines}>
                      <span style={styles.spans}>Order: </span><input ref="order" style={styles.inputs} type="text" /> <br/>
                </div>
                <div style={styles.lines}>
                      <button onClick={this.sendOrder} style={styles.buttonStyle} type="button">Continue</button>
                </div>
            </div>
          }
          {this.state.orderVerified && !this.state.placementVerified && !loading && this.state.apiWhiteListed &&
            <div>
                {this.state.placementError &&
                    <p style={styles.red}>
                        Unable to obtain the placement. Please try again.
                    </p>
                }
                <p>
                    Enter the name of the placement to target with header bidding.
                </p>
                <div style={styles.lines}>
                      <span style={styles.spans}>Placement: </span><input ref="placement" style={styles.inputs} type="text" /> <br/>
                </div>
                <div style={styles.lines}>
                      <button onClick={this.sendPlacement} style={styles.buttonStyle} type="button">Continue</button>
                </div>               
            </div>
          }
          {this.state.placementVerified && !this.state.sizesVerified && !loading && this.state.apiWhiteListed &&
            <div>
                {this.state.sizesError &&
                    <p style={styles.red}>
                        Please enter missing sizes.
                    </p>
                }
                <p>
                    Enter the number of ad unit sizes you will target through header bidding:
                </p>
                <div style={styles.lines}>
                      <span style={styles.spans}>Number of Ad Unit Sizes: </span><input ref="numberofsizes" style={styles.inputs} onChange={this.updateNumberOfSizes} type="number" /> <br/>
                </div>
                <AdSizesEntry sizesArray={this.state.sizesArray} updateSize={this.updateSize}/>
                <div style={styles.lines}>
                      <button onClick={this.sendSizes} style={styles.buttonStyle} type="button">Continue</button>
                </div>                              
            </div>
          }
          {this.state.sizesVerified && !this.state.lineItemsVerified && !loading && this.state.apiWhiteListed &&
            <div>
                {this.state.lineItem450Error &&
                    <p style={styles.red}>
                        Starting CPM must be less than ending CPM. Orders must be limited to 450 line items. Please fix CPM entries.
                    </p>
                }
                {this.state.lineItemGeneralError &&
                    <p style={styles.red}>
                        An error occured creating the line items. Please try again.
                    </p>
                }
                <p>
                    You are now ready to create the orders line items.
                </p>
                <p>
                    Please note that this application assumes USD currency.
                </p>
                <p>
                    Additionally, this application creates hb_pb key value targeting.
                </p>
                <p>
                    For customizations, please contact a sovrn support engineer.
                </p>
                <p>
                    Enter starting and ending CPM values for your line items. Orders are limited to 450 line items.
                </p>
                <p>
                    For example, if the starting CPM is $0.01, enter 1. If the ending CPM is $4.50, enter 450.
                </p>
                <div style={styles.lines}>
                      <span style={styles.spans}>Starting CPM: </span><input ref="cpmStart" style={styles.inputs} type="number" /> <br/>
                </div>
                <div style={styles.lines}>
                      <span style={styles.spans}>Ending CPM: </span><input ref="cpmEnd" style={styles.inputs} type="number" /> <br/>
                </div>
                <div style={styles.lines}>
                      <button onClick={this.sendLineItems} style={styles.buttonStyle} type="button">Continue</button>
                </div>  
            </div>
          }
          {this.state.lineItemsVerified && !this.state.creativesAssociated && !loading && this.state.apiWhiteListed &&
            <div>
                {this.state.creativesError &&
                    <p style={styles.red}>
                        Please enter missing creatives.
                    </p>
                }
                {this.state.creativeAssociationError &&
                    <p style={styles.red}>
                        An error occured associating the creatives. Please try again.
                    </p>                    
                }
                <p>
                    Your new line items have been created. Lastly, we must associate creatives to these line items.
                </p>
                <p>
                    In DFP, the creatives should be set as third party type and set to a 1x1 target ad unit size. The advertiser for the creative should be the same as the advertiser for the order.
                </p>
                <p>
                    In DFP, the code snippet for every creative should be:
                </p>
                <div>
                    <img style={styles.imgStyle} src={creativeSnippet} />
                </div>
                <p>
                    You should associate as many creatives as the max ad units per page. For example, if one page on your site contains five ad units, then you should associate at least five creatives.
                </p>
                <p>
                    After youve added these creatives into DFP, obtain the creative IDs.
                </p>
                <div>
                    <img style={styles.imgStyle} src={creativeIds} />
                </div>
                <p>
                    Enter the number of creatives and thier IDs below.
                </p>
                <div style={styles.lines}>
                      <span style={styles.spans}>Number of Creatives: </span><input ref="numberofcreatives" style={styles.inputs} onChange={this.updateNumberOfCreatives} type="number" /> <br/>
                </div>
                <CreativesEntry creativesArray={this.state.creativesArray} updateCreative={this.updateCreative}/>
                <div style={styles.lines}>
                      <button onClick={this.sendCreatives} style={styles.buttonStyle} type="button">Continue</button>
                </div>  
            </div>
          }
          {this.state.creativesAssociated && !loading && this.state.apiWhiteListed &&
                <div>
                    <img style={styles.imgStyle} src={youDidIt} />
                </div>            
          }
      </div>
    );
  }
});
 
module.exports = Create;