// ActiveUser.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ActiveUser.css';

const ActiveUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchActiveUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/active_user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error al obtener el usuario activo:', error);
      }
    };

    fetchActiveUser();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div id="user-info">
      Usuario activo: {user.nombre_usuario}
    </div>
  );
};

export default ActiveUser;
