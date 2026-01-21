-- Create a function to reduce stock when order items are inserted
CREATE OR REPLACE FUNCTION public.reduce_stock_on_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Get the branch_id from the order
  UPDATE public.stock
  SET quantity = quantity - NEW.quantity,
      updated_at = now()
  WHERE product_id = NEW.product_id
    AND branch_id = (SELECT branch_id FROM public.orders WHERE id = NEW.order_id);
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically reduce stock when order items are inserted
CREATE TRIGGER reduce_stock_on_order_item_insert
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.reduce_stock_on_order();