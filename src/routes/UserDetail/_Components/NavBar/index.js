export const NavBar = ({ navBarList, selectedItem, onSelect }) => {
    return (
        <div className='flex items-center gap-10'>
            {navBarList?.map((item, index) => (
                <div
                    onClick={() => onSelect && onSelect(item)}
                    key={`userDetail-navBarList-${item}-${index}`}
                    className={`${
                        selectedItem === item
                            ? 'text-black border-b-blue-500 '
                            : 'text-gray-600 border-b-blue-100'
                    } text-base w-fit pb-2 cursor-pointer border-b-4`}
                >
                    {item}
                </div>
            ))}
        </div>
    );
};
