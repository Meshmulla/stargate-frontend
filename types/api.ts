export interface Merchant {
  id: string;
  email: string;
  name: string;
  status: 'pending' | 'active' | 'suspended';
  tier: 'standard' | 'pro' | 'enterprise';
  stellar_address?: string;
  settlement_cadence?: 'daily' | 'weekly';
  created_at: string;
}

export interface RegisterDto {
  email: string;
  name: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  merchant?: Merchant;
}

export type InvoiceStatus = 'pending' | 'paid' | 'expired' | 'cancelled';

export interface CreateInvoiceDto {
  amount_usdc: number;
  description?: string;
  expires_in_minutes?: number;
}

export interface Invoice {
  id: string;
  merchant_id: string;
  amount_usdc: string;
  gross_usdc: string;
  fee_usdc: string;
  net_usdc: string;
  description?: string;
  status: InvoiceStatus;
  muxed_address: string;
  payment_url: string;
  expires_at: string;
  paid_at?: string;
  created_at: string;
}

export interface InvoiceListResponse {
  page: number;
  limit: number;
  total: number;
  items: Invoice[];
}

export interface PublicInvoice {
  id: string;
  gross_usdc: string;
  description?: string;
  merchant_name: string;
  status: InvoiceStatus;
  muxed_address: string;
  expires_at: string;
}

export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'closed' | 'won' | 'lost';
export type DisputeReason = 'fraudulent' | 'duplicate' | 'product_not_received' | 'product_unacceptable' | 'other';

export interface Dispute {
  id: string;
  invoice_id: string;
  merchant_id: string;
  amount_usdc: string;
  reason: DisputeReason;
  status: DisputeStatus;
  customer_email?: string;
  customer_message?: string;
  merchant_response?: string;
  evidence_files?: string[];
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  resolution_notes?: string;
}

export interface DisputeListResponse {
  page: number;
  limit: number;
  total: number;
  items: Dispute[];
}

export interface DisputeTimelineEvent {
  id: string;
  dispute_id: string;
  event_type: 'created' | 'evidence_submitted' | 'status_changed' | 'message_added' | 'resolved';
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
  created_by?: string;
}

export interface CreateDisputeResponseDto {
  message: string;
  evidence_files?: File[];
}

export interface UploadEvidenceDto {
  file: File;
  description?: string;
}
