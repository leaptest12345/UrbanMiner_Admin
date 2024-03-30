import React, { useState, useEffect, Fragment } from 'react';
import * as tf from '@tensorflow/tfjs';
import { DropzoneArea } from 'material-ui-dropzone';
import { Backdrop, Chip, CircularProgress, Grid, Stack } from '@mui/material';

function Ml() {
    const [model, setModel] = useState(null);
    const [classLabels, setClassLabels] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confidence, setConfidence] = useState(null);
    const [predictedClass, setPredictedClass] = useState(null);

    useEffect(() => {
        const loadModel = async () => {
            try {
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
        if (files.length === 0) {
            setConfidence(null);
            setPredictedClass(null);
        }

        if (files.length === 1) {
            setLoading(true);

            const imageSrc = await readImageFile(files[0]);
            const image = await createHTMLImageElement(imageSrc);

            // tf.tidy for automatic memory cleanup
            const [predictedClass, confidence] = tf.tidy(() => {
                const tensorImg = tf.browser
                    .fromPixels(image)
                    .resizeNearestNeighbor([224, 224])
                    .toFloat()
                    .expandDims();

                const result = model.predict(tensorImg);

                const predictions = result.dataSync();
                console.log('predictions', predictions);
                const predicted_index = result.as1D().argMax().dataSync()[0];

                console.log('predicted_index', predicted_index);

                const predictedClass = classLabels[predicted_index];
                const confidence = Math.round(predictions[predicted_index] * 100);

                return [predictedClass, confidence];
            });

            setPredictedClass(predictedClass);
            setConfidence(confidence);
            setLoading(false);
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
                    <Stack style={{ marginTop: '2em', width: '12rem' }} direction='row' spacing={1}>
                        <Chip
                            label={
                                predictedClass === null
                                    ? 'Prediction:'
                                    : `Prediction: ${predictedClass}`
                            }
                            style={{ justifyContent: 'left' }}
                            variant='outlined'
                        />
                        <Chip
                            label={
                                confidence === null ? 'Confidence:' : `Confidence: ${confidence}%`
                            }
                            style={{ justifyContent: 'left' }}
                            variant='outlined'
                        />
                    </Stack>
                </Grid>
            </Grid>

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
