const callData = {
    "Compliant Call": ["Out of Warranty","Under Warranty"],
    "Demo Call": ["Demo Call"],
    "Installation Call": ["Installation Call"]
};
function populateCallType(){
    const ticketSelect = document.getElementById("ticketCategory");
    console.log(ticketSelect);
    const callTypeSelect = document.getElementById("calltype");
    console.log(callTypeSelect);
    const selectedTicket = ticketSelect.option[ticketSelect.selectedIndex].value;

    callTypeSelect.innerHTML = "";

    if(callData[selectedTicket]){
        callData[selectedTicket].forEach(ticket => {
            const ticketOption = document.createElement("ticketOption");
            ticketOption.value = ticket;
            ticketOption.textContent = ticket;
            callTypeSelect.appendChild(ticketOption);
        });
    } else {
        const ticketOption = document.createElement("ticketOption");
        ticketOption.textContent = "...";
        callTypeSelect.appendChild(ticketOption);
    }
}

// Initialize the second dropdown based on the default selection
populateCallType();