import React, { useEffect, useState } from 'react';
import axios from 'axios';

const KullaniciListe = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5275/api/Account/GetAllUsers');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Kullanıcı Listesi</h1>
            {users.length > 0 ? (
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            <p>Email: {user.email}</p>
                            <p>Roles: {user.roles.join(', ')}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default KullaniciListe;
