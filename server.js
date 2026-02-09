const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust Proxy for Vercel/Heroku
app.set('trust proxy', 1);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'supersecretkey_mvp_crypto', // In production, use environment variable
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Secure in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes

// Home Redirect
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// Signup
app.get('/signup', (req, res) => {
    res.render('signup', { error: null });
});

app.post('/signup', async (req, res) => {
    const { phone_number, password } = req.body;

    if (!phone_number || !password) {
        return res.render('signup', { error: 'Phone number and password are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (phone_number, password_hash) VALUES (?, ?)', [phone_number, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.render('signup', { error: 'Phone number already registered.' });
                }
                console.error(err);
                return res.render('signup', { error: 'An error occurred during signup.' });
            }
            res.redirect('/login');
        });
    } catch (err) {
        console.error(err);
        res.render('signup', { error: 'Server error.' });
    }
});

// Login
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    const { phone_number, password } = req.body;

    db.get('SELECT * FROM users WHERE phone_number = ?', [phone_number], async (err, user) => {
        if (err) {
            console.error(err);
            return res.render('login', { error: 'An error occurred.' });
        }
        if (!user) {
            return res.render('login', { error: 'Invalid phone number or password.' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (match) {
            req.session.userId = user.id;
            req.session.user = user; // Store basic user info
            res.redirect('/dashboard');
        } else {
            res.render('login', { error: 'Invalid phone number or password.' });
        }
    });
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Dashboard
app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const userId = req.session.userId;
    const error = req.query.error || null;
    const success = req.query.success || null;

    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user) {
            return res.redirect('/logout');
        }

        db.all('SELECT * FROM investments WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, investments) => {
            if (err) {
                console.error(err);
                investments = [];
            }
            res.render('dashboard', { user, investments, error, success });
        });
    });
});

// Deposit
app.post('/deposit', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
        return res.redirect('/dashboard?error=Invalid deposit amount');
    }

    const userId = req.session.userId;
    db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, userId], (err) => {
        if (err) {
            console.error(err);
            return res.redirect('/dashboard?error=Deposit failed');
        }
        res.redirect('/dashboard?success=Deposit successful');
    });
});

// Invest
app.post('/invest', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const { plan, amount } = req.body;
    const investAmount = parseFloat(amount);

    if (isNaN(investAmount) || investAmount <= 0) {
        return res.redirect('/dashboard?error=Invalid investment amount');
    }

    let interestRate = 0;
    let planName = '';

    // Define plans
    switch (plan) {
        case 'gold':
            interestRate = 0.05;
            planName = 'Gold Plan (5% Daily)';
            break;
        case 'platinum':
            interestRate = 0.10;
            planName = 'Platinum Plan (10% Daily)';
            break;
        case 'diamond':
            interestRate = 0.15;
            planName = 'Diamond Plan (15% Daily)';
            break;
        default:
            return res.redirect('/dashboard?error=Invalid plan selected');
    }

    const userId = req.session.userId;

    // Transaction-like operations
    db.get('SELECT balance FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user) {
            return res.redirect('/dashboard?error=User not found');
        }

        if (user.balance < investAmount) {
            return res.redirect('/dashboard?error=Insufficient balance');
        }

        const potentialReturn = investAmount + (investAmount * interestRate);

        // Deduct balance
        db.run('UPDATE users SET balance = balance - ? WHERE id = ?', [investAmount, userId], (err) => {
            if (err) {
                console.error(err);
                return res.redirect('/dashboard?error=Investment failed');
            }

            // Create investment record
            db.run('INSERT INTO investments (user_id, plan_name, amount, potential_return) VALUES (?, ?, ?, ?)',
                [userId, planName, investAmount, potentialReturn], (err) => {
                if (err) {
                    // In a real app, we would rollback the balance deduction here
                    console.error(err);
                    return res.redirect('/dashboard?error=Investment record failed');
                }
                res.redirect('/dashboard?success=Investment successful');
            });
        });
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
