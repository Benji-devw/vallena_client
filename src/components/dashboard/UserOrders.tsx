'use client';

import React from 'react';

// TODO: Remplacer par de vraies données et types de commandes
const mockOrders = [
  { id: '1', date: '2023-10-26', total: 49.99, status: 'Livrée' },
  { id: '2', date: '2023-11-15', total: 120.00, status: 'En cours de préparation' },
  { id: '3', date: '2023-12-01', total: 75.50, status: 'Expédiée' },
];

const UserOrders = () => {
  // TODO: Logique pour récupérer les commandes de l'utilisateur via API

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Mes Commandes</h2>
      {mockOrders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Commande</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total} €</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'Livrée' ? 'bg-green-100 text-green-800' : 
                        order.status === 'Expédiée' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}
                    `}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Vous n'avez aucune commande pour le moment.</p>
      )}
    </div>
  );
};

export default UserOrders; 