/*
  # Create Form Submissions Table

  1. New Tables
    - `form_submissions`
      - `id` (uuid, primary key)
      - `first_name` (text, required)
      - `phone` (text, required)
      - `sms_consent` (boolean, default false)
      - `created_at` (timestamp)
      
  2. Security
    - Enable RLS on `form_submissions` table
    - Add policy for service role to insert data
*/

CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  phone text NOT NULL,
  sms_consent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role to insert submissions"
  ON form_submissions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Allow service role to read submissions"
  ON form_submissions
  FOR SELECT
  TO service_role
  USING (true);