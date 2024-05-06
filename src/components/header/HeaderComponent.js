import React, { useContext, useEffect, useState } from 'react';
import { string } from 'prop-types';
import { useHistory } from 'react-router-dom';
import { SidebarContext } from 'hooks/useSidebar';
import SLUGS from 'resources/slugs';
import { onValue, ref } from 'firebase/database';
import { database } from 'configs/firebaseConfig';

function HeaderComponent() {
    const { push } = useHistory();
    const { currentItem } = useContext(SidebarContext);
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState('');
    let title;

    switch (true) {
        case currentItem === SLUGS.dashboard:
            title = 'Dashboard';
            break;
        case currentItem === SLUGS.items:
            title = 'items';
            break;
        case currentItem === SLUGS.UserList:
            title = 'UserList';
            break;
        case currentItem === SLUGS.AdminList:
            title = 'AdminList';
            break;
        case currentItem === SLUGS.AddProduct:
            title = 'AddProduct';
            break;
        case currentItem === SLUGS.UserDetail:
            title = 'UserDetail';
            break;
        case currentItem === SLUGS.ViewDraft:
            title = 'ViewDraft';
            break;
        case currentItem === SLUGS.PaymentList:
            title = 'PaymentList';
            break;
        case currentItem === SLUGS.FeedBack:
            title = 'FeedBack';
            break;
        case currentItem === SLUGS.TermAndCondition:
            title = 'TermAndCondition';
            break;
        case currentItem === SLUGS.privacyPolicy:
            title = 'privacyPolicy';
            break;
        case currentItem === SLUGS.settings:
            title = 'Settings';
            break;
        case currentItem === SLUGS.PdfDetail:
            title = 'PdfDetail';
            break;
        case currentItem === SLUGS.PriceSheet:
            title = 'PriceSheet';
            break;
        case currentItem === SLUGS.blog:
            title = 'Articles';
            break;
        case currentItem === SLUGS.blogDetails:
            title = 'Article Details';
            break;
        case currentItem === SLUGS.UserPermission:
            title = 'Permission';
            break;
        case currentItem === SLUGS.AddAdmin:
            title = 'Create Admin';
            break;
        case currentItem === SLUGS.categoryImages:
            title = 'Category Images';
            break;
        case currentItem === SLUGS.EditCategory:
            title = 'Edit Category';
            break;
        case currentItem === SLUGS.ContactDetail:
            title = 'Contact Detail';
            break;
        default:
            title = '';
    }

    useEffect(() => {
        getUserDetail();
    }, []);

    const getUserDetail = async () => {
        try {
            const userID = await localStorage.getItem('userID');
            if (userID != null) {
                const result = ref(database, `/USERS/${userID}`);
                onValue(result, (snapshot) => {
                    const data = snapshot.val();
                    setName(data?.firstName + ' ' + data?.lastName);
                    setPhoto(data?.photo ?? 'https://www.yttags.com/portraits/women/15.jpg');
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className='bg-white max-xl:hidden max-lg:visible shadow-md fixed pr-[350px] max-md:pr-[100px] min-w-full z-50 flex px-10 py-3 items-center justify-between'>
            {/* <ArrowBackIosNew className='text-white' /> */}
            <span className='text-black font-bold text-xl'>{title}</span>
            <div className='flex items-center gap-2'>
                {photo && <img src={photo} className='w-10 h-10 -ml-2 rounded-full' />}
                <p className='text-black text-base font-bold'>{name}</p>
            </div>
        </div>
    );
}

HeaderComponent.propTypes = {
    title: string
};

export default HeaderComponent;
