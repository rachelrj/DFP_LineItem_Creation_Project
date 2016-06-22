/*
 * action types
 */
import generateURL from '../services/generateAuthenticationUrl.js';
import generateTokens from '../services/generateTokens.js';
import getAdvertiser from '../services/getAdvertiser.js';
import getUser from '../services/getUser.js';
import getOrder from '../services/getOrder.js';
import getPlacement from '../services/getPlacement.js';
import createLineItems from '../services/createLineItems.js';
import createCreativeAssociations from '../services/createCreativeAssociations.js';

export const SET_APPLICATION_CREDS = 'SET_APPLICATION_CREDS';
export const SET_APPLICATION_TOKENS = 'SET_APPLICATION_TOKENS';
export const SET_AUTHORIZATION_CODE = 'SET_AUTHORIZATION_CODE';
export const SET_NETWORK_CODE = 'SET_NETWORK_CODE';
export const SET_ADVERTISER = 'SET_ADVERTISER';
export const SET_USER = 'SET_USER';
export const SET_ORDER = 'SET_ORDER';
export const SET_PLACEMENT = 'SET_PLACEMENT';
export const SET_SIZES = 'SET_SIZES';
export const SET_LINE_ITEMS = 'SET_LINE_ITEMS';
export const SET_CREATIVE_ASSOCIATIONS = 'SET_CREATIVE_ASSOCIATIONS';
export const SET_API_ACCESS_TRUE = 'SET_API_ACCESS_TRUE';
export const SET_API_ACCESS_FALSE = 'SET_API_ACCESS_FALSE';

/*
 * other constants
 */

/*
 * action creators
 */

export function ApiWhiteListed(response) {
	if(response === true) {
		return {type: SET_API_ACCESS_TRUE}
	}
	else {
		return {type: SET_API_ACCESS_FALSE}
	}
}

export function setNewApplicationCreds(creds, message, status){
	return {type: SET_APPLICATION_CREDS, creds: creds, message: message, status: status};
};

export function setNetNetworkCode(code) {
	return {type: SET_NETWORK_CODE, code: code};
};

export function setNewApplicationCredsAsync(creds) {

  	return function (dispatch) {
		return generateURL(creds)
		    .then(function (result) {
		        var message = result;
		        dispatch(setNewApplicationCreds(creds, message, true));
		    }, function(err) {
		    	var message = "Could not create Authentication URL";
				dispatch(setNewApplicationCreds(creds, message, false));		    	
		    });
	};
};

function setNewApplicationTokens(tokens, message, status){
	return {type: SET_APPLICATION_TOKENS, tokens: tokens, message: message, status: status};
};

export function setNewApplicationTokensAsync(code, client_id, client_secret) {

	return function (dispatch) {
		return generateTokens(code, client_id, client_secret)
			.then(function (result) {
		        if(result.error){
		        	if(result.error_description){
		        		dispatch(setNewApplicationTokens(result.error, result.error_description, false));
		        	}
		        	else {
		        		dispatch(setNewApplicationTokens(result.error, "UNKNOWN ERROR", false));
		        	}
		        }
		        else{
		        	dispatch(setNewApplicationTokens(result, "SUCCESS", true));
		        }
			}, function(err) {
		        	dispatch(setNewApplicationTokens("UNKNOWN ERROR", "UNKNOWN ERROR", false));
			});
	};
};
function setAdvertiser(advertiser){
	return {type: SET_ADVERTISER, advertiser: advertiser};
};
export function setAdvertiserAsync(settings, advertiser) {
	return function (dispatch) {
		return getAdvertiser(settings, advertiser)
		.then(function (result) {
			if(result != "NOT_WHITELISTED_FOR_API_ACCESS"){
				dispatch(setAdvertiser(result));
			}
			else {
				dispatch(ApiWhiteListed(false));
			}
		});
	};
};
export function setNewAuthorizationCode(code){
	return {type: SET_AUTHORIZATION_CODE, code: code};
};
function setUser(user){
	return {type: SET_USER, user: user};
};
export function setUserAsync(settings) {
	return function (dispatch) {
		return getUser(settings)
		.then(function (result) {
			dispatch(setUser(result));
		});
	};
};
function setOrder(order){
	return {type: SET_ORDER, order: order};
};
export function setOrderAsync(settings, advertiserId, userId, orderName) {
	return function (dispatch) {
		return getOrder(settings, advertiserId, userId, orderName)
		.then(function (result) {
			dispatch(setOrder(result));
		});
	};
};
function setPlacement(placement){
	return {type: SET_PLACEMENT, placement: placement};
};
export function setPlacementAsync(settings, placementName) {
	return function (dispatch) {
		return getPlacement(settings, placementName)
		.then(function (result) {
			dispatch(setPlacement(result));
		});
	};
};
export function setSizes(sizesArray) {
	return {type: SET_SIZES, sizes: sizesArray};
};
function setLineItems(lineitems){
	return {type: SET_LINE_ITEMS, lineitems: lineitems};
};
export function setLineItemsAsync(settings, start, end, advertiserName, orderId, sizes, placement) {
	return function (dispatch) {
		return createLineItems(settings, start, end, advertiserName, orderId, sizes, placement)
		.then(function (result) {
			var lineItemIdArray = [];
			if(result.rval){
				for(var i = 0; i<result.rval.length; i++){
					lineItemIdArray[i] = result.rval[i].id;
				}
			}
			dispatch(setLineItems(lineItemIdArray));
		});
	};
};
function setCreativeAssociations(creativeassociations){
	return {type: SET_CREATIVE_ASSOCIATIONS, creativeassociations: creativeassociations};
};
export function setCreativesAsync(settings, creativeArray, sizes, lineitems) {
	return function (dispatch) {
		return createCreativeAssociations(settings, creativeArray, sizes, lineitems)
		.then(function (result) {
			dispatch(setCreativeAssociations(result));
		})
	}
};