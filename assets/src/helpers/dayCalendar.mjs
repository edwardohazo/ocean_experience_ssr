import { getOrders } from "../../api.js";
import { getCurrentTrip, setCurrentTrip } from "../localStorage.js";
import { showLoading, hideLoading, showMessage } from '../utils/utils.js';


const reservedShiftsView = async () => {
    
    const currentDaySelectedShifts = [];
    const currentDayPaidOrders = []
    let morningParticipants = 0;
    let afternoonParticipants = 0;
    let currentTrip = getCurrentTrip();
    let $warningUnsuficientPlaces = document.querySelector('.body__main-div--three-div--two');
    let selectedShift;

    // Format Date Function
    function formatDate(inputDate) {
        const date = new Date(inputDate);
        date.setUTCHours(0, 0, 0, 0);
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Getting day orders and reserved hour of each one

    showLoading();

    await getOrders()
    .then((orders) => {
        orders.forEach((order) => {
            let orderFormattedDate = formatDate(order.date);
    
             // ALL ORDERS
             if (orderFormattedDate === localStorage.getItem('current-day') && order.isPaid) {
                currentDayPaidOrders.push(order);
                currentDaySelectedShifts.push(order.shift);
            } 
        });
    });

    currentDayPaidOrders.map((order) => {
        if (order.shift === 'morning') {
            morningParticipants += order.participants;
        } else {
            afternoonParticipants += order.participants;
        }
    });

    console.log('CURRENT DATE TOTAL PARTICIPANTS: ', morningParticipants + afternoonParticipants);

    hideLoading();

    // Function to generate the reserved shifts
    function generateView() {

        const shiftsContainer = document.getElementById('shifts-container');

        // Loop from morning to afternoon
        let shifts = ['morning', 'afternoon'];
        shifts.forEach((shift) => {
            const shiftDiv = document.createElement('div');
            if (shift === 'morning') {
                shiftDiv.innerHTML = `
                <p>${shift}</p>
                <p>${8 - morningParticipants} / 8</p>
                <p>Places left</p>
                `;
                shiftDiv.classList.add('shiftOne');
            } else {
                shiftDiv.innerHTML = `
                <p>${shift}</p>
                <p>${8 - afternoonParticipants} / 8</p>
                <p>Places left</p>
                `;
                shiftDiv.classList.add('shiftTwo');
            }
            shiftDiv.classList.add('shift');

            if (currentDaySelectedShifts.includes(shift) && shift === 'morning') {
                switch (true) {
                    case morningParticipants >= 8:
                        shiftDiv.classList.add('sold-out-shift');
                        break;
                    case morningParticipants > 6:
                        shiftDiv.classList.add('few-shifts-left');
                        break;
                    case morningParticipants > 4:
                        shiftDiv.classList.add('some-shifts-left');
                        break;
                    case morningParticipants >= 1:
                        shiftDiv.classList.add('many-shifts-left');
                        break;
                    case morningParticipants < 1:
                        shiftDiv.classList.add('all-shifts-left');
                        break;
                    default:
                        // Default case if none of the conditions are met
                        break;
                }
            }


            // Coloring UI places left per day shift
            if (currentDaySelectedShifts.includes(shift) && shift === 'afternoon') {
                switch (true) {
                    case afternoonParticipants >= 8:
                        shiftDiv.classList.add('sold-out-shift');
                        break;
                    case afternoonParticipants > 6:
                        shiftDiv.classList.add('few-shifts-left');
                        break;
                    case afternoonParticipants > 4:
                        shiftDiv.classList.add('some-shifts-left');
                        break;
                    case afternoonParticipants >= 1:
                        console.log("here i am");
                        shiftDiv.classList.add('many-shifts-left');
                        break;
                    case afternoonParticipants < 1:
                        shiftDiv.classList.add('all-shifts-left');
                        break;
                    default:
                        // Default case if none of the conditions are met
                        break;
                }
            }

            shiftsContainer.appendChild(shiftDiv);
        });

        // Selecting shift
        for (let shift of shiftsContainer.children) {
            shift.addEventListener('click', async function (e) {
                let selectedShift;
                if (this.classList.contains('shiftOne')) {
                    selectedShift = 'morning';
                } else if (this.classList.contains('shiftTwo')) {
                    selectedShift = 'afternoon';
                }
                
                // Adding shift to the current trip 
                currentTrip.shift = selectedShift;
    
                // Shift available validation
                if ((currentTrip.shift === 'morning' 
                    && (morningParticipants +  parseInt(currentTrip.participants)) > 8)
                    || (currentTrip.shift === 'morning' 
                    && parseInt(currentTrip.participants) > 8)
                    ) {
                        console.log(currentTrip.participants);
                    $warningUnsuficientPlaces.hidden = false;
                    setTimeout(() => {
                        $warningUnsuficientPlaces.hidden = true;
                    }, 5000);
                    return;
                } else if ((currentTrip.shift === 'afternoon' 
                    && (afternoonParticipants +  parseInt(currentTrip.participants)) > 8)
                    || (currentTrip.shift === 'afternoon' 
                    && parseInt(currentTrip.participants) > 8)
                    ) {
                    $warningUnsuficientPlaces.hidden = false;
                    setTimeout(() => {
                        $warningUnsuficientPlaces.hidden = true;
                    }, 5000);
                    return;
                }
                
                setCurrentTrip(JSON.stringify(currentTrip));
    
                location.href = './payment';
            });
        }
    }

    generateView();
}

reservedShiftsView();

