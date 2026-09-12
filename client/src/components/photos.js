import React from "react";

const breakpoints = [3840, 2400, 1080, 640, 384, 256, 128, 96, 64, 48];

// Replace these placeholders with your Google image URLs and dimensions
const googlePhotos = [
  {
    url: "https://images.shiksha.com/mediadata/images/1632741709phpXAqEeH.jpeg",
    width: 1080,
    height: 800,
  },
  {
    url: "https://qph.cf2.quoracdn.net/main-qimg-c11558bffe4830e0726c4a218e0ed4ef-lq",
    width: 1080,
    height: 1620,
  },
  // Add more image data here
];

const photos = googlePhotos.map((photo) => {
  const width = breakpoints[0];
  const height = (photo.height / photo.width) * width;

  return {
    src: photo.url,
    width,
    height,
    srcSet: breakpoints.map((breakpoint) => {
      const height = Math.round((photo.height / photo.width) * breakpoint);
      return {
        src: photo.url.replace(/\/\d+x\d+\//, `/${breakpoint}x${height}/`),
        width: breakpoint,
        height,
      };
    }),
  };
});

const PhotoGallery = () => {
  return (
    <div className="photo-gallery">
      {photos.map((photo, index) => (
        <div key={index} className="photo">
          <img
            src={photo.src}
            alt={`Photo ${index + 1}`}
            srcSet={photo.srcSet.map((src) => `${src.src} ${src.width}w`).join(", ")}
            sizes="100vw"
          />
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery;
