-- Tripful Database Setup Script
-- Run this script in your PostgreSQL database

-- Create database (run this separately if needed)
-- CREATE DATABASE "Tripful";

-- Users table
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS packages (
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
CREATE TABLE IF NOT EXISTS bookings (
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
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  transaction_ref VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for testing

-- Sample staff user (password: password123)
INSERT INTO users (full_name, email, password_hash, phone, role) VALUES 
('Staff Admin', 'staff@demo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567890', 'STAFF')
ON CONFLICT (email) DO NOTHING;

-- Sample customer user (password: password123)
INSERT INTO users (full_name, email, password_hash, phone, role) VALUES 
('John Customer', 'customer@demo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567891', 'CUSTOMER')
ON CONFLICT (email) DO NOTHING;

-- Sample packages (using staff user ID)
INSERT INTO packages (title, destination, flight_summary, hotel_name, hotel_rating, duration_days, price, available_slots, start_date, end_date, created_by) 
SELECT 
  'Dubai Desert Adventure',
  'Dubai, UAE',
  'Emirates Airlines - Direct flights from major cities',
  'Burj Al Arab',
  5,
  7,
  2499.99,
  20,
  '2024-03-01',
  '2024-12-31',
  u.id
FROM users u WHERE u.email = 'staff@demo.com'
ON CONFLICT DO NOTHING;

INSERT INTO packages (title, destination, flight_summary, hotel_name, hotel_rating, duration_days, price, available_slots, start_date, end_date, created_by) 
SELECT 
  'Tropical Paradise Getaway',
  'Maldives',
  'Qatar Airways - Connecting flights via Doha',
  'Conrad Maldives Rangali Island',
  5,
  5,
  3999.99,
  15,
  '2024-02-15',
  '2024-11-30',
  u.id
FROM users u WHERE u.email = 'staff@demo.com'
ON CONFLICT DO NOTHING;

INSERT INTO packages (title, destination, flight_summary, hotel_name, hotel_rating, duration_days, price, available_slots, start_date, end_date, created_by) 
SELECT 
  'European City Break',
  'Paris, France',
  'Air France - Direct flights from New York',
  'Hotel Plaza Athénée',
  4,
  4,
  1899.99,
  25,
  '2024-04-01',
  '2024-10-31',
  u.id
FROM users u WHERE u.email = 'staff@demo.com'
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_packages_active ON packages(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_package_id ON bookings(package_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);

-- Display success message
SELECT 'Database setup completed successfully!' as message;