import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EstatePhotosPage = ({ estateId }) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await axios.get(`http://localhost:5275/api/Estate/GetPhotosByEstateId?estateId=${1}`, {
                    headers: {
                        'Authorization': 'Bearer YOUR_JWT_TOKEN', // JWT Token'ınızı buraya koyun
                    },
                });
                const photosData = response.data;

                // Base64'ten Blob'a dönüştürme
                const photosWithUrls = photosData.map(photo => {
                    const imageBlob = new Blob([new Uint8Array(atob(photo.data).split('').map(c => c.charCodeAt(0)))], { type: photo.fileType });
                    const imageUrl = URL.createObjectURL(imageBlob);
                    return { ...photo, imageUrl };
                });

                setPhotos(photosWithUrls);
            } catch (error) {
                setError('Fotoğraflar yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, [estateId]);

    if (loading) return <p>Yükleniyor...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Estate Fotoğrafları</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {photos.map(photo => (
                    <div key={photo.id} style={{ margin: '10px' }}>
                        <img src={photo.imageUrl} alt={photo.fileName} style={{ maxWidth: '300px', maxHeight: '200px' }} />
                        <p>{photo.fileName}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EstatePhotosPage;
