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
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { mainListItems, secondaryListItems } from '../GeneralDashboard/listItems';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { jwtDecode } from 'jwt-decode';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L, { icon } from 'leaflet';
import { Popup } from 'react-leaflet';
import { Input } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddIcon from '@mui/icons-material/Add';
import { Card, CardActions, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

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


const customIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});



const markerIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  // specify the path here
  iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png"
});


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



const defaultTheme = createTheme();

export default function EstateAdd() {
  const [open, setOpen] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedEstateType, setSelectedEstateType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [files, setFiles] = useState([]);

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [currencies, setCurrencies] = useState([]);
  const [estateTypes, setEstateTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const userId = jwtDecode(localStorage.getItem('token'))["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  const { t } = useTranslation();

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const handleAddEstate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    const formattedStartDate = selectedStartDate ? selectedStartDate.format('YYYYMMDD') : '';
    const formattedEndDate = selectedEndDate ? selectedEndDate.format('YYYYMMDD') : '';

    const requestBody = {
      name: selectedName,
      estateTypeId: selectedEstateType,
      statusId: selectedStatus,
      currencyId: selectedCurrency,
      startDate: parseInt(formattedStartDate),
      endDate: parseInt(formattedEndDate),
      price: parseFloat(selectedPrice),
      latitude,
      longitude,
      userId: userId
    };

    const estateResponse = await fetch('http://localhost:5275/api/Estate/AddEstate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    if (estateResponse.ok) {
      const { estateId } = await estateResponse.json();

      const formData = new FormData();
      Array.from(files).forEach(file => formData.append('files', file));

      const photoResponse = await fetch(`http://localhost:5275/api/Estate/UploadPhotos?estateId=${estateId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (photoResponse.ok) {
        alert('Estate and photos added successfully');
        // Reset form
        setSelectedName('');
        setSelectedEstateType('');
        setSelectedCurrency('');
        setSelectedPrice('');
        setSelectedStatus('');
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        setLatitude(0);
        setLongitude(0);
        setFiles([]);

      } else {
        alert('Failed to upload photos');
      }
    } else {
      alert('Failed to add estate');
    }
  };

  const fetchCurrencies = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }
    const response = await fetch('http://localhost:5275/api/Currency/GetAllCurrencies', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setCurrencies(data);
    } else {
      alert('Failed to fetch currencies');
    }
  };

  const fetchEstateTypes = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }
    const response = await fetch('http://localhost:5275/api/EstateType/GetAllEstateTypes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setEstateTypes(data);
    } else {
      alert('Failed to fetch estate types');
    }
  };

  const fetchStatuses = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }
    const response = await fetch('http://localhost:5275/api/Status/GetAllStatuses', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setStatuses(data);
    } else {
      alert('Failed to fetch statuses');
    }
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      },
    }
    );

    return latitude !== 0 && longitude !== 0 ? (
      <Marker position={[latitude, longitude]} icon={customIcon}></Marker>
    ) : null;
  }

  useEffect(() => {
    fetchCurrencies();
    fetchEstateTypes();
    fetchStatuses();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission logic here
    console.log("Selected Currency:", selectedCurrency);
    console.log("Selected Estate Type:", selectedEstateType);
    console.log("Selected Status:", selectedStatus);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {t('Estate Add Page')}
            </Typography>
            <Button color="inherit" variant='outlined' onClick={handleLogout}>
            {t('Logout')}
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
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
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            padding: 3,
          }}
        >
          <Toolbar />

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              maxWidth: "%100",
              margin: 'auto',
            }}
          >
            <Card >
              <CardContent>
                <FormControl fullWidth sx={{ mb: 2 }} >
                  <TextField
                    id="outlined-basic"
                    label={t('Estate Name')}
                    variant="outlined"
                    value={selectedName}
                    onChange={(e) => setSelectedName(e.target.value)}
                  />

                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
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

                <FormControl fullWidth sx={{ mb: 2 }}>
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

                <FormControl fullWidth sx={{ mb: 2 }}>
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

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    id="outlined-basic"
                    label={t('Price Name')}
                    variant="outlined"
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                  />
                </FormControl>



                <FormControl fullWidth  sx={{ mb: 2 }}>
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



                  <Box sx={{ height: 400, width: "%100", mb: 2 }}>
                    <MapContainer center={[latitude, longitude]} zoom={5} style={{ height: '100%' }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationMarker />
                    </MapContainer>
                  </Box>
                </FormControl>
                <FormControl fullWidth sx={{ marginBottom: 1 }}>
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
                    {files.length > 0 ? `${files.length}`+ t('files selected'): t('No files selected') } 
                  </Typography>
                </FormControl>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddEstate}
                  fullWidth
                >
                  {t('Estate Add')}
                </Button>
              </CardContent>
            </Card>

          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
