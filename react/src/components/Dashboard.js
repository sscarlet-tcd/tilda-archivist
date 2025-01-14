import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'
import { get } from 'lodash'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WhoAmI } from '../actions'
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StorageIcon from '@material-ui/icons/Storage';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import { Link } from 'react-router-dom';
import { reverse as url } from 'named-urls'
import routes from '../routes'
import Helmet from "react-helmet";
import { useDispatch } from 'react-redux'
import BreadcrumbBar from './BreadcrumbBar'
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" to="https://material-ui.com/">
        Archivist
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

const MainListItems = ({onExpand, user}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    onExpand()
    setOpen(!open);
  };

  return (
  <div>
    <ListItem button>
        <ListItemIcon>
          <Link to={url(routes.instruments.all)}>
            <QuestionAnswerIcon />
          </Link>
        </ListItemIcon>
      <Link to={url(routes.instruments.all)}>
        <ListItemText primary="Instruments" />
      </Link>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <Link to={url(routes.datasets.all)}>
          <StorageIcon />
        </Link>
      </ListItemIcon>
      <Link to={url(routes.datasets.all)} title={'Datasets'}>
        <ListItemText primary="Datasets" />
      </Link>
    </ListItem>
    { user && user.role === 'admin' && (
      <>
          <ListItem button onClick={handleClick}>
            <ListItemIcon>
              <SupervisedUserCircleIcon style={{ color: '37b34a' }} />
            </ListItemIcon>
            <ListItemText primary="Admin" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested}>
                <Link to={url(routes.admin.instruments.all)}>
                  <ListItemText primary="Instruments" />
                </Link>
              </ListItem>
              <ListItem button className={classes.nested}>
                <Link to={url(routes.admin.datasets.all)}>
                  <ListItemText primary="Datasets" />
                </Link>
              </ListItem>
              <ListItem button className={classes.nested}>
                <Link to={url(routes.admin.users.all)}>
                  <ListItemText primary="Users" />
                </Link>
              </ListItem>
              <ListItem button className={classes.nested}>
                <Link to={url(routes.admin.import)}>
                  <ListItemText primary="Import" />
                </Link>
              </ListItem>
              <ListItem button className={classes.nested}>
                <Link to={url(routes.admin.imports.all)}>
                  <ListItemText primary="DDI Imports" />
                </Link>
              </ListItem>
              <ListItem button className={classes.nested}>
                <Link to={url(routes.admin.instruments.exports)}>
                  <ListItemText primary="Instrument Exports" />
                </Link>
              </ListItem>
            </List>
          </Collapse>
      </>
    )}
  </div>
  )
}

export const Dashboard = (props)  => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { instrumentId } = props;
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const user = useSelector(state => get(state.auth, 'user'));

  useEffect(() => {
    dispatch(WhoAmI())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <Helmet>
          <meta charSet="utf-8" />
          <title>Archivist</title>
      </Helmet>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {props.title}
          </Typography>
          <IconButton color="inherit">
            <ExitToAppIcon onClick={()=>{ dispatch({type:'LOGOUT'}) }}/>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <img src="/logo.svg" alt="BigCo Inc. logo" style={{width: "51%"}}/>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <MainListItems onExpand={handleDrawerOpen} user={user} />
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth={false} maxHeight={false} className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <BreadcrumbBar instrumentId={instrumentId} />
              <Paper className={classes.paper}>
                {props.children}
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}
