import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
        maxWidth: '100vw',
    },
    maxWidth: '95%',
    margin : '20px'
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
      duration: 1500,
    }),
  },
  zoomInAnim : {
    transform: 'scale3d(1.16, 1.16, 1.16)',
    transition: theme.transitions.create('transform', {
      duration: 1500,
    }),
  },
  opacityOutAnim : {
    opacity: 0.4,
    transition: theme.transitions.create('opacity', {
      duration: 1500,
    }),
  },
  opacityInAnim : {
    opacity: 0,
    transition: theme.transitions.create('opacity', {
      duration: 1500,
    }),
  }
}));

export default function BlogItem() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [hover, setHover] = useState(false);

  return (
    <Card className={classes.root}>
      {/* <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Shrimp and Chorizo Paella"
        subheader="September 14, 2016"
      /> */}
      {/* <CardMedia
        className={[classes.media, hover ? classes.zoomInAnim : classes.zoomOutAnim].join(' ')}
        image="/images/blogs/1.jpg"
        title="Paella dish"
        onMouseEnter = {() => setHover(true)}
        onMouseOut = {() => setHover(false)}
      /> */}
      <CardContent>
         <Card style = {{position : 'relative'}}>
         <CardMedia
            className={[classes.media, hover ? classes.zoomInAnim : classes.zoomOutAnim].join(' ')}
            image="/images/blogs/1.jpg"
            title="Paella dish"
        
          />
          <div style = {{position : 'absolute', top : 0, width : '100%', height : '100%', backgroundColor : '#000'}}
            className={hover ? classes.opacityInAnim : classes.opacityOutAnim}
            onMouseEnter = {() => setHover(true)}
            onMouseOut = {() => setHover(false)}
          ></div>
         </Card>
        
        <Typography variant="h6" color="textSecondary" component="p">
            Manager | August 12, 2020
        </Typography>
        <Typography variant="h2" color="textSecondary" component="p" style = {{marginTop : 6, marginBottom : 6}}>
            Hello, everyone
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          This impressive paella is a perfect party dish and a fun meal to cook together with your
          guests. Add 1 cup of frozen peas along with the mussels, if you like.
        </Typography>
      </CardContent>
      <CardActions disableSpacing style = {{float: 'right'}}>
        {/* <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton> */}
        <Typography variant="body2" color="textSecondary" component="p">
          Read more
        </Typography>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
            minutes.
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
            heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
            browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
            and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
            pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}