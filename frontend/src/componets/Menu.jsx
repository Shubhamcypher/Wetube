import React from 'react'


import styled from 'styled-components'

import channel_logo from '../img/channel_logo.png'

import HomeIcon from '@mui/icons-material/Home';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import HistoryIcon from '@mui/icons-material/History';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import PersonIcon from '@mui/icons-material/Person';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SettingsIcon from '@mui/icons-material/Settings';
import FlagIcon from '@mui/icons-material/Flag';
import HelpIcon from '@mui/icons-material/Help';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import NightlightIcon from '@mui/icons-material/Nightlight';

import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';






const Container = styled.div`
    flex: 1;
    background-color: ${({theme})=>theme.bgLighter};
    height:100%;
    color:${({theme})=>theme.text};
    font-size:14px;
    position: sticky;
    top:0;
    
`;


const Wrapper = styled.div`
    padding: 18px 26px;
    display:flex;
    flex-direction:column;
   
`;


const Logo = styled.div`
    display:flex;
    align-items:center;
    gap:5px;
    font-weight:bold;
    margin-bottom:25px;
`;
const Img = styled.img`
    height:25px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 0px;

  &:hover {
    background-color: ${({ theme }) => theme.soft};
    border-radius : 7.5px;
    padding: 7.5px ;
  }
`;


const Hr = styled.hr`
    margin:15px 0px;
    border:0.5px solid ${({theme})=>theme.soft};;
`

const Login = styled.div`
    
`

const Button = styled.button`
    padding: 5px 15px;
    background-color: transparent ;
    color: #3ae;
    border: 1px solid #3ae;
    border-radius:3px;
    font-weight: 500;
    margin-top:10px;
    cursor: pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:3px;

`

const Title = styled.h2`
    font-size:14px;
    font-weight:500;
    color:${({theme})=>theme.text};
    margin-bottom:20px;
`


const Menu = ({darkMode, setDarkMode}) => {
    const {currentUser} = useSelector(state=>state.user)
  return (
    <Container>
        <Wrapper>

        {/* Todo: Need to replace a tag with Link */}
        <Link to="/" style={{textDecoration:"none", color:"inherit"}}>  
          <Logo>
            <Img src={channel_logo} />
            WeTube
          </Logo>
        </Link>
            
        <Link to="/" style={{textDecoration:"none", color:"inherit"}}>
            <Item>
                <HomeIcon/>
                Home
            </Item>
        </Link>
            
            <Link to='/trending' style={{textDecoration:"none", color:"inherit"}}>
            <Item>
                <TravelExploreIcon/>
                Explore
            </Item>
            </Link>
            <Link to='/subscriptions' style={{textDecoration:"none", color:"inherit"}}>
            <Item>
                <SubscriptionsIcon/>
                Subscriptions
            </Item>
            </Link>
            <Hr/>
            <Item>
                <VideoLibraryIcon/>
                Library
            </Item>
            <Item>
                <HistoryIcon/>
                History
            </Item>
            <Hr/>
            {!currentUser &&
            <>
            <Login>Sign in to like videos, comment  and subscribe.
                <Link to='/signin' style={{textDecoration:"none"}}>
                    <Button>
                        <PersonIcon/> Sign in
                    </Button>
                </Link>
            </Login>
            <Hr/>
            </>}
            

            <Title>FEATURED</Title>

            <Item>
                <LibraryMusicIcon/>
                Music
            </Item>
            <Item>
                <SportsBasketballIcon/>
                Sports
            </Item>
            <Item>
                <SportsEsportsIcon/>
                Gaming
            </Item>
            <Item>
                <MovieCreationIcon/>
                Movies
            </Item>
            <Item>
               <NewspaperIcon/>
                News
            </Item>
            <Item>
                <LiveTvIcon/>
                Live
            </Item>
            <Hr/>
            <Item>
                <SettingsIcon/>
                Settings
            </Item>
            <Item>
                <FlagIcon/>
                Report
            </Item>
            <Item>    
                <HelpIcon/>
                Help
            </Item>
            <Item onClick={()=> setDarkMode(!darkMode)}>
                {darkMode?<ModeNightIcon/>:<NightlightIcon/>}
                {darkMode?"Light":"Dark"} Mode
            </Item>
        </Wrapper>
    </Container>
  )
}

export default Menu