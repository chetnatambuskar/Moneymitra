require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const loanRoutes = require('./routes/loanRoutes');
const documentRoutes = require('./routes/documentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const {notFound, errorHandler} = require('./middleware/errorHandler');
const cibilRoutes = require('./routes/cibilRoutes');

const app = express();


app.use(helmet({crossOriginResourcePolicy: false})); // allow serving /uploads to the app
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Serve uploaded selfies/documents/bank statements back as plain URLs
// (e.g. http://localhost:4000/uploads/aadhaar/169...jpg).
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/health', (_req, res) => res.json({success: true, message: 'MoneyMitra API is running.'}));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/cibil', cibilRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
