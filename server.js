//Node.js Modules
const fs                = require('fs'), //modulo
    express           = require('express'),           //framework Express
    bodyParser        = require('body-parser'),        //modulo
    path              = require('path'),
    cors              = require('cors'),               //middleware di Express
    CryptoJS          = require('crypto-js'),          //Libreria
    PasswordValidator = require('password-validator'); //libreria
//Node.js Modules

//Variables
const app          = express(),
    port         = 3000,                                         //port number on witch the server answers
    jsonFilePath = path.join(__dirname, 'database.json');        //JSON file's path
//Variables

app.use(bodyParser.urlencoded({ extended: true }));                //allows to analyze data passed in HTTP request and response
app.use(bodyParser.json());                                        //allows to analyze JSON format data
app.use(cors());                                                   //allows connections by all origins

//shows the error message
function sendError(res) {
    res.status(404).json({error: true});
}

//when the server receives an HTTP request to this url, it logs the user up
app.post("/login", (req, res) => {

//gets username and password from the request
    const username = req.body.username,
        password = req.body.password;

        //reads the JSON file
        fs.readFile(jsonFilePath, 'utf8', (err, data) => {

            //parses the JSON data
            const info = JSON.parse(data),

                //checks if the user is registered
                checkUser = info.utenti.find(u => u.username === username);

            //if the user is registered
            if (checkUser) {

                //encrypts the password
                const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

                //checks if the entered password is correct and sends the user to "index.html"
                if (checkUser.password === hashedPassword) {
                    res.json({
                        name: checkUser.nome,
                        surname: checkUser.cognome,
                        redirect: 'index.html'
                    });
                } else {
                    sendError(res);
                }
            } else {
                sendError(res);
            }
        });
});

//when the server receives an HTTP request to this url, it logs the user in
app.post('/register', (req, res) => {

    //gets name, surname, username, and password from the request
    const name = req.body.name,
        surname = req.body.surname,
        username = req.body.username,
        password = req.body.password,
        confirmPassword = req.body.confirmPassword;

    //checks if the password respects the standard
    const checkPassword = new PasswordValidator();
    checkPassword.is().min(8).has().uppercase().has().symbols();

    //checks if name, surname, username, and password are correctly read and if the user isn't logged
    if (name.trim() !== ''                &&
        surname.trim() !== ''             &&
        username.trim() !== ''            &&
        checkPassword.validate(password)  &&
        username.length < 15              &&
        password === confirmPassword) {

        //reads the JSON file
        fs.readFile(jsonFilePath, 'utf8', (err, data) => {

            //parses the JSON data
            const info = JSON.parse(data),

                //checks if the user is registered
                checkUser = info.utenti.find(u => u.username === username);


            //if the user isn't registered
            if (!checkUser) {

                //encrypts the password
                const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

                    //stores the user and his information into the JSON file
                    info.utenti.push({
                        nome: name,
                        cognome: surname,
                        username: username,
                        password: hashedPassword,
                        carrello: []

                });


                //writes the updated data to the JSON file
                fs.writeFile(jsonFilePath, JSON.stringify(info, null, 2), 'utf8', () => {});

                //sends the user to "index.html"
                res.json({redirect: 'index.html'});
            }
        });
    } else {
        sendError(res);
    }
});


//when the server receives an HTTP request to this url, it returns user's data
app.post("/getInfo", (req, res) => {

    const username = req.body.username;


    //reads the JSON file
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {

        //parses the JSON data
        const info = JSON.parse(data),

            //gets user's information
            checkUser = info.utenti.find(u => u.username === username);

        //if it finds the user, sends its data to the client
        if (checkUser) {

            //sends the information to the client
            res.json ({ success: true });
        } else {
            sendError(res);
        }
    });
});

//carrello
//when the server receives an HTTP request to this url, it adds the specified book to the user's cart
app.post('/addBook', (req, res) => {

    const bookName = req.body.bookName,
        username = req.body.username;

    //reads the JSON file
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {

        //parses the JSON data
        const info = JSON.parse(data),

            checkBook      = info.prodotti.find(b => b.nome === bookName),           //checks if the book is available
            checkCart      = info.utenti.find(u => u.username === username),      //searches the user's cart
            checkDuplicate = checkCart.carrello.find(b => b.nome === bookName);   //checks if the user has already added the book at his cart

        //if it finds user's cart, the book is available and the user hasn't already added it to him cart, it does it now
        if (checkBook && checkCart && !checkDuplicate) {
            checkCart.carrello.push ({
                nome: bookName,
                prezzo: checkBook.prezzo
            });
            fs.writeFile(jsonFilePath, JSON.stringify(info, null, 2), 'utf8', () => {
                res.json({ result: true })
            });
        } else {
            sendError(res);
        }
    });
});

//when the server receives an HTTP request to this url, it removes the specified book from the user's cart
app.post('/removeBook', (req, res) => {

    //gets book's name from the request
    const bookName = req.body.bookName,
        username = req.body.username;

    //reads the JSON file
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {

        //parses the JSON data
        const info = JSON.parse(data),

            //searches the user
            checkUser = info.utenti.find(u => u.username === username);

        //if it finds him
        if (checkUser) {

            //checks if the book to remove is in his cart
            const index = checkUser.carrello.findIndex(book => book.nome === bookName);
            if (index !== -1) {

                //removes the book from user's cart
                checkUser.carrello.splice(index, 1);

                //reads the JSON file to apply the changes
                fs.writeFile(jsonFilePath, JSON.stringify(info, null, 2), 'utf8', () => {});

                //sends the user's cart to the client
                res.json({value: checkUser.carrello});
            } else {
                sendError(res);
            }
        } else {
            sendError(res);
        }
    });
});

//when the server receives an HTTP request to this url, it shows the user's cart
app.post('/showCart', (req, res) => {

    const username = req.body.username;

    //reads the JSON file
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {

        //parses the JSON data
        const info = JSON.parse(data),

            //searches the user's cart
            checkCart = info.utenti.find(u => u.username === username);

        //if it finds user's cart, it sends it to the client
        if (checkCart) {
            res.json({value: checkCart.carrello});
        } else {
            sendError(res);
        }
    });
});


app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${ port }`);
});