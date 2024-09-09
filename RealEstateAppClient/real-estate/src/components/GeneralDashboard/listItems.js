import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@mui/material';
import Flag from 'react-world-flags';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import AddIcon from '@mui/icons-material/Add';
import MapIcon from '@mui/icons-material/Map';


// ListItem bileşeni
const ListItem = ({ icon, text, path }) => {
  const navigate = useNavigate();
  return (
    <ListItemButton onClick={() => navigate(path)}>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
};

const LanguageButton = ({ changeLanguage }) => (
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
    <IconButton onClick={() => changeLanguage('tr')}>
      <Flag code="TR" style={{ width: '24px', height: '24px' }} />
    </IconButton>

    <IconButton onClick={() => changeLanguage('en')}>
      <Flag code="GB" style={{ width: '24px', height: '24px' }} />
    </IconButton>
  </div>
);

// MainListItems bileşeni
const MainListItemsComponent = () => {
  const { t, i18n } = useTranslation();

  return (
    <React.Fragment>
      <LanguageButton changeLanguage={i18n.changeLanguage} />
      <ListItem
        icon={<HomeIcon />}
        text={t('Home')}
        path="/Home"
      />
      {/* <ListItem
        icon={<DashboardIcon />}
        text={t('Token Page')}
        path="/TokenPage"
      />
      <ListItem
        icon={<DashboardIcon />}
        text={t('Template Page')}
        path="/Template"
      /> */}
      <ListItem
        icon={<AddIcon />}
        text={t('Estate Add Page')}
        path="/EstateAdd"
      />
      <ListItem
        icon={<ListIcon />}
        text={t('Estate List Page')}
        path="/EstateList"
      />
      <ListItem
        icon={<MapIcon />}
        text={t('Estate Map Page')}
        path="/EstateMap"
      />
    </React.Fragment>
  );
};

// SecondaryListItems bileşeni
const SecondaryListItemsComponent = () => {
  const { t } = useTranslation();
  const role = localStorage.getItem('role');

  if (role === 'Admin') {
    return (
      <React.Fragment>
        <ListItem
          icon={<DashboardIcon />}
          text={t('Currency Page')}
          path="/CurrencyPage"
        />
        <ListItem
          icon={<DashboardIcon />}
          text={t('Status Page')}
          path="/StatusPage"
        />
        <ListItem
          icon={<DashboardIcon />}
          text={t('Estate Type Page')}
          path="/EstateTypePage"
        />
      </React.Fragment>
    );
  } else {
    return <React.Fragment />;
  }
};

export const mainListItems = <MainListItemsComponent />;
export const secondaryListItems = <SecondaryListItemsComponent />;
