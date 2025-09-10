import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const {
        productId,
        price,
        productName,
        size,
        number,
        color,
        productDisplayImage,
        sku,
        tokenId,
      } = action.payload;

      const existingItem = state.cartItems.find(
        (item) =>
          item.productId === productId &&
          item.size === size &&
          item.number === number
      );

      if (existingItem) {
        // If you want to keep the commented out functionality to increase quantity:
        // state.cartItems = state.cartItems.map((item) =>
        //   item.productId === productId && item.size === size
        //     ? { ...item, quantity: item.quantity + 1 }
        //     : item
        // );

        // Current functionality:
        state.cartItems = state.cartItems.map((item) =>
          item.productId === productId && item.size === size ? item : item
        );
      } else {
        state.cartItems.push({
          productId,
          quantity: 1,
          price,
          productName,
          size,
          number,//not present in store
          color,
          productDisplayImage, //not present in store
          sku,
          tokenId, //not present in store
        });
      }
      // Save to localStorage
      localStorage.setItem("default-user-cart", JSON.stringify(state.cartItems));
    },

     removeFromCart: (state, action) => {
      const { productId, size, number } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.size === size &&
            item.number === number
          )
      );
      localStorage.setItem("default-user-cart", JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.setItem("default-user-cart", JSON.stringify([]));
    },
  },
});

// Export actions
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.cartItems;

// Export reducer
export default cartSlice.reducer;