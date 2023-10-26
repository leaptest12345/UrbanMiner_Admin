import { Button } from 'component';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { uploadBlogImages, uploadBlogVideo } from 'util/uploadProductImage';
import * as Yup from 'yup';
import { onValue, ref, update } from 'firebase/database';
import { database } from 'configs/firebaseConfig';
import { notify } from 'util/notify';
import { useHistory } from 'react-router-dom';
import ImageModal from 'components/ImageModal/ImageModal';

export default function BlogDetails(props) {
    const [blogDetail, setBlogDetail] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const { blogId } = props.location.state;
    const history = useHistory();

    useEffect(() => {
        getAllDetails();
    }, []);

    const getAllDetails = async () => {
        const subUserRef = ref(database, `/ADMIN/Blog/${blogId}`);
        onValue(subUserRef, (snapShot1) => {
            console.log('list ing', snapShot1.val());
            setBlogDetail(snapShot1.val());
        });
    };

    const formik = useFormik({
        validationSchema: Yup.object().shape({
            title: Yup.string().required('title is required'),
            description: Yup.string().required('description is required')
        }),
        enableReinitialize: true,
        initialValues: {
            title: blogDetail?.title,
            description: blogDetail?.description,
            images: blogDetail?.images ?? [],
            videoUrl: blogDetail?.video
        },
        onSubmit: async (values) => {
            try {
                console.log('inside');
                let uploadVideo = values.videoUrl;

                let uploadedImages = values.images;

                const isVideoUploaded =
                    typeof values.videoUrl === 'string' && values.videoUrl.startsWith('https://');

                if (!isVideoUploaded) {
                    uploadVideo = await uploadBlogVideo(values.videoUrl);
                }

                // Wait for all promises to resolve using Promise.all
                if (values.images) {
                    const imagePromises = values.images.map(async (item) => {
                        if (typeof item === 'string' && item.startsWith('https://')) {
                            return item;
                        } else {
                            return uploadBlogImages(item);
                        }
                    });

                    uploadedImages = await Promise.all(imagePromises);
                }

                const starCount = ref(database, `/ADMIN/Blog/${blogId}`);
                await update(starCount, {
                    title: values.title,
                    description: values.description,
                    images: uploadedImages,
                    updatedAt: new Date().toString(),
                    video: uploadVideo
                });
                notify('Blog has been successfully Updated!', 1);
                formik.resetForm();
                history.goBack();
            } catch (error) {
                console.log('error', error);
            }
        }
    });

    return (
        <section className='flex flex-col w-full gap-6'>
            <h1 className='text-4xl font-bold text-blue-800 -mt-10'>Edit Article</h1>
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
            <h4 className='font-bold text-yellow-950'>Add Images</h4>
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
                            <ImageModal
                                url={
                                    typeof item === 'string' && item.startsWith('https://')
                                        ? item
                                        : URL.createObjectURL(item)
                                }
                                className='h-32 w-32 rounded-lg'
                                imageStyle={{
                                    width: 120,
                                    height: 120
                                }}
                            />
                        );
                    })}
            </div>
            <h4 className='font-bold text-yellow-950'>Add Video</h4>
            <input
                type='file'
                onChange={(e) => {
                    formik.setFieldValue('videoUrl', e.target.files[0], false);
                    setSelectedVideo(e.target.files[0]);
                }}
                accept='video/*'
            />

            {selectedVideo != null ? (
                <video controls width='400' className='rounded-md'>
                    <source src={URL.createObjectURL(selectedVideo)} type='video/mp4' />
                    Your browser does not support the video tag.
                </video>
            ) : null}

            {formik.values.videoUrl && selectedVideo == null && (
                <video controls width='400' className='rounded-md'>
                    <source src={formik.values.videoUrl} type='video/mp4' />
                    Your browser does not support the video tag.
                </video>
            )}
            <Button
                isDisabled={formik.isSubmitting}
                title={'Update'}
                onClick={formik.handleSubmit}
            />
        </section>
    );
}
