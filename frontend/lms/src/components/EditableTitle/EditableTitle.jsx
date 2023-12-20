import React, { useState } from 'react'
import styles from './EditableTitle.module.css'
import { Box, Button, Container, Grid, Input, MenuItem, TextField, Typography, Tooltip, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import toast, { Toaster } from 'react-hot-toast';
import CancelIcon from '@mui/icons-material/Cancel';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import config from '../../config.json';
import { useAuth } from '../../Contexts/AuthContext';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const EditableTitle = ({ courseTitle, setCourseTitle, setThumbnail, isEditing, setIsEditing, imageName, setImageName, Description, setDescription, setPrice, price }) => {
    const { userdata } = useAuth()
    const token = userdata.token
    const [thumbnailType, setthumbnailType] = useState(true)
    const [thumbnailUrl, setThumbnailUrl] = useState('')
    const currencies = [

        {
            value: 'INR',
            label: '₹'
        },
        {
            value: 'USD',
            label: '$',
        },
        {
            value: 'EUR',
            label: '€',
        },
        {
            value: 'BTC',
            label: '฿',
        },
        {
            value: 'JPY',
            label: '¥',

        }
    ];
    const handleClick = () => {
        if (courseTitle === '') {
            return toast.error("Please enter a valid Title")
        }
        setIsEditing(!isEditing)
    }

    const handleChange = (e) => {
        const { value } = e.target;
        if (value === '') {
            setIsEditing(true)
        }
        setCourseTitle(e.target.value);
    };

    const handleImageUpload = async (event) => {
        const loadingToast = toast.loading("Uploading Image")
        const file = event.target.files[0];
        if (file) {
            const fileType = file.type.split("/")[1]
            try {
                const response = await fetch(`${config.recurring.domainUrl}/${config.recurring.post.ImagePresignedUrl}?fileType=${fileType}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `bearer ${token}`
                    }
                })
                const responseBody = await response.json();
                const { uploadURL, Key } = responseBody;
                console.log(uploadURL)
                if (!uploadURL) {
                    return toast.error("Error in uploading image")
                }


                const uploadResponse = await fetch(uploadURL, {
                    method: "PUT",
                    headers: {
                        'Content-Type': `image/${fileType}`
                    },
                    body: file
                })

                if (!uploadResponse.ok) {
                    return toast.error("Error in uploading image");

                }

                const fileLink = `${config.recurring.s3BucketUrl}/${Key}`;
                setThumbnail(fileLink)
                setImageName(event.target.files[0].name)
                toast.dismiss(loadingToast)
                toast.success("Image Uploaded");
            } catch (error) {
                toast.dismiss(loadingToast)
                console.log(error)
            }
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
    }

    const handleSaveTitledes = () => {
        if (courseTitle === '' && Description === '') {
            return toast.error("Please enter valid Course Title and Description")
        }

        setIsEditing(false)
    }


    const handleCurrencyChange = (e) => {
        const selectedCurrencyValue = e.target.value;

        const selectedCurrency = currencies.find((currency) => currency.value === selectedCurrencyValue);
        if (selectedCurrency) {
            setPrice({
                ...price,
                value: selectedCurrency.value,
                symbol: selectedCurrency.label,
            });
        }
    }

    const handleamountChange = (e) => {

        setPrice({
            ...price, amount: e.target.value
        })
    }

    const handleLogoUrl = () => {
        if (thumbnailUrl === '') {
            return toast.error("Please enter a valid url")
        }
        setThumbnail(thumbnailUrl);
        setImageName(thumbnailUrl)
        setThumbnailUrl('')
        toast.success("Thumbnail Uploaded")
    }


    return (
        <>
            <Container sx={{
                padding: "15px",
                boxShadow: "11px 1px 20px 0px rgb(219 220 217)"
            }}>
                <div className={styles.EditableTitleDiv}>
                    <Grid container xs={12} sx={{
                        padding: '0px 5%'
                    }
                    }>
                        <Grid item xs={12} sm={6} sx={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                        }}>
                            {
                                isEditing ?
                                    <div className={styles.TitleDiv}>
                                        <TextField
                                            id="outlined-basic"
                                            label={'Enter Course Title*'}
                                            variant="standard"
                                            onChange={handleChange}
                                            value={courseTitle}
                                            className={styles.TextField}
                                            sx={{
                                                width: '80%'
                                            }}
                                        />
                                    </div>
                                    :
                                    <div className={styles.TitleDiv}>
                                        <Typography variant='h4' className={styles.TextField}
                                            sx={{
                                                width: '90%',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {courseTitle}
                                        </Typography>
                                        <Box ><EditIcon onClick={handleClick} /></Box>
                                    </div>
                            }
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {imageName ? <div className={styles.imageDiv}>
                                <h5 style={{ fontSize: '.8rem', width: '50%', height: '20px', overflow: 'hidden', textOverflow: 'ellipsis' }} >{
                                    imageName}</h5>
                                <Button startIcon={<CancelIcon />} onClick={() => {
                                    setImageName('')
                                    setThumbnail('')
                                }}></Button>
                            </div>
                                :
                                <div className={styles.LogoDiv}>
                                    {thumbnailType ? <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}
                                        sx={{
                                            fontSize: '.8rem',
                                            marginLeft: "10px",
                                            backgroundColor: 'rgb(77,135,51)',
                                            border: '1px solid rgb(77,135,51)'
                                        }}>
                                        Upload Thumbnail
                                        <VisuallyHiddenInput type="file" onChange={handleImageUpload}
                                            accept='image/*' />
                                    </Button> :
                                        <div className={styles.LogoUrlDiv}>
                                            <TextField label='Logo Url' value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} variant='standard' />
                                            <Button variant='outlined' sx={{
                                                marginLeft: '20px',
                                                color: 'rgb(77,135,51)',
                                                border: '1px solid rgb(77,135,51)'
                                            }} onClick={handleLogoUrl}>Add</Button>
                                        </div>
                                    }
                                    <Tooltip title="Change thumnail type">
                                        <IconButton>
                                            <ChangeCircleIcon sx={{ cursor: 'pointer' }} onClick={() => setthumbnailType(!thumbnailType)} />
                                        </IconButton>
                                    </Tooltip>

                                </div>
                            }
                        </Grid>
                    </Grid>
                </div>
                <div className={styles.desDiv}>
                    <div className={styles.descriptionDiv}>
                        {isEditing ? <>
                            <textarea className={styles.descriptionTextarea} name="" id="" cols="30" rows="5" placeholder='Enter Short Description' value={Description} onChange={handleDescriptionChange}></textarea>
                            <Button variant='outlined' sx={{
                                marginLeft: '20px',
                                border: '1px solid rgb(77,135,51)',
                                color: 'rgb(77,135,51)'
                            }} onClick={handleSaveTitledes}>Save</Button>
                        </> : <>
                            <Typography variant='h6' className={styles.TextField}
                                sx={{
                                    width: '90%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    height: 'auto'
                                }}
                            >
                                {Description}
                            </Typography>
                        </>
                        }
                    </div>
                    <div className={styles.currencyDiv}>
                        <TextField
                            id="outlined-select-currency"
                            select
                            label="Select"
                            defaultValue="INR"
                            sx={{
                                width: '80px'
                            }}
                            value={price.value}
                            onChange={handleCurrencyChange}
                        >
                            {currencies.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            id="outlined-uncontrolled"
                            label="Amount"
                            sx={{
                                width: '150px'
                            }}
                            value={price.amount}
                            onChange={handleamountChange}
                            type='number'

                        />
                    </div>
                </div>
            </Container >
        </>
    )
}

export default EditableTitle