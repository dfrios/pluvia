interface WhatsAppContact {
  profile: {
    name: string;
    username?: string;
  };
  wa_id: string;
  user_id?: string;
  country_code?: string;
}

interface WhatsAppMessage {
  from: string;
  from_user_id?: string;
  id: string;
  timestamp: string;
  text?: {
    body: string;
  };
  from_logical_id?: string;
  type: string;
  internal_1p_only_data?: {
    account_context: {
      waac_id: string;
      cs_id: string;
      account_context_type: string;
    };
  };
}

interface WhatsAppChange {
  value: {
    messaging_product: string;
    metadata: {
      display_phone_number: string;
      phone_number_id: string;
    };
    contacts: WhatsAppContact[];
    messages?: WhatsAppMessage[];
  };
  field: string;
}

interface WhatsAppEntry {
  id: string;
  changes: WhatsAppChange[];
}

interface WhatsAppWebhookPayload {
  object: string;
  entry: WhatsAppEntry[];
}

// interface WhatsAppMessage {
//   ExternalUserId: string;
//   SmsMessageSid: string;
//   NumMedia: string;
//   ProfileName: string;
//   MessageType: string;
//   SmsSid: string;
//   WaId: string;
//   SmsStatus: string;
//   Body: string;
//   To: string;
//   NumSegments: string;
//   ReferralNumMedia: string;
//   MessageSid: string;
//   AccountSid: string;
//   ChannelMetadata: string;
//   From: string;
//   ApiVersion: string;
// }

interface WhatsAppFormPayload {
  From: string;
  Body: string;
}

export type { WhatsAppWebhookPayload, WhatsAppFormPayload };
