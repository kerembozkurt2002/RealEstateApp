import React from 'react';
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
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { mainListItems, secondaryListItems } from '../GeneralDashboard/listItems';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { jwtDecode } from 'jwt-decode';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import { Card } from '@mui/material';

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

export default function EstateList() {
  const [open, setOpen] = React.useState(true);
  const [estates, setEstates] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageSize, setPageSize] = React.useState(3);
  const [page, setPage] = React.useState(0);
  const [rowCount, setRowCount] = React.useState(0);

  const { t } = useTranslation();

  const navigate = useNavigate();

  const fetchEstates = async () => {
    setLoading(true);
    console.log(`Fetching estates for page: ${page + 1}, pageSize: ${pageSize}`);
    try {
      const response = await axios.get('http://localhost:5275/api/Estate/GetAllEstatesByServerSide', {
        params: {
          pageSize: pageSize,
          page: page + 1, // API pages might be 1-indexed
        },
      });
      const { data, totalCount } = response.data;
      setEstates(data);
      setRowCount(totalCount); // set the total row count for pagination
      console.log(`Fetched ${data.length} estates. Total count: ${totalCount}`);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const handleInfo = (id) => {
    navigate(`/EstateInfo/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/EstateEdit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5275/api/Estate/DeleteEstate?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        alert('Estate deleted successfully');
        fetchEstates();
      } else {
        alert('Failed to delete estate');
      }
    } catch (error) {
      console.error('Error deleting estate:', error);
    }
  };

  const formatDate = (dateInt) => {
    const dateStr = dateInt.toString();
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${month}/${day}/${year}`;
  };

  const columns = [
    { field: 'name', headerName: t('Estate Name'), width: 230 },
    { field: 'estateTypeName', headerName: t('Estate Type Name'), width: 160 },
    { field: 'statusName', headerName: t('Status Name'), width: 160 },
    { field: 'price', headerName: t('Price Name'), width: 160 },
    { field: 'currencyType', headerName: t('Currency Type'), width: 140 },
    {
      field: 'startDate',
      headerName: t('Start Date'),
      width: 200,
      renderCell: (params) => formatDate(params.value)
    },
    {
      field: 'endDate',
      headerName: t('End Date'),
      width: 200,
      renderCell: (params) => formatDate(params.value)
    },
    {
      field: 'actions',
      headerName: t('Actions'),
      width: 170,
      renderCell: (params) => {
        const role = localStorage.getItem('role');
        const userId = jwtDecode(localStorage.getItem('token'))["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        const estateUserId = params.row.userId;

        return (
          <>
            <IconButton
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleInfo(params.id)}
              aria-label="info"
            >
              <InfoIcon />
            </IconButton>

            {(role === 'Admin' || estateUserId === userId) && (
              <>
                <IconButton
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => handleEdit(params.id)}
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(params.id)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </>
        );
      },
    },
  ];

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
              {t('Estate List')}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Toolbar />
          <Card sx={{ width: '100%', margin: 'auto', mx:-4, mr:2}}>
            <div style={{ height: 560, width: '100%' }}>
              <DataGrid
                rows={estates}
                columns={columns}
                loading={loading}
                hideFooterPagination={true} // Sayfa navigasyonunu gizle
                hideFooter={true} // TÃ¼m footer'Ä± gizle (eÄŸer gerekliyse)
                components={{
                  Toolbar: GridToolbar,
                }}
              />
            </div>
            <div style={{ marginTop: '10px', marginBottom: '10px' ,  textAlign: 'center' }}>
              <Button
                disabled={page === 0}
                onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
              >
                {t('Previous')}
              </Button>
              <span style={{ margin: '0 15px' }}>
                {t('Page')} {page + 1} {t('of')} {Math.ceil(rowCount / pageSize)}
              </span>
              <Button
                disabled={(page + 1) * pageSize >= rowCount}
                onClick={() => setPage((prevPage) => Math.min(prevPage + 1, Math.ceil(rowCount / pageSize) - 1))}
              >
                {t('Next')}
              </Button>
            </div>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
