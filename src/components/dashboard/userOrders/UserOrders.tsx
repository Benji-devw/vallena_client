'use client';

import { User } from 'next-auth';
import React, { useState, useMemo, useEffect, Fragment } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
  SortingState
} from '@tanstack/react-table';
import { orderService } from '@/services/api/orderService';
import { Order, OrderItem, UserProfileProps } from '@/types/orderTypes';
import { productService } from '@/services/api/productService';
import { Product } from '@/types/productTypes';


// Fonction pour obtenir le statut d'affichage
const getStatusDisplay = (order: Order) => {
  if (order.statut.finish) return 'Livrée';
  if (order.statut.inProgress) return 'En cours';
  
  // Vérifier le statut de paiement
  const paymentStatus = order.client[0]?.payments?.captures[0]?.status;
  if (paymentStatus === 'PENDING') return 'En attente';
  if (paymentStatus === 'COMPLETED') return 'Payée';
  
  return 'Traitement';
};

// Fonction pour obtenir la classe de la pastille de statut
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

// Fonction pour calculer le total des articles en utilisant les détails des produits récupérés
const calculateTotal = (items: OrderItem[], productDetails: {[key: string]: Product}) => {
  return items.reduce((total, item) => {
    const product = productDetails[item.product_id];
    if (product) {
      return total + (item.quantity * product.priceProduct);
    }
    return total;
  }, 0);
};

// Formater la date pour affichage
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

const columnHelper = createColumnHelper<Order>();

