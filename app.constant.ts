import * as path from 'path';

export const MailTemplateFilePath = {
  ContactUs: path.join(
      __dirname,
      '/assets/mail-templates/contact-us-mail-template.html'
  ),
  ForgetPassword: path.join(
      __dirname,
      '/assets/mail-templates/forget-password-mail-template.html'
  ),
  VerifyAccount: path.join(
      __dirname,
      '/assets/mail-templates/verify-account-mail-template.html'
  ),
};
