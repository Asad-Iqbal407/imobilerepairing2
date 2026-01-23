import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  items: IOrderItem[];
  total: number;
  currency?: 'usd' | 'eur';
  paymentMethod?: string;
  status: 'pending' | 'paid' | 'confirmed' | 'shipped' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const OrderSchema: Schema = new Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: false },
    customerAddress: { type: String, required: false },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    currency: { type: String, enum: ['usd', 'eur'], required: false },
    paymentMethod: { type: String, default: 'card' },
    status: { type: String, enum: ['pending', 'paid', 'confirmed', 'shipped', 'cancelled'], default: 'pending' },
  },
  { 
    timestamps: true,
    collection: 'orders' 
  }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;

