
// Cart
let cartIcon = document.querySelector("#carta-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

//open cart
cartIcon.onclick = () =>{
    cart.classList.add("active")
}

//close cart
closeCart.onclick = () =>{
    cart.classList.remove("active")
}

//cart working js
if (document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

//making function
function ready(){
    //remove items from cart
    var reomveCartButtons = document.getElementsByClassName("cart-remove");
    console.log(reomveCartButtons)
    for (var i= 0; i < reomveCartButtons.length; i++){
        var button = reomveCartButtons[i]
        button.addEventListener("click", removeCartItem)
    }
    //Quantity changes
    var quantityInputs = document.getElementsByClassName("cart-quantity")
    for (var i = 0; i < quantityInputs.length; i++){
        var input = quantityInputs[i]
        input.addEventListener("change", quantityChanged)
    }
     //Add to cart
    var addCart = document.getElementsByClassName("add-cart");
    for (var i = 0; i < addCart.length; i++){
        var button = addCart[i];
        button.addEventListener("click", addCartClicked);
    }
    //Buy Button Work
    document
    .getElementsByClassName("btn-buy")[0]
    .addEventListener("click", buyButtonClicked);
}

//Buy Button
function buyButtonClicked(){
    alert("Your order is placed");
    var cartContent = document.getElementsByClassName("cart-content")[0];
    while (cartContent.hasChildNodes()){
        cartContent.removeChild(cartContent.firstChild);
    }
    updatetotal();
}

//remove items from cart
 function removeCartItem(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal();
 }

 //quantity Changed
    function quantityChanged(event){
    var input = event.target;
        if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
        }
        updatetotal();
    }

//Add to cart
function addCartClicked(event){
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    var price = shopProducts.getElementsByClassName("price")[0].innerText;
    var productImg = shopProducts.getElementsByClassName("product-img")[0].src;
    addProductToCart(title, price, productImg);
    updatetotal();
}
function addProductToCart(title, price, productImg) {
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");

    var cartItems = document.querySelector(".cart-content");

    var cartItemsNames = cartItems.querySelectorAll(".cart-product-title");
    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title) {
            alert("You have already added this item to the cart");
            return;


        }
    }

    var cartBoxContent = `
    <div>
        <img src="${productImg}" alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <i class="bx bxs-trash-alt cart-remove"></i>
    </div>`;

    cartShopBox.innerHTML = cartBoxContent;
    cartItems.appendChild(cartShopBox);


    cartShopBox.querySelector(".cart-remove").addEventListener("click", removeCartItem);
    cartShopBox.querySelector(".cart-quantity").addEventListener("change", quantityChanged);

    updatetotal();

}


//Update total
function updatetotal() {
    console.log("Updating total...");
    var cartContent = document.querySelector(".cart-content");
    var cartBoxes = document.querySelectorAll(".cart-box");
    var total = 0;

    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.querySelector(".cart-price");
        if (!priceElement) {
            console.error("Price element not found for cart box:", cartBox);
            continue;
        }

        var quantityElement = cartBox.querySelector(".cart-quantity");

        var price = parseFloat(priceElement.textContent.replace('€', '').trim());

        var quantity = parseInt(quantityElement.value);

        console.log("Price:", price, "Quantity:", quantity);

        total += price * quantity;
    }

    // Round the total to two decimal places
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName("total-price")[0].innerText = "€" + total.toFixed(2);

}

//login

//starts automatically when the page is loaded and checks if the user has access to the page (used by "cart.html", "account.html", "shop.html" e "recensione.html")
function checkLogged() {
    if (sessionStorage.getItem('logged') !== 'true') {
        document.location.href = "index.html";
    }
}

//starts automatically when the page is loaded and checks if the user is logged
function checkNotLogged() {
    if (sessionStorage.getItem('logged') === 'true') {
        document.location.href = "index.html";
    }
}

//starts automatically when the page is loaded and checks if the user is logged
function showNavbar() {
    const logged = sessionStorage.getItem('logged'),
        loginButton = document.getElementById('nav_login'),
        accountButton = document.getElementById('nav_account');

        loginButton.style.display = "block";
        accountButton.style.display = "none";

    if (logged === 'true') {
        loginButton.style.display = "none";
        accountButton.style.display = "block";
    }
}


