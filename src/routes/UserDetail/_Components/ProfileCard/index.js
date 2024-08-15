import moment from 'moment';

export const ProfileCard = ({ name, mobileNumber, Role, Status, createdAt }) => {
    return (
        <div className='rounded-md w-1/3 bg-white border border-slate-200 h-full'>
            <h6 className='font-bold text-base p-4 border-b'>Profile</h6>
            <div className='p-4 flex flex-col gap-6'>
                <div className='text-sm flex gap-8'>
                    <p className=' text-slate-400 flex-1'>Full Name</p>
                    <p className='text-black flex-1'>{name}</p>
                </div>
                <div className='text-sm flex gap-8'>
                    <p className=' text-slate-400 flex-1'>Mobile number</p>
                    <p className='text-black flex-1'>{mobileNumber}</p>
                </div>
                <div className='text-sm flex gap-8'>
                    <p className=' text-slate-400 flex-1'>Role</p>
                    <p className='text-black flex-1'>USER-{Role}</p>
                </div>
                <div className='text-sm flex gap-8'>
                    <p className=' text-slate-400 flex-1'>Status</p>
                    <p className='text-black flex-1'>{Status}</p>
                </div>
                {createdAt && (
                    <div className='text-sm flex gap-8'>
                        <p className=' text-slate-400 flex-1'>Created At</p>
                        <p className='text-black flex-1'>{moment(createdAt).fromNow()}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
