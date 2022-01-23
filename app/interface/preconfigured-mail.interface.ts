export interface PreconfiguredMail {
  key: string;
  from: string;
  mails: {
    language: string;
    subject: string;
    body: string;
  }[];
}
