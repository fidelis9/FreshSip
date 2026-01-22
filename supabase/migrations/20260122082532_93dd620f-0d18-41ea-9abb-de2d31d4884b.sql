-- Ensure stock table is in realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'stock'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.stock;
  END IF;
END $$;