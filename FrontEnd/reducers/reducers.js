import { combineReducers } from 'redux';
//import { SET_APPLICATION_CREDS, VALIDATE_APPLICATION_CREDS } from '../actions/actions.js';
import { SET_API_ACCESS_TRUE, SET_API_ACCESS_FALSE, SET_LINE_ITEMS, SET_NETWORK_CODE, SET_APPLICATION_TOKENS, SET_APPLICATION_CREDS, SET_AUTHORIZATION_CODE, SET_ADVERTISER, SET_USER, SET_ORDER, SET_PLACEMENT, SET_SIZES, SET_CREATIVE_ASSOCIATIONS } from '../actions/actions.js';

function applicationCredentials(state = [], action) {
    switch (action.type) {
        case SET_APPLICATION_CREDS:
            return [
                {
                  creds: action.creds,
                  message: action.message,
                  status: action.status
                }
            ]
        default:
            return state
    }
}

function apiWhiteListed(state = true, action) {
    switch (action.type) {
        case SET_API_ACCESS_TRUE:
            return true
        case SET_API_ACCESS_FALSE:
            return false            
        default:
            return state
    }    
}

function advertiser(state = [], action) {
    switch (action.type) {
        case SET_ADVERTISER:
            return [
                {
                    advertiser: action.advertiser
                }
            ]
        default:
            return state
    }
}

function networkCode(state = [], action) {
    switch (action.type) {
        case SET_NETWORK_CODE:
            return [
                {
                    code: action.code
                }
            ]
        default:
            return state
    }
}

function applicationTokens(state = [], action) {
    switch (action.type) {
        case SET_APPLICATION_TOKENS:
            return [
                {
                    tokens: action.tokens,
                    message: action.message,
                    status: action.status
                }
            ]
        default:
            return state
    }
}

function applicationCode(state = [], action) {
    switch (action.type) {
        case SET_AUTHORIZATION_CODE:
            return [
                {
                    code: action.code
                }
            ]
        default:
            return state
    }
}

function user(state = [], action) {
    switch(action.type) {
        case SET_USER:
            return [
                {
                    user: action.user
                }
            ]
        default:
            return state
    }
}

function order(state = [], action) {
    switch(action.type) {
        case SET_ORDER:
            return [
                {
                    order: action.order
                }
            ]
        default:
            return state
    }
}

function placement(state = [], action) {
    switch(action.type) {
        case SET_PLACEMENT:
            return [
                {
                    placement: action.placement
                }
            ]
        default:
            return state
    }
}

function sizes(state = [], action) {
    switch(action.type) {
        case SET_SIZES:
            return [
                {
                    sizes: action.sizes
                }
            ]
        default:
            return state
    }
}

function lineitems(state = [], action) {
    switch(action.type) {
        case SET_LINE_ITEMS:
            return [
                {
                    lineitems: action.lineitems
                }
            ]
        default:
            return state
    }    
}

function creativeassociations(state = [], action) {
    switch(action.type) {
        case SET_CREATIVE_ASSOCIATIONS:
            return [
                {
                    creativeassociations: action.creativeassociations
                }
            ]
        default:
            return state
    }    
}

const appCreds = combineReducers({
    applicationCredentials, applicationCode, applicationTokens, networkCode, advertiser, user, order, placement, sizes, lineitems, creativeassociations, apiWhiteListed
})

export default appCreds;