//executes the login when the form's submit button is pressed
function login() {

    //gets user's username and password from the page
    const username = document.getElementById('log_usr').value,
        password = document.getElementById('log_passw').value;

    //sends an HTTP request to the server at the specified url to check if the login works
    $.ajax ({
        url        : 'http://localhost:3000/login',
        method     : 'POST',
        contentType: 'application/json',
        data       : JSON.stringify ({ username: username, password: password }),

        //if the login works, it sends the user at "index.html"
        success: function (data) {

            sessionStorage.setItem('logged', 'true');
            sessionStorage.setItem('name', data.name);
            sessionStorage.setItem('surname', data.surname);
            sessionStorage.setItem('username', username);

            document.location.href = data.redirect;

        },

        //if the login doesn't work, it shows the error message
        error: function () {
            const loginError = document.getElementById('login_error');
            if (loginError) {
                loginError.innerText     = 'Credenziali errate';
                loginError.style.display = 'block';
            }
        }
    });
}

//makes the password visible or invisible in login form
function logTogglePasswordVisibility() {
    let password = document.getElementById("log_passw");
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}

//makes the password visible or invisible in sign up form
function regTogglePasswordVisibility() {
    let password = document.getElementById("reg_passw");
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}

function confRegTogglePasswordVisibility() {
    let password = document.getElementById("conf_passw");
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}

function newTogglePasswordVisibility() {
    let password = document.getElementById("new_passw");
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}

function confNewTogglePasswordVisibility() {
    let password = document.getElementById("confnew_passw");
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}




//register
//checks username's format
function checkUsername() {

    //gets username and error message element
    const username = document.getElementById('reg_usr').value,
        regError = document.getElementById('reg_error');

    //chechs if the username contains more of 15 characters
    if (username.length > 15) {
        regError.innerText     = "La dimensione dell'username eccede il limite massimo di 15 caratteri";
        regError.style.display = 'block';
        return false;
    }

    //checks if the username contains spaces
    else if (/\s/.test(username)) {
        regError.innerText     = "L'username non può contenere spazi";
        regError.style.display = 'block';
        return false;
    }
    return true;
}

//checks if the password respects the standard
function checkPassword() {

    //gets password and error message element
    const password = document.getElementById('reg_passw').value,
        regError = document.getElementById('reg_error');

    //checks if the password contains at least 8 letters, an upper case letter and a special character
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[@#$%^&+=-_]/.test(password)) {
        regError.innerText     = 'La password deve contenere almeno 8 caratteri, una lettera maiuscola e un carattere speciale';
        regError.style.display = 'block';
        return false;
    }

    //checks if the password contains spaces
    else if (/\s/.test(password)) {
        regError.innerText     = 'La password non può contenere spazi';
        regError.style.display = 'block';
        return false;
    }
    return true;
}

//executes the signup when the form's submit button is pressed
function register() {

    //gets user's name, surname, username, and password from the page
    const name          = document.getElementById('reg_name').value,
        surname         = document.getElementById('reg_surname').value,
        username        = document.getElementById('reg_usr').value,
        password        = document.getElementById('reg_passw').value,
        confirmPassword = document.getElementById('conf_passw').value;
    //checks if the password respects the standard using the checkPassword() function
    if (checkUsername() && checkPassword() && password === confirmPassword) {

        //sends an HTTP request to the server at the specified URL to check if the sign-up works
        $.ajax({
            url: 'http://localhost:3000/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify ({ name: name, surname: surname, username: username, password: password, confirmPassword: confirmPassword}),

            //if the sign-up works, it sends the user to the page "index.html"
            success: function (data) {
                sessionStorage.setItem('logged',   'true');
                sessionStorage.setItem('name',     name);
                sessionStorage.setItem('surname',  surname);
                sessionStorage.setItem('username', username);
                document.location.href = data.redirect;
            },

            //if the sign-up doesn't work, shows the error message
            error: function () {
                const regError = document.getElementById('reg_error');
                if (regError) {
                    regError.innerText     = 'Username non disponibile o uso di caratteri non consentiti per nome e cognome';
                    regError.style.display = 'block';
                }
            }
        });
    }
}


