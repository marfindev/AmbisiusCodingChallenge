import React from 'react';
import EditableTable from '../components/EditableTable';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mt-10 mb-5 text-gray-800">Coding Challenge Ambisius - Marfin</h1>
      <EditableTable />
    </div>
  );
};

export default HomePage;
