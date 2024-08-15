export const InfoCard = ({ title, value, onClick }) => {
    return (
        <div
            onClick={onClick}
            className='p-6 w-full cursor-pointer flex flex-col items-center gap-2 bg-blue-50 rounded-md border border-slate-100'
        >
            <p>{title}</p>
            <p>{value}</p>
        </div>
    );
};
