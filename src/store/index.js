import { configureStore, createSlice } from '@reduxjs/toolkit';
import { loadState, saveState } from './util';
import { v4 as uuidv4 } from 'uuid';

const loadedState = loadState();

const initialState = loadedState || {
    auth: { user: [], token: '', role: '', isLoggedIn: false },
    cart: [],
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState.auth,
    reducers: {
        login(state, action) {
            const { user, token, role } = action.payload;
            state.user = user;
            state.token = token;
            state.role = role;
            state.isLoggedIn = true;
            saveState({ ...initialState, auth: state });
        },
        logout(state) {
            state.user = '';
            state.token = '';
            state.role = '';
            state.isLoggedIn = false;
            saveState({ ...initialState, auth: state });
            localStorage.removeItem('state');
        },
        updateUser(state, action) {
            state.user = { ...state.user, ...action.payload };
            saveState({ ...initialState, auth: state });
        },
    },
});

const searchSlice = createSlice({
    name: 'search',
    initialState: { keyword: "", results: [] },
    reducers: {
        search(state, action) {
            const { keyword } = action.payload;
            state.keyword = keyword;
        },
        setResults(state, action) {
            state.results = action.payload.results;
        },
    },
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState.cart,
    reducers: {
        addToCart(state, action) {
            const newItem = {
                ...action.payload,
                id: uuidv4() // Assign a unique ID to the item
            };
            state.push(newItem); // Push the new item into the cart array
            saveState({ ...initialState, cart: state }); // Save state to localStorage
        },
        removeFromCart(state, action) {
            const itemId = action.payload; // Payload should be the unique ID
            const newCart = state.filter(item => item.id !== itemId);
            saveState({ ...initialState, cart: newCart }); // Save state to localStorage
            return newCart;
        },
        clearCart(state) {
            saveState({ ...initialState, cart: [] }); // Save state to localStorage
            return [];
        },
    },
});

export const authActions = authSlice.actions;
export const searchActions = searchSlice.actions;
export const cartActions = cartSlice.actions;

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        search: searchSlice.reducer,
        cart: cartSlice.reducer,
    },
});

store.subscribe(() => {
    saveState(store.getState());
});
