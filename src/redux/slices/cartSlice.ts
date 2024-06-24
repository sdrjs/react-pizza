import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type ICartItem = {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    type: string;
    size: number;
    paramId: string;
}

interface ICartState {
    items: {
        [key: string]: {
            item: ICartItem
            count: number;
        }
    };
    totalCount: number;
    totalPrice: number;
}

function getInitialState(): ICartState {
    const localStorageCart = localStorage.getItem('cart');

    if (localStorageCart) {
        return JSON.parse(localStorageCart);
    }

    return {
        items: {},
        totalCount: 0,
        totalPrice: 0,
    };
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: getInitialState(),
    reducers: {
        addItem(state, action: PayloadAction<ICartItem>) {
            const key = action.payload.paramId;
            if (!(key in state.items)) {
                state.items[key] = { item: action.payload, count: 0};
            }
            state.items[key].count++;

            state.totalPrice += action.payload.price;
            state.totalCount++;
        },
        removeItem(state, action: PayloadAction<ICartItem>) {
            const key = action.payload.paramId;
            state.items[key].count--;
            if (state.items[key].count === 0) {
                delete state.items[key];
            }

            state.totalPrice -= action.payload.price;
            state.totalCount--;
        },
        removeItems(state, action: PayloadAction<ICartItem>) {
            const key = action.payload.paramId;

            state.totalCount -= state.items[key].count;
            state.totalPrice -= state.items[key].count * state.items[key].item.price;

            delete state.items[key];
        },
        clearItems(state) {
            state.items = {};
            state.totalPrice = 0;
            state.totalCount = 0;
        },
    }
});

export const selectItemsCountById = (id: string) => {
    return (state: RootState) => {
        return Object.values(state.cart.items).reduce((acc, items) => {
            if (items.item.id === id) {
                return acc + items.count;
            }

            return acc;
        }, 0);
    }
};
export const selectCart = (state: RootState) => state.cart;
export const { addItem, removeItem, clearItems, removeItems } = cartSlice.actions;
export default cartSlice.reducer;