// ActiveUser.js
import React from 'react';

const ActiveUser = () => {
  const activeUser = JSON.parse(localStorage.getItem('activeUser'));

  if (!activeUser) {
    return null;
  }

  return (
    <div className="active-user">
      <p>{activeUser.username} ({})</p>
    </div>
  );
};

export default ActiveUser;
