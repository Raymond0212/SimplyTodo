import React from 'react';

export const NoContentView = () => {
  return (
    <div style={{ textAlign: 'center', paddingTop: '20px' }}>
      <h4>No todo selected</h4>
      <p>Select a todo from the list to see its details.</p>
    </div>
  );
};
