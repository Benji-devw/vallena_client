import { Order, OrderItem } from '@/types/orderTypes';
import { Product } from '@/types/productTypes';
import { ColumnDef, createColumnHelper, Row } from '@tanstack/react-table';

// Define the types for the props of the getOrderColumns function
interface OrderColumnsProps {
  selectedOrder: Order | null;
  productDetails: { [key: string]: Product };
  setSelectedOrder: (order: Order | null) => void;
  handleGetProducts: (items: OrderItem[]) => Promise<void>;
  formatDate: (dateString: string) => string;
  getStatusDisplay: (order: Order) => string;
  getStatusClass: (status: string) => string;
  calculateTotal: (items: OrderItem[], productDetails: { [key: string]: Product }) => number;
}

const columnHelper = createColumnHelper<Order>();

export const getOrderColumns = ({
  selectedOrder,
  productDetails,
  setSelectedOrder,
  handleGetProducts,
  formatDate,
  getStatusDisplay,
  getStatusClass,
  calculateTotal,
}: OrderColumnsProps): ColumnDef<Order, any>[] => [
  columnHelper.accessor(row => row._id.substring(row._id.length - 8), {
    id: 'reference',
    header: 'Référence',
    cell: info => (
      <span className="font-medium text-gray-900 dark:text-white">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor(row => formatDate(row.createdAt), {
    id: 'date',
    header: 'Date',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor(
    row => {
      const orderAmount = row.client[0]?.amount?.value;
      const currency = row.client[0]?.amount?.currency_code || 'EUR';
      // Note: row est de type Order ici, pas Row<Order> comme dans la cellule d'action
      if (row === selectedOrder && Object.keys(productDetails).length > 0 && row.items.length > 0) {
        return `${calculateTotal(row.items, productDetails).toFixed(2)} ${currency}`;
      }
      return `${orderAmount || '0.00'} ${currency}`;
    },
    {
      id: 'amount',
      header: 'Montant',
    }
  ),
  columnHelper.accessor(row => row.items.length, {
    id: 'items',
    header: 'Articles',
  }),
  columnHelper.accessor(row => getStatusDisplay(row), {
    id: 'status',
    header: 'Statut',
    cell: info => {
      const status = info.getValue();
      return (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(status)}`}
        >
          {status}
        </span>
      );
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    // props ici est de type CellContext<Order, any>
    cell: ({ row }: { row: Row<Order> }) => {
      const clickedOrder = row.original;
      return (
        <button
          onClick={() => {
            if (selectedOrder === clickedOrder) {
              setSelectedOrder(null);
            } else {
              setSelectedOrder(clickedOrder);
              handleGetProducts(clickedOrder.items);
            }
          }}
          className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
        >
          {selectedOrder === clickedOrder ? 'Masquer' : 'Détails'}
        </button>
      );
    },
  }),
];
