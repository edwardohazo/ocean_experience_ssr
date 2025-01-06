import { showLoading, hideLoading, showMessage } from '../utils/utils.js';
import {apiUrl} from '../utils/config.js';

console.log(apiUrl);
document.addEventListener("DOMContentLoaded", async function () {

    const calendarContainer = document.getElementById("calendar");
    const currentMonthSpan = document.getElementById("current-month");
    const prevMonthButton = document.getElementById("prev-month");
    const nextMonthButton = document.getElementById("next-month");
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Sample data from the backend (replace with actual data from your API)
    const reservationData = [];

    // Format Date Function
    function formatDate(inputDate) {
      const date = new Date(inputDate);
      date.setUTCHours(0, 0, 0, 0);
      const year = date.getUTCFullYear();
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const day = date.getUTCDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    // Getting Reserved Dates
    showLoading();

    await fetch(`${apiUrl}/api/orders`)
    .then((res) => {
        return res.json()
    })
    .then((res) => {
        res.forEach((order) => {
          if (order.isPaid) {
            const formattedDate = formatDate(order.date);
            reservationData.push({date: formattedDate, status: "reserved", participants: order.participants, shift: order.shift});
          }
        });
    })
    .catch((err) => {
        showMessage();
        console.log(err);
    });
    
    hideLoading();
  
    let currentDate = new Date(); // Current displayed month
    createCalendar(currentDate, daysOfWeek);

    function createCalendar(date) {
      currentMonthSpan.textContent = getMonthYearString(date);
    
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
      let calendarHTML = "<table>";
      calendarHTML += "<tr>";
    
      // Create the table header with days of the week from Monday to Sunday
      const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
      for (const day of daysOfWeek) {
          calendarHTML += `<th>${day}</th>`;
      }
    
      calendarHTML += "</tr><tr>";
    
      // Determine the day of the week for the first day of the month (0 - Sunday, 1 - Monday, ..., 6 - Saturday)
      const firstDayOfMonth = startDate.getDay() === 0 ? 7 : startDate.getDay();
      let currentDate = new Date(startDate);
    
      // Add empty cells for days before the first day of the month
      for (let i = 1; i < firstDayOfMonth; i++) {
          calendarHTML += "<td></td>";
      }
        
      while (currentDate <= endDate) {
        let morningParticipants = 0;
        let afternoonParticipants = 0;

        const dateString = currentDate.toISOString().split("T")[0];
          let cellClassMorning = "available"; 
          let cellClassAfternoon = "available"; 
 
          const reservation = reservationData.filter((res) => res.date === dateString);

          reservation.forEach((reserv) => {
            if (reserv.shift === 'morning') {
              morningParticipants += reserv.participants;
            } else {
              afternoonParticipants += reserv.participants;
            }
          });

          if (reservation && reservation.length > 0) {
            switch (true) {
              case morningParticipants >= 8:
                  cellClassMorning = "reserved";
                  break;
              // case morningParticipants > 5:
              //     cellClassMorning = "few";
              //     break;
              // case morningParticipants > 3:
              //     cellClassMorning = "some";
              //     break;
              // case morningParticipants >= 2:
              //     cellClassMorning = "many";
              //     break;
              // case morningParticipants < 1:
              //     cellClassMorning = "all";
              //     break;
              // case afternoonParticipants < 8:
              //   cellClassAfternoon = "some";
              //   break;
              default:
                  // Default case if none of the conditions are met
                  break;
          }

            switch (true) {
              case afternoonParticipants >= 8:
                  cellClassAfternoon = "reserved";
                  break;
              // case afternoonParticipants > 5:
              //     cellClassAfternoon = "few";
              //     break;
              // case afternoonParticipants > 3:
              //     cellClassAfternoon = "some";
              //     break;
              // case afternoonParticipants >= 2:
              //     cellClassAfternoon = "many";
              //     break;
              // case afternoonParticipants < 1:
              //     cellClassAfternoon = "all";
              //     break;
              // case afternoonParticipants < 8:
              //   cellClassAfternoon = "some";
              //   break;
              default:
                  // Default case if none of the conditions are met
                  break;
          }

          }

          calendarHTML += `<td class="" data-date="${dateString}">${currentDate.getDate()}<div class="${cellClassMorning} half-morning-day" data-date="${dateString}">${currentDate.getDate()}</div><div class="${cellClassAfternoon} half-afternoon-day" data-date="${dateString}"></div></td>`;
        
          if (currentDate.getDay() === 0) {
              calendarHTML += "</tr><tr>";
          }
        
          currentDate.setDate(currentDate.getDate() + 1);
      }
    
      calendarHTML += "</tr></table>";
      calendarContainer.innerHTML = calendarHTML;
    }

    // Handle previous month button click
    prevMonthButton.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      createCalendar(currentDate);
    });

    // Handle next month button click
    nextMonthButton.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      createCalendar(currentDate);
    });

    // Utility function to get a string for the month and year
    function getMonthYearString(date) {
      const options = { year: 'numeric', month: 'long' };
      return date.toLocaleDateString(undefined, options);
    }

});


  