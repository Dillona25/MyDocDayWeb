CREATE TABLE appointments (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id INTEGER REFERENCES providers(id) ON DELETE SET NULL,

    title VARCHAR(150) NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    doctor_name VARCHAR(200),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT appointments_doctor_required_check CHECK (
        provider_id IS NOT NULL OR doctor_name IS NOT NULL
    )
);

CREATE INDEX appointments_user_id_idx ON appointments(user_id);
CREATE INDEX appointments_provider_id_idx ON appointments(provider_id);
