import { AddressResponse } from "./user";

export interface Invoice {
  invoiceNo: string;
  transactionId: string;
  paymentId: string;
  address: AddressResponse;
  buyerName: string;
  buyerEmail: string;
  seller: string;
  shopAddress: AddressResponse;
  amount: number;
  paymentMethod: string;
  orderId: string;
  quantity: number;
  productDescription: string;

}