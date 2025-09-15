-- Create vulnerabilities table
CREATE TABLE public.vulnerabilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cve_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
  cvss_score DECIMAL(3,1),
  published_date TIMESTAMP WITH TIME ZONE NOT NULL,
  modified_date TIMESTAMP WITH TIME ZONE,
  vendor TEXT,
  affected_products TEXT[],
  source TEXT NOT NULL,
  source_url TEXT,
  reference_urls TEXT[],
  cwe_ids TEXT[],
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_vulnerabilities_cve_id ON public.vulnerabilities(cve_id);
CREATE INDEX idx_vulnerabilities_severity ON public.vulnerabilities(severity);
CREATE INDEX idx_vulnerabilities_published_date ON public.vulnerabilities(published_date DESC);
CREATE INDEX idx_vulnerabilities_vendor ON public.vulnerabilities(vendor);

-- Enable RLS
ALTER TABLE public.vulnerabilities ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since vulnerability data should be publicly accessible)
CREATE POLICY "Vulnerabilities are publicly readable" 
ON public.vulnerabilities 
FOR SELECT 
USING (true);

-- Create policy for authenticated insert/update (for the system to add data)
CREATE POLICY "Authenticated users can insert vulnerabilities" 
ON public.vulnerabilities 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update vulnerabilities" 
ON public.vulnerabilities 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_vulnerabilities_updated_at
  BEFORE UPDATE ON public.vulnerabilities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create chat_sessions table to store chat history
CREATE TABLE public.chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on chat_sessions
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for chat sessions (public read for now)
CREATE POLICY "Chat sessions are publicly readable" 
ON public.chat_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert chat sessions" 
ON public.chat_sessions 
FOR INSERT 
WITH CHECK (true);