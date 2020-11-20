import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles, useTheme } from '@material-ui/styles';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  useMediaQuery,
  Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {LoadingButton, PageLoading} from 'components'
import {config, _http, _sessionStorage,  _auth_check, _crypto, _localStorage} from 'helpers';
import { Facebook as FacebookIcon, Google as GoogleIcon } from 'icons';
import Header from './components/Header';
import BlogItem from './components/BlogItem';
import RoomButton from './components/RoomButton';
import Footer from './components/Footer';
import { bounce, fadeInDown, flipInX , fadeInDownBig, fadeInLeft, fadeInRight, rotateIn, zoomInDown} from 'react-animations';
import Radium, {StyleRoot} from 'radium';

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};

const styles = {
  buttonFadeLeftAnim: {
    animation: 'x 1s',
    animationName: Radium.keyframes(fadeInLeft, 'fadeInLeft'),
  },
  buttonFadeRightAnim: {
    animation: 'x 1s',
    animationName: Radium.keyframes(fadeInRight, 'fadeInRight'),
  },
}

const useStyles = makeStyles(theme => ({
  root: {
    // backgroundColor: theme.palette.background.default,
    backgroundColor: 'lightgrey',
    // backgroundColor: '#323232',
    // fontFamily : 'Source Sans Pro',
    // height: '100%',
    
  },
  grid: {
    // height: '100%'
    display: 'flex',
    justifyContent : 'center',
  },
  bannerContainer: {
    // [theme.breakpoints.down('md')]: {
    //   display: 'none'
    // },
    width : '100%'
  },
  banner: {
    height: '100%',
    position : 'relative'
  },
  bannerInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  bannerText: {
    color: theme.palette.white,
    fontWeight: 'bold',
    [theme.breakpoints.down('md')]: {
      fontSize: 'x-large',
    },
    fontSize: 'xxx-large',
    lineHeight : '85px',
    marginTop : '50px'
  },
  bio: {
    color: theme.palette.white
  },
  buttonContainer :{
    // [theme.breakpoints.down('lg')]: {
    //   marginTop : -230,
    // },
    // [theme.breakpoints.down('md')]: {
    //     marginTop : -180,
    // },
    // [theme.breakpoints.down('sm')]: {
    //   marginTop : 0,
    // },
    // marginTop : -280,
    zIndex : 100,
    display: 'flex',
    justifyContent : 'center',
  },
  blogContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent : 'center',
    alignItems : 'flex-start',
    paddingLeft : '20px',
    paddingRight : '20px',
  },
  blog: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent : 'center',
    alignItems : 'center',
  },
  blog_header : {
    padding: '40px',
    width : '100%'
  },
  myVideo : {
    // position: 'absolute',
    // top : 0,
    // right: 0,
    // bottom: '17vh',
    minWidth: '100%',
    maxWidth: '100%',
    zIndex : -1,
    // borderRadius: '150em / 10em',
    // borderBottomLeftRadius: 0,
    // borderBottomRightRadius: 0,
  },
  overlay : { 
    position: 'fixed', 
    overflowY: 'scroll',
    top: 0, right: 0, bottom: 0, left: 0, 
  },
  hidden : { 
    display : 'none'
  },
  welcomeTxt: {
    color : '#fff', 
    fontSize : '50px', 
    fontWeight : 'bold',
    [theme.breakpoints.down('sm')]: {
      fontSize : '13px'
    },
    animation: 'x 1s',
    animationName: Radium.keyframes(bounce, 'bounce'),
    transform: 'scale3d(1, 1, 1)',
    transition: theme.transitions.create('transform', {
      duration: 1225,
    }),
  },
  welcomeTxt1: {
    color : '#fff', 
    fontSize : '50px', 
    fontWeight : 'bold',
    [theme.breakpoints.down('sm')]: {
      fontSize : '13px'
    },
    animation: 'x 1s',
    animationName: Radium.keyframes(bounce, 'bounce'),
    transform: 'scale3d(1.5, 1.5, 1.5) translate(0, -10px);',
    transition: theme.transitions.create('transform', {
      duration: 1225,
    }),
  }

}));


function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

