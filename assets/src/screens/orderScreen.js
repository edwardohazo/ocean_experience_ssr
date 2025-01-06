import {
    parseRequestUrl,
    showLoading,
    hideLoading,
    showMessage,
    rerender,
  } from '../utils/utils.js';
import { getPaypalClientId, getOrder, payOrder, getPaypalApi, clientSec } from '../../api.js';


const $mainOrder = document.getElementById('main-divOrder');

const addPaypalSdk = async (totalPrice, orderId) => {
  const clientId = await getPaypalClientId();
  const paypalApi = await getPaypalApi();
  const accessToken = await clientSec();
  
  showLoading();

  // PAYPAL JS SDK INTEGRATION

  if (!window.paypal) {

    //   * BRAINTREE SDK *

    // const scriptOne = document.createElement('script');
    // scriptOne.type = 'text/javascript';
    // scriptOne.src = 'https://js.braintreegateway.com/web/3.92.1/js/client.min.js';
    // scriptOne.async = true;
    // scriptOne.onload = () => {
    //       const scriptTwo = document.createElement('script');
    //       scriptTwo.type = 'text/javascript';
    //       scriptTwo.src = 'https://js.braintreegateway.com/web/3.92.1/js/paypal-checkout.min.js';
    //       scriptTwo.async = true;
    //       scriptTwo.onload =  () => handlePayment(clientId, totalPrice, paypalApi, accessToken);
    //       document.body.appendChild(scriptTwo);
    // };
    // document.body.appendChild(scriptOne);

    // * CHECKOUT JS *

    const scriptOne = document.createElement('script');
    scriptOne.type = 'text/javascript';
    scriptOne.src = `https://www.paypalobjects.com/api/checkout.js`;
    scriptOne.async = true;
    scriptOne.onload = () => {
        handlePayment(clientId, totalPrice, paypalApi, accessToken, orderId); 
    } 
    document.body.appendChild(scriptOne);

  } else {
    handlePayment(clientId, paypalApi, totalPrice, accessToken);
  }
};


const handlePayment = (clientId, totalPrice, paypalApi, accessToken, orderId) => {

  hideLoading();

  console.log('CLIENT ID: ', clientId);
  console.log('PAYPAL API: ', paypalApi);
  console.log('TOKEN: ', accessToken);
  console.log('TOTAL PRICE: ', totalPrice);

//   * BRAINTREE SDK *
  
//   braintree.client.create({
//     authorization: accessToken
//   }).then(function (clientInstance) {
//     return braintree.paypalCheckout.create({
//       client: clientInstance
//     });
//   }).then(function (paypalCheckoutInstance) {
//     return paypal.Buttons({
//       createOrder: function () {
//         return paypalCheckoutInstance.createPayment({
//           flow: 'checkout',
//           currency: 'USD',
//           amount: totalPrice,
//           intent: 'capture' // this value must either be `capture` or match the intent passed into the PayPal SDK intent query parameter
//           // your other createPayment options here
//         });
//       },
  
//       onApprove: function (data, actions) {
//         // some logic here before tokenization happens below
//         return paypalCheckoutInstance.tokenizePayment(data).then(function (payload) {
//           // Submit payload.nonce to your server
//         });
//       },
  
//       onCancel: function () {
//         // handle case where user cancels
//       },
  
//       onError: function (err) {
//         // handle case where error occurs
//       }
//     }).render('#paypal-button');
//   }).catch(function (err) {
//    console.error('Error!', err);
//   });

// * CHECKOUT JS *

window.paypal.Button.render(
    {
      env: 'sandbox',
      client: {
        sandbox: clientId,
        production: '',
      },
      locale: 'en_US',
      style: {
        size: 'responsive',
        color: 'gold',
        shape: 'pill',
      },

      commit: true,
      payment(data, actions) {
        return actions.payment.create({
          transactions: [
            {
              amount: {
                total: totalPrice,
                currency: 'USD',
              },
            },
          ],
        });
      },
      onAuthorize(data, actions) {
        return actions.payment.execute().then(async () => {
          showLoading();
          await payOrder(orderId, {
            orderID: data.orderID,
            payerID: data.payerID,
            paymentID: data.paymentID,
          });
          hideLoading();
          showMessage(
            'Payment was successfull.', 
            (orderId) => {
            location.href = `./order?orderId=${orderId}`;
            }, 
            orderId
            );
        });
      },
    },
    '#paypal-button'
  ).then(() => {
    hideLoading();
  });
};

const OrderScreen = {
  after_render: async () => {
    // const request = parseRequestUrl();
    rerender(OrderScreen);
  },
  render: async () => {
    // Create a URL object
    const url = new URL(location.href);
    // Get the query parameters
    const queryParams = url.searchParams;
    // Access specific query parameters
    const orderId = queryParams.get("orderId");

    const {
        orderItem,
        username,
        participants,
        date,
        shift,
        taxPrice,
        totalPrice,
        payment,        
        isPaid,
        paidAt,
    } = await getOrder(orderId);

    if (!isPaid) {
      addPaypalSdk(totalPrice, orderId);
    }

    const isoDate = new Date(date);
    const formattedDate = isoDate.toISOString().split('T')[0];

    return `
    <div>
    ${
      isPaid 
        ?  `<h1 class="success">TICKET</h1>`
        :  `<h1 class="success">TICKET PREVIEW</h1>`
    }
      <div class="body__main-div--one-div--one-div--two-div--one order">
        <div class="body__main-div--one-div--one-div--two-div--one-div--one order-info">
          <div>
            <h2 class="body__main-div--one-div--one-div--two-div--one-div--one-div--one-h2--one">Payment</h2>
            Status: 
            ${
              isPaid
                ? `<div class="success">Paid at ${paidAt}</div>`
                : `<div class="error">Not Paid</div>`
            }
          </div>
        </div>
        <div class="body__main-div--one-div--one-div--two-div--one-div--two order-action">
           <ul>
                <li class="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--one body__main-div-div-div-div-div-ul-li">
                  <h2 class="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--one-h2--one">Order Summary</h2>
                 </li>

                 <li class="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--one body__main-div-div-div-div-div-ul-li"><div>Client:</div><div>${username}</div></li>
                 <li class="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--two body__main-div-div-div-div-div-ul-li"><div>Service:</div><div>${orderItem.service}</div></li>
                 <li class="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--three body__main-div-div-div-div-div-ul-li"><div>Participants:</div><div>${participants}</div></li>
                 <li class="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--four body__main-div-div-div-div-div-ul-li"><div>Date:</div><div>${formattedDate}</div></li>
                 <li class="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--five body__main-div-div-div-div-div-ul-li"><div>shift:</div><div>${shift}</div></li>
                 <li class="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--six body__main-div-div-div-div-div-ul-li"><div>Price:</div><div>$${orderItem.price}</div></li>
                 <li class="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--seven body__main-div-div-div-div-div-ul-li"><div>Tax:</div><div>$${taxPrice}</div></li>
                 <li class="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--eight body__main-div-div-div-div-div-ul-li" class="total"><div>Total Price:</div><div>$${totalPrice}</div></li> 
                 <li class="body__main-div--one-div--one-div--two-div--one-div--two-ul--one-li--nine body__main-div-div-div-div-div-ul-li"><div>Payment Method:</div><div>${payment.paymentMethod}</div></li>
          </ul>
          <div class="fw" id="paypal-button"></div>
        </div>
      </div>
    </div>
    `;
  },
};
OrderScreen.render()
.then((html) => {
  $mainOrder.innerHTML = html;
});