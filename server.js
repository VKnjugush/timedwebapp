// server.js

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; 


// Set the view engine to EJS
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// Custom Middleware to check working hours
const checkWorkingHours = (req, res, next) => {
  const now = new Date();
  const day = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  const hour = now.getHours(); // 0 - 23

  const isWorkingDay = day >= 1 && day <= 5; // Monday to Friday
  const isWorkingHour = hour >= 9 && hour < 17; // 9 AM to 5 PM (17:00 is 5 PM, so less than 17)

  console.log(`Current Time: Day ${day}, Hour ${hour}. Is Working: ${isWorkingDay && isWorkingHour}`); // For debugging

  if (isWorkingDay && isWorkingHour) {
    next(); 
  } else {
    res.status(403).render('unavailable', {
      pageTitle: 'Service Unavailable'
    });
  }
};

// Apply the time-checking middleware to all routes that need protection.
// For this app, we want it on all our main pages.
app.use(checkWorkingHours);


// --- Routes ---

// Home Page Route
app.get('/', (req, res) => {
  // res.send('<h1>Welcome to our Home Page!</h1><p>Accessible during working hours.</p>');
  res.render('home', {
    pageTitle: 'Home'
  });
});

// Our Services Page Route
app.get('/services', (req, res) => {
  // res.send('<h1>Our Services</h1><p>Details about services offered.</p>');
  res.render('services', {
    pageTitle: 'Our Services'
  });
});

// Contact Us Page Route
app.get('/contact', (req, res) => {
  // res.send('<h1>Contact Us</h1><p>Get in touch with us.</p>');
  res.render('contact', {
    pageTitle: 'Contact Us'
  });
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Working hours are Monday-Friday, 9 AM to 5 PM.');
});