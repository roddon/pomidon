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

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
        maxWidth: '100vw',
    },
    maxWidth: '90%',
    width : '90%',
    // height : 250,
    margin : '30px',
   
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
    video_item.current.currentTime = 3

  }, [])

  const [hover, setHover] = useState(false);

  const changeHover = () => {
    setTimeout(() => {
      setHover(!hover);
    }, 200)
  };

  const  handleMouseHover = () => {
    // console.log('hover')
    setHover(true)
    video_item.current.currentTime = 0
    video_item.current.play()
  }

  const  handleMouseOut = () => {
    // console.log('out')
    setHover(false)
    video_item.current.pause();
    video_item.current.currentTime = 3
  }

  return (
    <StyleRoot className={classes.root}>
    <div
      className = {classes.animRoot} 
       >
          <video ref = {video_item}  muted loop 
          currentTime  = {1}
          onMouseEnter = {() => {handleMouseHover()}} 
          onMouseOut = {() => {handleMouseOut()}}
          className={[classes.animRoot, hover ? classes.zoomInAnim : classes.zoomOutAnim, classes.myVideo].join(' ')} >
            <source src={props.url} type="video/mp4"/>
          </video>
        
      {/* <Card  style={{backgroundColor : '#327699', width : '100%', height : '100%'}}>
        <CardActionArea style = {{display : 'flex', alignItems : 'flex-start', height : '100%'}}>
          <CardContent >
            <Typography variant="h6" style = {{textAlign : 'center', color : '#fff'}} color="#fff" component="p">
                {props.title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card> */}
    </div>
    </StyleRoot >
  );
}