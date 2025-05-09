'use client';

import React from 'react';
import { useSession } from 'next-auth/react';

const Dashboard = () => {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <p>Chargement de la session...</p>;
  }

  return (
    <div>
      { 
        session ? (
          <div>
            <h1>Dashboard</h1>
            <p>Bienvenue {session?.user?.name}</p>
            <p>Email: {session?.user?.email}</p>
            {/* <p>Token API: {(session.user as any)?.accessToken}</p> */}
            <pre>{JSON.stringify(session, null, 2)}</pre>
          </div>
        ) : (
          <div>
            <p>Aucune session active. Vous n'êtes pas connecté.</p>
          </div>
        )
      }
    </div>
  );
};

export default Dashboard;


