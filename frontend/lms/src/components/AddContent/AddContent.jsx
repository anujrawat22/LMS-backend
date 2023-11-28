import React from 'react';
import styles from './AddContent.module.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Switch, TextField, Typography } from '@mui/material';
import NotesIcon from '@mui/icons-material/Notes';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ImageIcon from '@mui/icons-material/Image';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import toast from 'react-hot-toast';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LessonPreview from '../LessonPreview/LessonPreview';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
const label = { inputProps: { 'aria-label': 'Switch demo' } };
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



const AddContent = ({ setOpen, setSections, sectionId, LessonData }) => {
    const generateLessonId = () => {
        return `Lesson-${Date.now()}`
    }
    const initialLessonState = Object.keys(LessonData).length > 0 ? LessonData : {
        Title: '',
        text: [],
        videos: [],
        images: [],
        pptUrl: '',
        embedMedia: '',
        bannerimage: '',
        isfree: false,
        LessonId: generateLessonId()
    }
    const [contentType, setContentType] = useState('text')
    const [LessonContent, setLessonContent] = useState(initialLessonState)
    const [text, setText] = useState('')
    const [isEditingTitle, setisEditingTitle] = useState(true)
    const [videourl, setVideoUrl] = useState({
        name: '',
        url: ''
    })
    const [imgUrl, setImgUrl] = useState('')
    const [bannerimageUrl, setBannerImgUrl] = useState('')
    const [embedMediaUrl, setEmbedMediaUrl] = useState('')
    const [PPTurl, setPPturl] = useState('')
    const [ispreviewOpen, setPreviewOpen] = useState(false)



    const handletitleChange = (e) => {
        setLessonContent({ ...LessonContent, Title: e.target.value })
    }

    const handleSaveTitle = () => {
        if (LessonContent.Title === '') {
            return toast.error("Please enter a valid title")
        }
        toast.success("Changes saved")
        setisEditingTitle(false)
    }

    const handleTextAdd = () => {
        if (text === '') {
            return toast.error("Enter valid text")
        }
        setLessonContent({ ...LessonContent, text: [...LessonContent.text, text] })
        setText('')
        toast.success("Text added")
    }

    const handlelessontype = () => {
        setLessonContent({ ...LessonContent, isfree: !LessonContent.isfree })
    }

    const handlevideourlChange = (e) => {
        const { name, value } = e.target;
        setVideoUrl({ ...videourl, [name]: value })
    }

    const handleAddVideoUrl = () => {
        if (videourl.url === '') {
            return toast.error("Please provide a valid URL")
        }
        if (videourl.name === '') {
            return toast.error("Please enter a custom video name")
        }
        setLessonContent({ ...LessonContent, videos: [...LessonContent.videos, videourl] })
        setVideoUrl({
            name: '',
            url: ''
        })
        toast.success("Video Added")
    }

    const handleAddVideo = async (e) => {
        const toastpromise = toast.loading("Uploading Video")
        const file = e.target.files[0];
        const name = e.target.files[0].name

        try {
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setLessonContent({ ...LessonContent, videos: [...LessonContent.videos, { name, url: event.target.result }] })
                };
                reader.readAsDataURL(file);
            }
            toast.dismiss(toastpromise)
            toast.success("Video Uploaded")
        } catch (error) {
            console.log(error);
        }
    }

    const handleImage = (e) => {
        const loadingToast = toast.loading("Uploading Image")
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLessonContent({ ...LessonContent, images: [...LessonContent.images, event.target.result] });
            };
            reader.readAsDataURL(file);
            toast.dismiss(loadingToast)
            toast.success("Image Uploaded")
        }
    }

    const handleImageUrl = () => {
        if (!imgUrl) {
            return toast.error("Invalid image url")
        }
        setLessonContent({ ...LessonContent, images: [...LessonContent.images, imgUrl] });
        setImgUrl('')
        toast.success("Image Uploaded")
    }

    const handlebannerImageUpload = (e) => {
        const loadingToast = toast.loading("Uploading Image")
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLessonContent({ ...LessonContent, bannerimage: event.target.result });
            };
            reader.readAsDataURL(file);
            toast.dismiss(loadingToast)
            toast.success("BannerImage Uploaded")
        }
    }

    const handlebannerimgurl = () => {
        if (!bannerimageUrl) {
            return toast.error("Invalid Banner Image Url")
        }
        setLessonContent({ ...LessonContent, bannerimage: bannerimageUrl })
        setBannerImgUrl('')
        toast.success("Banner Image added")
    }

    const handleEmbedMedia = () => {
        const match = embedMediaUrl.match(/\/d\/(.*?)\/view/);
        const videoId = match && match[1];
        const newUrl = `https://drive.google.com/file/d/${videoId}/preview`
        console.log(newUrl)
        setLessonContent({ ...LessonContent, embedMedia: newUrl })
        setEmbedMediaUrl('')
        toast.success('Media added')
    }


    const embedUrl = (url) => {
        const parts = url.split('?'); // Split the URL at the question mark

        // Check if the split resulted in two parts (indicating a valid URL with a query string)
        if (parts.length === 2) {
            const baseUrl = parts[0];
            const query = parts[1];

            // Create the new URL by replacing '/pub' with '/embed' in the base URL
            const newBaseUrl = baseUrl.replace('/pub', '/embed');
            const newUrl = `${newBaseUrl}?${query}`;

            // Validate the new URL using the URL constructor
            try {
                new URL(newUrl);
                // If the URL is valid, update the slideUrl state with the new URL
                return newUrl
            } catch (error) {
                // Handle invalid URL (e.g., show an error message)
                console.log(error)
                toast.error('Invalid URL');
            }
        } else {
            // Handle invalid URL (e.g., show an error message)
            toast.error('Invalid URL');
        }
    }

    const handlePPTURL = () => {
        const newUrl = embedUrl(PPTurl)
        if (newUrl) {

            setLessonContent({ ...LessonContent, pptUrl: newUrl })
            toast.success("PPT Added")
            setPPturl('')

        } else {
            toast.error('Invalid URL');
        }
    }


    const handleAddlesson = () => {
        if (LessonContent.Title === '') {
            return toast.error("The lesson must contain a title")
        }
        setSections((prevSections) =>
            prevSections.map((section) => {
                if (section.sectionid === sectionId) {
                    return {
                        ...section,
                        subsections: [...section.subsections, LessonContent]
                    }
                }
                return section;
            }))
        toast.success('Lesson Added')
        setLessonContent(initialLessonState)
        setOpen(false)
    }
    return (
        <div className={styles.AddCourseModal}>
            <div className={styles.TitleDiv}>
                <div className={styles.backButton} onClick={() => setOpen(false)}><ArrowBackIcon /></div>
                <div className={styles.Title}><Typography variant='h4'>Add Lesson</Typography></div>
                <div className={styles.PreviewDiv} onClick={() => setPreviewOpen(true)}>Preview</div>
            </div>
            <div className={styles.Container}>
                <div className={styles.ContentDiv}>
                    <div className={styles.LessonTitleDiv}>
                        <div className={styles.TitlesubDiv}>
                            {isEditingTitle ?
                                <>
                                    <TextField id="standard-basic" label="Title" variant="standard" value={LessonContent.Title} onChange={handletitleChange} />
                                    <Button onClick={handleSaveTitle} sx={{
                                        color: 'rgb(77,135,51)'
                                    }}>
                                        <CheckCircleIcon />
                                    </Button>
                                </>
                                :
                                <>
                                    <Typography variant='h5'>Title - {LessonContent.Title}</Typography>
                                    <Button onClick={() => setisEditingTitle(true)} sx={{
                                        color: "rgb(77,135,51)"
                                    }}><ModeEditIcon /></Button>
                                </>}
                        </div>
                        <div className={styles.SwitchDiv}>
                            <Typography>Free</Typography>
                            <Switch checked={LessonContent.isfree} onChange={handlelessontype} />
                        </div>
                    </div>
                    <div className={styles.contentfuncDiv}>
                        {
                            contentType === 'text' &&
                            <>
                                <div className={styles.TextDiv}>
                                    <textarea name="text" id="text" rows="3" value={text} onChange={(e) => setText(e.target.value)} className={styles.text} placeholder='Enter text'></textarea>
                                    <Button variant='outlined' onClick={handleTextAdd} sx={{
                                        color: 'rgb(77,135,51)',
                                        border: '1px solid rgb(77,135,51)'
                                    }}>Add</Button>
                                </div>
                            </>
                        }
                        {
                            contentType === 'video' &&
                            <>
                                <div className={styles.videoDiv}>
                                    <div className={styles.videoBtn}>
                                        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{
                                            backgroundColor: 'rgb(77,135,51)',
                                        }}>
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
                                        <Button variant='outlined' onClick={handleAddVideoUrl} sx={{
                                            border: '1px solid rgb(77,135,51)',
                                            color: 'rgb(77,135,51)'
                                        }}>Add</Button>
                                    </div>
                                </div>
                            </>
                        }
                        {
                            contentType === 'image' &&
                            <div className={styles.AddImageDiv}>
                                <div className={styles.UploadImgDiv}>
                                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{
                                        backgroundColor: 'rgb(77,135,51)'
                                    }}>
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
                                    <Button variant='outlined' onClick={handleImageUrl} sx={{
                                        color: 'rgb(77,135,51)',
                                        border: '1px solid rgb(77,135,51)'
                                    }}>Add</Button>
                                </div>
                            </div>
                        }
                        {
                            contentType === 'background' &&
                            <div className={styles.bannerimage}>
                                <div className={styles.Uploadbgimg}>
                                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{
                                        backgroundColor: 'rgb(77,135,51)'
                                    }}>
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
                                    <Button variant='outlined' onClick={handlebannerimgurl} sx={{
                                        border : '1px solid rgb(77,135,51)',
                                        color : 'rgb(77,135,51)'
                                    }}>Add</Button>
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
                                <Button variant='contained' sx={{
                                    width: '100px', backgroundColor: 'rgb(77,135,51)'
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
                                <Button variant='contained' sx={{
                                    width: '100px',
                                    backgroundColor: 'rgb(77,135,51)'
                                }} onClick={handlePPTURL}>Add</Button>
                            </div>
                        }
                    </div>
                </div>
                <div className={styles.AddContentBtnDiv}>
                    <Typography sx={{
                        textAlign: 'center'
                    }} variant='h6'>Add Content</Typography>
                    <div className={styles.AddContentdiv}>
                        <div className={styles.addContentBtn} onClick={() => setContentType('text')} style={{
                            color: 'rgb(77,135,51)'
                        }}>
                            <NotesIcon />
                            <Typography>Text</Typography>
                        </div>
                        <div className={styles.addContentBtn} onClick={() => setContentType('video')} style={{
                            color: 'rgb(77,135,51)'
                        }}>
                            <OndemandVideoIcon />
                            <Typography>Videos</Typography>
                        </div>
                        <div className={styles.addContentBtn} onClick={() => setContentType('image')} style={{
                            color: 'rgb(77,135,51)'
                        }}>
                            <ImageIcon />
                            <Typography>Images</Typography>
                        </div>
                        <div className={styles.addContentBtn} onClick={() => setContentType('background')} style={{
                            color: 'rgb(77,135,51)'
                        }}>
                            <WallpaperIcon />
                            <Typography>Banner Image</Typography>
                        </div>
                        <div className={styles.addContentBtn} onClick={() => setContentType('embed')} style={{
                            color: 'rgb(77,135,51)'
                        }}>
                            <VideoLibraryIcon />
                            <Typography>Gdrive Video</Typography>
                        </div>
                        <div className={styles.addContentBtn} onClick={() => setContentType('PPT')} style={{
                            color: 'rgb(77,135,51)'
                        }}>
                            <AddToDriveIcon />
                            <Typography>PPT</Typography>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.AddLessonbtnDiv}>
                <Button variant='outlined' onClick={handleAddlesson} sx={{
                    border: '1px solid rgb(77,135,51)',
                    color: 'rgb(77,135,51)'
                }}>Add Lesson</Button>
            </div>
            {
                ispreviewOpen && <LessonPreview LessonContent={LessonContent} setLessonContent={setLessonContent} setPreviewOpen={setPreviewOpen} />
            }
        </div>
    )
}

export default AddContent