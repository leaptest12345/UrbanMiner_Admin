import React, { useEffect, useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import {
    IconAgents,
    IconArticles,
    IconContacts,
    IconLogout,
    IconSubscription,
    IconTickets
} from 'assets/icons';
import { convertSlugToUrl } from 'resources/utilities';
import LogoComponent from './LogoComponent';
import Menu from './MenuComponent';
import MenuItem from './MenuItemComponent';
import { UserContext } from 'util/userContext';

const useStyles = createUseStyles({
    separator: {
        borderTop: ({ theme }) => `1px solid ${theme.color.lightGrayishBlue}`,
        marginTop: 16,
        marginBottom: 16,
        opacity: 0.06
    }
});

function SidebarComponent(props) {
    const { permission } = props;
    const [show, setShow] = useState(true);
    const { signOut1 } = React.useContext(UserContext);
    const [permissionStatus, setPermissionStatus] = useState('');
    const { push } = useHistory();
    const theme = useTheme();
    const classes = useStyles({ theme });
    const isMobile = window.innerWidth <= 1080;
    async function logout() {
        signOut1();
    }
    function onClick(slug, parameters = {}) {
        push(convertSlugToUrl(slug, parameters));
    }
    const data = JSON.parse(localStorage.getItem('permission'));

    const handler = (e) => setShow(e.matches);
    window.matchMedia('(min-width: 768px)').addEventListener('change', handler);
    useEffect(() => {
        setPermissionStatus(data);
    }, []);
    return show ? (
        <div>
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
                {permission?.user ? (
                    <MenuItem
                        id={SLUGS.UserList}
                        title='UserList'
                        icon={IconContacts}
                        onClick={() => onClick(SLUGS.UserList)}
                    />
                ) : null}
                {permission?.item ? (
                    <MenuItem
                        id={SLUGS.items}
                        title='Items'
                        icon={IconTickets}
                        onClick={() => onClick(SLUGS.items)}
                    />
                ) : null}
                {permission?.payment ? (
                    <MenuItem
                        id={SLUGS.PaymentList}
                        title='PaymentList'
                        icon={IconTickets}
                        onClick={() => onClick(SLUGS.PaymentList)}
                    />
                ) : null}

                {permission?.addAdmin ? (
                    <MenuItem
                        id={SLUGS.AddAdmin}
                        title='AddAdmin'
                        icon={IconAgents}
                        onClick={() => onClick(SLUGS.AddAdmin)}
                    />
                ) : null}

                {permission?.addProduct ? (
                    <MenuItem
                        id={SLUGS.AddProduct}
                        title='AddProduct'
                        icon={IconSubscription}
                        onClick={() => onClick(SLUGS.AddProduct)}
                    />
                ) : null}
                {permission?.feedback ? (
                    <MenuItem
                        id={SLUGS.FeedBack}
                        title='FeedBack'
                        icon={IconAgents}
                        onClick={() => onClick(SLUGS.FeedBack)}
                    />
                ) : null}

                {permission?.privacy ? (
                    <MenuItem
                        id={SLUGS.privacyPolicy}
                        title='PrivacyPolicy'
                        icon={IconSubscription}
                        onClick={() => onClick(SLUGS.privacyPolicy)}
                    />
                ) : null}
                {permission?.term ? (
                    <MenuItem
                        id={SLUGS.TermAndCondition}
                        title='TermAndCondition'
                        icon={IconArticles}
                        onClick={() => onClick(SLUGS.TermAndCondition)}
                    />
                ) : null}
                <div className={classes.separator}></div>
                <MenuItem id='logout' title='Logout' icon={IconLogout} onClick={logout} />
            </Menu>
        </div>
    ) : null;
}

export default SidebarComponent;
