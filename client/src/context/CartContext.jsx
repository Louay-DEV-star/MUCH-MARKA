import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(
        item => item.id === action.payload.id && item.selectedSize === action.payload.selectedSize
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && item.selectedSize === action.payload.selectedSize
              ? {
                  ...item,
                  quantity: item.quantity + action.payload.quantity,
                  subtotal: item.price * (item.quantity + action.payload.quantity), // ✅ recalc subtotal
                }
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => 
          !(item.id === action.payload.id && item.selectedSize === action.payload.selectedSize)
        )
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && item.selectedSize === action.payload.selectedSize
            ? {
                ...item,
                quantity: action.payload.quantity,
                subtotal: item.price * action.payload.quantity,
              }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'SET_SELECTED_SIZE':
      return {
        ...state,
        selectedSize: action.payload
      };

    case 'RESTORE_CART':
      return {
        ...state,
        items: action.payload
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    selectedSize: null
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      dispatch({ type: 'RESTORE_CART', payload: parsedCart });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product, quantity, selectedSize) => {
    const finalPrice =
    product.promotion > 0
      ? product.price - (product.price * product.promotion) / 100
      : product.price;
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: finalPrice,
        image: product.banner,
        quantity,
        selectedSize,
        subtotal: finalPrice * quantity
      }
    });
  };

  const removeFromCart = (id, selectedSize) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { id, selectedSize }
    });
  };

  const updateQuantity = (id, selectedSize, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, selectedSize);
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id, selectedSize, quantity }
      });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + item.subtotal, 0);
  };

  const getCartItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    items: state.items,
    selectedSize: state.selectedSize,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
