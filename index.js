async function get_pop(){
    
    // Setup variables
    const state = $(`#state_entry`).val();
    const city = $(`#city_entry`).val();
    
    // Call GET request
    await fetch(`api/population/state/${state}/city/${city}`, {
        method: "GET"
    })
    .then((res) => {
        
        // Handle failed responses and update index.html
        if (res.status == 400) {
            $(`#results`).html("Sorry, location not found");
            throw new Error(`HTTP error! Status: ${res.status}`);
        } else if (!res.ok) {
            $(`#results`).html("Uh oh, something went wrong");
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then((data) => {

        // Handle successful response and update index.html
        $(`#results`).html(data);
    });
}

async function post_pop(){
    
    // Setup variables
    const state = $(`#state_entry`).val();
    const city = $(`#city_entry`).val();
    const pop = $(`#pop_entry`).val();

    // Check if population is a valid number
    const only_numbers = new RegExp("^[0-9]*$");
    if (!only_numbers.test(pop)) {
        $(`#results`).html("Sorry but that's not a vaild number");
        return;
    }

    // Call POST request
    await fetch(`api/population/state/${state}/city/${city}`, {
        method: "POST",  
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"population" : pop})
    })
    .then((res) => {

        // Handle responses and update index.html
        if (res.status == 200) {
            $(`#results`).html("Location's population successfully updated!");
        } else if (res.status == 201) {
            $(`#results`).html("New location and it's population added!");
        } else {
            $(`#results`).html("Uh oh, something went wrong");
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    });
}
