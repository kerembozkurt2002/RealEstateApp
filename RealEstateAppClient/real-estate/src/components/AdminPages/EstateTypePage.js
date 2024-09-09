import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { mainListItems, secondaryListItems } from '../GeneralDashboard/listItems';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import { Card, CardActions, CardContent, CardHeader } from '@mui/material';
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

export default function EstateTypePage() {
  const { t } = useTranslation();

  const [open, setOpen] = useState(true);
  const [estateTypeName, setEstateTypeName] = useState('');
  const [estateTypes, setEstateTypes] = useState([]);

  const decodedToken = jwtDecode(localStorage.getItem('token'));
  const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
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

  const handleAddEstateType = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }
    const response = await fetch('http://localhost:5275/api/EstateType/AddEstateType', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ estateTypeName })
    });

    if (response.ok) {
      alert('Estate type added successfully');
      setEstateTypeName('');
      fetchEstateTypes();
    } else {
      alert('Failed to add estate type');
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

  const handleDeleteEstateType = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }
    const response = await fetch(`http://localhost:5275/api/EstateType/DeleteEstateType?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      alert('Estate type deleted successfully');
      fetchEstateTypes();
    } else {
      alert('Failed to delete estate type');
    }
  };

  useEffect(() => {
    fetchEstateTypes();
  }, []);

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
              {t('Estate Type Page')}
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
          }}
        >
          <Toolbar />
          <Box sx={{ p: 3 }}>
            <Card>
              <CardHeader title={t('Add Estate Type')} />
              <CardContent>
                <Typography variant="h4" gutterBottom>


                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TextField
                    label={t('Estate Type Name')}
                    variant="outlined"
                    value={estateTypeName}
                    onChange={(e) => setEstateTypeName(e.target.value)}
                    sx={{ mr: 2 }}
                  />
                  <Button variant="contained" color="primary" onClick={handleAddEstateType}>
                    {t('Add Estate Type')}
                  </Button>
                </Box>
              </CardContent>
            </Card>


            <Card sx={{ mt: 4 }}>
              <CardHeader title={t('Estate Types')} />
              <CardContent>
            
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">            {t('Estate Type Name')}
                    </TableCell>
                    <TableCell align="right">            {t('Actions')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {estateTypes.map((type) => (
                    <TableRow
                      key={type.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {type.id}
                      </TableCell>
                      <TableCell align="right">{type.estateTypeName}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          color="error"

                          onClick={() => handleDeleteEstateType(type.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
