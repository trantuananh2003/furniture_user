export interface OrderResponse {
  id: string;
  totalPrice: string;
  orderItems: OrderItemResponse[];
  paymentStatus: string;
  shippingAddress: string;
  orderStatus: string;
  createdAt: Date;
  orderPaidTime: Date;
  paymentMethod: string;
}

export interface OrderItemResponse {
  id: string;
  imageItemUrl: string;
  nameItem: string;
  quantity: number;
  price: string;
  productItem_Id: string;
  isComment: boolean;
}
