import React from 'react';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import './ImageVideoCarasouel.module.css'
class ImageVideoCarasouel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showIndex: false,
            showBullets: true,
            infinite: true,
            showThumbnails: true,
            showFullscreenButton: true,
            showGalleryFullscreenButton: true,
            showPlayButton: false,
            showGalleryPlayButton: true,
            showNav: true,
            isRTL: false,
            slideDuration: 450,
            slideInterval: 2000,
            slideOnThumbnailOver: false,
            thumbnailPosition: 'bottom',
            showVideo: {},
            useWindowKeyDown: true,
            fullScreen: false,
        };
        this.images = [];

        const allImages = props.allImages || [];
        const videos = props.videos || [];
        if (allImages.length > 0) {

            for (let i = 0; i < allImages.length; i++) {
                if (allImages[i].trim() === '') {
                    continue;
                }
                this.images.push({
                    original: allImages[i],
                    thumbnail: allImages[i],
                    originalClass: 'featured-slide',
                    thumbnailClass: 'featured-thumb',
                    description: '',
                    bulletClass: 'simpleIcon',
                });
            }
        }

        if (videos.length > 0) {


            for (let i = 0; i < videos.length; i++) {
                if (videos[i].trim() == '') {
                    continue;
                }
                this.images.push({
                    embedUrl: videos[i],
                    description: '',
                    renderItem: this._renderVideo.bind(this),
                    bulletClass: 'playIcon',
                });
            }
        }
    }

    _onImageClick(event) { }

    _onImageLoad(event) { }

    _onSlide(index) {
        this._resetVideo();
    }

    _onPause(index) { }

    _onScreenChange(fullScreenElement) {
        if (fullScreenElement == true) {
            this.setState({ fullScreen: true });
        } else {
            this.setState({ fullScreen: false });
        }
    }

    _onPlay(index) { }

    _handleInputChange(state, event) {
        if (event.target.value > 0) {
            this.setState({ [state]: event.target.value });
        }
    }

    _handleCheckboxChange(state, event) {
        this.setState({ [state]: event.target.checked });
    }

    _handleThumbnailPositionChange(event) {
        this.setState({ thumbnailPosition: event.target.value });
    }

    _resetVideo() {
        this.setState({ showVideo: {} });
        if (this.state.showPlayButton) {
            this.setState({ showGalleryPlayButton: true });
        }
        if (this.state.showFullscreenButton) {
            this.setState({ showGalleryFullscreenButton: true });
        }
    }

    _toggleShowVideo(url) {
        this.state.showVideo[url] = !Boolean(this.state.showVideo[url]);
        this.setState({
            showVideo: this.state.showVideo,
        });

        if (this.state.showVideo[url]) {
            if (this.state.showPlayButton) {
                this.setState({ showGalleryPlayButton: false });
            }
            if (this.state.showFullscreenButton) {
                this.setState({ showGalleryFullscreenButton: false });
            }
        }
    }

    _renderVideo(item) {
        return (
            <div>
                <a onClick={this._toggleShowVideo.bind(this, item.embedUrl)}>
                    <iframe
                        src={item.embedUrl}
                        className={this.state.fullScreen ? 'iframeFullScreen' : 'iframeNotFullScreen'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                </a>
            </div>
        );
    }

    // _renderCustomControls() {
    //     return <>
    //         <div><img /></div>
    //     </>
    // }

    render() {
        return (
            <section className="app" >
                <ImageGallery
                    ref={(i) => (this._imageGallery = i)}
                    items={this.images}
                    onClick={this._onImageClick.bind(this)}
                    onImageLoad={this._onImageLoad}
                    onSlide={this._onSlide.bind(this)}
                    onPause={this._onPause.bind(this)}
                    onScreenChange={this._onScreenChange.bind(this)}
                    onPlay={this._onPlay.bind(this)}
                    infinite={this.state.infinite}
                    showBullets={this.state.showBullets}
                    showFullscreenButton={
                        this.state.showFullscreenButton &&
                        this.state.showGalleryFullscreenButton
                    }
                    showPlayButton={
                        this.state.showPlayButton && this.state.showGalleryPlayButton
                    }
                    showThumbnails={this.state.showThumbnails}
                    showIndex={this.state.showIndex}
                    showNav={this.state.showNav}
                    isRTL={this.state.isRTL}
                    thumbnailPosition={this.state.thumbnailPosition}
                    slideDuration={parseInt(this.state.slideDuration)}
                    slideInterval={parseInt(this.state.slideInterval)}
                    slideOnThumbnailOver={this.state.slideOnThumbnailOver}
                    additionalClass="app-image-gallery"
                    useWindowKeyDown={this.state.useWindowKeyDown}
                />
            </section>
        );
    }
}

export default ImageVideoCarasouel;