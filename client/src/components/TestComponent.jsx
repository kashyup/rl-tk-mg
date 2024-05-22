import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const TestComponent = () => {
  const { getAccessToken } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await getAccessToken();
        const response = await fetch('/api/protected-resource', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        const result = await response.json();
        if (response.ok) {
          setData(result);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('Error fetching protected resource:', error);
      }
    };

    fetchData();
  }, [getAccessToken]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Protected Resource</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default TestComponent;
