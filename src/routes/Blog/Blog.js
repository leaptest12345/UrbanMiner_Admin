import { Button } from 'component';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { uploadBlogImages, uploadBlogVideo } from 'util/uploadProductImage';
import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';
import { onValue, ref, set } from 'firebase/database';
import { database } from 'configs/firebaseConfig';
import { notify } from 'util/notify';
import { formateData } from 'util/formateData';
import { Delete, Edit } from '@material-ui/icons';
import SLUGS from 'resources/slugs';
import { convertSlugToUrl } from 'resources/utilities';
import { useHistory } from 'react-router-dom';
import ImageModal from 'components/ImageModal/ImageModal';

export default function Blog(props) {
    const [blogList, setBlogList] = useState([]);
    const [addArticle, setAddArticle] = useState(false);

    const { push } = useHistory();
    useEffect(() => {
        getAllDetails();
    }, []);

    function onClick(slug, data, parameters = {}) {
        push({
            pathname: convertSlugToUrl(slug, parameters),
            state: data
        });
    }

    const getAllDetails = async () => {
        const subUserRef = ref(database, `/ADMIN/Blog`);
        onValue(subUserRef, (snapShot1) => {
            setBlogList(formateData(snapShot1.val()));
        });
    };

    const formik = useFormik({
        validationSchema: Yup.object().shape({
            title: Yup.string().required('title is required'),
            description: Yup.string().required('description is required')
        }),
        initialValues: {
            title: '',
            description: '',
            images: [],
            videoUrl: ''
        },
        onSubmit: async (values) => {
            try {
                let uploadVideo = null;
                let uploadedImages = null;

                if (values.videoUrl) {
                    uploadVideo = await uploadBlogVideo(values.videoUrl);
                }

                if (values.images) {
                    const imagePromises = values.images.map(async (item) => {
                        return uploadBlogImages(item);
                    });
                    uploadedImages = await Promise.all(imagePromises);
                }

                const id = uuid().slice(0, 8);
                const starCount = ref(database, `/ADMIN/Blog/${id}`);
                await set(starCount, {
                    id: id,
                    title: values.title,
                    description: values.description,
                    images: uploadedImages,
                    createdAt: new Date().toString(),
                    video: uploadVideo
                });
                notify('Blog has been successfully created!', 1);
                formik.resetForm();
            } catch (error) {
                console.log('error', error);
            } finally {
                setAddArticle(false);
            }
        }
    });

    const handleDeleteBlog = (id) => {
        const starCount = ref(database, `/ADMIN/Blog/${id}`);
        set(starCount, null);
    };

    return (
        <section className='flex flex-col w-full gap-6'>
            {addArticle ? (
                <>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-4xl font-bold text-blue-800 -mt-10'>Articles</h1>
                        <Button title={'Cancel'} onClick={() => setAddArticle(false)} />
                    </div>
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
                            onChange={(e) =>
                                formik.setFieldValue('description', e.target.value, false)
                            }
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
                                        url={URL.createObjectURL(item)}
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
                        }}
                        accept='video/*'
                    />
                    {formik.values.videoUrl && (
                        <video controls width='400' className='rounded-md'>
                            <source
                                src={URL.createObjectURL(formik.values.videoUrl)}
                                type='video/mp4'
                            />
                            Your browser does not support the video tag.
                        </video>
                    )}
                    <Button
                        type='primary'
                        isDisabled={formik.isSubmitting}
                        title={'Submit'}
                        onClick={formik.handleSubmit}
                    />
                </>
            ) : (
                <>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-bold text-black text-2xl'>Article List</h1>
                        <Button title={'Add Article'} onClick={() => setAddArticle(true)} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        {blogList.map((item, index) => {
                            return (
                                <div className='bg-slate-500 rounded-md px-2 py-4 flex items-center justify-between'>
                                    <h4 className='font-medium text-lg text-white'>
                                        {index + 1}. {item.title}
                                    </h4>
                                    <div className='flex items-center'>
                                        <div
                                            onClick={() => {
                                                onClick(SLUGS.blogDetails, { blogId: item.id });
                                            }}
                                            className='cursor-pointer w-12 h-10 flex items-center justify-center'
                                        >
                                            <Edit className='text-white' />
                                        </div>
                                        <div
                                            onClick={() => handleDeleteBlog(item.id)}
                                            className='cursor-pointer w-12 h-10 flex items-center justify-center'
                                        >
                                            <Delete className='text-red-700' />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </section>
    );
}
