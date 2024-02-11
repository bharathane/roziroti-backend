const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dbPath = path.join(__dirname, 'moneyTracker.db')
const app = express()
const corsOptions = {
  origin: 'http://localhost:3000', // Specify the allowed origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable cookies and credentials
  optionsSuccessStatus: 204, // Respond with 204 No Content for preflight requests
}

app.use(cors(corsOptions))
app.use(express.json())

let db

// Establish connection between server and database
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is running at 3000 port')
    })
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}

initializeDbAndServer()

// Middleware function to authenticate token
const authenticateToken = (req, res, next) => {
  let jwtToken
  const authHeader = req.headers['authorization']
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }
  if (jwtToken === undefined) {
    // Token not provided
    res.status(401)
    res.send({errorMessage: 'Invalid JWT Token'})
  } else {
    jwt.verify(jwtToken, 'MY_SECRET_TOKEN', async (error, payload) => {
      if (error) {
        // Incorrect token
        res.status(401)
        res.send({errorMessage: 'Invalid JWT Token'})
      } else {
        req.username = payload.username // Pass data to the next handler with req obj

        next() // Call the next handler or middleware
      }
    })
  }
}

//sample
app.get('/', (req, res) => {
  res.send('Hello World')
})

//creating a user in database
app.post('/register/', async (req, res) => {
  try {
    const {username, name, gender, password, balance} = req.body
    const hashedPassword = await bcrypt.hash(password, 10) //masking the password for password protection

    const isUserExitsQuery = `select * from user where username='${username}'`
    const checkIsUserExits = await db.get(isUserExitsQuery) //checking if user is already exits in the data base or not
    if (checkIsUserExits !== undefined) {
      //if user exits this block will excutes
      res.status(400)
      res.send({errorMessage: 'user is already exits'})
    } else {
      if (password.length < 6) {
        res.status(401)
        res.send({
          errorMessage:
            'password is too short please enter atleast 6 charecters',
        })
      } else {
        //if user is a new user
        const postQuery = `insert into user(username,name,gender,password,balance)
  values("${username}","${name}","${gender}","${hashedPassword}",${balance})`

        await db.run(postQuery)
        res.send({errorMessage: 'user created successfully'})
      }
    }
  } catch (error) {
    console.log(error.message)
  }
})

//User Login API
app.post('/login/', async (req, res) => {
  const {username, password} = req.body
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`
  const dbUser = await db.get(selectUserQuery) // Check user in db
  if (dbUser === undefined) {
    // If user doesn't have account
    res.status(400)
    res.send({errorMessage: 'Invalid user'})
  } else {
    // If user has an A/C
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password)
    if (isPasswordMatched === true) {
      // Correct pw
      const payload = {
        username: username,
      }
      const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN')
      res.send({jwtToken, username})
    } else {
      // Incorrect pw
      res.status(400)
      res.send({errorMessage: 'Invalid user'})
    }
  }
})

//inserting data into userTransaction table

app.post('/postData/', authenticateToken, async (req, res) => {
  try {
    const {category, type, amount, transactionDate} = req.body
    const sqlQuery = `insert into userTransactions(username,category,type,amount,transactionDate)
  values ('${req.username}','${category}','${type}',${amount},'${transactionDate}')`
    await db.run(sqlQuery)
    res.send({message: 'transaction add successfully'})
  } catch (error) {
    console.log(error.message)
  }
})

//get transaction data

app.get('/getData', authenticateToken, async (req, res) => {
  try {
    const sqlQuery = `select * from userTransactions where username='${req.username}'`
    const dbRes = await db.all(sqlQuery) //it returs all transactions
    const sqlQuryForBalance = `select (user.balance - sum(userTransactions.amount)) as balance
    from user inner join userTransactions on user.username=userTransactions.username  where type like "expenses" and userTransactions.username="${req.username}"`
    const dbResForBalance = await db.get(sqlQuryForBalance) //returns balace after deducting all expenses
    const sqlQueryForIncoms = `select sum(amount)as incomAmmount from userTransactions where type like "income" and username="${req.username}"`
    const dbResForIncom = await db.get(sqlQueryForIncoms) //return balance after adding all incomes
    const sqlQueryForexpenses = `select sum(amount)as expensesAmount from userTransactions where type like "expenses" and username="${req.username}"`
    const dbResForExpenses = await db.get(sqlQueryForexpenses)

    res.send({
      allTransaction: dbRes,
      totlaIncome: dbResForIncom.incomAmmount,
      totalExpenses: dbResForExpenses.expensesAmount,
      avilableBalance: dbResForBalance.balance + dbResForIncom.incomAmmount,
    })
  } catch (error) {
    console.log(error.message)
  }
})

/*

//login user

app.post('/login/', async (req, res) => {
  try {
    const {username, password} = req.body
    const sqlQuery = `select * from user where username="${username}"`
    const dbRes = await db.get(sqlQuery)
    if (dbRes === undefined) {
      res.status(400)
      res.send('Invalid user')
    } else {
      const isPassMatch = await bcrypt.compare(password, dbRes.password)
      if (isPassMatch) {
        const payload = {username}
        const jwtToken = jwt.sign(payload, 'my_jwt')
        res.send(jwtToken)
      }
    }
  } catch (error) {
    console.log(error.message)
  }
})
*/
