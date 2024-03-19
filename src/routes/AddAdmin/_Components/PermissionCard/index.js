export const PermissionCard = ({ value, onChange, type, warningTypes }) => {
    return (
        <div className='flex items-center'>
            <input className='w-6 h-6' type='checkbox' checked={value} onChange={onChange} />
            <label className='pl-5 text-xl'>
                User can <label className='text-red-500 font-bold'>{warningTypes}</label> {type}
            </label>
        </div>
    );
};
