// Initialize Firebase
var config = {
    apiKey: "AIzaSyCitT0ot2ltK4HGubAVgPa4vup90VfXTEE",
    authDomain: "dinner-savio.firebaseapp.com",
    databaseURL: "https://dinner-savio.firebaseio.com",
    projectId: "dinner-savio",
    storageBucket: "dinner-savio.appspot.com",
    messagingSenderId: "69909255571"
};
firebase.initializeApp(config);
var database = firebase.database();

// TO DO: update the next two lines to reference the restaurant from Google Places API
var currentCity = "chicago"; //can change this to take the value of the tab selected
var currentRest = localStorage.getItem("selected_restaurant"); //will be the name of the restaurant from Google Places API
var currentPic = localStorage.getItem("selected_img");
console.log(currentPic);

//available localStorage data: selected_address selected_rating selected_img

$("#selected-restaurant").text(currentRest);
$("#selected-restaurant-pic").html(`<img src='${currentPic}'>`);

//sends the user input for the current restaurant to Firebase
$("#add-wait-time").on("click", function (event) {
    event.preventDefault();
    var partySize = $("#party-size").val();
    var waitTime = $("#quoted-wait").val().trim();

    console.log(partySize);

    if (partySize > 0 && partySize < 13 && isNaN(`${waitTime}`) === false) {
        
        var userInput = {
            "partySize": partySize,
            "waitTime": waitTime,
            "time": Date.now()
        };

        database.ref('restaurants/' + currentCity + '/' + currentRest).set(userInput);
        $("#party-size").val("");
        $("#quoted-wait").val("");

    } else {
        $("#quoted-wait").val("");
        $("#error-message").html(`<p>Incorrect input format</p>`);
    };

});

//prints the most recent quoted wait times from Firebase to the DOM
database.ref('restaurants/' + currentCity + '/' + currentRest).on("value", function (snapshot) {
    //to avoid the "Cannot read property 'partySize' of null" thrown by firebase
    if(snapshot.val()){
        var partySize = snapshot.val().partySize;
        var waitTime = snapshot.val().waitTime;
        var time = moment(snapshot.val().time).format('MMMM Do YYYY, h:mm a');


        $("#reported-party-size").text(partySize);
        $("#reported-wait-time").text(waitTime);
        $("#entry-time").text(time);
    }
});