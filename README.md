
# WanderLux Travel Agency

## ICT502 Assessment 2 — Individual Coding Project

**Student:** Sujan BK  
**Student ID:** s20240054  
**Project:** WanderLux Travel Agency Website  
**Technology:** HTML5, CSS3 and JavaScript  
**Hosting:** GitHub Pages

## Live Website

https://ghatrajsujan00-rgb.github.io/wanderlux-travel-agency/

## Project Overview

WanderLux Travel Agency is a responsive multi-page website
developed for the ICT502 Individual Coding Project.

The website presents a fictional travel agency that offers
personalised holiday planning, guided tours, flights and hotel
assistance, and honeymoon packages.

The main objective is to help visitors explore destinations,
estimate travel costs, request consultations and submit
general enquiries through an accessible interface.

## Website Pages

1. **Home (index.html)**
   - Travel agency introduction
   - Automatic featured destination carousel
   - Popular holiday packages
   - Services and booking links

2. **Destinations & Services (destinations.html)**
   - Featured travel destinations
   - Holiday Packages
   - Guided Tours
   - Flights & Hotels
   - Honeymoon Specials

3. **Trip Cost Calculator (calculator.html)**
   - Destination selection
   - Number of travellers
   - Number of travel days
   - Budget, Standard and Luxury travel styles
   - Estimated cost calculation
   - Input validation and reset functionality
   - Detailed cost breakdown

4. **Appointment Request (appointment.html)**
   - Name, email and phone fields
   - Preferred appointment date
   - Travel enquiry message
   - JavaScript form validation
   - Formspree submission integration

5. **About Us (about.html)**
   - Agency background
   - Mission and vision
   - Proposed travel consultant roles
   - Customer service values

6. **Contact (contact.html)**
   - Demonstration contact information
   - General enquiry form
   - Embedded Sydney location map
   - Formspree email integration

## Technologies Used

### HTML5
Semantic page structure, navigation, headings,
forms, labels and accessibility attributes.

### CSS3
Responsive layouts, CSS variables, Grid,
Flexbox, media queries, transitions and styling.

### JavaScript
Interactive carousel, trip cost calculation,
form validation, mobile navigation,
scroll animations and email submissions.

### Formspree
Third-party form handling for the static website.
Contact and appointment forms submit information
without requiring a custom backend server.

### GitHub Pages
Static website hosting with a public HTTPS URL.

## Project Structure

```text
wanderlux-travel-agency/
|-- index.html
|-- destinations.html
|-- calculator.html
|-- appointment.html
|-- about.html
|-- contact.html
|-- css/
|   `-- style.css
|-- js/
|   |-- main.js
|   |-- carousel.js
|   |-- calculator.js
|   `-- forms.js
|-- images/
|   |-- bali.jpg
|   |-- santorini.jpg
|   `-- switzerland.jpg
`-- README.md
```

## Trip Cost Calculation

The calculator uses preset demonstration rates
for destination expenses and accommodation.

Formula:

Total Cost =
(Traveller Costs + Accommodation Costs)
x Travel Style Multiplier

Accommodation assumes up to two travellers
sharing one room.

The calculator displays results in Australian
dollars (AUD).

These estimates are for educational demonstration
and are not live travel quotations.

## Responsive Design

The website uses mobile-first CSS media queries
to adapt to different screen sizes.

Testing has included representative mobile,
tablet and desktop viewports.

## Accessibility

The website includes:

- Semantic HTML elements
- Descriptive image alternative text
- Associated form labels
- Visible keyboard focus indicators
- Accessible input error states
- Reduced-motion preferences
- Keyboard-operable navigation controls

## Running Locally

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Open index.html in a browser or use Live Server.
4. Navigate between pages to test the website.

An internet connection is required for external
map content and Formspree submissions.

## Deployment

The website is published through GitHub Pages
from the main branch and root directory.

Live URL:
https://ghatrajsujan00-rgb.github.io/wanderlux-travel-agency/

## Testing

Development testing has covered:

- Navigation across six pages
- Responsive layouts
- Destination carousel
- Trip cost calculations
- Calculator reset
- Form submissions and email delivery
- Embedded location map

Contact and appointment submission notifications
have been verified through Formspree and email.

## Project Limitations

WanderLux is a fictional travel agency developed
for academic demonstration.

Destination rates are illustrative, and the
calculator does not use real-time travel prices.

The Sydney map is a demonstration location,
not a confirmed physical business address.

Appointment requests do not automatically
confirm a consultation.

Future improvements could include live travel
prices, a booking management system, additional
destination photographs and database integration.

## Academic Purpose

This project was developed for ICT502 Assessment 2
using HTML, CSS and JavaScript without a frontend
framework.
