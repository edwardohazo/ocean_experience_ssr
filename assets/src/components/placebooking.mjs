import {
  getPayment,
  getBookingInfo,
  setPaymentDetails
} from '../localStorage.js';


const $body__mainBooking = document.querySelector('.body__mainBooking');
const convertBookingToOrder = () => {
  const bookingInfo = getBookingInfo();
  const payment = getPayment();
  return {...bookingInfo, payment};
};

const PlaceOrderScreen = {
    after_render: async () => {
      document
        .getElementById('placeorder-button')
        .addEventListener('click', async () => {
          const details = convertBookingToOrder();
          console.log(details);
          localStorage.clear();
          setPaymentDetails(details);
          location.href = './checkout.html';
        //   showLoading();
        //   const data = await createOrder(details);
        //   hideLoading();
        //   if (data.error) {
        //     showMessage(data.error);
        //   } else {
        //     cleanCart();
        //     document.location.hash = `/order/${data.order._id}`;
        //   }
        });
    },
    render: () => {
      const {
        username,
        service,
        participants,
        hour,
        price,
        taxPrice,
        totalPrice,
        payment
      } = convertBookingToOrder();
      return `
      <div>
        <div class="order">
          <div class="order-action">
            <ul>
                <li>
                  <h2>Order Summary</h2>
                </li>
                <li><div>Name:</div><div>${username}</div></li>
                <li><div>Experience:</div><div>${service}</div></li>
                <li><div>Participants:</div><div>${participants}</div></li>
                <li><div>Hour:</div><div>${hour} hrs</div></li>
                <li><div>Price:</div><div>$${price}</div></li>
                <li class="tax"><div>Taxes:</div><div>$${taxPrice}</div></li>
                <li class="total"><div>Total Price:</div><div>$${totalPrice}</div></li>
                <li><div>Pyment Method:</div><div>${payment.paymentMethod}</div></li> 
                <li>
                  <button id="placeorder-button" class="primary fw">
                    Pay!
                  </button>
                </li>
            </ul>
          </div>
        </div>
      </div>
      `;
    },
};
  
$body__mainBooking.innerHTML = PlaceOrderScreen.render();
PlaceOrderScreen.after_render();


//   ${CheckoutSteps.render({
//     step1: true,
//     step2: true,
//     step3: true,
//     step4: true,
//   })}