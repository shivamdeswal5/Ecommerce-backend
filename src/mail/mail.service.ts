import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service:'gmail',
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT ,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  async sendWelcomeEmail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: `'"Zenmonk" <${process.env.MAIL_USERNAME}>`,
      to,
      subject,
      text,
    });
  }


}