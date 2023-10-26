import React, { useEffect, useState } from 'react';

import { database } from 'configs/firebaseConfig';
import { onValue, ref } from 'firebase/database';

export default function FeedBackList() {
    const [data, setData] = useState([]);

    useEffect(() => {
        getFeedbackList();
    }, []);

    const ReadMore = ({ children }) => {
        const text = children;
        const [isReadMore, setIsReadMore] = useState(true);
        const toggleReadMore = () => {
            setIsReadMore(!isReadMore);
        };
        return (
            <p className='text'>
                {isReadMore ? text?.slice(0, 150) : text}
                {
                    <span
                        style={{
                            color: 'red'
                        }}
                        onClick={toggleReadMore}
                        className='read'
                    >
                        {isReadMore ? '...read more' : ' show less'}
                    </span>
                }
            </p>
        );
    };

    const getFeedbackList = () => {
        try {
            const starCountRef = ref(database, '/ADMIN/FeedBack');
            onValue(starCountRef, (snapshot) => {
                if (Array.isArray(snapshot.val())) {
                    let newArr = snapshot.val();
                    setData(newArr);
                } else {
                    let arr = [];
                    Object.keys(snapshot.val()).map((key) => arr.push(snapshot.val()[key]));
                    setData(arr);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section>
            <div className='flex flex-1 items-center font-bold text-white text-base bg-veryDarkGrayishBlue p-4 rounded-t-md'>
                <h5 className='w-[100px]'>No</h5>
                <h5 className='flex-1'>Name</h5>
                <h5 className='flex-1'>Email</h5>
                <h5 className='flex-1'>Feedback</h5>
            </div>
            {data &&
                data.map((item, index) => (
                    <div
                        className={`flex border ${
                            index + 1 != data.length && 'border-b-0'
                        } flex-1 items-center font-bold text-black text-sm ${
                            index % 2 == 0 ? 'bg-lightGrayishBlue' : 'bg-white'
                        } p-4`}
                    >
                        <h5 className='w-[100px]'>{index + 1}</h5>
                        <h5 className='flex-1'>{item.name}</h5>
                        <h5 className='flex-1'>{item.email}</h5>
                        <div className='flex-1'>
                            <ReadMore>{item?.feedBack}</ReadMore>
                        </div>
                    </div>
                ))}
        </section>
    );
}
