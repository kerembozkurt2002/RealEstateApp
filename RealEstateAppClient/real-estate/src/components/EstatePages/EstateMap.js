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
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { mainListItems, secondaryListItems } from '../GeneralDashboard/listItems';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import InfoIcon from '@mui/icons-material/Info';
import { Card, CardActions, CardContent, CardHeader } from '@mui/material';
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

export default function EstateMap() {
  const [open, setOpen] = React.useState(true);
  const decodedToken = jwtDecode(localStorage.getItem('token'));
  const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const [estates, setEstates] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageSize, setPageSize] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const { t } = useTranslation();

  const handleInfo = (id) => {
    navigate(`/EstateInfo/${id}`);
  };
  const fetchEstates = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5275/api/Estate/GetAllEstates', {
        params: {
          pageSize: pageSize,
          page: page + 1, // API pages might be 1-indexed
        },
      });
      setEstates(response.data);
    } catch (error) {
      console.error('Error fetching estates:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEstates();
  }, [page, pageSize]);

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

  const defaultCenter = [38.9637, 35.2433]; 
  const defaultZoom = 6;

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
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            {t('Estate Map Page')}
            </Typography>
            <Button color="inherit" variant="outlined" onClick={handleLogout}>
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
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />

          
          <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Card>
              <CardContent>

            <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: '500px', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {estates
                .filter((estate) => estate.latitude && estate.longitude)
                .map((estate) => (
                  <Marker
                    key={estate.id}
                    position={[estate.latitude, estate.longitude]}
                    icon={customIcon}
                  >
                    <Popup>
                      <div> 
                        <strong>{t('Estate Name')}:</strong> {estate.name}<br />
                        <strong>{t('Price Name')}:</strong> {estate.price} {estate.currencyType}<br />
                        <strong>{t('Status Name')}:</strong> {estate.statusName}<br />
                        <strong>{t('Latitude')}:</strong> {estate.latitude}<br />
                        <strong>{t('Longitude')}:</strong> {estate.longitude}<br />
                        
                        <IconButton 
                        variant="contained"
                        color="success"
                        size="small"
                        style={{ display: 'block', margin: '10px auto' }}
                        onClick={() => handleInfo(estate.id)}
                        >  <InfoIcon></InfoIcon>   </IconButton>
                      </div> 
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
            </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

    </ThemeProvider>
  );
}
