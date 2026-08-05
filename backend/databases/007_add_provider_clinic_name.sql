ALTER TABLE providers
ADD COLUMN clinic_name VARCHAR(200);

UPDATE providers
SET
    clinic_name = CONCAT(first_name, ' ', last_name),
    first_name = NULL,
    last_name = NULL
WHERE type = 'clinic';

ALTER TABLE providers
ALTER COLUMN first_name DROP NOT NULL,
ALTER COLUMN last_name DROP NOT NULL;

ALTER TABLE providers
ADD CONSTRAINT providers_name_by_type_check CHECK (
    (
        type = 'provider'
        AND first_name IS NOT NULL
        AND last_name IS NOT NULL
        AND clinic_name IS NULL
    )
    OR
    (
        type = 'clinic'
        AND clinic_name IS NOT NULL
        AND first_name IS NULL
        AND last_name IS NULL
    )
);
