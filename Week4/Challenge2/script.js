// Task 1
// Add an event listner to the button (the user drags his mouse over the button)
var justinBtn = document.getElementById("justin-btn");
var result = document.getElementById("result");

justinBtn.addEventListener("mouseover", function () {
    result.style.background = "pink";
    result.innerText = "Welcome to My Heart";
    result.style.color = "blue";
});


// Task 2
// Add an event listner to the button (the user drags his mouse out of the button)
justinBtn.addEventListener("mouseout", function () {
    result.style.background = "black";
    result.innerText = "Don't Leave My Heart";
    result.style.color = "red";
});