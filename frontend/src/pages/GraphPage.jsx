import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import GraphBox from '../components/GraphBox';

const GraphPage = () => {
  const [selectedMlId, setSelectedMlId] = useState(null);

  return (
    <div className="flex w-screen h-screen">
      <Sidebar selectedMlId={setSelectedMlId} setSelectedMlId={setSelectedMlId} />
      <GraphBox selectedMlId={selectedMlId} />
    </div>
  );
};

export default GraphPage;
