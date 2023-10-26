import React from 'react';
import { useSidebar } from 'hooks/useSidebar';

function MenuItemComponent({ children, icon, id, items = [], level = 1, onClick, title }) {
    const isCollapsible = children && children.length > 0;
    const { isExpanded, isActive, onItemClick } = useSidebar({
        isCollapsible,
        item: id,
        items
    });
    // const classNameColumn = isActive ? classes.leftBar : '';
    // const iconColor = isActive ? theme.color.paleBlue : theme.color.grayishBlue2;

    function onItemClicked(e) {
        if (onClick) {
            onClick(e);
        }
        onItemClick();
    }

    return (
        <div
            onClick={onItemClicked}
            className={`flex px-6 py-1.5 mb-1 ${
                isActive ? 'bg-slate-600' : ''
            } hover:bg-slate-600 rounded-sm cursor-pointer items-center gap-4`}
        >
            {icon}
            <p className='text-lg font-medium text-white'>{title}</p>
        </div>
    );
}

export default MenuItemComponent;
