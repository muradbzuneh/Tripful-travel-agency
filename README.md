Group 1

Members name ---- ID ---- Role

- Hubeyb Awol---------------- 1067/16----------------Database
- Kidanework Yirga----------- 1152/16----------------Frontend(Work on the page Service, Destination, & Attraction)
- Mahlet Chanyalew----------- 3963/16----------------Frontend(Work on the page Event, Package for user and staff, & the staff dashboard )
- Mena Mulugeta-------------- 1320/16----------------Frontend(Work on the page Home, Login for staff, & Register for the User)
- Murad Bzuneh--------------- 1492/16----------------Backend()

# Tripful - Travel Booking Website

A complete travel booking platform where customers can browse holiday packages, make bookings, and process payments with a "Book Now, Pay Later" feature. Staff members can manage packages and bookings through an admin dashboard.

## Features

### Customer Features

- Browse holiday packages with flights and hotels
- Search and filter packages by destination, price, duration, and rating
- Book packages with flexible travel dates
- Book Now, Pay- make partial or full payments
- View and manage bookings
- Track payment status

### Staff Features

- Add, edit, and deactivate holiday packages with image upload
- View all customer bookings
- Update booking statuses
- Manage package availability
- Upload package images through file manager

## Tech Stack

### Frontend

- React 19
- React Router DOM
- Axios for API calls
- CSS3 for styling
- Vite as build tool

### Backend

- Node.js with Express 5
- PostgreSQL database
- JWT authentication
- bcryptjs for password hashing
- CORS enabled

## Project Structure

```
├── Backend/
│   ├── src/
│   │   ├── config/          # Database and environment config
│   │   ├── middlewares/     # Authentication and role guards
│   │   ├── modules/
│   │   │   ├── auth/        # Authentication (login/register)
│   │   │   ├── bookings/    # Booking management
│   │   │   ├── packages/    # Package management
│   │   │   └── payment/     # Payment processing
│   │   ├── utils/           # JWT and password utilities
│   │   ├── app.js
│   │   ├── routes.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── componets/       # Reusable components
    │   ├── context/         # Auth context
    │   ├── pages/           # Page components
    │   ├── services/        # API service layer
    │   ├── styles/          # CSS files
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup

1. Create a PostgreSQL database named `Tripful`

2. Run the following SQL to create tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(20) DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'STAFF')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Packages table
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  flight_summary TEXT,
  hotel_name VARCHAR(255),
  hotel_rating INTEGER CHECK (hotel_rating BETWEEN 1 AND 5),
  duration_days INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  available_slots INTEGER NOT NULL,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  package_id UUID REFERENCES packages(id) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  travel_date DATE NOT NULL,
  booking_status VARCHAR(20) DEFAULT 'PENDING' CHECK (booking_status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
  payment_status VARCHAR(20) DEFAULT 'UNPAID' CHECK (payment_status IN ('UNPAID', 'PENDING', 'SUCCESS')),
  paid_amount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  transaction_ref VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Backend Setup

1. Navigate to the Backend directory:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env`:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Tripful
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

4. Start the backend server:

```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Packages (Public)

- `GET /api/packages` - Get all active packages

### Packages (Staff Only)

- `POST /api/packages` - Create new package
- `GET /api/packages/all` - Get all packages (including inactive)
- `PUT /api/packages/:id` - Update package
- `DELETE /api/packages/:id` - Deactivate package

### Bookings (Customer)

- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - Get user's bookings

### Bookings (Staff Only)

- `GET /api/bookings` - Get all bookings
- `PATCH /api/bookings/:id/status` - Update booking status

### Payments

- `POST /api/payments` - Create payment

## Default Accounts

For testing purposes, you can create these accounts:

**Customer Account:**

- Email: customer@demo.com
- Password: password123
- Role: CUSTOMER

**Staff Account:**

- Email: staff@demo.com
- Password: password123
- Role: STAFF

## Usage

1. **Browse Packages**: Visit the home page or packages page to see available holiday packages
2. **Register/Login**: Create an account or login to book packages
3. **Book a Package**: Select a package, choose travel date, and confirm booking
4. **Make Payments**: Go to "My Bookings" and make partial or full payments
5. **Staff Dashboard**: Staff members can access the dashboard to manage packages and bookings

## Features Implemented

✅ User authentication with JWT
✅ Role-based access control (Customer/Staff)
✅ Package browsing and filtering
✅ Booking creation with travel date selection
✅ Book Now, Pay functionality
✅ Payment tracking and status updates
✅ Staff dashboard for package management
✅ Staff dashboard for booking management
✅ Responsive design for mobile and desktop
✅ Protected routes for authenticated users
✅ Dark and light mode for our website
✅ Different language options like Amharic, English, Tigregna and Oromic.

## Notes

- Images are placeholders - replace with actual images in `frontend/src/assets/`
- The API base URL is set to `http://localhost:5000/api` in the frontend
- All API requests require authentication except for viewing packages and auth endpoints
- Payments are tracked but no actual payment gateway is integrated (simulation only)

## Future Enhancements

- Integration with real payment gateway (Stripe, PayPal)
- Email notifications for bookings and payments
- Package reviews and ratings
- Advanced search with date range filters
- Booking cancellation with refund logic
- Multi-currency support
- Package image uploads

## License

This project is for educational purposes.
