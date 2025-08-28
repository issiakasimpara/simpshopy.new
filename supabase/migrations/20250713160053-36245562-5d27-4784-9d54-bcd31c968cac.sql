-- Create custom domains table for multi-tenant domain management
CREATE TABLE public.custom_domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  custom_domain TEXT NOT NULL UNIQUE,
  verification_token TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  ssl_enabled BOOLEAN NOT NULL DEFAULT false,
  cloudflare_zone_id TEXT,
  cloudflare_record_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_domains ENABLE ROW LEVEL SECURITY;

-- Create policies for custom domains
CREATE POLICY "Users can manage their own custom domains" 
ON public.custom_domains 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own custom domains" 
ON public.custom_domains 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_custom_domains_updated_at
BEFORE UPDATE ON public.custom_domains
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster domain lookups
CREATE INDEX idx_custom_domains_domain ON public.custom_domains(custom_domain);
CREATE INDEX idx_custom_domains_store ON public.custom_domains(store_id);
CREATE INDEX idx_custom_domains_verified ON public.custom_domains(verified);