/**
 * @description holds auth token interface
 */

export interface Mail {
  body: string;
  title: string;
}

export interface PrivateMail extends Mail {
  to: string;
}
