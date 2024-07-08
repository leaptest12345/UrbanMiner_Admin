import React, { useEffect, useState } from 'react';
import { Input } from 'components/Input';
import { Button } from 'component';
import { generateOne } from 'util/referralCode';

import * as Firebase from '../../Firebase';

export const ReferralCode = () => {
    const [generatedReferralCode, setGeneratedReferralCode] = useState();
    const [pattern, setPattern] = useState('####-#######-##');
    const [prefix, setPrefix] = useState('urbanminer');
    const [postfix, setPostfix] = useState(`${new Date().getFullYear()}`);

    useEffect(() => {
        getInitialData();
    }, []);

    const getInitialData = async () => {
        const data = await Firebase.getReferralCode();
        setGeneratedReferralCode(data?.code);
    };

    return (
        <div className='flex flex-col gap-10'>
            <div className='flex flex-col gap-4'>
                <div className='text-2xl font-bold text-black'>Change pattern for referralCode</div>
                <div className='flex flex-row gap-4'>
                    <Input
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        label={'pattern for code'}
                    />
                    <Input
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value)}
                        label={'Prefix'}
                    />
                    <Input
                        value={postfix}
                        onChange={(e) => setPostfix(e.target.value)}
                        label={'Postfix'}
                    />
                </div>
            </div>
            <div className='flex flex-col gap-6'>
                <div className='text-2xl font-bold text-black'>Change referralCode</div>
                <Input
                    value={generatedReferralCode}
                    onChange={(value) => setGeneratedReferralCode(value)}
                    label={'Referral Code'}
                    placeholder={'Enter Referral code'}
                />
            </div>
            <div className='flex items-center gap-10'>
                <Button
                    title={'Generate Code'}
                    onClick={() => {
                        const newReferralCode = generateOne({
                            charset:
                                '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
                            pattern: pattern,
                            postfix: postfix,
                            prefix: prefix
                        });
                        setGeneratedReferralCode(newReferralCode);
                    }}
                />
                <Button
                    title={'Save'}
                    onClick={async () => {
                        if (generatedReferralCode) {
                            await Firebase.setReferralCode(generatedReferralCode);
                        }
                    }}
                />
            </div>
        </div>
    );
};
