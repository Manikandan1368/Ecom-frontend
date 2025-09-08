import { ShoppingCart } from "./shopping-cart";

export interface Order {
      _id?: string,
      items: ShoppingCart[],
      paymentType: string,
      address: any,
      date: Date,
      totalAmount: number;
      status?: string;
}