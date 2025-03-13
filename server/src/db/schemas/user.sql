CREATE TYPE user_roles AS ENUM ('admin', 'guest', 'owner');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    avatar VARCHAR(255) DEFAULT 'https://static.vecteezy.com/system/resources/previews/027/708/418/large_2x/default-avatar-profile-icon-in-flat-style-free-vector.jpg',
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    app_user_role user_roles DEFAULT 'guest',
    user_password VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
);