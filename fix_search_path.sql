-- Fix search_path security warnings for Supabase functions
-- Run this in Supabase SQL Editor

-- Fix update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix is_valid_email function
CREATE OR REPLACE FUNCTION public.is_valid_email(email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

-- Fix is_valid_country_code function
CREATE OR REPLACE FUNCTION public.is_valid_country_code(code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
BEGIN
  RETURN code ~ '^[A-Z]{2}$';
END;
$$;

-- Fix get_workspace_id function
CREATE OR REPLACE FUNCTION public.get_workspace_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN (auth.jwt() ->> 'workspace_id')::uuid;
END;
$$;
