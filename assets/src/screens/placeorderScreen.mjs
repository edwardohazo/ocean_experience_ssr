import {
    getCurrentTrip,
} from '../localStorage.js';
import { showLoading, hideLoading, showMessage } from '../utils/utils.js';
import { createOrder } from '../../api.js';
import CheckoutSteps from '../components/checkoutSteps.js';
const $mainPlaceorder = document.querySelector('.placeorder');
  

const convertTripToOrder = () => {
  const orderDetails = getCurrentTrip();
  const username = orderDetails.username;
  const orderItem = {
    price: orderDetails.price,
    service: orderDetails.service
  };
  const participants = orderDetails.participants;
  const date = orderDetails.date;
  const shift = orderDetails.shift;
  const taxPrice = orderDetails.taxPrice;
  const totalPrice = orderDetails.totalPrice;
  const payment = {paymentMethod: orderDetails.paymentMethod};
  return {
    username,
    orderItem,
    participants,
    date,
    shift,
    taxPrice,
    totalPrice,
    payment,
  };
};
const PlaceOrderScreen = {
  after_render: async () => {
    document
      .getElementById('placeorder-button')
      .addEventListener('click', async () => {
        const order = convertTripToOrder();
        showLoading();

        const data = await createOrder(order);
        hideLoading();
        if (data.error) {
          showMessage(data.error);
        } else {
          location.href = `./order?orderId=${data.order._id}`;
        }
      });
  },
  render: () => {
    const {
    username,
    service,
    participants,
    shift,
    date,
    price,
    taxPrice,
    totalPrice,
    paymentMethod,
    } = getCurrentTrip();
    
    return `
    ${CheckoutSteps.render({ step1: true, step2: true })}
    <div>
      <div class="body__main-div--one-div--one-div--two-div--one order">
        <div class="body__main-div--one-div--one-div--two-div--one-div--one order-info">
          <div>
            <h2 class="body__main-div--one-div--one-div--two-div--one-div--one-div--one-h2--one">Payment</h2>
            <div>
              Payment Method: </br> ${paymentMethod}
            </div>
          </div>
        </div>
        <div class="body__main-div--one-div--one-div--two-div--one-div--two order-action">
           <ul>
                <li class="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--one body__main-div-div-div-div-div-ul-li" >
                  <h2 class="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--one-h2--one">Order Summary</h2>
                </li>
                <li class="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--one body__main-div-div-div-div-div-ul-li"><div>Client:</div><div>${username}</div></li>
                <li clasS="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--two body__main-div-div-div-div-div-ul-li"><div>Service:</div><div>${service}</div></li>
                <li clasS="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--three body__main-div-div-div-div-div-ul-li"><div>Participants:</div><div>${participants}</div></li>
                <li clasS="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--four body__main-div-div-div-div-div-ul-li"><div>Date:</div><div>${date}</div></li>
                <li clasS="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--five body__main-div-div-div-div-div-ul-li"><div>shift:</div><div>${shift}</div></li>
                <li clasS="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--six body__main-div-div-div-div-div-ul-li"><div>Price:</div><div>$${price}</div></li>
                <li clasS="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--seven body__main-div-div-div-div-div-ul-li"><div>Tax:</div><div>$${taxPrice}</div></li>
                <li clasS="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--eight body__main-div-div-div-div-div-ul-li total"><div>Order Total:</div><div>$${totalPrice}</div></li> 
                <li clasS="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--nine body__main-div-div-div-div-div-ul-li">
                <button id="placeorder-button" class="order-submit primary fw">
                Place Order
                </button>
        </div>
      </div>
    </div>
    `;
  },
};

$mainPlaceorder.innerHTML = PlaceOrderScreen.render()
PlaceOrderScreen.after_render();
