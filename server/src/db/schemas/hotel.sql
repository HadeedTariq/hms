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
    owner_id INT REFERENCES users(id) ON DELETE
    SET
        NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    hotel_id INT REFERENCES hotels(id) ON DELETE CASCADE,
    room_number VARCHAR(50) NOT NULL,
    type VARCHAR(100) NOT NULL CHECK (type IN ('single', 'double', 'suite', 'deluxe')),
    price DECIMAL(10, 2) NOT NULL,
    capacity INT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    room_id INT REFERENCES rooms(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (
        status IN ('pending', 'confirmed', 'cancelled', 'completed')
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES bookings(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) CHECK (
        payment_method IN ('credit_card', 'paypal', 'bank_transfer', 'cash')
    ),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (
        payment_status IN ('pending', 'paid', 'failed', 'refunded')
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);