//starts automatically when the page is loaded, gets user's data and shows them in the page
function getInfo() {

    //send an HTTP request to the server at the specified url to get user's data
    $.ajax ({
        url   : 'http://localhost:3000/getInfo',
        method: 'POST',
        data: { username: sessionStorage.getItem('username') },
        success: function () {

            //gets username, name and surname elements
            const usernameText = document.getElementById('acc_user'),
                nameText     = document.getElementById('acc_name'),
                surnameText  = document.getElementById('acc_surn');


            //shows user's data
            usernameText.textContent = 'Ciao ' + sessionStorage.getItem('username');
            nameText.textContent     = sessionStorage.getItem('name');
            surnameText.textContent  = sessionStorage.getItem('surname');
        }
    });
}

//account
//executes the logout when the form's submit button is pressed and frees session storage
function logout() {
    sessionStorage.removeItem('logged');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('surname');
    window.location.href = "index.html";
}

//carrello
//allows the user to add a book in his cart
function addBook() {

    //gets the book searched by the user
    const bookName = document.getElementById("img_trenino").value;

    //sends an HTTP request at the specified url to add the book in user's cart
    $.ajax ({
        url:         'http://localhost:3000/addBook',
        method:      'POST',
        contentType: 'application/JSON',
        data:         JSON.stringify({ bookName: bookName, username: sessionStorage.getItem('username') }),

        success: function (){
            const addButton = document.getElementById("cart_btn");
            addButton.innerHTML = "";
            const imgInCart = document.createElement("img");
            const textInCart = document.createElement("cart_btn");
            imgInCart.src = "images/Button%20icons/check-solid.svg";
            textInCart.innerText = "Nel carrello";
            addButton.appendChild(imgInCart);
            addButton.appendChild(textInCart);
        }
    })
}

//removes a book from the user's cart
function removeBookFromCart(bookName) {

    //sends an HTTP request to the server at the specified url to check if the book is in user's cart
    $.ajax ({
        url:         'http://localhost:3000/removeBook',
        method:      'POST',
        contentType: 'application/json',
        data:        JSON.stringify({ bookName: bookName, username: sessionStorage.getItem('username') }),
        success: function (data) {
            updateCartView(data.value);
        }
    });
}

function updateCartView(cartItems) {

    //gets cart element
    const cartList = document.getElementById("cart_list");

    //total price of books in the cart
    let totalPrice = 0;

    //clears previous cart visualization
    cartList.innerHTML = '';

    //shows the updated cart
    cartItems.forEach(ordine => {
        const bookName     = document.createElement('h3'),
            bookPrice      = document.createElement('p'),
            spacer         = document.createElement('p'),
            removeBook     = document.createElement('button'),
            insertImage    = document.createElement('img'),
            imageContainer = document.createElement('div'),
            infoContainer  = document.createElement('div'),
            priceContainer = document.createElement('div');

        //shows book's information
        bookName.textContent     = ordine.nome;
        bookPrice.textContent    = 'Prezzo: ' + ordine.prezzo;
        spacer.textContent       = '|';
        removeBook.textContent   = 'Rimuovi';
        insertImage.src          = 'images/' + ordine.genere + '/' + ordine.nome + '.webp';
        insertImage.id           = 'cart_cover';
        spacer.id                = 'book_spacer';
        imageContainer.className = 'image_container';
        infoContainer.className  = 'info_container';
        priceContainer.className = 'price_container';

        //adds book's price to cart's total price
        totalPrice += parseFloat(ordine.prezzo);

        //when a remove button is pressed, it removes the indicated book from user's cart
        removeBook.onclick = function () {
            removeBookFromCart(ordine.nome);
        };

        //appends book's information
        imageContainer.appendChild(insertImage);
        imageContainer.appendChild(infoContainer);
        infoContainer.appendChild(bookName);
        infoContainer.appendChild(priceContainer);
        priceContainer.appendChild(removeBook);
        priceContainer.appendChild(spacer);
        priceContainer.appendChild(bookPrice);
        cartList.appendChild(imageContainer);
    });

    //gets total price and clear cart button elements
    const cartTot    = document.getElementById('cart_price'),
        cartSpacer = document.getElementById('cart_spacer'),
        clearCart  = document.getElementById('cart_clear');

    //if the cart isn't empty
    if (parseFloat(totalPrice) > 0) {

        //appends cart's total price and clear cart button
        cartTot.textContent    = 'Carrello: ' + (parseFloat(totalPrice)) + '€';
        cartSpacer.style.display = 'block';
        clearCart.style.display = 'block';

        //when the clear cart button is pressed, it empties user's cart
        clearCart.onclick = function () {
            totalPrice = 0;
            cartTot.textContent    = 'Carrello vuoto';
            cartSpacer.style.display = 'none';
            clearCart.style.display = 'none';
            emptyCart();
        };
    } else {
        cartTot.textContent    = 'Carrello vuoto';
        cartSpacer.style.display = 'none';
        clearCart.style.display = 'none';
    }
}

