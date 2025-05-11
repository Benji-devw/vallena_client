import { User } from 'next-auth';

export interface Order {
  _id: string;
  createdAt: string;
  updatedAt: string;
  payer: Payer;
  statut: OrderStatus;
  client: Array<{
    amount: {
      value: string;
      currency_code: string;
    };
    shipping?: {
      name: {
        full_name: string;
      };
      address: {
        address_line_1: string;
        admin_area_2: string;
        postal_code: string;
        country_code: string;
      };
    };
    payments: {
      captures: Array<{
        status: string;
        id: string;
        create_time: string;
      }>;
    };
  }>;
  items: OrderItem[];
}

export interface UserProfileProps {
  user: User | undefined;
}

// Type pour les commandes basé sur l'exemple fourni
export interface OrderItem {
  product_id: string;
  quantity: number;
}

export interface OrderStatus {
  inProgress: boolean;
  finish: boolean;
}

export interface Payer {
  email_address: string;
  name: {
    given_name: string;
    surname: string;
  };
  address: {
    country_code: string;
  };
  [key: string]: any; // Pour permettre des propriétés supplémentaires
}
