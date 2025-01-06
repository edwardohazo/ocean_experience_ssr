import {apiUrl} from './src/utils/config.js';
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';


export const createOrder = async (order) => {
  try {
    // const { token } = getBookingInfo();
    console.log('ORDER: ', order);
    const response = await axios({
      url: `${apiUrl}/api/orders`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
      data: order,
    });
    // if (response.statusText !== "Created") {
    //   throw new Error(response.data.message);
    // }

    return response.data;
  } catch (err) {
    console.log("sucedio un error");
    return { error: err.response ? err.response.data.message : err.message };
  }
};
export const getOrders = async () => {
  try {
    // const { token } = getBookingInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
  }
};
export const deleteOrder = async (orderId) => {
  try {
    // const { token } = getBookingInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders/${orderId}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    return { error: err.response.data.message || err.message };
  }
};
export const getOrder = async (id) => {
  try {
    // const { token } = getBookingInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders/${id}`,
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    return { error: err.message };
  }
};
export const getMyOrders = async () => {
  try {
    // const { token } = getBookingInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders/mine`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    return { error: err.response ? err.response.data.message : err.message };
  }
};
export const getPaypalClientId = async () => {
  const response = await axios({
    url: `${apiUrl}/api/paypal/clientId`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  // if (response.statusText !== 'OK') {
  //   throw new Error(response.data.message);
  // }
  return response.data.clientId;
};
export const getPaypalApi = async () => {
  const response = await axios({
    url: `${apiUrl}/api/paypal/paypalApi`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  // if (response.statusText !== 'OK') {
  //   throw new Error(response.data.message);
  // }
  return response.data.paypalApi;
};
export const clientSec = async () => {
  const response = await axios({
    url: `${apiUrl}/api/paypal/access-token`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  // if (response.statusText !== 'OK') {
  //   throw new Error(response.data.message);
  // }

  return response.data.accessToken;
};
export const payOrder = async (orderId, paymentResult) => {
  try {
    // const { token } = getBookingInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders/${orderId}/pay`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
      // data: paymentResult,
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    return { error: err.response ? err.response.data.message : err.message };
  }
};
export const getSummary = async () => {
  try {
    // const { token } = getBookingInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders/summary`,
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }

    return response.data;
  } catch (err) {
    return { error: err.response ? err.response.data.message : err.message };
  }
};