//starts automatically when the page is loaded and gets user's cart
function showCart() {

    //gets cart element
    const cartList = document.getElementById("cart_list");

    //sends an HTTP request to the server at the specified url to get user's cart
    $.ajax ({
        url: 'http://localhost:3000/showCart',
        method: 'POST',
        data: { username: sessionStorage.getItem('username') },
        success: function (data) {

            //total price of books in the cart
            let totalPrice = 0;

            //each book added to the cart is inserted as a <li> element in a <ul> list
            data.value.forEach(ordine => {
                const bookName     = document.createElement('h3'),
                    bookPrice      = document.createElement('p'),
                    spacer         = document.createElement('p'),
                    removeBook     = document.createElement('button'),
                    insertImage    = document.createElement('img'),
                    imageContainer = document.createElement('div'),
                    infoContainer  = document.createElement('div'),
                    priceContainer = document.createElement('div');

                //shows book's information
                bookName.textContent     = ordine.nome;
                bookName.classList       = 'book_name';
                bookName.addEventListener('click', function() { redirectBook(bookName.textContent); });
                insertImage.setAttribute('onclick', 'showBook(this)');
                bookPrice.textContent    = 'Prezzo: ' + ordine.prezzo;
                bookPrice.id             = 'book_price';
                spacer.textContent       = '|';
                removeBook.textContent   = 'Rimuovi';
                insertImage.src          = 'images/' + ordine.genere + '/' + ordine.nome + '.webp';
                insertImage.id           = 'cart_cover';
                spacer.id                = 'book_spacer';
                imageContainer.className = 'image_container';
                infoContainer.className  = 'info_container';
                priceContainer.className = 'price_container';

                //adds book's price to cart's total price
                totalPrice += parseFloat(ordine.prezzo);

                //when a remove button is pressed, it removes the indicated book from user's cart
                removeBook.onclick = function () {
                    removeBookFromCart(ordine.nome);
                };

                //appends book's information
                imageContainer.appendChild(insertImage);
                imageContainer.appendChild(infoContainer);
                infoContainer.appendChild(bookName);
                infoContainer.appendChild(priceContainer);
                priceContainer.appendChild(removeBook);
                priceContainer.appendChild(spacer);
                priceContainer.appendChild(bookPrice);
                cartList.appendChild(imageContainer);
            });

            //gets total price and clear cart button elements
            const cartTot  = document.getElementById('cart_price'),
                cartSpacer = document.getElementById('cart_spacer'),
                clearCart  = document.getElementById('cart_clear');

            //if the cart isn't empty
            if (parseFloat(totalPrice) > 0) {

                //appends cart's total price and clear cart button
                cartTot.textContent    = 'Carrello: ' + (parseFloat(totalPrice)) + '€';
                cartSpacer.textContent = '|';
                clearCart.textContent  = 'Svuota';

                //when the clear cart button is pressed, it empties user's cart
                clearCart.onclick = function () {
                    totalPrice             = 0;
                    cartTot.textContent    = 'Carrello vuoto';
                    cartSpacer.textContent = '';
                    clearCart.textContent  = '';
                    emptyCart();
                };
            } else {
                cartTot.textContent    = 'Carrello vuoto';
                cartSpacer.textContent = '';
                clearCart.textContent  = '';
            }
        }
    });
}


