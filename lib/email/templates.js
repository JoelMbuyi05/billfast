// lib/email/templates.js

// EXPLANATION: HTML email template
export function getInvoiceEmailHTML(invoice, businessInfo, invoiceUrl) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoiceNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; background-color: #2563eb;">
              ${businessInfo.logoUrl ? `
                <img src="${businessInfo.logoUrl}" alt="${businessInfo.businessName}" style="max-height: 60px; margin-bottom: 20px;">
              ` : ''}
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                New Invoice
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.5;">
                Hello <strong>${invoice.clientName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.5;">
                ${businessInfo.businessName} has sent you an invoice.
              </p>

              <!-- Invoice details box -->
              <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #f3f4f6; border-radius: 6px; margin: 30px 0;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="5" cellspacing="0">
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Invoice Number</td>
                        <td align="right" style="color: #111827; font-size: 14px; font-weight: bold;">
                          ${invoice.invoiceNumber}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Issue Date</td>
                        <td align="right" style="color: #111827; font-size: 14px;">
                          ${invoice.issueDate}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Due Date</td>
                        <td align="right" style="color: #111827; font-size: 14px;">
                          ${invoice.dueDate}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding-top: 10px; border-top: 1px solid #d1d5db;">
                          Amount Due
                        </td>
                        <td align="right" style="color: #2563eb; font-size: 20px; font-weight: bold; padding-top: 10px; border-top: 1px solid #d1d5db;">
                          $${invoice.total.toFixed(2)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${invoiceUrl}" 
                       style="display: inline-block; padding: 14px 40px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                      View Invoice
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                If you have any questions about this invoice, please contact ${businessInfo.businessName} at 
                <a href="mailto:${businessInfo.businessEmail}" style="color: #2563eb; text-decoration: none;">
                  ${businessInfo.businessEmail}
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                This invoice was sent via InvoSnap<br>
                © ${new Date().getFullYear()} ${businessInfo.businessName}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// EXPLANATION: Plain text version (fallback for email clients that don't support HTML)
export function getInvoiceEmailText(invoice, businessInfo, invoiceUrl) {
  return `
New Invoice from ${businessInfo.businessName}

Hello ${invoice.clientName},

${businessInfo.businessName} has sent you an invoice.

Invoice Details:
- Invoice Number: ${invoice.invoiceNumber}
- Issue Date: ${invoice.issueDate}
- Due Date: ${invoice.dueDate}
- Amount Due: $${invoice.total.toFixed(2)}

View your invoice: ${invoiceUrl}

If you have any questions, please contact ${businessInfo.businessName} at ${businessInfo.businessEmail}

---
This invoice was sent via InvoSnap
© ${new Date().getFullYear()} ${businessInfo.businessName}
  `;
}