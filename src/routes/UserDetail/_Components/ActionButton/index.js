export const ActionButton = ({ title, onClick }) => {
    return (
        <div onClick={onClick} className='px-2 py-2 cursor-pointer rounded-md w-fit bg-white'>
            <p className='text-sm px-4'>{title}</p>
        </div>
    );
};
