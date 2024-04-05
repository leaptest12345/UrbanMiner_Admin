import React, { useState, useEffect, Fragment } from 'react';
import * as tf from '@tensorflow/tfjs';
import { DropzoneArea } from 'material-ui-dropzone';
import { Backdrop, Button, Chip, CircularProgress, Grid, Stack } from '@mui/material';
import { uploadWheelImage } from 'util/uploadProductImage';
import { get, ref, set } from 'firebase/database';
import { database } from 'configs';
import { v4 as uuid } from 'uuid';
import { formateData } from 'util/formateData';

function Ml() {
    const [model, setModel] = useState(null);
    const [classLabels, setClassLabels] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confidence, setConfidence] = useState(null);
    const [predictedClass, setPredictedClass] = useState(null);
    const [files, setFiles] = useState([]);
    const [predictedLabel, setPredictedLabel] = useState(null);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const loadModel = async () => {
            try {
                const starCount = ref(database, `/Wheel/`);
                const snapShot = await get(starCount);
                const data = formateData(snapShot.val());

                console.log('vales', data);
                setImages(data);

                const model_url = 'tfjs/model/model.json';

                const model = await tf.loadLayersModel(model_url, {
                    strict: false
                });

                console.log('loaded');
                setModel(model);
            } catch (e) {
                console.log(e);
            }
        };

        const getClassLabels = async () => {
            const labelsUrl = 'tfjs/model/metadata.json';

            const res = await fetch(labelsUrl);

            const data = await res.json();
            console.log('details', data.labels);

            setClassLabels(data.labels);
        };

        loadModel();
        getClassLabels();
    }, []);

    const readImageFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);

            reader.readAsDataURL(file);
        });
    };

    const createHTMLImageElement = (imageSrc) => {
        return new Promise((resolve) => {
            const img = new Image();

            img.onload = () => resolve(img);

            img.src = imageSrc;
        });
    };

    const handleImageChange = async (files) => {
        // setPredictedLabel(null);
        // setImages([]);
        if (files.length === 0) {
            setConfidence(null);
            setPredictedClass(null);
        }

        if (files.length === 1) {
            setLoading(true);

            const imageSrc = await readImageFile(files[0]);
            const image = await createHTMLImageElement(imageSrc);

            // tf.tidy for automatic memory cleanup
            const predictedClasses = tf.tidy(() => {
                const tensorImg = tf.browser
                    .fromPixels(image)
                    .resizeNearestNeighbor([224, 224])
                    .toFloat()
                    .expandDims();

                const result = model.predict(tensorImg);
                const predictions = result.dataSync();

                const predictedClasses = [];

                const predicted_index = result.as1D().argMax().dataSync()[0];

                const predictedLabel = classLabels[predicted_index];

                console.log('predicted label', predictedLabel);
                setPredictedLabel(predictedLabel);

                return [
                    {
                        predictedClass: predictedLabel,
                        confidence: Math.round(predictions[predicted_index] * 100)
                    }
                ];
                // Iterate over prediction scores
                // for (let i = 0; i < predictions.length; i++) {
                //     const predictedClass = classLabels[i];
                //     const confidence = Math.round(predictions[i] * 100);
                //     predictedClasses.push({
                //         predictedClass: predictedClass,
                //         confidence: confidence
                //     });
                // }

                // Return array of predicted classes and confidences
                // return predictedClasses;

                // const confidence = Math.round(predictions[predicted_index] * 100);

                // return [predictedClass, confidence];
            });

            setPredictedClass(predictedClasses);
            // setConfidence(confidence);
            setLoading(false);
        }
    };

    const addImages = async () => {
        let count = 0;

        for (const wheelImage of files) {
            const url = await uploadWheelImage(wheelImage);

            const id = uuid().slice(0, 8);

            const starCount = ref(database, `/Wheel/${id}`);

            console.log('uploaded', count);

            // "wire"
            // "steal"
            // "sand"
            // "MudTerrain"
            // "carbonFiber"
            // "alloy"

            await set(starCount, {
                id: id,
                url: url,
                label: 'wire'
            });

            count++;
        }
    };

    return (
        <Fragment>
            <Grid
                container
                className='App'
                direction='column'
                alignItems='center'
                justifyContent='center'
                marginTop='12%'
            >
                <Grid item>
                    <h1 style={{ textAlign: 'center', marginBottom: '1.5em' }}>
                        UrbanMiner Image Classifier
                    </h1>
                    <DropzoneArea
                        acceptedFiles={['image/*']}
                        dropzoneText={'Add an image'}
                        onChange={handleImageChange}
                        maxFileSize={10000000}
                        filesLimit={1}
                        showAlerts={['error']}
                    />
                    {predictedClass?.map((item) => {
                        return (
                            <Stack
                                style={{ marginTop: '2em', width: '12rem' }}
                                direction='row'
                                spacing={1}
                            >
                                <Chip
                                    label={
                                        item.predictedClass === null
                                            ? 'Prediction:'
                                            : `Prediction: ${item.predictedClass}`
                                    }
                                    style={{ justifyContent: 'left' }}
                                    variant='outlined'
                                />
                                <Chip
                                    label={
                                        item.confidence === null
                                            ? 'Confidence:'
                                            : `Confidence: ${item.confidence}%`
                                    }
                                    style={{ justifyContent: 'left' }}
                                    variant='outlined'
                                />
                            </Stack>
                        );
                    })}
                </Grid>
            </Grid>
            <div className='flex flex-wrap flex-1'>
                {images
                    .filter((item) => item.label == predictedLabel)
                    .map((item, index) => {
                        return <img key={index} src={item.url} alt={item.label} />;
                    })}
            </div>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color='inherit' />
            </Backdrop>
        </Fragment>
    );
}

export default Ml;
