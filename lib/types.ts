export interface Media {
  id: string;
  name: string;
  type: string;
  location: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  daily_impressions: number;
  monthly_price: number;
  size: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  file_name: string;
  file_url: string | null;
  parsed_data: Record<string, any> | null;
  status: 'pending' | 'parsed' | 'error';
  created_at: string;
}

export interface Report {
  id: string;
  title: string;
  proposal_id: string | null;
  media_ids: string[] | null;
  campaign_start: string | null;
  campaign_end: string | null;
  target_audience: string | null;
  budget: number | null;
  analysis_data: Record<string, any> | null;
  status: 'draft' | 'analyzing' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  report_id: string | null;
  status: 'planned' | 'active' | 'completed' | 'paused';
  start_date: string | null;
  end_date: string | null;
  total_budget: number;
  spent_budget: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
