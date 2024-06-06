import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Sidebar = ({ selectedMlId, setSelectedMlId }) => {
  const [mlCases, setMlCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMlCases = async () => {
      try {
        const response = await axios.get('http://localhost:5506/api/mlids');
        const mlIds = response.data;
        
        const casesPromises = mlIds.map(mlId =>
          axios.get('http://localhost:5506/api/mlcase', { params: { mlId } })
        );

        const casesResponses = await Promise.all(casesPromises);
        const cases = casesResponses.map(res => res.data);

        setMlCases(cases);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ML cases', error);
        setLoading(false);
      }
    };
    fetchMlCases();
  }, []);

  return (
    <div className="w-64 bg-gray-100 p-4 shadow-lg overflow-y-auto h-screen">
       <button
        className="p-4 mb-4 rounded-lg shadow-md bg-blue-500 text-white hover:bg-blue-700 transition duration-300 w-full text-left"
        onClick={() => setSelectedMlId(null)}
      >
        Home
      </button>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="loader">Loading...</div>
        </div>
      ) : (
        <ul>
          {mlCases.map((mlCase, index) => (
            <li
              key={index}
              className={`p-4 mb-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition duration-300 ${
                selectedMlId === mlCase.ML_ID ? 'bg-blue-500 text-white' : 'bg-white text-blue-700'
              }`}
              onClick={() => setSelectedMlId(mlCase.ML_ID)}
            >
              <div className="flex justify-between">
                <div className="font-bold text-lg">{mlCase.ML_type}</div>
                <div className="text-sm">{new Date(mlCase.first_trx_date).toLocaleDateString()}</div>
              </div>
              <div className="text-sm">ID: {mlCase.ML_ID}</div>
              <div className="text-sm">Date: {new Date(mlCase.first_trx_date).toLocaleDateString()}</div>
              <div className="text-sm">Entities: {mlCase.n_entities_involved.low}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
