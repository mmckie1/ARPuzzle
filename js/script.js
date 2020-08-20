'use strict';

//video variables
var constraints;
var imageCapture;
var mediaStream;

var takePhotoButton = document.querySelector('button#takePhoto');

var canvas = document.querySelector('canvas');
var video = document.querySelector('video');
var videoSelect = document.querySelector('select#video');

// takePhotoButton.onclick = takePhoto;
takePhotoButton.addEventListener(`click`, takePhoto);
videoSelect.addEventListener(`change`, getStream);
// videoSelect.onchange = getStream;


//Puzzle Variables 

//Get a list of available media input (and ouput) devices 
//then get a MediaStream for the currently selected input device 
navigator.mediaDevices.enumerateDevices()
  .then(gotDevices)
  .catch(error => {
    console.log('enumerateDevices() error: ', error);
  })
  .then(getStream);

  // From the list of media devices available, set up the camera source <select>,
// then get a video stream from the default camera source.
function gotDevices(deviceInfos) {
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    console.log('Found media input or output device: ', deviceInfo);
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || 'Camera ' + (videoSelect.length + 1);
      videoSelect.appendChild(option);
    }
  }
}

// Get a video stream from the currently selected camera source.
function getStream() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => {
      track.stop();
    });
  }
  var videoSource = videoSelect.value;
  constraints = {
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  navigator.mediaDevices.getUserMedia(constraints)
    .then(gotStream)
    .catch(error => {
      console.log('getUserMedia error: ', error);
    });
}

// Display the stream from the currently selected camera source, and then
// create an ImageCapture object, using the video from the stream.
function gotStream(stream) {
  console.log('getUserMedia() got stream: ', stream);
  mediaStream = stream;
  video.srcObject = stream;
  video.classList.remove('hidden');
  imageCapture = new ImageCapture(stream.getVideoTracks()[0]);
  //getCapabilities();
}

// Get an ImageBitmap from the currently selected camera source and
// display this with a canvas element.
function takePhoto() {
  imageCapture.takePhoto()
      .then((img) => {
        image.src = URL.createObjectURL(img);
        image.setAttribute('crossOrigin', 'anonymous'); // Github CORS Policy
        image.addEventListener('load', () => createImagePieces(image));
        setInterval(() => checkDistance(), 1000);
        console.log(puzzle);

      })
      .catch((error) => { console.log('takePhoto() error: ', error) });
}