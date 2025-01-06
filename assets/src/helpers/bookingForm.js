const $form = document.querySelector('.body__main-div--two-form--one');
const $table = document.querySelector('.body__main-div--two-div--one');
const $price = document.querySelector('.body__main-div--two-form--one-input--two');
const $dateInput = document.querySelector('.body__main-div--two-form--one-input--five');
const $warningDaySelection = document.querySelector(".body__main-div--two-form--one-div--one");
const $qtyParticipants = document.querySelector('.body__main-div--two-form--one-select--two');
const $qtyParticipantsLabel = document.querySelector('.qtyParticipants-label');
const $totalText = document.querySelector(".body__main-div--two-form--one-p--one");
const $taxPrice =  document.querySelector(".body__main-div--two-form--one-input--four");
const $total = document.querySelector(".body__main-div--two-form--one-input--three");


let daySelected;
// Default values for price and taxes
$price.value = 1000;
$taxPrice.value = $price.value * .16;
$qtyParticipants.value = 1;

// $qtyParticipants.style.display = "none";
// $qtyParticipantsLabel.style.display = "none";

$taxPrice.value = Math.round(0.16 * ($price.value * $qtyParticipants.value) * 100) / 100;
        let totalPrice = ($price.value * $qtyParticipants.value) + parseInt($taxPrice.value);
        $totalText.textContent = `$${totalPrice}.00`;
        $total.value = totalPrice;

// Events delegation on calendar table
$table.addEventListener("click", (e) => {
    if (daySelected) {
        daySelected.classList.remove('day-selected');
    }

    if (e.target.textContent.length < 3) {
        daySelected = e.target;
        daySelected.classList.add('day-selected');
    }
    $dateInput.value = e.target.getAttribute("data-date");
});

// Determining the price
$form.addEventListener('change', (e) => {
    
    if (e.target.className.match('body__main-div--two-form--one-select--One') 
        &&  
        e.target.value === '65403ead6f41b178fd0dcb63') {
        $price.value = 1000;
    } 
    else if (e.target.className.match('body__main-div--two-form--one-select--One') 
        &&  e.target.value === '65404661c833a46a8812ef19') {
        $price.value = 2000;
    } 
    else if (e.target.className.match('body__main-div--two-form--one-select--One') 
        &&  e.target.value === '65404a173d3fe96835c4646b') {
        $price.value = 3000;
    }

    if (e.target.className.match('qtyParticipants') || e.target.className.match('body__main-div--two-form--one-select--One')) {
        $taxPrice.value = Math.round(0.16 * ($price.value * $qtyParticipants.value) * 100) / 100;
        let totalPrice = ($price.value * $qtyParticipants.value) + parseInt($taxPrice.value);
        $totalText.textContent = `$${totalPrice}.00`;
        $total.value = totalPrice;
    };
});

// Add a submit event listener to the form
$form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    // Get the form data
    const formData = new FormData($form);
    // Convert the form data to a JSON object
    const formDataObject = {};
    formData.forEach((value, key) => {
        console.log("VAL: ",value,"KEY: ", key);
        formDataObject[key] = value;
    });
    console.log(formDataObject);
    // Selected day validation
    if (!formDataObject.date) {
        $warningDaySelection.removeAttribute('hidden');
        return;
    }

    daySelected.classList.remove('day-selected');

    // Send the form data with a POST request
    localStorage.clear();
    localStorage.setItem('current-trip', JSON.stringify(formDataObject));
    localStorage.setItem('current-day', $dateInput.value);
    // Clearing form
    $form.reset();
    location.href = './day';
 });