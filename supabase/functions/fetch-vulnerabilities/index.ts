import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CVEItem {
  id: string;
  sourceIdentifier: string;
  published: string;
  lastModified: string;
  vulnStatus: string;
  descriptions: Array<{
    lang: string;
    value: string;
  }>;
  metrics?: {
    cvssMetricV31?: Array<{
      cvssData: {
        baseScore: number;
        baseSeverity: string;
      };
    }>;
  };
  weaknesses?: Array<{
    description: Array<{
      lang: string;
      value: string;
    }>;
  }>;
  references?: Array<{
    url: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, query } = await req.json();
    console.log(`Fetch vulnerabilities action: ${action}`);

    if (action === 'fetch_latest') {
      // Fetch latest vulnerabilities from CVE feed
      const response = await fetch('https://cvefeed.io/api/v1/latest/100');
      
      if (!response.ok) {
        throw new Error(`CVE feed API error: ${response.status}`);
      }

      const cveData = await response.json();
      console.log(`Fetched ${cveData.length} vulnerabilities from CVE feed`);

      // Process and store vulnerabilities
      const vulnerabilities = cveData.map((item: CVEItem) => {
        const description = item.descriptions?.find(d => d.lang === 'en')?.value || 'No description available';
        const cvssScore = item.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || null;
        const severity = item.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity?.toLowerCase() || 'medium';
        
        const cweIds = item.weaknesses?.flatMap(w => 
          w.description?.filter(d => d.lang === 'en').map(d => d.value)
        ) || [];

        const referenceUrls = item.references?.map(r => r.url) || [];

        return {
          cve_id: item.id,
          title: `${item.id} - ${description.substring(0, 100)}...`,
          description: description,
          severity: severity,
          cvss_score: cvssScore,
          published_date: item.published,
          modified_date: item.lastModified,
          vendor: 'Multiple',
          affected_products: [],
          source: 'CVE Feed',
          source_url: `https://cvefeed.io/vuln/${item.id}`,
          reference_urls: referenceUrls,
          cwe_ids: cweIds,
          tags: [item.vulnStatus]
        };
      });

      // Insert vulnerabilities into database
      const { data, error } = await supabaseClient
        .from('vulnerabilities')
        .upsert(vulnerabilities, { 
          onConflict: 'cve_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log(`Successfully stored ${vulnerabilities.length} vulnerabilities`);

      return new Response(JSON.stringify({
        success: true,
        count: vulnerabilities.length,
        message: `Fetched and stored ${vulnerabilities.length} latest vulnerabilities`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'search') {
      // Search vulnerabilities in database
      let dbQuery = supabaseClient
        .from('vulnerabilities')
        .select('*')
        .order('published_date', { ascending: false });

      if (query) {
        dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%,cve_id.ilike.%${query}%,vendor.ilike.%${query}%`);
      }

      const { data: vulnerabilities, error } = await dbQuery.limit(50);

      if (error) {
        throw error;
      }

      return new Response(JSON.stringify({
        success: true,
        vulnerabilities: vulnerabilities || [],
        count: vulnerabilities?.length || 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get_stats') {
      // Get vulnerability statistics
      const { data: stats, error } = await supabaseClient
        .from('vulnerabilities')
        .select('severity, vendor')
        .order('published_date', { ascending: false });

      if (error) {
        throw error;
      }

      const severityCounts = stats?.reduce((acc: any, vuln: any) => {
        acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
        return acc;
      }, {}) || {};

      const vendorCounts = stats?.reduce((acc: any, vuln: any) => {
        acc[vuln.vendor] = (acc[vuln.vendor] || 0) + 1;
        return acc;
      }, {}) || {};

      return new Response(JSON.stringify({
        success: true,
        stats: {
          total: stats?.length || 0,
          severityCounts,
          vendorCounts
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      error: 'Invalid action'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-vulnerabilities function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});