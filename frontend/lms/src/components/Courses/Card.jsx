import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import { Box, Container, Typography, } from '@mui/material';

export default function CourseCard(data) {
    return (
        <>
            <Container sx={{ marginTop: "88px" }}>
                <Card sx={{ height: "500px", padding: "10px" }} className='MainContainer'>
                    <CardMedia
                        sx={{ objectFit: "contain" }}
                        component="img"
                        height="280"
                        image={data.data.thumbnail}
                        alt="Paella dish"
                    />
                    <Typography>
                        <div class='cardData' style={{
                            color: "#2b3636",
                            lineHeight: "25px",
                            padding: "16px 16px 4px",
                            fontWeight: "700",
                            fontSize: "20px",
                            maxHeight: "65px",
                            overflow: "hidden",
                            display: "-webkit-box",
                            wordWrap: "break-word",
                            webkitBoxOrient: "vertical",
                            webkitLineClamp: "2"
                        }}>
                            {data.data.title}
                        </div>
                        <div class='cardData' style={{
                            color: "#586f6f",
                            padding: "5px 16px",
                            fontWeight: "200",
                            fontSize: "16px",
                            overflow: "hidden",
                            display: "-webkit-box",
                            maxHeight: "60px",
                            wordWrap: "break-word",
                            webkitBoxOrient: "vertical",
                            webkitLineClamp: "2"
                        }}
                        >
                            {data.data.Description}
                        </div>
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingRight: '10px'
                    }}>

                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    <img style={{
                                        width: "42px", height: "42px", borderRadius: "100%"
                                    }} src={data ? data.data.createBy.avatar : "https://cdn-icons-png.flaticon.com/512/2815/2815428.png"} />
                                </Avatar>
                            }
                            title={data.data.createBy.name}
                            subheader={data.data.createdAt}
                        />
                        <Typography>{`${data.data.price.symbol}${data.data.price.amount}`}</Typography>
                    </Box>
                </Card>

            </Container>
        </>
    );
} 