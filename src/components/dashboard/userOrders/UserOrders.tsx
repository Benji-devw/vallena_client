'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
} from '@tanstack/react-table';
import { orderService } from '@/services/api/orderService';
import { Order, OrderItem, UserProfileProps } from '@/types/orderTypes';
import { productService } from '@/services/api/productService';
import { Product } from '@/types/productTypes';
import { getOrderColumns } from './OrderColumns';
import OrderTable from './OrderTable';
import Skeleton from '@/components/dashboard/userOrders/OrderSkeleton';

// Function to get the status display
const getStatusDisplay = (order: Order) => {
  if (order.statut.finish) return 'Livrée';
  if (order.statut.inProgress) return 'En cours';

  // Vérifier le statut de paiement
  const paymentStatus = order.client[0]?.payments?.captures[0]?.status;
  if (paymentStatus === 'PENDING') return 'En attente';
  if (paymentStatus === 'COMPLETED') return 'Payée';

  return 'Traitement';
};

// Function to get the status pill class
const getStatusClass = (status: string) => {
  switch (status) {
    case 'Livrée':
      return 'bg-green-100 text-green-800';
    case 'En cours':
      return 'bg-blue-100 text-blue-800';
    case 'Payée':
      return 'bg-purple-100 text-purple-800';
    case 'En attente':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Function to calculate the total of articles using the product details retrieved
const calculateTotal = (items: OrderItem[], productDetails: { [key: string]: Product }) => {
  return items.reduce((total, item) => {
    const product = productDetails[item.product_id];
    if (product) {
      return total + item.quantity * product.priceProduct;
    }
    return total;
  }, 0);
};

// Format the date for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

const UserOrders = ({ user }: UserProfileProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [productDetails, setProductDetails] = useState<{ [key: string]: Product }>({});
  const [isLoading, setIsLoading] = useState(true);

  const handleGetProducts = async (currentOrderItems: OrderItem[]) => {
    if (!currentOrderItems || currentOrderItems.length === 0) {
      setProductDetails({});
      return;
    }

    // Get the product IDs from the current order items
    const productIds = Array.from(new Set(currentOrderItems.map(item => item.product_id)));

    if (productIds.length === 0) {
      setProductDetails({});
      return;
    }

    // Fetch the products from the API
    try {
      const productsPromises = productIds.map(async id => {
        try {
          const apiResponse = await productService.getProductById(id);
          if (apiResponse && apiResponse.data) {
            return apiResponse.data;
          }
          console.warn(
            `[UserOrders] No data found in API response for product ID ${id}:`,
            apiResponse
          );
          return null;
        } catch (error) {
          console.error(`[UserOrders] Error fetching product ID ${id}:`, error);
          return null;
        }
      });
      const resolvedProductsArray = await Promise.all(productsPromises);

      const newProductDetails: { [key: string]: Product } = {};
      resolvedProductsArray.forEach(product => {
        if (product && product._id) {
          newProductDetails[product._id] = product;
        } else if (product) {
          console.warn(
            '[UserOrders] Product in array but missing _id (should have been data):',
            product
          );
        }
      });
      setProductDetails(newProductDetails);
    } catch (error) {
      console.error('[UserOrders] General error in handleGetProducts:', error);
      setProductDetails({});
    }
  };

  // Define the columns for the table, useMemo to avoid re-rendering the columns when the selectedOrder or productDetails change
  const columns = useMemo(
    () =>
      getOrderColumns({
        selectedOrder,
        productDetails,
        setSelectedOrder,
        handleGetProducts,
        formatDate,
        getStatusDisplay,
        getStatusClass,
        calculateTotal,
      }),
    [selectedOrder, productDetails]
  );

  const table = useReactTable({
    data: orders,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const fetchOrders = async () => {
        try {
          setIsLoading(true);
          if (user?.id) {
            const response = await orderService.getUserOrders(user.id);
            setOrders(response.data || []);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          setOrders([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrders();
    }, 1000);
  }, [user]);

  console.log(orders);
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Mes Commandes</h2>
        </div>
        {isLoading ? (
          <Skeleton display="row" rows={orders.length || 3} columns={6} viewMode="horizontal" className="w-full" />
        ) : orders.length > 0 ? (
          <OrderTable
            table={table}
            selectedOrder={selectedOrder}
            productDetails={productDetails}
            getStatusDisplay={getStatusDisplay}
            getStatusClass={getStatusClass}
            calculateTotal={calculateTotal}
          />
        ) : (
          <p className="text-gray-600 dark:text-gray-300">
            Vous n'avez aucune commande pour le moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
