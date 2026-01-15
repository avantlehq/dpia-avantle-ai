-- Check actual structure of systems table
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'systems'
ORDER BY ordinal_position;
