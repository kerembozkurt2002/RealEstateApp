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
import jwtDecode from 'jwt-decode';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';

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
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  const [estateTypes, setEstateTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const userId = jwtDecode(localStorage.getItem('token'))["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  
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

    // Convert dates to YYYYMMDD format
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
      latitude, // Dynamic latitude from map click
      longitude, // Dynamic longitude from map click
      userId: userId,
    };

    const response = await fetch('http://localhost:5275/api/Estate/AddEstate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      alert('Estate added successfully');
      setSelectedName('');
      setSelectedEstateType('');
      setSelectedCurrency('');
      setSelectedPrice('');
      setSelectedStatus('');
      setSelectedStartDate(null);
      setSelectedEndDate(null);
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
        'Authorization': `Bearer ${token}`,
      },
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
        'Authorization': `Bearer ${token}`,
      },
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
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setStatuses(data);
    } else {
      alert('Failed to fetch statuses');
    }
  };

  useEffect(() => {
    fetchCurrencies();
    fetchEstateTypes();
    fetchStatuses();
  }, []);

  // Component for handling map clicks and updating latitude/longitude
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      },
    });

    return latitude !== 0 && longitude !== 0 ? (
      <Marker position={[latitude, longitude]}></Marker>
    ) : null;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
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
              Estate Add
            </Typography>
            <Button color="inherit" variant='outlined' onClick={handleLogout}>
              Logout
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
          }}
        >
          <Toolbar />
          <Box
            sx={{
              marginTop: '20px',
              marginLeft: '20px',
              marginRight: '20px',
            }}
          >
            <TextField
              label="Estate Name"
              fullWidth
              variant="outlined"
              margin="normal"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Estate Type</InputLabel>
              <Select
                value={selectedEstateType}
                onChange={(e) => setSelectedEstateType(e.target.value)}
              >
                {estateTypes.map((estateType) => (
                  <MenuItem key={estateType.id} value={estateType.id}>
                    {estateType.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Currency</InputLabel>
              <Select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.id} value={currency.id}>
                    {currency.code}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Price"
              fullWidth
              variant="outlined"
              margin="normal"
              type="number"
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer>
                <DatePicker
                  label="Start Date"
                  value={selectedStartDate}
                  onChange={(newValue) => setSelectedStartDate(newValue)}
                />
              </DemoContainer>
              <DemoContainer>
                <DatePicker
                  label="End Date"
                  value={selectedEndDate}
                  onChange={(newValue) => setSelectedEndDate(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
            <Box
              sx={{
                marginTop: '20px',
                marginBottom: '20px',
                height: '400px',
                width: '100%',
              }}
            >
              <MapContainer center={[latitude || 39.9334, longitude || 32.8597]} zoom={6} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
              </MapContainer>
            </Box>
            <Button variant="contained" color="primary" onClick={handleAddEstate}>
              Add Estate
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
