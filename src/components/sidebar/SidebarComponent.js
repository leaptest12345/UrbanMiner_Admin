import React, { useEffect, useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import { convertSlugToUrl } from 'resources/utilities';
import LogoComponent from './LogoComponent';
import Menu from './MenuComponent';
import MenuItem from './MenuItemComponent';
import { UserContext } from 'util/userContext';
import {
    AdminPanelSettingsTwoTone,
    Article,
    Dashboard,
    DataUsageRounded,
    Feedback,
    Logout,
    Payment,
    PictureAsPdf,
    PriceCheckTwoTone,
    PrivacyTipSharp,
    ProductionQuantityLimitsSharp,
    ProductionQuantityLimitsTwoTone,
    TerminalSharp,
    VerifiedUserSharp
} from '@mui/icons-material';
import { Avatar, List, ListItemSecondaryAction } from '@mui/material';

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
    // window.matchMedia('(min-width: 768px)').addEventListener('change', handler);

    useEffect(() => {
        setPermissionStatus(data);
    }, []);

    return (
        <div className=' z-50'>
            <Menu isMobile={isMobile}>
                <div style={{ paddingTop: 30, paddingBottom: 30 }}>
                    <LogoComponent />
                </div>
                <div className='flex flex-1 flex-col gap-2'>
                    <MenuItem
                        id={SLUGS.dashboard}
                        title='Dashboard'
                        icon={<Dashboard className='text-white' />}
                        onClick={() => onClick(SLUGS.dashboard)}
                    />
                    {permission?.user ? (
                        <MenuItem
                            id={SLUGS.UserList}
                            title='UserList'
                            icon={<DataUsageRounded className='text-white' />}
                            onClick={() => onClick(SLUGS.UserList)}
                        />
                    ) : null}
                    {permission?.item ? (
                        <MenuItem
                            id={SLUGS.items}
                            title='Items'
                            icon={<ProductionQuantityLimitsTwoTone className='text-white' />}
                            onClick={() => onClick(SLUGS.items)}
                        />
                    ) : null}
                    <MenuItem
                        id={SLUGS.blog}
                        title='Articles'
                        icon={<Article className='text-white' />}
                        onClick={() => onClick(SLUGS.blog)}
                    />
                    {permission?.payment ? (
                        <MenuItem
                            id={SLUGS.PaymentList}
                            title='PaymentList'
                            icon={<Payment className='text-white' />}
                            onClick={() => onClick(SLUGS.PaymentList)}
                        />
                    ) : null}

                    {permission?.addAdmin ? (
                        <MenuItem
                            id={SLUGS.AdminList}
                            title='AdminList'
                            icon={<AdminPanelSettingsTwoTone className='text-white' />}
                            onClick={() => onClick(SLUGS.AdminList)}
                        />
                    ) : null}

                    {permission?.addProduct ? (
                        <MenuItem
                            id={SLUGS.AddProduct}
                            title='AddProduct'
                            icon={<ProductionQuantityLimitsSharp className='text-white' />}
                            onClick={() => onClick(SLUGS.AddProduct)}
                        />
                    ) : null}
                    {permission?.feedback ? (
                        <MenuItem
                            id={SLUGS.FeedBack}
                            title='FeedBack'
                            icon={<Feedback className='text-white' />}
                            onClick={() => onClick(SLUGS.FeedBack)}
                        />
                    ) : null}
                    {permission?.priceSheet ? (
                        <MenuItem
                            id={SLUGS.PriceSheet}
                            title='PriceSheet'
                            icon={<PriceCheckTwoTone className='text-white' />}
                            onClick={() => onClick(SLUGS.PriceSheet)}
                        />
                    ) : null}
                    {permission?.pdfDetail ? (
                        <MenuItem
                            id={SLUGS.PdfDetail}
                            title='PdfDetail'
                            icon={<PictureAsPdf className='text-white' />}
                            onClick={() => onClick(SLUGS.PdfDetail)}
                        />
                    ) : null}

                    {permission?.privacy ? (
                        <MenuItem
                            id={SLUGS.privacyPolicy}
                            title='PrivacyPolicy'
                            icon={<PrivacyTipSharp className='text-white' />}
                            onClick={() => onClick(SLUGS.privacyPolicy)}
                        />
                    ) : null}
                    {permission?.term ? (
                        <MenuItem
                            id={SLUGS.TermAndCondition}
                            title='TermAndCondition'
                            icon={<TerminalSharp className='text-white' />}
                            onClick={() => onClick(SLUGS.TermAndCondition)}
                        />
                    ) : null}
                    <div className={classes.separator}></div>
                    <MenuItem
                        id='logout'
                        title='Logout'
                        icon={<Logout className='text-white' />}
                        onClick={logout}
                    />
                </div>
            </Menu>
        </div>
    );
}

export default SidebarComponent;
