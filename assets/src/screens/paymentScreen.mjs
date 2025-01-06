import { 
  getCurrentTrip, 
  setCurrentTrip 
} from '../localStorage.js';
import CheckoutSteps from '../components/checkoutSteps.js';
const $mainPayment = document.querySelector('.payment');


let currentTrip = getCurrentTrip();

const PaymentScreen = {
  after_render: () => {
    document
      .getElementById('payment-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        const paymentMethod = document.querySelector(
          'input[name="payment-method"]:checked'
        ).value;
        currentTrip.paymentMethod = paymentMethod;
        setCurrentTrip(JSON.stringify(currentTrip));
        location.href = './placeorder';
      });
  },
  // Rendering payment method options
  render: async () => {
    return `
    ${CheckoutSteps.render({ step1: true, step2: false })}
    <div class="form-container">
      <form id="payment-form">
        <ul class="form-items">
          <li>
            <h1>Payment</h1>
          </li>
          <li>
            <div>
              <input type="radio"
              name="payment-method"
              id="paypal"
              value="Paypal"
              checked />
              <label for="paypal" >PayPal</label>
             </div> 
          </li>
          <li>
          <div>
            <input type="radio"
            name="payment-method"
            id="stripe"
            value="Stripe"
             />
            <label for="stripe">Stripe</label>
           </div> 
        </li>
          <li>
            <button class="payment-submit" type="submit" class="primary">Continue</button>
          </li>        
        </ul>
      </form>
    </div>
    `;
  },
};

PaymentScreen.render()
.then((html) => {
  $mainPayment.innerHTML = html;
  PaymentScreen.after_render();
});

