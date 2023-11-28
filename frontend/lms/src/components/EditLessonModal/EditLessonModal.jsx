import React, { useState } from 'react';
import styles from './EditLessonModal.module.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, IconButton, Tooltip, Typography, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ImageIcon from '@mui/icons-material/Image';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import NotesIcon from '@mui/icons-material/Notes';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import toast, { Toaster } from 'react-hot-toast';
import PreviewEditLesson from '../PreviewEditLesson/PreviewEditLesson';
import { UpdateLesson } from '../../services/updateLesson.service';
import { useAuth } from '../../Contexts/AuthContext';
import Swal from 'sweetalert2';

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

const EditLessonModal = ({ handleCloseModel, Data, courseId, sectionId, fetchCourseData, setData }) => {
    const [contentType, setContentType] = useState('text')
    const initialdata = {
        _id: Data._id || null,
        Title: Data.Title || '',
        bannerimage: Data.bannerimage || '',
        embedMedia: Data.embedMedia || '',
        images: Data.images || [],
        isfree: Data.isfree || false,
        pptUrl: Data.pptUrl || '',
        text: Data.text || [],
        videos: Data.videos || []
    }
    const { userdata } = useAuth()
    const token = userdata.token;
    const [LessonData, setLessonData] = useState(initialdata)
    const [text, setText] = useState('')
    const [videourl, setVideoUrl] = useState({
        url: "",
        name: ''
    })
    const [imgUrl, setImgUrl] = useState('')
    const [bannerimageUrl, setBannerImgUrl] = useState('')
    const [embedMediaUrl, setEmbedMediaUrl] = useState('')
    const [PPTurl, setPPturl] = useState('')
    const [preview, setPreview] = useState(false)
    const [hasChanges, setHasChanges] = useState(false);

    const handleTextadd = () => {
        if (!text) {
            return toast.error("Please enter some text")
        }
        setLessonData({ ...LessonData, text: [...LessonData.text, text] })
        toast.success("Text added")
        setText('')
        setHasChanges(true)
    }

    const handleTitleChange = (e) => {
        setLessonData({ ...LessonData, Title: e.target.value })
        setHasChanges(true)
    }

    const handlevideourlChange = (e) => {
        const { name, value } = e.target;
        setVideoUrl({ ...videourl, [name]: value })
        setHasChanges(true)
    }

    const handleAddVideo = (e) => {
        const toastpromise = toast.loading("Uploading Video")
        const file = e.target.files[0];
        const name = e.target.files[0].name

        try {
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setLessonData({ ...LessonData, videos: [...LessonData.videos, { name, url: event.target.result }] })
                };
                reader.readAsDataURL(file);
            }
            toast.dismiss(toastpromise)
            toast.success("Video Uploaded")
            setHasChanges(true)
        } catch (error) {
            toast.dismiss(toastpromise)
            console.log(error);
        }
    }


    const handleAddVideoUrl = () => {
        if (videourl.url === '') {
            return toast.error("Please provide a valid URL")
        }
        if (videourl.name === '') {
            return toast.error("Please enter a custom video name")
        }
        setLessonData({ ...LessonData, videos: [...LessonData.videos, videourl] })
        setVideoUrl({
            name: '',
            url: ''
        })
        toast.success("Video Added")
        setHasChanges(true)
    }

    const handleImageUrl = () => {
        if (!imgUrl) {
            return toast.error("Invalid image url")
        }
        setLessonData({ ...LessonData, images: [...LessonData.images, imgUrl] });
        setImgUrl('')
        toast.success("Image Uploaded")
        setHasChanges(true)
    }

    const handleImage = (e) => {

        const loadingToast = toast.loading("Uploading Image")
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLessonData({ ...LessonData, images: [...LessonData.images, event.target.result] });
            };
            reader.readAsDataURL(file);
            toast.dismiss(loadingToast)
            toast.success("Image Uploaded")
            setHasChanges(true)
        }
    }


    const handlebannerImageUpload = (e) => {
        const loadingToast = toast.loading("Uploading Image")
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLessonData({ ...LessonData, bannerimage: event.target.result });
            };
            reader.readAsDataURL(file);
            toast.dismiss(loadingToast)
            toast.success("BannerImage Uploaded")
            setHasChanges(true)
        }
    }

    const handlebannerimgurl = () => {
        if (!bannerimageUrl) {
            return toast.error("Invalid Banner Image Url")
        }
        setLessonData({ ...LessonData, bannerimage: bannerimageUrl })
        setBannerImgUrl('')
        toast.success("Banner Image added")
        setHasChanges(true)
    }

    const handleEmbedMedia = () => {
        const match = embedMediaUrl.match(/\/d\/(.*?)\/view/);
        const videoId = match && match[1];
        const newUrl = `https://drive.google.com/file/d/${videoId}/preview`
        console.log(newUrl)
        setLessonData({ ...LessonData, embedMedia: newUrl })
        setEmbedMediaUrl('')
        toast.success('Media added')
        setHasChanges(true)
    }


    const embedUrl = (url) => {
        const parts = url.split('?'); 
        if (parts.length === 2) {
            const baseUrl = parts[0];
            const query = parts[1];

           
            const newBaseUrl = baseUrl.replace('/pub', '/embed');
            const newUrl = `${newBaseUrl}?${query}`;
            try {
                new URL(newUrl);
               
                return newUrl
            } catch (error) {
               
                console.log(error)
                toast.error('Invalid URL');
            }
        } else {
            toast.error('Invalid URL');
        }
    }

    const handlePPTURL = () => {
        const newUrl = embedUrl(PPTurl)
        if (newUrl) {
            setLessonData({ ...LessonData, pptUrl: newUrl })
            toast.success("PPT Added")
            setPPturl('')
            setHasChanges(true)
        } else {
            toast.error('Invalid URL');
        }
    }

    const handleUpdateLesson = async (e) => {
        const loader = toast.loading("Updating course")
        setHasChanges(false)
        try {
            const response = await UpdateLesson(courseId, sectionId, { lesson: LessonData }, token)
            toast.dismiss(loader)
            toast.success(response.data.msg)
            fetchCourseData()
            handleCloseModel()
            setData()
        } catch (error) {
            console.log(error)
            toast.dismiss(loader)
            toast.error("Error updating lesson data")
        }
    }

    const onClose = () => {
        setPreview(false)
    }

    const handleBackbutton = () => {
        if (hasChanges) {
            Swal.fire({
                title: "Discard Changes?",
                text: "Click on UPDATE LESSON to save changes",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "rgb(77,135,51)",
                cancelButtonColor: "#d33",
                confirmButtonText: "Discard"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    handleCloseModel()
                    setData({})
                }
            });
        } else {
            handleCloseModel()
            setData()
        }
    }
    return (
        <div className={styles.EditLessonContainer}>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            {preview && <PreviewEditLesson onClose={onClose} setLessonData={setLessonData} LessonData={LessonData} />}
            <div className={styles.LessonMainContainer}>
                <div className={styles.BackButtonDiv}>
                    <Tooltip title="Go back">
                        <IconButton onClick={() => handleBackbutton()} sx={{
                            color: 'rgb(145, 170, 48)'
                        }}>
                            <ArrowBackIosIcon />
                        </IconButton>
                    </Tooltip>
                    <Button sx={{
                        border: '1px solid rgb(145, 170, 48)',
                        color: 'rgb(145, 170, 48)',
                        padding: '0px 15px'
                    }}
                        onClick={() => setPreview(true)}
                        startIcon={<VisibilityIcon />}>Preview</Button>
                </div>
                <div className={styles.DataContainer}>
                    <div className={styles.LessonPreviewContainer}>
                        <div className={styles.TitleDiv}>
                            <TextField label='Title' variant='standard' value={LessonData.Title} onChange={handleTitleChange}></TextField>
                        </div>
                        <div className={styles.AddContentComponents}>
                            {
                                contentType === 'text' &&
                                <div className={styles.addText}>
                                    <textarea className={styles.textarea} value={text} onChange={(e) => setText(e.target.value)}></textarea>
                                    <Button variant='outlined' sx={{
                                        border: '1px solid rgb(145, 170, 48)',
                                        color: 'rgb(145, 170, 48)',
                                        '&:hover': { border: '1px solid rgb(145, 170, 48)' }
                                    }} placeholder='Add text' onClick={handleTextadd}>Add</Button>
                                </div>
                            }
                            {
                                contentType === 'video' &&
                                <div className={styles.VideoDiv}>
                                    <div className={styles.videoBtn}>
                                        <Button component="label" variant="contained" sx={{
                                            backgroundColor: 'rgb(77,135,51)'
                                        }} startIcon={<CloudUploadIcon />}>
                                            Upload Video
                                            <VisuallyHiddenInput type="file" accept='video/*' onChange={handleAddVideo} />
                                        </Button>
                                    </div>
                                    <Typography>OR</Typography>
                                    <div className={styles.videoUrlDiv}>
                                        <div className={styles.videoTextfield}>
                                            <TextField
                                                label="URL"
                                                id="outlined-size-small"
                                                size="small"
                                                name='url'
                                                fullWidth
                                                sx={{
                                                    marginBottom: '20px'
                                                }}
                                                value={videourl.url}
                                                onChange={handlevideourlChange}
                                            />
                                            <TextField
                                                label="Custom name"
                                                id="outlined-size-small"
                                                size="small"
                                                fullWidth
                                                name='name'
                                                value={videourl.name}
                                                onChange={handlevideourlChange}
                                            />
                                        </div>
                                        <Button variant='outlined' sx={{
                                            width: '100px',
                                            border: '1px solid rgb(145, 170, 48)',
                                            color: 'rgb(145, 170, 48)',
                                            '&:hover': { border: '1px solid rgb(145, 170, 48)' }
                                        }} onClick={handleAddVideoUrl}>Add</Button>
                                    </div>
                                </div>
                            }
                            {
                                contentType === 'image' &&
                                <div className={styles.imageDiv}>
                                    <div className={styles.UploadImgDiv}>
                                        <Button component="label" variant="contained" sx={{
                                            backgroundColor: 'rgb(77,135,51)'
                                        }} startIcon={<CloudUploadIcon />}>
                                            Upload Image
                                            <VisuallyHiddenInput type="file" onChange={handleImage} accept='image/*' />
                                        </Button>
                                    </div>
                                    <Typography>OR</Typography>
                                    <div className={styles.ImageUrl}>
                                        <TextField
                                            label="Url"
                                            id="outlined-size-small"
                                            size="small"
                                            fullWidth sx={{
                                                marginRight: '20px'
                                            }} value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
                                        <Button variant='outlined' sx={{
                                            width: '100px',
                                            border: '1px solid rgb(145, 170, 48)',
                                            color: 'rgb(145, 170, 48)',
                                            '&:hover': { border: '1px solid rgb(145, 170, 48)' }
                                        }} onClick={handleImageUrl}>Add</Button>
                                    </div>
                                </div>
                            }
                            {
                                contentType === 'background' &&
                                <div className={styles.bannerimage}>
                                    <div className={styles.Uploadbgimg}>
                                        <Button component="label" variant="contained" sx={{
                                            backgroundColor: 'rgb(77,135,51)'
                                        }} startIcon={<CloudUploadIcon />}>
                                            Upload BannerImage
                                            <VisuallyHiddenInput type="file" onChange={handlebannerImageUpload} accept='image/*' />
                                        </Button>
                                    </div>
                                    <Typography>OR</Typography>
                                    <div className={styles.UploadbgimgUrl}>
                                        <TextField
                                            label="Url"
                                            id="outlined-size-small"
                                            size="small" fullWidth sx={{
                                                paddingRight: '20px'
                                            }} value={bannerimageUrl} onChange={(e) => setBannerImgUrl(e.target.value)}></TextField>
                                        <Button variant='outlined' sx={{
                                            width: '100px',
                                            border: '1px solid rgb(145, 170, 48)',
                                            color: 'rgb(145, 170, 48)',
                                            '&:hover': { border: '1px solid rgb(145, 170, 48)' }
                                        }} onClick={handlebannerimgurl}>Add</Button>
                                    </div>
                                </div>
                            }
                            {
                                contentType === 'embed' &&
                                <div className={styles.EmbedMediDiv}>
                                    <TextField
                                        label="Enter Gdrive Video Url"
                                        fullWidth sx={{
                                            marginRight: '30px'
                                        }} value={embedMediaUrl} onChange={(e) => setEmbedMediaUrl(e.target.value)}></TextField>
                                    <Button variant='outlined' sx={{
                                        width: '100px',
                                        border: '1px solid rgb(145, 170, 48)',
                                        color: 'rgb(145, 170, 48)',
                                        '&:hover': { border: '1px solid rgb(145, 170, 48)' }
                                    }} onClick={handleEmbedMedia}>Add</Button>
                                </div>
                            }
                            {
                                contentType === 'PPT' &&
                                <div className={styles.PPTdiv}>
                                    <TextField
                                        label="Enter GoogleDocs PPT link"
                                        fullWidth sx={{
                                            marginRight: '30px'
                                        }} value={PPTurl} onChange={(e) => setPPturl(e.target.value)}></TextField>
                                    <Button variant='outlined' sx={{
                                        width: '100px',
                                        border: '1px solid rgb(145, 170, 48)',
                                        color: 'rgb(145, 170, 48)',
                                        '&:hover': { border: '1px solid rgb(145, 170, 48)' }
                                    }} onClick={handlePPTURL}>Add</Button>
                                </div>
                            }
                        </div>
                        <div className={styles.updatebtnDiv}>
                            <Button variant='outlined' onClick={handleUpdateLesson}
                                sx={{
                                    color: 'rgb(145, 170, 48)',
                                    border: '1px solid rgb(145, 170, 48)',
                                    '&:hover': { border: '1px solid rgb(145, 170, 48)' }
                                }}
                                disabled={!hasChanges}
                            >Update Lesson</Button>
                        </div>
                    </div>
                    <div className={styles.AddContent}>
                        <Typography variant='h6' textAlign={'center'}>Add Content</Typography>
                        <div className={styles.AddContentOptions}>
                            <div className={styles.addContentBtn} onClick={() => setContentType('text')}>
                                <NotesIcon />
                                <Typography>Text</Typography>
                            </div>
                            <div className={styles.addContentBtn} onClick={() => setContentType('video')}>
                                <OndemandVideoIcon />
                                <Typography>Videos</Typography>
                            </div>
                            <div className={styles.addContentBtn} onClick={() => setContentType('image')}>
                                <ImageIcon />
                                <Typography>Images</Typography>
                            </div>
                            <div className={styles.addContentBtn} onClick={() => setContentType('background')}>
                                <WallpaperIcon />
                                <Typography>Banner Image</Typography>
                            </div>
                            <div className={styles.addContentBtn} onClick={() => setContentType('embed')}>
                                <VideoLibraryIcon />
                                <Typography>Gdrive Video</Typography>
                            </div>
                            <div className={styles.addContentBtn} onClick={() => setContentType('PPT')}>
                                <AddToDriveIcon />
                                <Typography>PPT</Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default EditLessonModal