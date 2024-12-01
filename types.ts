export interface InvoiceData {
  clientName: string;
  clientNumber: string;
  clientAddress: {
    home: string;
    street: string;
    city: string;
  };
  gstPercentage: number;
  estimateNumber: string;
  date: string;
  items: {
    description: string;
    quantity: number;
    price: number;
    per: "Box" | "NOs";
  }[];
}

  export interface InvoiceItem {
    description: string;
    quantity: number;
    price: number;
    per: "Box" | "NOs";
  }