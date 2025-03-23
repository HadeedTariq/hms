CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    rating DECIMAL(2, 1) CHECK (
        rating BETWEEN 0
        AND 5
    ),
    contact_email VARCHAR(100) UNIQUE NOT NULL,
    contact_phone VARCHAR(20) UNIQUE NOT NULL,
    owner_id INT UNIQUE REFERENCES users(id) ON DELETE
    SET
        NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        hotel_images TEXT [],
        amenities TEXT [],
        -- List of services like 'WiFi', 'Pool', 'Gym', etc.
        policies TEXT,
        -- Cancellation, check-in/check-out policies
        check_in_time TIME DEFAULT '14:00:00',
        check_out_time TIME DEFAULT '12:00:00'
);

-- Rooms Table
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    hotel_id INT REFERENCES hotels(id) ON DELETE CASCADE,
    room_number VARCHAR(50) NOT NULL,
    type VARCHAR(100) NOT NULL CHECK (type IN ('single', 'double', 'suite', 'deluxe')),
    price DECIMAL(10, 2) NOT NULL,
    capacity INT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    room_images TEXT [],
    amenities TEXT [],
    CONSTRAINT unique_hotel_room UNIQUE (hotel_id, room_number)
);

-- Bookings Table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    hotel_id INT REFERENCES hotels(id) ON DELETE CASCADE,
    room_id INT REFERENCES rooms(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) CHECK (
        status IN ('pending', 'confirmed', 'cancelled', 'completed')
    ) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    booking_id INT REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) CHECK (
        payment_method IN ('credit_card', 'paypal', 'bank_transfer')
    ),
    status VARCHAR(50) CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    hotel_id INT REFERENCES hotels(id) ON DELETE CASCADE,
    rating DECIMAL(2, 1) CHECK (
        rating BETWEEN 0
        AND 5
    ) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);