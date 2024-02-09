import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { getVideoUrl } from '../../services/generateVideoUrl.service';
import { generateAuthVideoUrl } from '../../services/generateAuthvideoUrl.service';

const VideoComponent = ({ url, name, data, courseId, sectionId }) => {
    const [videoUrl, setVideoUrl] = useState('')
    const [isVideoCipherVideo, setIsVideoCipherVideo] = useState(false);


    const modifyVideos = async (url) => {
        if (isVideoCipherVideoId(name)) {
            let response;
            if (data?.isfree) {
                response = await getVideoUrl(`${courseId}/${sectionId}/${data._id}`, { videoId: url })
            } else {
                response = await generateAuthVideoUrl({ videoId: url })
            }
            setIsVideoCipherVideo(true)
            setVideoUrl(response.data.url)
        } else {
            setVideoUrl(url)
        }
    }





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
            {isVideoCipherVideo ? <iframe
                src={videoUrl}
                style={{
                    width: '100%', height: '75dvh', borderRadius: '15px'
                }}
                allow="encrypted-media"
                allowfullscreen
                title='VideoCipher'
            ></iframe>
                :
                <ReactPlayer url={videoUrl} controls={true} config={playerConfig} width={'100%'} height={'80dvh'}></ReactPlayer>}
        </>
    )
}

export default VideoComponent;

function isVideoCipherVideoId(name) {
    return name === "videoCipherVideoId"
}