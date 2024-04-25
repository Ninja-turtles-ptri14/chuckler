import React, {useEffect, useState} from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../stylesheets/main.css';
import homeIcon from '../images/home.png';
import profileIcon from '../images/profileIcon.png';
import chatIcon from '../images/chatIcon.png';
import logout from '../images/logout1.png';
import Tabs from "./Tabs.jsx";
import TabNavItem from "./Components/TabNavItem.jsx";
import Axios from 'axios';

    
export default function Main({userData}) {
    const [activeTab, setActiveTab] = useState("tab1");
    const handleLogOut = async () => {
        Axios.get('/api/user/logout');
		const response = Axios.post('/api/user/logout', { username: userData.username })
	}; 
    return (
        <div className='background'>
        <div className="main-container">
           <div className="navigation">
            <a className="button" href="/" onClick={handleLogOut}>
                <img src={logout} style={{width:'30px'}}/>
                <div className="logout">LOGOUT</div>
            </a>
           </div>
                <Tabs userData={userData} activeTab={activeTab}/>
            <ul className="nav">
                <TabNavItem title={homeIcon} id="tab1" activeTab={activeTab} setActiveTab={setActiveTab}/>
                <TabNavItem title={chatIcon} id="tab2" activeTab={activeTab} setActiveTab={setActiveTab}/>
                <TabNavItem title={profileIcon} id="tab3" activeTab={activeTab} setActiveTab={setActiveTab}/>
            </ul>
        </div>
    </div>
       
    )
}