const UserOrders = ({ user }: UserProfileProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [productDetails, setProductDetails] = useState<{[key: string]: Product}>({});

  const handleGetProducts = async (currentOrderItems: OrderItem[]) => {
    if (!currentOrderItems || currentOrderItems.length === 0) {
      setProductDetails({});
      return;
    }

    const productIds = Array.from(new Set(currentOrderItems.map(item => item.product_id)));
    // console.log('[UserOrders] Product IDs to fetch:', productIds); // Peut être gardé pour débug
    
    if (productIds.length === 0) {
      setProductDetails({});
      return;
    }

    try {
      const productsPromises = productIds.map(async (id) => {
        try {
          const apiResponse = await productService.getProductById(id);
          // console.log(`[UserOrders] API response for ID ${id}:`, apiResponse); // Log de la réponse brute
          if (apiResponse && apiResponse.data) {
            // console.log(`[UserOrders] Product data for ID ${id}:`, apiResponse.data); // Log du produit extrait
            return apiResponse.data; // Retourner l'objet produit qui est dans la clé 'data'
          }
          console.warn(`[UserOrders] No data found in API response for product ID ${id}:`, apiResponse);
          return null;
        } catch (error) {
          console.error(`[UserOrders] Error fetching product ID ${id}:`, error);
          return null; 
        }
      });
      const resolvedProductsArray = await Promise.all(productsPromises);
      // console.log('[UserOrders] Resolved products array (data extracted):', resolvedProductsArray);
      
      const newProductDetails: {[key: string]: Product} = {};
      resolvedProductsArray.forEach(product => {
        // Maintenant, 'product' ici est l'objet produit réel (ou null)
        if (product && product._id) { 
          newProductDetails[product._id] = product;
        } else if (product) {
          // Ce cas ne devrait plus se produire si apiResponse.data est bien l'objet Product
          console.warn('[UserOrders] Product in array but missing _id (should have been data):', product);
        }
      });
      // console.log('[UserOrders] New productDetails state:', newProductDetails);
      setProductDetails(newProductDetails);
    } catch (error) {
      console.error('[UserOrders] General error in handleGetProducts:', error);
      setProductDetails({}); 
    }
  };

  const columns = useMemo<ColumnDef<Order, any>[]>(() => [
    columnHelper.accessor(row => row._id.substring(row._id.length - 8), {
      id: 'reference',
      header: 'Référence',
      cell: info => (
        <span className="font-medium text-gray-900 dark:text-white">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor(row => formatDate(row.createdAt), {
      id: 'date',
      header: 'Date',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor(row => {
      const orderAmount = row.client[0]?.amount?.value;
      const currency = row.client[0]?.amount?.currency_code || 'EUR';
      if (row === selectedOrder && Object.keys(productDetails).length > 0 && row.items.length > 0) {
        return `${calculateTotal(row.items, productDetails).toFixed(2)} ${currency}`;
      }
      return `${orderAmount || '0.00'} ${currency}`;
    }, {
      id: 'amount',
      header: 'Montant',
    }),
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
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(status)}`}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: props => (
        <button 
          onClick={() => {
            const clickedOrder = props.row.original;
            if (selectedOrder === clickedOrder) {
              setSelectedOrder(null); 
              setProductDetails({});  
            } else {
              setSelectedOrder(clickedOrder); 
              handleGetProducts(clickedOrder.items);
            }
          }}
          className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
        >
          {selectedOrder === props.row.original ? 'Masquer' : 'Détails'}
        </button>
      ),
    }),
  ], [selectedOrder, productDetails]);

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
    const fetchOrders = async () => {
      try {
        if (user?.id) {
          const response = await orderService.getUserOrders(user.id);
          setOrders(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Mes Commandes</h2>
          <div className="mt-4 md:mt-0">
            <input
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Rechercher..."
            />
          </div>
        </div>
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th 
                        key={header.id}
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {table.getRowModel().rows.map(row => (
                  <Fragment key={row.id}>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                    {row.original === selectedOrder && (
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <td colSpan={columns.length} className="p-0">
                          <div className="p-6 animate-fadeIn">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Détails de la commande #{selectedOrder._id.substring(selectedOrder._id.length - 8)}
                              </h3>
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(getStatusDisplay(selectedOrder))}`}>
                                {getStatusDisplay(selectedOrder)}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div>
                                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Client</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {selectedOrder.payer.name.given_name} {selectedOrder.payer.name.surname}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedOrder.payer.email_address}</p>
                              </div>
                              
                              {selectedOrder.client[0]?.shipping && (
                                <div>
                                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Adresse de livraison</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedOrder.client[0].shipping.name.full_name}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedOrder.client[0].shipping.address.address_line_1}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedOrder.client[0].shipping.address.postal_code} {selectedOrder.client[0].shipping.address.admin_area_2}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedOrder.client[0].shipping.address.country_code}
                                  </p>
                                </div>
                              )}
                            </div>

                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Articles commandés</h4>
                            <div className="space-y-4 mb-6">
                              {selectedOrder.items.map((item) => {
                                const product = productDetails[item.product_id]; 
                                if (!product && Object.keys(productDetails).length > 0 && selectedOrder.items.some(i => i.product_id === item.product_id)) {
                                  return (
                                    <div key={item.product_id} className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                      Détails du produit {item.product_id} non trouvés.
                                    </div>
                                  );
                                } 
                                if (!product) {
                                  return (
                                    <div key={item.product_id} className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                      Chargement du produit {item.product_id}...
                                    </div>
                                  );
                                }
                                return (
                                  <div key={item.product_id} className="flex flex-col sm:flex-row items-start sm:items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <div className="w-16 h-16 flex-shrink-0 mr-4 mb-2 sm:mb-0 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                                      {product.imgCollection && product.imgCollection.length > 0 ? (
                                        <img 
                                          src={product.imgCollection[0]} 
                                          alt={product.titleProduct} 
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                         <div className="w-full h-full flex items-center justify-center">
                                           <span className="text-gray-400">Image</span>
                                         </div>
                                      )}
                                    </div>
                                    <div className="flex-grow">
                                      <h5 className="font-medium text-gray-800 dark:text-white">{product.titleProduct}</h5>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">Catégorie: {product.categoryProduct || 'N/A'}</p>
                                      <div className="flex justify-between mt-1">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                          Quantité: {item.quantity}
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                                          {(item.quantity * product.priceProduct).toFixed(2)} €
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                              <div className="flex justify-between mb-2">
                                <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
                                <span className="font-medium text-gray-800 dark:text-white">
                                  {calculateTotal(selectedOrder.items, productDetails).toFixed(2)} €
                                </span>
                              </div>
                              <div className="flex justify-between mb-2">
                                <span className="text-gray-600 dark:text-gray-400">Livraison</span>
                                <span className="font-medium text-gray-800 dark:text-white">Gratuite</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span className="font-medium text-gray-800 dark:text-white">Total</span>
                                <span className="font-bold text-lg text-gray-800 dark:text-white">
                                  {selectedOrder.client[0]?.amount?.value || calculateTotal(selectedOrder.items, productDetails).toFixed(2)} {selectedOrder.client[0]?.amount?.currency_code || '€'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Vous n'avez aucune commande pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default UserOrders; 