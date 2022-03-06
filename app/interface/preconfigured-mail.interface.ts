export interface PreconfiguredMail {
  key: string;
  from: string;
  to?: string;
  mails: {
    language: string;
    subject: string;
    body: string;
  }[];
}
