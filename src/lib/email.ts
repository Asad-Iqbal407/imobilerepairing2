import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const ADMIN_EMAIL = 'umpulsiva@gmail.com';

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

interface OrderDetails {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status: string;
}

export async function sendOrderEmails(order: OrderDetails) {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  const emailContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
      <h2 style="color: #2563eb; text-align: center;">Order Confirmation</h2>
      <p>Hello ${order.customerName},</p>
      <p>Thank you for your purchase! Your order <strong>#${order._id}</strong> has been successfully processed.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f8fafc;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: center;">Qty</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px; font-weight: bold; text-align: right;">Total:</td>
            <td style="padding: 10px; font-weight: bold; text-align: right;">$${order.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px;">
        <h3 style="margin-top: 0; font-size: 16px;">Shipping Details</h3>
        <p style="margin-bottom: 5px;"><strong>Address:</strong> ${order.customerAddress}</p>
        <p style="margin-bottom: 0;"><strong>Phone:</strong> ${order.customerPhone}</p>
      </div>

      <p style="text-align: center; color: #64748b; font-size: 14px; margin-top: 30px;">
        If you have any questions, please contact our support team.
      </p>
    </div>
  `;

  const adminEmailContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
      <h2 style="color: #2563eb; text-align: center;">New Order Received!</h2>
      <p>A new order <strong>#${order._id}</strong> has been placed.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; font-size: 16px;">Customer Information</h3>
        <p style="margin-bottom: 5px;"><strong>Name:</strong> ${order.customerName}</p>
        <p style="margin-bottom: 5px;"><strong>Email:</strong> ${order.customerEmail}</p>
        <p style="margin-bottom: 5px;"><strong>Phone:</strong> ${order.customerPhone}</p>
        <p style="margin-bottom: 0;"><strong>Address:</strong> ${order.customerAddress}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f8fafc;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: center;">Qty</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px; font-weight: bold; text-align: right;">Total:</td>
            <td style="padding: 10px; font-weight: bold; text-align: right;">$${order.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;

  try {
    // Send to User
    await transporter.sendMail({
      from: `"IMOBILE" <${process.env.EMAIL_USER}>`,
      to: order.customerEmail,
      subject: `Order Confirmation - #${order._id}`,
      html: emailContent,
    });

    // Send to Admin
    await transporter.sendMail({
      from: `"IMOBILE System" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `NEW ORDER - #${order._id}`,
      html: adminEmailContent,
    });

    console.log(`Emails sent successfully for order ${order._id}`);
  } catch (error) {
    console.error('Error sending emails:', error);
    // We don't throw here to avoid failing the order update if email fails
  }
}
