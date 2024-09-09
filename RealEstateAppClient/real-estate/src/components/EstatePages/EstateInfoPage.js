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
import { Button, TextField, Card, CardMedia, CardContent, CardHeader, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { mainListItems, secondaryListItems } from '../GeneralDashboard/listItems';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { jwtDecode } from 'jwt-decode';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { useState, useEffect } from 'react';
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

const defaultTheme = createTheme();
const customIcon = new L.Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

export default function EstateInfoPage() {
    const [open, setOpen] = useState(true);
    const [estate, setEstate] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentPhoto, setCurrentPhoto] = useState(null);
    const { t } = useTranslation();

    const decodedToken = jwtDecode(localStorage.getItem('token'));
    const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const navigate = useNavigate();
    const { id } = useParams();

    const toggleDrawer = () => setOpen(!open);

    const formatDate = (dateInt) => {
        const dateStr = dateInt.toString();
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `${month}/${day}/${year}`;
    };

    useEffect(() => {
        const fetchEstate = async () => {
            try {
                const estateResponse = await axios.get(`http://localhost:5275/api/Estate/GetEstateById?id=${id}`);
                setEstate(estateResponse.data);

                const photosResponse = await axios.get(`http://localhost:5275/api/Estate/GetPhotosByEstateId?estateId=${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                });

                const photosData = photosResponse.data;
                if (photosData && photosData.length > 0) {
                    const photosWithUrls = photosData.map(photo => {
                        const imageBlob = new Blob([new Uint8Array(atob(photo.data).split('').map(c => c.charCodeAt(0)))], { type: photo.fileType });
                        const imageUrl = URL.createObjectURL(imageBlob);
                        return { ...photo, imageUrl };
                    });
                    setPhotos(photosWithUrls);
                } else {
                    setPhotos([]);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setPhotos([]);
                } else {
                    setError('Error fetching photos.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchEstate();
    }, [id]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handlePhotoClick = (photo) => {
        setCurrentPhoto(photo);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setCurrentPhoto(null);
    };

    const mapPosition = estate && estate.latitude && estate.longitude ? [estate.latitude, estate.longitude] : [38.9637, 35.2433];
    const mapZoom = estate && estate.latitude && estate.longitude ? 13 : 6;

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!estate) return <Typography>No estate data found.</Typography>;

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar sx={{ pr: '24px' }}>
                        <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer} sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                            {t('Estate Details')}
                        </Typography>
                        <Button color="inherit" variant="outlined" onClick={handleLogout}>Logout</Button>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
                        <IconButton onClick={toggleDrawer}><ChevronLeftIcon /></IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        {mainListItems}
                        <Divider sx={{ my: 1 }} />
                        {secondaryListItems}
                    </List>
                </Drawer>
                <Box component="main" sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                    padding: 0,
                    marginBottom: 1,
                    mt: 1
                }}>
                    <Toolbar />
                    <Card sx={{ margin: 2 }}>
                        <CardContent>
                            <Box sx={{ padding: 2 }}>

                                <TextField label={t('Estate Name')} value={estate.name} fullWidth InputProps={{ readOnly: true }} margin="normal" />
                                <TextField label={t('Estate Type Name')} value={estate.estateTypeName} fullWidth InputProps={{ readOnly: true }} margin="normal" />
                                <TextField label={t('Price Name')} value={estate.price} fullWidth InputProps={{ readOnly: true }} margin="normal" />
                                <TextField label={t('Status Name')} value={estate.statusName} fullWidth InputProps={{ readOnly: true }} margin="normal" />
                                <TextField label={t('Currency Type')} value={estate.currencyType} fullWidth InputProps={{ readOnly: true }} margin="normal" />
                                <TextField label={t('Start Date')} value={formatDate(estate.startDate)} fullWidth InputProps={{ readOnly: true }} margin="normal" />
                                <TextField label={t('End Date')} value={formatDate(estate.endDate)} fullWidth InputProps={{ readOnly: true }} margin="normal" />
                                <TextField label={t('Latitude')} value={estate.latitude} fullWidth InputProps={{ readOnly: true }} margin="normal" />
                                <TextField label={t('Longitude')} value={estate.longitude} fullWidth InputProps={{ readOnly: true }} margin="normal" />
                                {/* <TextField label="User ID" value={estate.userId} fullWidth InputProps={{ readOnly: true }} margin="normal" /> */}
                            </Box>
                            <Box sx={{ padding: 2 }}>
                                <MapContainer center={mapPosition} zoom={mapZoom} style={{ height: '400px', width: '100%' }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    {estate.latitude && estate.longitude && (
                                        <Marker position={[estate.latitude, estate.longitude]} icon={customIcon}>
                                            <Popup>{estate.name}</Popup>
                                        </Marker>
                                    )}
                                </MapContainer>
                            </Box>

                            <CardHeader title={t('Photos')} />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' ,mx:2 }}>
                                {photos.map((photo) => (
                                    <Card key={photo.id} sx={{ width: 200, height: 250 }}> {/* Sabit kart boyutu */}
                                        <CardMedia
                                            component="img"
                                            sx={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                            image={photo.imageUrl}
                                            alt={photo.name}
                                            onClick={() => handlePhotoClick(photo)}
                                        />

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
                        </CardContent>
                    </Card>
                </Box>


            </Box>
        </ThemeProvider>
    );
}
