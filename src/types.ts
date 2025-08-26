export type Country = 'FR';
export interface VpnProfile {
  id: string;
  user_id: string;
  country: Country;
  conf_text: string;
  created_at: string;
}
