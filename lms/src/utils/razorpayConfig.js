import axiosInstance from './axiosConfig';

export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const createPaymentOrder = async (amount) => {
  try {
    const response = await axiosInstance.post('/api/payment/create-order', {
      amount: amount * 100 // Convert to paise
    });
    return response.data;
  } catch (error) {
    throw new Error('Error creating payment order');
  }
}; 