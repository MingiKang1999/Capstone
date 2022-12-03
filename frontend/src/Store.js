import { createContext, useReducer} from "react";

export const Store = createContext();

const initialState ={
    cart: {
        cartItems: [],
    },
};
function reducer(state, action){
    switch (action.type){
        case "CART_ADD_ITEM":
            const newItem = action.payload;
            const cartItems = state.cart.cartItems.find(
                (item) => item._id === newItem._id);
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            return {...state, cart:{...state.cart, cartItems:[...state.cart.cartItems, action.payload],},};
            case "CART_REMOVE_ITEM": {
                const cartItems = state.cart.cartItems.filter(
                    (item) => item._id !== action.payload._id);
                    localStorage.setItem("cartItems", JSON.stringify(cartItems));
                    return {...state, cart: {...state.cart, cartItems}};
                }
            case "USER_SIGNIN":
                return {...state, userInfo: action.payload};
        default:
            return state;
    }
}

export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = {state, dispatch};
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}