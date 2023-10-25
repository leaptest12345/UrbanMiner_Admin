import { Button } from 'component';
import { useFormik } from 'formik';
import React from 'react';
import { uploadBlogImages } from 'util/uploadProductImage';
import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';
import { ref, set } from 'firebase/database';
import { database } from 'configs/firebaseConfig';
import { notify } from 'util/notify';

export default function Blog(props) {
    const formik = useFormik({
        validationSchema: Yup.object().shape({
            title: Yup.string().required('title is required'),
            description: Yup.string().required('description is required')
        }),
        initialValues: {
            title: '',
            description: '',
            images: []
        },
        onSubmit: async (values) => {
            try {
                const imagePromises = values.images.map(async (item) => {
                    return uploadBlogImages(item);
                });

                // Wait for all promises to resolve using Promise.all
                const uploadedImages = await Promise.all(imagePromises);

                // Do something with the results (uploadedImages)
                console.log('All images uploaded:', uploadedImages);

                const id = uuid().slice(0, 8);
                const starCount = ref(database, `/ADMIN/Blog/${id}`);
                await set(starCount, {
                    id: id,
                    title: values.title,
                    description: values.description,
                    images: uploadedImages,
                    createdAt: new Date().toString()
                });
                notify('Blog has been successfully created!', 1);
                formik.resetForm();
            } catch (error) {}
        }
    });

    return (
        <section className='flex flex-col w-full gap-6'>
            <h1 className='text-4xl font-bold text-blue-800 -mt-10'>Blog</h1>
            <div className='flex flex-col gap-2 w-full'>
                <h2 className='font-bold text-lg'>Title</h2>
                <input
                    value={formik.values.title}
                    onChange={(e) => formik.setFieldValue('title', e.target.value, false)}
                    className='h-12 px-2 text-base w-full bg-white outline-none border border-gray-300 rounded-md'
                />
                <h5 className='text-sm text-red-600'>{formik.errors.title}</h5>
            </div>
            <div className='flex flex-col gap-2 w-full'>
                <h2 className='font-bold text-lg'>Description</h2>
                <textarea
                    value={formik.values.description}
                    onChange={(e) => formik.setFieldValue('description', e.target.value, false)}
                    className='h-96 p-2 text-base w-full bg-white outline-none border border-gray-300 rounded-md'
                />
                <h5 className='text-sm text-red-600'>{formik.errors.description}</h5>
            </div>
            <input
                type='file'
                className='flex'
                multiple
                accept='image/*'
                onChange={(e) => formik.setFieldValue('images', [...e.target.files], false)}
            />
            <div className='flex flex-wrap gap-4'>
                {formik.values.images &&
                    formik.values?.images?.map((item) => {
                        return (
                            <img src={URL.createObjectURL(item)} className='h-32 w-32 rounded-lg' />
                        );
                    })}
            </div>
            <Button
                isDisabled={formik.isSubmitting}
                title={'Submit'}
                onClick={formik.handleSubmit}
            />
        </section>
    );
}
