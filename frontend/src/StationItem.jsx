import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import { blue, yellow, green } from '@mui/material/colors';

import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import styled from '@emotion/styled';

export default function StationItem(props) {
    const { distance, company, address, postcode, b7, e5, e10 } = props.company;
    const formattedDistance = distance.toLocaleString('en-GB', { maximumFractionDigits: 0 });

    const getValue = (val) => val ? `${(Math.round(val * 10) / 10).toFixed(1)} p/L` : 'N/A';

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', pb: 1 }}>
                <Typography variant="h5">{company}</Typography>
                <Typography variant="subtitle" sx={{ color: 'green', pb: 0.5 }}>{formattedDistance} metres away</Typography>
            </Box>
            <Typography variant="subtitle">{address}, {postcode}</Typography>
            <List>
                <ListItem disablePadding>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: blue[500] }} variant="rounded">
                            <LocalGasStationIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <PopupText primary="Super (E5)" secondary={getValue(e5)} />
                </ListItem>
                <ListItem disablePadding>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: green[500] }} variant="rounded">
                            <LocalGasStationIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <PopupText primary="Petrol (E10)" secondary={getValue(e10)} />
                </ListItem>
                <ListItem disablePadding>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: yellow[600] }} variant="rounded">
                            <LocalGasStationIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <PopupText primary="Diesel (B7)" secondary={getValue(b7)} />
                </ListItem>
            </List>
        </Box>
    );
}

const PopupText = styled(ListItemText)({
    '& .MuiListItemText-secondary': {
        margin: 0
    }
});