import React, { Fragment } from 'react';
import { flexRender, Table } from '@tanstack/react-table';
import { Order } from '@/types/orderTypes';
import { Product } from '@/types/productTypes';

interface OrderTableProps {
  table: Table<Order>;
  selectedOrder: Order | null;
  productDetails: { [key: string]: Product };
  getStatusDisplay: (order: Order) => string;
  getStatusClass: (status: string) => string;
  calculateTotal: (items: Order['items'], productDetails: { [key: string]: Product }) => number;
}

const OrderTable = ({
  table,
  selectedOrder,
  productDetails,
  getStatusDisplay,
  getStatusClass,
  calculateTotal,
}: OrderTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  scope="col"
                  className="hover:underline user-select-none px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center">
                    {flexRender(header.column.columnDef.header, header.getContext())}
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
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {row.original === selectedOrder && (
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td colSpan={table.getAllColumns().length} className="p-0">
                    <div className="p-6 animate-fadeIn">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                          Détails de la commande #
                          {selectedOrder._id.substring(selectedOrder._id.length - 8)}
                        </h3>
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(getStatusDisplay(selectedOrder))}`}
                        >
                          {getStatusDisplay(selectedOrder)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Client
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedOrder.payer.name.given_name}{' '}
                            {selectedOrder.payer.name.surname}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedOrder.payer.email_address}
                          </p>
                        </div>

                        {selectedOrder.client[0]?.shipping && (
                          <div>
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Adresse de livraison
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedOrder.client[0].shipping.name.full_name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedOrder.client[0].shipping.address.address_line_1}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedOrder.client[0].shipping.address.postal_code}{' '}
                              {selectedOrder.client[0].shipping.address.admin_area_2}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedOrder.client[0].shipping.address.country_code}
                            </p>
                          </div>
                        )}
                      </div>

                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Articles commandés
                      </h4>
                      <div className="space-y-4 mb-6">
                        {selectedOrder.items.map(item => {
                          const product = productDetails[item.product_id];
                          if (
                            !product &&
                            Object.keys(productDetails).length > 0 &&
                            selectedOrder.items.some(i => i.product_id === item.product_id)
                          ) {
                            return (
                              <div
                                key={item.product_id}
                                className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                              >
                                Détails du produit {item.product_id} non trouvés.
                              </div>
                            );
                          }
                          if (!product) {
                            return (
                              <div
                                key={item.product_id}
                                className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                              >
                                Chargement du produit {item.product_id}...
                              </div>
                            );
                          }
                          return (
                            <div
                              key={item.product_id}
                              className="flex flex-col sm:flex-row items-start sm:items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
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
                                <h5 className="font-medium text-gray-800 dark:text-white">
                                  {product.titleProduct}
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Catégorie: {product.categoryProduct || 'N/A'}
                                </p>
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
                          <span className="font-medium text-gray-800 dark:text-white">
                            Gratuite
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                          <span className="font-medium text-gray-800 dark:text-white">
                            Total
                          </span>
                          <span className="font-bold text-lg text-gray-800 dark:text-white">
                            {selectedOrder.client[0]?.amount?.value ||
                              calculateTotal(selectedOrder.items, productDetails).toFixed(2)}{' '}
                            {selectedOrder.client[0]?.amount?.currency_code || '€'}
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
  );
};

export default OrderTable; 