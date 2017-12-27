import Y from 'yjs/dist/y';
import { Reducer } from 'redux';
import { Map as IMap, List as IList, fromJS } from 'immutable';
import { AppThunkAction } from '../appThunkAction';
import { uuidv4 } from '../../lib/uuid';
import { fail } from 'assert';
import configureProtocol from './configureProtocol';
import objectify from './objectify';
import { KnownActions } from './KnownActions';

const initialState = fromJS({
    log: {},
    items: {},
    chat: [],
    connected: false,
    protocol: undefined
});

export const reducer: Reducer<IMap<string, any>> = (
    state: IMap<string, any> = initialState,
    action: KnownActions
): IMap<string, any> => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            let messages = state.get('chat');
            messages = messages.push(fromJS({
                id: action.id,
                message: action.message,
                user: action.user,
                date: action.date
            }));
            return state.set('chat', messages);
        case 'REGISTER_BLOCK_ACTION':
            let actions = state.getIn(['log', action.blockId]);
            if (!actions) { actions = IList<any>(); }
            actions = actions.push(IMap(action.payload));
            return state.setIn(['log', action.blockId], actions);
        case 'CONNECT_PROTOCOL_SUCCESS':
            return state
                .set('protocol', action.payload)
                .set('connected', true);
        case 'CONNECT_PROTOCOL_REQUEST':
            return state.set('connected', false);
        case 'CONNECT_PROTOCOL_FAIL':
            return state.set('connected', false);
        case 'CREATE_BLOCK': {
            let block = fromJS({
                id: action.data.id
            });
            return state.setIn(['items', action.data.id], block);
        }
        case 'SET_BLOCK_TAG': {
            let block = state.getIn(['items', action.blockId]);
            for (const prop in action.data) {
                if (action.data.hasOwnProperty(prop)) {
                    block = block.setIn(['tags', prop], action.data[prop]);
                }
            }
            return state.setIn(['items', action.blockId], block);
        }
        default:
            return state;
    }
};

export const actionCreators = {
    addMessage: (message: string): AppThunkAction<KnownActions> => (dispatch, getState) => {
        getState().blocks.get('protocol').share.chat.push([{
            id: uuidv4(),
            date: new Date().getTime(),
            message: message,
            user: getState().client.loggedInUser
        }]);
    },
    registerBlockAction: (
        type: string,
        blockId: string,
        data: string
    ): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let actionLog = getState().blocks.get('protocol').share.actionLog;

        let bid = blockId;
        if (type === 'CREATE_BLOCK') {
            bid = uuidv4();
            data = 'id:' + bid;
        }

        let actions = actionLog.get(bid);
        if (!actions) {
            actionLog.set(bid, Y.Array);
            actions = actionLog.get(bid);
        }
        actions.push([{
            id: uuidv4(),
            time: new Date().getTime(),
            user: getState().client.loggedInUser,
            blockId: bid,
            type: type,
            data: objectify(data)
        }]);
    },
    connectProtocol: (terminalId: string, user: string): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let currentProtocol = getState().blocks.get('protocol');
        if (currentProtocol) {
            return;
        }

        dispatch({
            type: 'CONNECT_PROTOCOL',
            terminalId,
            user,
            payload: new Promise<any>(resolve => {
                try {
                    configureProtocol(
                        terminalId, user, dispatch, getState,
                        protocol => {
                            resolve(protocol);
                        }
                    );
                } catch (error) {
                    fail(error);
                }
            })
        });
    }
};