function useVideoSize(video_item) {
  const [size, setSize] = useState([0, 0]);
  useEffect(() => {
    function updateSize() {
      console.log('video size ', video_item.current.clientHeight)
      setSize([video_item.current.clientWidth, video_item.current.clientHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

const Landing = props => {
  const { history } = props;

  const classes = useStyles();


  const [stop, setStop] = useState(true);
  const [pageLoaded, setPageLoad] = useState(false);
  const [signin_status, setStatus] = useState(false);
  const [user, setUser] = useState(null);

  const roomButtons = [{
    title : 'COLLABORATION',
    url : "/icons/1-Engineering.png",
    text : 'We deem worthy of them, and the hatred of those who are accusing, and the righteous, But, in truth.'
  },
  {
    title : 'CONTROL ROOM',
    url : "/icons/3-Planning.png",
    text : 'We deem worthy of them, and the hatred of those who are accusing, and the righteous, But, in truth.'
  },
  {
    title : 'MOS',
    url : "/icons/9-Tool.png",
    text : 'We deem worthy of them, and the hatred of those who are accusing, and the righteous, But, in truth.'
  },
  {
    title : 'STOCK CONTROL',
    url : "/icons/24-Voltmeter.png",
    text : 'We deem worthy of them, and the hatred of those who are accusing, and the righteous, But, in truth.'
  },
  {
    title : 'KNOWLEDGE BASE',
    url : "/icons/27-Engineering.png",
    text : 'We deem worthy of them, and the hatred of those who are accusing, and the righteous, But, in truth.'
  },
  {
    title : 'MINING SYSTEMS',
    url : "/icons/19-Tool.png",
    text : 'We deem worthy of them, and the hatred of those who are accusing, and the righteous, But, in truth.'
  },
  {
    title : 'VEHICLE TRACKING',
    url : "/icons/14-Barrier.png",
    text : 'We deem worthy of them, and the hatred of those who are accusing, and the righteous, But, in truth.'
  },
  {
    title : 'CALL LOGGING',
    url : "/icons/16-Screw.png",
    text : 'We deem worthy of them, and the hatred of those who are accusing, and the righteous, But, in truth.'
  },
]


  const video_item = useRef(null);
  const page_item = useRef(null);
  let registered_user = _sessionStorage.getItem('user');


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: false
  });

  const requestAccess = () => {
    if(registered_user == null)
    {
      _sessionStorage.setItem('cur_module', 'signin');
      document.location.href = '/sign-in';
    }
  };
  // const [width, height] = useWindowSize();
  // const [video_width, video_height] = useVideoSize(video_item);
  ////////////////////////////
  const [scrollOpacity, setSrollOpacity] = useState(0);
  const [videoSize, setVideoSize] = useState([0, 0]);
  
  const pageScroll = (e) => {
    if(video_item.current != null)
    {
      let scroll_top = window.pageYOffset;
      setVideoSize([video_item.current.clientWidth, video_item.current.clientHeight]);
      let video_h = video_item.current.clientHeight;
      if( scroll_top < 40)
      {
        if(registered_user != null)
        {
          // setStatus(false);
        }
      }
      else if (scroll_top >= video_h * 5 / 6)
      {
        if(registered_user != null)
        {
          // setStatus(true);
        }
      }
    }
    
  };

  // let cur_scroll_top = 0;
  // const MouseWheelHandler = (deltaY) => {
  //   setVideoSize([video_item.current.clientWidth, video_item.current.clientHeight]);
  //   cur_scroll_top = cur_scroll_top + Math.sign(deltaY) * 30;
  //   let video_h = video_item.current.clientHeight;
  //   setSrollOpacity(cur_scroll_top / (video_h / 3))
  //   if( cur_scroll_top < 40)
  //   {
  //     setStatus(false);
  //     page_item.current.style.overflowY = "hidden";
  //   }
  //   else if (page_item.current.style.overflowY == "hidden" && cur_scroll_top >= video_h * 4 / 6)
  //   {
  //     setStatus(true);
  //     page_item.current.style.overflowY = "scroll";
  //     page_item.current.scrollTop = video_h * 5 / 6;
  //   }

  //   if(page_item.current.style.overflowY == "scroll" && page_item.current.scrollTop == 0)
  //   {
  //     cur_scroll_top = 0;
  //   }
  // }

  // var ts;
  // const onTouchStart = (e) => {
  //   ts = e.touches[0].clientY;
  // }
  
  // const onTouchMove = (e) => {
  //   var te = e.changedTouches[0].clientY;
  //   MouseWheelHandler((ts - te));
  // }

  // const onMouseWheel = (e) => {
  //   MouseWheelHandler(e.deltaY);
  // }

  
  const updateSize = () => {
    if(video_item.current != null)
    {
      console.log([video_item.current.clientWidth, video_item.current.clientHeight])
      setVideoSize([video_item.current.clientWidth, video_item.current.clientHeight]);
    }
   
  }

  const set_event_handlers = () => {
    // document.body.style.overflow = "hidden";
    // page_item.current.addEventListener("mousewheel", onMouseWheel, false);
    // window.addEventListener('touchstart', onTouchStart);
    // window.addEventListener('touchend', onTouchMove);
  }

  const get_auth_status =  () => {
    // let auth_status = await _auth_check.get_auth_status(document.location.href, document.location.search);

    // if(auth_status == 'not_registered')
    // {
    //     document.location.href = '/app_download';
    // }
    // else if (auth_status == 'not_found')
    // {
    //     document.location.href = '/register'; 
    // }
    // else if (auth_status == 'under_review')
    // {
    //     document.location.href = '/account_status';
    // }
    // else if (auth_status == 'blocked')
    // {
    //     document.location.href = '/account_status';
    // }
    // else if (auth_status == 'verified')
    // {
    //   setPageLoad(true);
    //   set_event_handlers();
    // }

    setPageLoad(true);
    if(registered_user != null)
    {
      setStatus(true);
    }
  }
  
  useEffect(() => {
      // video_item.current.play();
      updateSize();
      get_auth_status();
      page_item.current.scrollTop = 0;
      if(video_item.current != null)
      {
        video_item.current.addEventListener('resize', updateSize);
      }
      
      window.addEventListener('resize', updateSize);
      window.addEventListener('scroll', pageScroll, { passive: true });
      return () => 
        {
          if(video_item.current != null)
          {
            video_item.current.removeEventListener('resize', updateSize);
          }
          window.removeEventListener('resize', updateSize);
          window.removeEventListener('scroll', pageScroll);
          // window.removeEventListener('touchstart', onTouchStart);
          // window.removeEventListener('touchend', onTouchMove);
          // page_item.current.removeEventListener('mousewheel', onMouseWheel);
        }
  }, []);


  const onClickRoomBtn = (button_name) => {
     if(button_name == 'COLLABORATION')
     {
        _sessionStorage.setItem('cur_module', 'COLLABORATION');

        _http.doPost('collab/get_last_workspace', 
        { 
          user_id : registered_user.id
        }, 
        (data) => {
          if(data.status == false)
          {
            document.location.href = '/collab_dashboard';
          }
          else
          {
            document.location.href = '/collab_dashboard?ws=' + data.data.id;
          }
        },
        (err) => {
          console.log('Error occured', err);
          alert('Error occured');
        }
      );
     }
  }

  return (
        <div ref = {page_item} >
          <div className={classes.root}>
            <Grid
              className={classes.grid}
              container
            >
              <Grid
                className={classes.bannerContainer}
                item
                xl = {12}
                lg={12}
                md= {12}
                sm = {12}
              > 
                <div className={classes.banner}>
                  <Header onRequesAccess = {() => requestAccess()}/>
                  {
                    isMobile == false ? 
                    <video ref = {video_item} autoPlay muted loop playsInline 
                      className={classes.myVideo}
                        // style = {{clipPath: 'url(#wave)'}}
                        // style = {{clipPath: 'url(#wave)'}}
                      >
                      <source src="/videos/Video_3m.mp4" type="video/mp4"/>
                    </video>
                    :
                    <img src = '/images/system/Header_Mobile01.jpg' className={classes.myVideo}/>
                  }
                  {
                    isMobile == false ? 
                    <div 
                    style = {{
                       opacity : 1, position : 'absolute', zIndex : 10, top: 0, left : 0, 
                    width : videoSize[0], height : videoSize[1],
                    display : 'flex', justifyContent : 'center', alignItems : 'center',
                    backgroundImage: 'radial-gradient(black 20%, transparent 30%)',
                       backgroundSize: '3px 3px',
                      //  clipPath: 'url(#wave)'
                    }}>
                    </div>
                    :null
                  }
                  
                </div>
                <svg style = {{height: '10px'}}>
                  <clipPath id="wave" clipPathUnits="objectBoundingBox">
                    {/* <path class="st0" d="M1,0c0,0-0.3,0.1-0.5,0.1S0.3,0,0,0.1V1h1L1,0z"/> */}
                    <path class="st0" d="M0,0.96 C0.2,1.05 0.4,0.94 0.5,0.9 C0.7,0.8 0.74,0.87 0.88,0.94 C0.93,0.97 0.94,0.98 0.98,0.97 L1,0.96  L1,0 L0,0 Z"/> 
                  </clipPath>
                </svg>
              </Grid>
              {/* <h1 style = {{width : '100%', textAlign : 'center', margin : '40px'}}>UNDER DEVELOPMENT</h1> */}
              {
                signin_status == true ? 
                <Grid
                xl = {9}
                lg={9}
                md= {10}
                sm = {12}
                  container
                  className={classes.buttonContainer}
                >
                  {
                    roomButtons.map((btn, index) => 
                          <Grid
                            key = {index}
                            className={classes.blog}
                            item
                            lg={3}
                            md= {3}
                            sm = {12}
                            xs={12}
                            onClick = {() => onClickRoomBtn(btn.title)}
                          >
                            <StyleRoot style = {{width : '100%'}}>
                              <div style = {[
                                // [2,3,6,7].includes(index) ?
                                // styles.buttonFadeRightAnim  : styles.buttonFadeLeftAnim,                      
                                {width : '100%', display: 'flex', justifyContent : 'center'}]}>
                                <RoomButton url =  {btn.url} title = {btn.title} text = {btn.text}/>
                              </div>
                            </StyleRoot>
                          </Grid>
                      )
                    }
                </Grid>
                : null
              }
              
              <div className={classes.blog_header}>
                <div >
                  <Typography variant="h4" >   Latest news </Typography>
                </div>
                <Typography variant="h1" > From our employees </Typography>
              </div>
              <Grid
                container
                className={classes.blogContainer}
              >
                {
                  [1,2,3].map((item, index) => 
                    <Grid
                    key = {index}
                    className={classes.blog}
                    item
                    lg={4}
                    md= {6}
                    sm = {12}
                    xs={12}
                  >
                      <BlogItem />
                      </Grid>
                    )
                  }
              </Grid>
            </Grid>
            <Footer />
          </div>
        </div>
    
  );
};

Landing.propTypes = {
  history: PropTypes.object
};

export default withRouter(Landing);
