import axios, { AxiosResponse } from "axios";

interface Item {
  name: string;
  quantity: number;
  height: number;
  weight: number;
  length: number;
  width: number;
}

interface ShippingPayload {
  from_district_id: number;
  from_ward_code: string;
  service_id: number | null;
  service_type_id: number;
  to_district_id: number;
  to_ward_code: string;
  height: number;
  length: number;
  weight: number;
  width: number;
  insurance_value: number;
  cod_failed_amount: number;
  coupon: string | null;
  items: Item[];
}

async function calculateShippingFeeWithItems(
  token: string,
  basePayload: Omit<ShippingPayload, "items">, // Exclude items to allow dynamic input
  items: Item[]
): Promise<any> {
  try {
    const payload: ShippingPayload = { ...basePayload, items };
    const response: AxiosResponse<any> = await axios.post(
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Token: token,
        },
      }
    );
    console.log("Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// Example usage:
const token: string = "YOUR_TOKEN_HERE"; // Thay thế bằng token thực tế của bạn.

const basePayload: Omit<ShippingPayload, "items"> = {
  from_district_id: 1459,
  from_ward_code: "22208",
  service_id: null,
  service_type_id: 1,
  to_district_id: 1443,
  to_ward_code: "20207",
  height: 50,
  length: 20,
  weight: 200,
  width: 20,
  insurance_value: 10000,
  cod_failed_amount: 2000,
  coupon: null,
};

const items: Item[] = [
  {
    name: "TEST1",
    quantity: 1,
    height: 200,
    weight: 1000,
    length: 200,
    width: 200,
  },
  {
    name: "TEST2",
    quantity: 2,
    height: 100,
    weight: 500,
    length: 150,
    width: 100,
  },
];

calculateShippingFeeWithItems(token, basePayload, items)
  .then((data) => {
    console.log("Shipping Fee:", data);
  })
  .catch((err) => {
    console.error("Failed to calculate shipping fee:", err.message);
  });
