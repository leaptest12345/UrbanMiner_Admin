import ImageModal from 'components/ImageModal/ImageModal';
import { getItemDetail } from '../../Firebase/contact/index';
import { useEffect, useState } from 'react';

export const ViewDraft = (props) => {
    const { userId, id, type } = props.location.state;

    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getInitialDetails();
    }, [userId, id, type]);

    const getInitialDetails = async () => {
        try {
            setLoading(true);
            const detail = await getItemDetail(userId, id, type);
            const data = Object.values(detail);

            setAllItems(data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-wrap items-center gap-4 '>
            {allItems.length === 0 && !loading && (
                <div className='flex items-center justify-center flex-1'>
                    <div className='text-2xl font-bold'>No Items Found</div>
                </div>
            )}
            {type == 'SALES' &&
                allItems?.map((item, index) => {
                    return (
                        <div
                            className='bg-slate-300 flex flex-row justify-between gap-10 min-w-[250px]  rounded-md p-4 border border-green-600'
                            key={index}
                        >
                            <div>
                                <div className='text-xl font-bold'>
                                    ProductName: {item?.productName}
                                </div>
                                <div className='text-base'>Price: {item?.price}</div>
                                <div className='text-base'>Quantity: {item?.quantity}</div>
                                <div className='text-base'>Um: {item?.um}</div>
                            </div>
                        </div>
                    );
                })}

            {type != 'SALES' &&
                allItems.map((item, index) => {
                    return (
                        <div
                            className='bg-slate-300 flex flex-row justify-between gap-10 min-w-[250px]  rounded-md p-4 border border-green-600'
                            key={index}
                        >
                            <div>
                                <div className='text-xl font-bold'>
                                    ProductName: {item.productName}
                                </div>
                                <div className='text-base'>GrossWeight: {item.grossWeight}</div>
                                <div className='text-base'>TareWeight: {item.tareWeight}</div>
                            </div>
                            {item?.photo && (
                                <ImageModal
                                    url={item?.photo}
                                    imageStyle={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
        </div>
    );
};
