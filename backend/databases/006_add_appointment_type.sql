ALTER TABLE appointments
ADD COLUMN appointment_type VARCHAR(20) NOT NULL DEFAULT 'in_person'
CHECK (appointment_type IN ('in_person', 'telehealth'));
