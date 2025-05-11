// Données de démonstration basées sur l'exemple fourni
const mockOrders = [
  {
    _id: '5f6616913e1eb622f40e800b',
    payer: {
      email_address: 'ben.nav@pm.me',
      name: {
        given_name: 'John',
        surname: 'Doe'
      },
      address: {
        country_code: 'FR'
      },
      payer_id: 'WDQVRJJA2WH6G'
    },
    statut: {
      inProgress: true,
      finish: false
    },
    createdAt: '2020-09-19T14:32:49.457Z',
    updatedAt: '2020-09-22T21:18:39.066Z',
    client: [
      {
        amount: {
          value: '160.50',
          currency_code: 'USD'
        },
        shipping: {
          name: {
            full_name: 'Ben Nav'
          },
          address: {
            address_line_1: '20 rue boieldieu',
            admin_area_2: 'ST MICHEL SUR ORGE',
            postal_code: '91240',
            country_code: 'FR'
          }
        },
        payments: {
          captures: [
            {
              status: 'PENDING',
              id: '4VH63940U4890833V',
              create_time: '2020-09-19T14:32:43Z'
            }
          ]
        }
      }
    ],
    items: [
      {
        id: 'g0l38d82o8w',
        quantity: 1,
        details: {
          titleProduct: 'Midnight',
          priceProduct: 23,
          imgCollection: ['http://localhost:8800/public/f5d51e4c-d7e2-454b-a27a-51a8dc0a063f-midnight_both_on-gray.jpg'],
          categoryProduct: 'Panière'
        }
      },
      {
        id: 'qanc9sh2lss',
        quantity: 4,
        details: {
          titleProduct: 'JetblackM',
          priceProduct: 33,
          imgCollection: ['http://localhost:8800/public/299ba3d9-ae3f-4992-9e23-3b8ea0eeab60-1jetblack_main-01.jpg'],
          categoryProduct: 'Sac à dos'
        }
      }
    ]
  },
  {
    _id: '5f6616913e1eb622f40e800c',
    payer: {
      email_address: 'client@example.com',
      name: {
        given_name: 'Marie',
        surname: 'Dupont'
      },
      address: {
        country_code: 'FR'
      },
      payer_id: 'ABCDEF12345'
    },
    statut: {
      inProgress: false,
      finish: true
    },
    createdAt: '2023-06-15T10:22:30.457Z',
    updatedAt: '2023-06-16T08:45:12.066Z',
    client: [
      {
        amount: {
          value: '89.90',
          currency_code: 'EUR'
        },
        shipping: {
          name: {
            full_name: 'Marie Dupont'
          },
          address: {
            address_line_1: '15 Avenue des Lilas',
            admin_area_2: 'Paris',
            postal_code: '75008',
            country_code: 'FR'
          }
        },
        payments: {
          captures: [
            {
              status: 'COMPLETED',
              id: 'PAY123456789',
              create_time: '2023-06-15T10:22:43Z'
            }
          ]
        }
      }
    ],
    items: [
      {
        id: 'prod123456',
        quantity: 2,
        details: {
          titleProduct: 'Sac Élégance',
          priceProduct: 44.95,
          imgCollection: ['https://example.com/images/sac-elegance.jpg'],
          categoryProduct: 'Sac à main'
        }
      }
    ]
  }
];

export default mockOrders;
