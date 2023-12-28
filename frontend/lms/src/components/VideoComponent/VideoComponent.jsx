import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import config from '../../config.json';
import { useAuth } from '../../Contexts/AuthContext';
import { PresignedUrl } from '../../services/generatePresignedUrl.service';
import { AuthenticatePresignedUrl } from '../../services/authenticatedPresignedUrl.service';
const s3BucketUrl = config.recurring.s3BucketUrl;

const VideoComponent = ({ url, data, sectionId, courseId }) => {

    const [videoUrl, setVideoUrl] = useState('')
    const { userdata } = useAuth()
    const { token } = userdata
    const modifyVideos = async (url) => {
        if (isS3Video(url)) {
            try {
                let response;
                if (data.isfree) {
                    response = await PresignedUrl(url.replace(`${s3BucketUrl}/`, ''), courseId, sectionId, data._id)
                } else {
                    response = await AuthenticatePresignedUrl(url.replace(`${s3BucketUrl}/`, ''), token);
                }
                
                setVideoUrl(response.data.fileURL);
            } catch (error) {
                console.error('Error fetching presigned URL:', error);
                setVideoUrl(null)
            }
        } else {
            setVideoUrl(url)
        }
    }

    // const fetchAndRevokeBlob = async (videoUrl) => {
    //     return new Promise((resolve) => {
    //         fetch(videoUrl)
    //             .then((response) => console.log(response))
    //             .catch((error) => {
    //                 console.error('Error fetching blob:', error);
    //                 resolve(null);
    //             });
    //     });
    // };




    useEffect(() => {
        modifyVideos(url)
    }, [url])

    const playerConfig = {
        file: {
            attributes: {
                controlsList: 'nodownload noembed',
            },
        },
    };
    return (
        <>
            <ReactPlayer url={videoUrl} controls={true} config={playerConfig}></ReactPlayer>
        </>
    )
}

export default VideoComponent;

function isS3Video(url) {
    const s3Pattern = new RegExp(`^${s3BucketUrl}/.*`);
    return s3Pattern.test(url);
}