import Types from '../actions/DeviceActions';

export default (state = { connected: null, connecting: false, subscribed: [] }, action) => {
    switch (action.type) {
        case Types.CONNECT:
            state = { ...state, connected: action.payload };
            break;
        case Types.DISCONNECT:
            state = { ...state, connected: null }
            break;
        case Types.CONNECTING:
            state = { ...state, connecting: action.payload };
            break;
        case Types.READ:
            break;
        case Types.WRITE:
            break;
        case Types.SUBSCRIBE:
            let alreadySubscribed = state.subscribed.find(characteristic => (characteristic === action.payload));
            if (!alreadySubscribed)
                state = { ...state, [...state.subscribed, action.payload] };
            break;
        case Types.UNSUBSCRIBE:
            let characteristicIndex = state.subscribed.indexOf(action.payload);
            if (characteristicIndex !== -1)
                state = { ...state, subscribed: state.subscribed.splice(characteristicIndex, 1) }
            break;
        // Default is only here to stop the compiler warning
        default:
            break;
    }

    return state;
}
