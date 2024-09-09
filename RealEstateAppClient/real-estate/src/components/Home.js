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
import { Button, Card, CardContent, Grid, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { mainListItems, secondaryListItems } from './GeneralDashboard/listItems';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { PieChart } from '@mui/x-charts';
import axios from 'axios';
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

export default function Home() {
    const [open, setOpen] = React.useState(true);
    const [pieChartData, setPieChartData] = React.useState([]);
    const [statusPieChartData, setStatusPieChartData] = React.useState([]);
    const { t } = useTranslation();

    const [estateSummary, setEstateSummary] = React.useState({
        totalEstates: 10,
        villas: 5,
        flats: 3,
        lands: 2
    });

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

    // Fetch data for the PieChart
    React.useEffect(() => {
        const fetchEstateNumbers = async () => {
            try {
                const response = await axios.get('http://localhost:5275/api/Estate/GetAllEstateNumbers');
                const data = response.data;

                // Transform data to fit the PieChart's format
                const chartData = data.map((item, index) => ({
                    id: index,
                    value: item.count,
                    label: item.estateType,
                }));

                setPieChartData(chartData);

                const responseSecond = await axios.get('http://localhost:5275/api/Estate/GetAllEstateStatusNumbers');
                const dataSecond = responseSecond.data;

                // Transform data to fit the PieChart's format
                const chartDataSecond = dataSecond.map((item, index) => ({
                    id: index,
                    value: item.count,
                    label: item.estateType,
                }));

                setStatusPieChartData(chartDataSecond);


                setEstateSummary({
                    totalEstates: data.reduce((sum, item) => sum + item.count, 0),
                    villas: data.find(item => item.estateType === "Villa")?.count || 0,
                    flats: data.find(item => item.estateType === "Flat")?.count || 0,
                    lands: data.find(item => item.estateType === "Land")?.count || 0
                });
            } catch (error) {
                console.error("Error fetching estate numbers:", error);
            }
        };

        fetchEstateNumbers();
    }, []);

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
                        > {t('Home')}
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



                    <Grid container spacing={3} sx={{ mt: 1, mx: 2 }}>
                        <Grid item xs={5.7}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{t('Total Estate Number')}</Typography>
                                    <Typography variant="h4">{estateSummary.totalEstates}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={5.7}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{t('Villa')}</Typography>
                                    <Typography variant="h4">{estateSummary.villas}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} sx={{ mt: 1, mx: 2 }}>

                        <Grid item xs={5.7}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{t('Flat')}</Typography>
                                    <Typography variant="h4">{estateSummary.flats}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={5.7}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{t('Land')}</Typography>
                                    <Typography variant="h4">{estateSummary.lands}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container  spacing={3} sx={{ mt: 2,  mx: 2 }}>
                    <Grid item xs={12} md={5.7}>
                        <Card >
                            <CardContent>
                                <PieChart 
                                    series={[
                                        {
                                            data: pieChartData,
                                        },
                                    ]}
                                    width={550}
                                    height={200}
                                />
                            </CardContent>
                        </Card>
                        </Grid>
                        <Grid item xs={12} md={5.7}>

                        <Card >
                            <CardContent>
                                <PieChart 
                                    series={[
                                        {
                                            data: statusPieChartData,
                                        },
                                    ]}
                                    width={570}
                                    height={200}
                                />
                            </CardContent>
                        </Card>
                        </Grid>

                    </Grid>

                </Box>
            </Box>

        </ThemeProvider>
    );
}
