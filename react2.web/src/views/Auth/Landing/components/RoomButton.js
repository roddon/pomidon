import React, {useState, useRef, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { bounce, fadeInDown, flipInX, zoomIn } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import Fade from 'react-reveal/Fade';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
        maxWidth: '100vw',
    },
    maxWidth: '300px !important',
    width : '90%',
    // height : 250,
    padding : 20,
    margin : '30px',
    '&:hover': {
      backgroundColor: '#00000010',
      cursor: 'pointer'
    },
  },
  animRoot : {
    // width : '100%',
    // height : '100%',
    display : 'flex',
    justifyContent : 'center',
    // boxShadow: '24px 21px 16px 8px rgba(32, 33, 36, .28)'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  zoomOutAnim : {
    transform: 'scale3d(1, 1, 1)',
    transition: theme.transitions.create('transform', {
      duration: 1225,
    }),
  },
  zoomInAnim : {
    transform: 'scale3d(1.05, 1.05, 1.05)',
    transition: theme.transitions.create('transform', {
      duration: 1225,
    })
  },
  myVideo : {
    // minWidth: '100%',
    // maxWidth: '100%',
    height : '30vh',
    borderRadius : 20,
    boxShadow: '24px 21px 16px 8px rgba(32, 33, 36, .28)'
  }
}));

export default function RoomButton(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const video_item = useRef(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
  }, [])

  const [hover, setHover] = useState(false);


  return (
    <StyleRoot className={classes.root}>
    <Fade
      bottom
      className = {classes.animRoot} 
       >
       <div>
         <div style = {{display : 'flex', alignItems : 'center', marginBottom : 20}}>
           <img src = {props.url} style = {{width : '32px', height : '32px', marginRight : 14}} />
           <h5>{props.title}</h5>
         </div>
         <div style = {{fontSize : 16}}>
           {props.text}
         </div>
       </div>
    </Fade>
    </StyleRoot >
  );
}