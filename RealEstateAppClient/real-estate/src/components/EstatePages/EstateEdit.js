import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { mainListItems, secondaryListItems } from '../GeneralDashboard/listItems';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { jwtDecode } from 'jwt-decode';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Card, CardContent, CardMedia, CardActions } from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddIcon from '@mui/icons-material/Add';
import {Input} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';


const drawerWidth = 240;
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const customIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultTheme = createTheme();

export default function EstateEdit() {
  const [open, setOpen] = useState(true);
  const [estate, setEstate] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [estateTypes, setEstateTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedEstateType, setSelectedEstateType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState(dayjs());
  const [selectedEndDate, setSelectedEndDate] = useState(dayjs());
  const [photos, setPhotos] = useState([]);
  const [deletePhotos, setSelectedPhotos] = useState([]);
  const [files, setFiles] = useState([]);

  const { t } = useTranslation();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);


  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();
  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  useEffect(() => {
    const fetchEstateDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5275/api/Estate/GetEstateById?id=${id}`);
        const estateData = response.data;
        setEstate(estateData);
        setSelectedCurrency(estateData.currencyId);
        setSelectedEstateType(estateData.estateTypeId);
        setSelectedStatus(estateData.statusId);
        setSelectedName(estateData.name);
        setSelectedPrice(estateData.price);
        setSelectedStartDate(dayjs(estateData.startDate));
        setSelectedEndDate(dayjs(estateData.endDate));
        setLatitude(estateData.latitude);
        setLongitude(estateData.longitude);


        const photosResponse = await axios.get(`http://localhost:5275/api/Estate/GetPhotosByEstateId?estateId=${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const photosData = photosResponse.data;

        // Base64'ten Blob'a dönüştürme
        const photosWithUrls = photosData.map(photo => {
          const imageBlob = new Blob([new Uint8Array(atob(photo.data).split('').map(c => c.charCodeAt(0)))], { type: photo.fileType });
          const imageUrl = URL.createObjectURL(imageBlob);
          return { ...photo, imageUrl };
        });

        setPhotos(photosWithUrls);
      } catch (error) {
        console.error('Error fetching estate details:', error);
      }
    };

    const fetchDropdownData = async () => {
      try {
        const [currencyRes, estateTypeRes, statusRes] = await Promise.all([
          axios.get('http://localhost:5275/api/Currency/GetAllCurrencies'),
          axios.get('http://localhost:5275/api/EstateType/GetAllEstateTypes'),
          axios.get('http://localhost:5275/api/Status/GetAllStatuses')
        ]);
        setCurrencies(currencyRes.data);
        setEstateTypes(estateTypeRes.data);
        setStatuses(statusRes.data);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchEstateDetails();
    fetchDropdownData();
  }, [id]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleSelectPhoto = (photoId) => {
    setSelectedPhotos((prevSelected) =>
      prevSelected.includes(photoId)
        ? prevSelected.filter((id) => id !== photoId)
        : [...prevSelected, photoId]
    );
  };

  const handlePhotoClick = (photo) => {
    setCurrentPhoto(photo);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentPhoto(null);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const handleDeleteEstate = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5275/api/Estate/DeleteEstate?id=${estate.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/EstateList');
    } catch (error) {
      console.error('Error deleting estate:', error);
    }
  };
  const handleEditEstate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    const formattedStartDate = selectedStartDate.format('YYYYMMDD');
    const formattedEndDate = selectedEndDate.format('YYYYMMDD');

    const requestBody = {
      id: estate.id,
      name: selectedName,
      estateTypeId: selectedEstateType,
      statusId: selectedStatus,
      currencyId: selectedCurrency,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      price: selectedPrice,
      latitude: latitude,
      longitude: longitude,
      userId: estate.userId, // Preserve the original userId
    };

    try {

      const formData = new FormData();
      Array.from(files).forEach(file => formData.append('files', file));

      await axios.put('http://localhost:5275/api/Estate/EditEstate', requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const photoResponse = await fetch('http://localhost:5275/api/Estate/DeletePhotoByIdList', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deletePhotos), 
      });

      const photoAddResponse = await fetch(`http://localhost:5275/api/Estate/UploadPhotos?estateId=${estate.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      navigate('/EstateList'); // Redirect to the estate list or details page after a successful edit
    } catch (error) {
      console.error('Error updating estate:', error);
    }
  };

  if (!estate) return <Typography>Loading...</Typography>;

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: '24px' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            {t('Edit Estate')}
            </Typography>
            <Button color="inherit" variant='outlined' onClick={handleLogout}>
            {t('Logout')}
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            padding: 3,
            marginBottom: 10,
            mt:7
          }}
        >
          
          <Card>
            <CardContent>

            
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              label= {t('Estate Name')}

              variant="outlined"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="currency-label">{t('Currency Type')}</InputLabel>
            <Select
              labelId="currency-label"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              label="Currency"
            >
              {currencies.map((currency) => (
                <MenuItem key={currency.id} value={currency.id}>
                  {currency.currencyType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="estate-type-label">{t('Estate Type Name')}</InputLabel>
            <Select
              labelId="estate-type-label"
              value={selectedEstateType}
              onChange={(e) => setSelectedEstateType(e.target.value)}
              label="Estate Type"
            >
              {estateTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.estateTypeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="status-label">{t('Status Name')}</InputLabel>
            <Select
              labelId="status-label"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="Status"
            >
              {statuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.statusName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              label={t('Price Name')}
              variant="outlined"
              type="number"
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
            />
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <DatePicker
                label={t('Start Date')}
                value={selectedStartDate}
                onChange={(newValue) => setSelectedStartDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <DatePicker
                label={t('End Date')}
                value={selectedEndDate}
                onChange={(newValue) => setSelectedEndDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </FormControl>
          </LocalizationProvider>
          <MapContainer
            center={[latitude, longitude]}
            zoom={13}
            style={{ height: '400px', marginBottom: 20 }}
            onClick={(e) => {
              setLatitude(e.latlng.lat);
              setLongitude(e.latlng.lng);
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[latitude, longitude]}
              icon={customIcon}
            />
          </MapContainer>

          <Typography variant="h6">{t('Photos')}</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {photos.map((photo) => (
              <Card key={photo.id} sx={{ width: 200, height: 250 }}> {/* Sabit kart boyutu */}
                <CardMedia
                  component="img"
                  sx={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  image={photo.imageUrl}
                  alt={photo.name}
                  onClick={() => handlePhotoClick(photo)}
                />
                <CardActions>
                  <Checkbox
                    {...label}
                    icon={<DeleteOutlineIcon />}
                    checkedIcon={<DeleteIcon />}
                    checked={deletePhotos.includes(photo.id)}
                    onChange={() => handleSelectPhoto(photo.id)}
                  />
                </CardActions>
              </Card>
            ))}
          </Box>

          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>{t('Photos')}</DialogTitle>
            <DialogContent>
              {currentPhoto && (
                <img
                  src={currentPhoto.imageUrl}
                  alt={currentPhoto.name}
                  style={{ width: '100%', height: 'auto' }}
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Close</Button>
            </DialogActions>
          </Dialog>
          <br></br>

          <br></br>
          <br></br>

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddPhotoAlternateIcon />}
                color="success"
                component="label" // This turns the Button into a label for the file input
              >
                {t('Upload Photos')}
                <Input
                  type="file"
                  inputProps={{ multiple: true }}
                  onChange={handleFileChange}
                  sx={{ display: 'none' }} // Hide the default file input
                />
              </Button>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                {files.length > 0 ? `${files.length} files selected` : 'No files selected yet'}
              </Typography>
            </FormControl>
            <br></br>

          <Button 
           startIcon={<EditIcon />}

          variant="contained" color="primary" fullWidth onClick={handleEditEstate}>
            {t('Update Estate')}
          </Button>
          <br></br>
          <br></br>

          <Button
          startIcon={<DeleteIcon />}

          variant="contained" color="error" fullWidth onClick={handleDeleteEstate}>
            {t('Delete Estate')}
          </Button>
          {/* <h1> {selectedName} </h1>
          <h1> {selectedCurrency} </h1>
          <h1> {JSON.stringify(deletePhotos)} </h1> */}
          </CardContent>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
