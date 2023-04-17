const express = require('express');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const User = require('./models/User');
const colors = require('colors');
const { checkAuthenticated } = require('./controllers/authController.js');

// Connect to MongoDB
const connectDB = require('./db.js');
connectDB();

const initializePassport = require('./passport-config.js');
initializePassport(
  passport,
  async (email) => await User.findOne({ email: email }),
  async (id) => await User.findById(id),
);

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use((req, res, next) => {
  console.log(
    `${req.method}`.bgCyan.bold.underline,
    `${req.path}`.brightGreen.bold.underline,
    `${Object.keys(req.body)}`.brightGreen.bold.underline,
  );
  next();
});

// Routes
const authRouter = require('./routes/auth.js');
const transactionRoutes = require('./routes/transactions');
app.use('/api/transactions', transactionRoutes);
app.use('/auth', authRouter);

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name });
});

module.exports = app;
