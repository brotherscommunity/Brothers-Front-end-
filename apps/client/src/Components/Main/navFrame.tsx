// ShoppingCartPage.tsx
import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: 'Item 1', price: 10 },
  { id: 2, name: 'Item 2', price: 20 },
  { id: 3, name: 'Item 3', price: 15 },
];

const ShoppingCartPage: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [userName, setUserName] = useState('John Doe');
  const [userImage, setUserImage] = useState('/path-to-your-avatar.jpg'); // Replace with your image path

  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header and Person Logo */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <img
            src={userImage}
            alt={userName}
            className="w-12 h-12 rounded-full border-2 border-gray-200"
          />
          <p className="text-lg font-semibold text-gray-700">{userName}</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Products</h2>

      {/* Products List */}
      <div className="space-y-4 mb-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md"
          >
            <span className="text-lg font-medium text-gray-800">{product.name}</span>
            <span className="text-lg font-medium text-gray-600">${product.price}</span>
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Cart</h3>
      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md"
          >
            <span className="text-lg font-medium text-gray-800">{item.name}</span>
            <span className="text-lg font-medium text-gray-600">${item.price}</span>
            <button
              onClick={() => removeFromCart(item.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Total Price */}
      <h4 className="text-xl font-semibold text-gray-800 mb-4">Total: ${getTotalPrice()}</h4>

      {/* Checkout Button */}
      {cart.length > 0 && (
        <button className="bg-green-500 text-white px-6 py-3 rounded-md mt-6 w-full">
          Proceed to Checkout
        </button>
      )}
    </div>
  );
};

export default ShoppingCartPage;
