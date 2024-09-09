import * as React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField } from '@mui/material';

export default function EstateInfo() {
  const { id } = useParams();
  const [estate, setEstate] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Utility function to convert YYYYMMDD to MM/DD/YYYY
  const formatDate = (dateInt) => {
    const dateStr = dateInt.toString();
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${month}/${day}/${year}`;
  };

  React.useEffect(() => {
    const fetchEstate = async () => {
      try {
        const response = await axios.get(`http://localhost:5275/api/Estate/GetEstateById?id=${id}`);
        setEstate(response.data);
      } catch (error) {
        console.error('Error fetching estate details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEstate();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!estate) return <Typography>No estate data found.</Typography>;

  return (
    <Box sx={{ padding: 2 }}>
      <TextField
        label="Name"
        value={estate.name}
        fullWidth
        InputProps={{ readOnly: true }}
        margin="normal"
      />
      <TextField
        label="Type"
        value={estate.estateTypeName}
        fullWidth
        InputProps={{ readOnly: true }}
        margin="normal"
      />
      <TextField
        label="Price"
        value={estate.price}
        fullWidth
        InputProps={{ readOnly: true }}
        margin="normal"
      />
      <TextField
        label="Status"
        value={estate.statusName}
        fullWidth
        InputProps={{ readOnly: true }}
        margin="normal"
      />
      <TextField
        label="Currency"
        value={estate.currencyType}
        fullWidth
        InputProps={{ readOnly: true }}
        margin="normal"
      />
      <TextField
        label="Start Date"
        value={formatDate(estate.startDate)}
        fullWidth
        InputProps={{ readOnly: true }}
        margin="normal"
      />
      <TextField
        label="End Date"
        value={formatDate(estate.endDate)}
        fullWidth
        InputProps={{ readOnly: true }}
        margin="normal"
      />
      <TextField
        label="Latitude"
        value={estate.latitude}
        fullWidth
        InputProps={{ readOnly: true }}
        margin="normal"
      />
      <TextField
        label="Longitude"
        value={estate.longitude}
        fullWidth
        InputProps={{ readOnly: true }}
        margin="normal"
      />
      <TextField
        label="User ID"
        value={estate.userId}
        fullWidth
        InputProps={{ readOnly: true }}
        margin="normal"
      />
    </Box>
  );
}
