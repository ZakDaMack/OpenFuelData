import { useState, cloneElement } from 'react';

import Toolbar from '@mui/material/Toolbar';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Button from '@mui/material/Button';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

export default function StationListToolbar(props) {
  const { sortKey, setSortKey, close } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const changeSort = (val) => { setSortKey(val); handleClose(); }
  const handleClick = (event) => setAnchorEl(event.currentTarget); 
  const handleClose = () => setAnchorEl(null);

  const sortList = [
    {text: 'Distance', value: 'distance'},
    {text: 'Super', value: 'e5'},
    {text: 'Petrol', value: 'e10'},
    {text: 'Diesel', value: 'b7'},
  ];

  return (
    <ElevationScroll>
      <AppBar position="absolute">
        <Toolbar>
          <Button variant="text"
            startIcon={<FilterAltIcon />}
            endIcon={<ExpandMoreIcon />}
            id="menu-button"
            aria-controls={open ? 'menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{textTransform: 'none', letterSpacing: 'normal', color: 'black'}}
          >
            { sortList.find(l =>l.value === sortKey).text }
          </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{zIndex: 3000}}
                MenuListProps={{
                    'aria-labelledby': 'menu-button',
                }}
            >
                {sortList.map(s => (<MenuItem key={s.value} onClick={()=>changeSort(s.value)}>{s.text}</MenuItem>))}
            </Menu>
            <Box sx={{flex: 1}}></Box>
            <IconButton onClick={close}>
              <CloseIcon />
            </IconButton>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
}

function ElevationScroll(props) {
    const { children } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: 0
    });
  
    return cloneElement(children, {
      sx: {
        borderBottom: trigger ? '1px solid black' : undefined
      }
    });
  }