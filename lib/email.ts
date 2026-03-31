import { Resend } from 'resend';

// Provide a mock key for development if none is set
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key_123');

const FROM_EMAIL = 'Swing for Change <hello@swingforchange.com>';

export type EmailTemplate = 
  | 'welcome'
  | 'subscription_confirmed'
  | 'draw_results'
  | 'winner_alert'
  | 'payout_confirmed'
  | 'subscription_renewal'
  | 'subscription_lapsed';

export interface EmailData {
  name?: string;
  planName?: string;
  nextBillingDate?: string;
  dashboardLink?: string;
  winningNumbers?: number[];
  resultsLink?: string;
  prizeAmount?: number;
  matchCount?: number;
  updatePaymentLink?: string;
}

export async function sendEmail(
  template: EmailTemplate,
  to: string | string[],
  data: EmailData
) {
  let subject = '';
  let html = '';

  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const dashboardLink = data.dashboardLink || `${BASE_URL}/dashboard`;

  // Provide a clean layout wrapper
  const wrapHtml = (content: string) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f4; color: #022c22; margin: 0; padding: 20px; }
        .container { max-w-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background-color: #022c22; color: #ffffff; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; letter-spacing: 0.5px; }
        .content { padding: 30px 20px; line-height: 1.6; }
        .button { display: inline-block; background-color: #047857; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin-top: 20px; text-align: center; }
        .footer { background-color: #f5f5f4; color: #064e3b; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #e7e5e4; }
        .accent { color: #047857; font-weight: bold; }
        .text-center { text-align: center; }
        .prize-box { background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .prize-amount { font-size: 32px; font-weight: bold; color: #047857; margin: 10px 0; }
        .numbers { display: flex; justify-content: center; gap: 8px; margin: 20px 0; }
        .number-ball { display: inline-block; width: 40px; height: 40px; line-height: 40px; border-radius: 50%; background-color: #047857; color: white; text-align: center; font-weight: bold; font-size: 18px; margin: 0 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Swing for Change</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Swing for Change. All rights reserved.</p>
          <p>You received this email because you are registered on Swing for Change.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  switch (template) {
    case 'welcome':
      subject = 'Welcome to Swing for Change';
      html = wrapHtml(`
        <h2 style="margin-top:0;">Welcome, ${data.name || 'Golfer'}!</h2>
        <p>Thank you for joining Swing for Change. We are thrilled to have you in our community.</p>
        <p>Your passion for golf is now a force for real-world good. Get ready to log your scores, compete in our monthly prize draws, and start funding the charities that matter most to you.</p>
        <div class="text-center">
          <a href="${dashboardLink}" class="button">Go to your Dashboard</a>
        </div>
      `);
      break;

    case 'subscription_confirmed':
      subject = 'Your subscription is active';
      html = wrapHtml(`
        <h2 style="margin-top:0;">Subscription Confirmed</h2>
        <p>Hi ${data.name || 'there'},</p>
        <p>Great news! Your <strong>${data.planName || 'Monthly'}</strong> subscription is now active.</p>
        <p>You can now start submitting your Stableford scores to enter the monthly draws. A portion of your fee is already being directed to your chosen charity.</p>
        <p><strong>Next Billing Date:</strong> ${data.nextBillingDate ? new Date(data.nextBillingDate).toLocaleDateString() : 'N/A'}</p>
        <div class="text-center">
          <a href="${dashboardLink}" class="button">Log Your First Score</a>
        </div>
      `);
      break;

    case 'draw_results':
      subject = "This month's draw results are in";
      const ballsHtml = (data.winningNumbers || []).map(n => `<span class="number-ball">${n}</span>`).join('');
      html = wrapHtml(`
        <h2 style="margin-top:0;">The Results Are Here!</h2>
        <p>The winning numbers for this month's draw have just been published.</p>
        <div class="text-center">
          <div class="numbers">${ballsHtml}</div>
        </div>
        <p>Log in to your dashboard to see if your active scores matched any of these numbers. Good luck!</p>
        <div class="text-center">
          <a href="${data.resultsLink || dashboardLink}" class="button">Check Your Results</a>
        </div>
      `);
      break;

    case 'winner_alert':
      subject = "🎉 You're a winner!";
      html = wrapHtml(`
        <h2 style="margin-top:0;">Congratulations, ${data.name || 'Player'}!</h2>
        <p>You matched <strong>${data.matchCount} / 5</strong> numbers in our latest draw!</p>
        <div class="prize-box">
          <p style="margin:0; text-transform:uppercase; font-size:14px; letter-spacing:1px;">Your Prize Share</p>
          <div class="prize-amount">£${(data.prizeAmount || 0).toFixed(2)}</div>
        </div>
        <p>To claim your winnings, please log into your dashboard and submit proof of your winning score card.</p>
        <div class="text-center">
          <a href="${dashboardLink}" class="button">Claim Your Prize</a>
        </div>
      `);
      break;

    case 'payout_confirmed':
      subject = 'Your prize has been paid';
      html = wrapHtml(`
        <h2 style="margin-top:0;">Prize Payout Complete</h2>
        <p>Hi ${data.name || 'there'},</p>
        <p>We've successfully processed your prize payout of <strong class="accent">£${(data.prizeAmount || 0).toFixed(2)}</strong>.</p>
        <p>The funds should be arriving in your nominated account shortly. Thank you for being a vital part of the Swing for Change community — keep playing, keep winning, and keep giving!</p>
        <div class="text-center">
          <a href="${dashboardLink}" class="button">Return to Dashboard</a>
        </div>
      `);
      break;

    case 'subscription_renewal':
      subject = 'Your subscription renews soon';
      html = wrapHtml(`
        <h2 style="margin-top:0;">Renewal Reminder</h2>
        <p>Hi ${data.name || 'there'},</p>
        <p>Just a quick heads-up that your <strong>${data.planName || 'Monthly'}</strong> subscription is scheduled to renew on <strong>${data.nextBillingDate ? new Date(data.nextBillingDate).toLocaleDateString() : 'N/A'}</strong>.</p>
        <p>Your ongoing support allows us to keep funding vital charitable causes every single month. No action is required to continue your membership.</p>
      `);
      break;

    case 'subscription_lapsed':
      subject = 'Action needed — subscription payment failed';
      html = wrapHtml(`
        <h2 style="margin-top:0;">Action Required</h2>
        <p>Hi ${data.name || 'there'},</p>
        <p>Unfortunately, we couldn't process the recent payment for your Swing for Change subscription.</p>
        <p>To ensure you remain eligible for the upcoming monthly draws and continue supporting your chosen charity, please update your payment information.</p>
        <div class="text-center">
          <a href="${data.updatePaymentLink || dashboardLink}" class="button" style="background-color: #f59e0b;">Update Payment Method</a>
        </div>
      `);
      break;

    default:
      throw new Error(`Invalid email template: ${template}`);
  }

  try {
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    
    // Always log in development
    console.log(`[Email System] Sent '${template}' to ${to}`, response);
    return response;
  } catch (error) {
    console.error(`[Email System] Failed to send '${template}' to ${to}:`, error);
    throw error;
  }
}
