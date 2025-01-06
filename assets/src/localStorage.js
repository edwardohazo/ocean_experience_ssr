export const setCurrentTrip = (trip) => {
    console.log(trip);
    localStorage.setItem('current-trip', trip)
};
export const getCurrentTrip = () => {
    const currentTrip = localStorage.getItem('current-trip')
    return JSON.parse(currentTrip);
};

