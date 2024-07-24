'use client';
import { useState } from 'react';
import Layout from './layout';
// import Layout from './layout';
import BranchesPage from './customers/page';

const AdminPage = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <Layout setActiveComponent={setActiveComponent}>
      <div className="p-4">
        {activeComponent === 'branches' && <BranchesPage />}
        {/* Add other components as needed */}
      </div>
    </Layout>
  );
};

export default AdminPage;
