import * as React from 'react';
import { styled } from '@mui/material/styles';
import config from '../../config.json';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import { Box, Container, Typography, } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { ThumbnailPresignedUrl } from '../../services/thumbnailPresignedUrl.service';
import './Card.css'
const s3BucketUrl = config.recurring.s3BucketUrl;

export default function CourseCard({ data }) {
    const [modifyThumbnail, setModifyThumbnail] = useState('')

    const handleModifyThumbnail = async () => {
        if (isS3Image(data.thumbnail)) {
            try {
                const response = await ThumbnailPresignedUrl(data.thumbnail.replace(`${s3BucketUrl}/`, ''));
                setModifyThumbnail(response.data.fileURL)
            } catch (error) {

            }
        } else {
            setModifyThumbnail(data.thumbnail)
        }
    }

    useEffect(() => {
        handleModifyThumbnail()
    }, [])

    return (
        <>
            <Container >
                <Card sx={{
                    height: "400px",
                    transition: 'border-color 0.3s ease-in-out, color 0.3s ease-in-out',
                    ':hover': {
                        borderColor: 'rgb(180, 211, 59)',
                        color: 'rgb(180, 211, 59)',
                        boxShadow: 'rgba(180, 211, 59, 0.6) 0px 2px 8px 0px',
                        cursor: 'pointer'
                    },
                }} className='MainContainer'>
                    <CardMedia
                        sx={{ objectFit: "cover", width: '100%' }}
                        component="img"
                        height="220"
                        image={modifyThumbnail}
                        alt="Paella dish"
                    />
                    <Typography>
                        <div class='cardData' style={{
                            padding: '10px'
                        }}>
                            <p style={{
                                margin: 0,
                                fontSize: '20px',
                                fontWeight: 'bold'
                            }}>
                                {data.title}
                            </p>
                        </div>
                        <div style={{
                            padding: '0px 10px',
                            fontSize: '14px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'start',
                            color: 'rgb(140,140,140)',
                            textOverflow: 'ellipsis'
                        }}
                        >
                            {data.Description}
                        </div>
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '20px'
                    }}>
                        <Typography sx={{
                            color: 'rgb(180,211,59)',
                            fontWeight: 700
                        }} >{`${data.price.symbol}${data.price.amount}`}</Typography>
                        {data.isPurchased ? <button className='button'>
                            View Content
                        </button> : <button className='button'>View Details</button>}
                    </Box>
                </Card>

            </Container>
        </>
    );
}


function isS3Image(url) {
    const s3Pattern = new RegExp(`^${s3BucketUrl}/.*`);
    return s3Pattern.test(url);
}