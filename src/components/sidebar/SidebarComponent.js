import React, { useEffect, useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import {
    IconAgents,
    IconArticles,
    IconContacts,
    IconIdeas,
    IconLogout,
    IconOverview,
    IconSettings,
    IconSubscription,
    IconTickets
} from 'assets/icons';
import { convertSlugToUrl } from 'resources/utilities';
import LogoComponent from './LogoComponent';
import Menu from './MenuComponent';
import MenuItem from './MenuItemComponent';
import { UserContext } from 'util/userContext';
import { onValue, ref } from 'firebase/database';
import { database } from 'configs/firebaseConfig';

const useStyles = createUseStyles({
    separator: {
        borderTop: ({ theme }) => `1px solid ${theme.color.lightGrayishBlue}`,
        marginTop: 16,
        marginBottom: 16,
        opacity: 0.06
    }
});

function SidebarComponent(props) {
    // setPermissionStatus(localStorage.getItem('permission'))
   const {permission}=props
   console.log("location values",permission)

    const {signOut1} = React.useContext(UserContext);
    const [permissionStatus,setPermissionStatus]=useState('')
    const { push } = useHistory();
    const theme = useTheme();
    const classes = useStyles({ theme });
    const isMobile = window.innerWidth <= 1080;
    async function logout() {
        signOut1()
    }
    function onClick(slug, parameters = {}) {
        push(convertSlugToUrl(slug, parameters));
    }
    const data= JSON.parse(localStorage.getItem('permission'))
    console.log("permission detail",data)

//    const getUserPermissionDetail=async()=>{
//     try{
//        const id=await localStorage.getItem('userID')
//        if(id!=null)
//        {
//         const refDetail=ref(database,`USERS/${id}`)
//         onValue(refDetail,snapShot=>{
//             // console.log("permissionStatus",snapShot.val().role.PermissionStatus)
//             setPermissionStatus(snapShot.val().role.PermissionStatus)
//         })
//        }
//     }
    // catch(error)
    // {
    //     console.log(error)
    // }
//    }
    useEffect(()=>{
        // getUserPermissionDetail()
    setPermissionStatus(data)
    },[])
    return (
        <Menu isMobile={isMobile}>
            <div style={{ paddingTop: 30, paddingBottom: 30 }}>
                <LogoComponent />
            </div>
            <MenuItem
                id={SLUGS.dashboard}
                title='Dashboard'
                icon={IconSubscription}
                onClick={() => onClick(SLUGS.dashboard)}
            />
            {
                permission?.user?
                <MenuItem
                id={SLUGS.UserList}
                title='UserList'
                icon={IconContacts}
                onClick={() => onClick(SLUGS.UserList)}
            />:null
            }
                {
                permission?.item?
                <MenuItem
                id={SLUGS.items}
                title='Items'
                icon={IconTickets}
                onClick={() => onClick(SLUGS.items)}
            />:null
            }
                {
                permission?.payment?
                <MenuItem
                id={SLUGS.PaymentList}
                title='PaymentList'
                icon={IconTickets}
                onClick={() => onClick(SLUGS.PaymentList)}
            />:null
            }
             
            
           
           
            {
                permission?.addAdmin?
                <MenuItem
                id={SLUGS.AddAdmin}
                title='AddAdmin'
                icon={IconAgents}
                onClick={() => onClick(SLUGS.AddAdmin)}
            />:null
            }
          
            {
                permission?.addProduct?
                <MenuItem
                id={SLUGS.AddProduct}
                title='AddProduct'
                icon={IconSubscription}
                onClick={() => onClick(SLUGS.AddProduct)}
            />
                :null
            }
               {
                permission?.feedback?
                <MenuItem
                id={SLUGS.FeedBack}
                title='FeedBack'
                icon={IconAgents}
                onClick={() => onClick(SLUGS.FeedBack)}
            />:null
            }
            
              {
                permission?.privacy?
                <MenuItem
                id={SLUGS.privacyPolicy}
                title='PrivacyPolicy'
                icon={IconSubscription}
                onClick={() => onClick(SLUGS.privacyPolicy)}
            />:null
            }
            {
                permission?.term?
                <MenuItem
                id={SLUGS.TermAndCondition}
                title='TermAndCondition'
                icon={IconArticles}
                onClick={() => onClick(SLUGS.TermAndCondition)}
            />:null
            }
            <div className={classes.separator}></div>
            {/* <MenuItem
                id={SLUGS.settings}
                title='Settings'
                icon={IconSettings}
                onClick={() => onClick(SLUGS.settings)}
            /> */}
            <MenuItem id='logout' title='Logout' icon={IconLogout} onClick={logout} />
        </Menu>
    );
}

export default SidebarComponent;
