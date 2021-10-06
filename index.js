const express = require('express');
const app = express();
const Ajv = require('ajv');
const ajv = new Ajv();
const port = 3000
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');


/*const APIInfoSchema = require('./API.json');
const APIValidator = ajv.compile(APIInfoSchema);*/

app.use(bodyParser.json());

let userDb = [];
//let postingsDb = [];

passport.use(new BasicStrategy(

    (email, password, done) => {
        console.log('basic strategy params, email ' + email + ' and password ' + password);


        // search the database for the user and password
        
        const searchResult = userDb.find(user => {
            if(user.email === email) {
                if(bcrypt.compareSync(password, user.password)){
                    return true;
                }
            }
            return false;
        })
        if (searchResult != undefined)
        {
            done(null, searchResult);     
        } else {
            done(null, false);
        }
    }
));

app.post('/users/create-posting',(req, res) => {
    const newPosting =
    {  
        postingId : uuidv4(),
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        location: req.body.location,
        image : req.body.Image,
        price: req.body.Price,
        dateOfPosting: req.body.DateOfPosting,
        deliveryType : req.body.DeliveryType,
        Name : req.body.Name,
        phoneNumber : req.body.phoneNumber,
        email : req.body.email
    }

    const findUser = userDb.find(user => {
        if(user.userId === this.userId) {
            return true;
        }
        else {
            return false;
        }

    })
    if (findUser != undefined)
    {
        user.postings.push(newPosting);
        res.sendStatus(201);   
    } else {
        res.sendStatus(404);
    }

})
app.get('/users/{userId}/postings', passport.authenticate('basic', { session: false }), (req, res) => {

    const findUser = userDb.find(user => {
        if(user.userId === this.userId) {
            return true;
        }
        return false;
    })
    if (findUser != undefined)
    {
        for(let i = 0; i < userDb.postings.length; i++) {
            res.send(userDb.postings);
        }                                                       //should print all the postings of the user
        res.sendStatus(201);   
    } else {
        res.sendStatus(404);
    }

})
app.patch('/users/{userId}/postings', passport.authenticate('basic', { session: false }), (req, res) => {

    const findUser = userDb.find(user => {
        if(user.userId === this.userId) {
            return true;
        }
        return false;
    })
    if (findUser != undefined)
    {
        for(let i = 0; i < userDb.postings.length; i++) {
            res.send(userDb.postings);
        }                                                       //should modify the chosen posting but didnt have enough time to implement it
        res.sendStatus(201);   
    } else {
        res.sendStatus(404);
    }

})
app.delete('/users/{userId}/postings', passport.authenticate('basic', { session: false }), (req, res) => {

    const findPosting = userDb.postings.find(posting => {
        if(posting.postingId === this.postingId) {
            return true;
        }
        return false;
    })
    const indexOfPosting = userDb.findIndex(findPosting)
    
    if (findUser != undefined)
    {
        delete userDb.posting[indexOfPosting];                              //should delete the chosen posting
        res.sendStatus(201);   
    } else {
        res.sendStatus(404);
    }


})


app.post('/register', (req,res) =>{

    /*const validationResult = APIValidator(req.body);
    console.log(validationResult);*/

    console.log('original password ' + req.body.password);
    const salt = bcrypt.genSaltSync(6)
    console.log('salt ' + salt);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt)
    console.log('hashed password ' + hashedPassword)
    const newUser = 
        {
         userId : uuidv4(),
         firstName : req.body.firstname,
         lastName : req.body.lastName,
         password: hashedPassword,
         email: req.body.email,
         dateOfBirth : req.body.dateOfBirth,
         phoneNumber : req.body.phoneNumber,
         location : req.body.location,
         postings : []
        }
    //console.log('users id ' + userId)
    userDb.push(newUser);
    res.sendStatus(201);

})

/*JWT implementation*/
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtsecretKey = 'secretKey';
const options = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtsecretKey
};

passport.use(new JwtStrategy(options, (payload, done) =>{
    //pass the control to the handle methods
    done(null, {});

}));

app.post('/login', passport.authenticate('basic', {session: false}), (req, res) =>{

    const token = jwt.sign({foo: "bar"}, "mySecretKey");

    res.json({ token: token})
})

app.get('/postings', (req, res) =>{
    
    for(let i = 0; i < userDb.postings.length; i++) {
        res.send(userDb.postings);
    }                                                       
    res.send("heres all postings !")

})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})