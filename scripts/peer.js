const localVideo = document.getElementById("local-video");
const remoteVideo = document.getElementById("remote-video");
var peer = new Peer();
var peerId ;
let watchers = [];


peer.on('open', function(id) {
    peerId = id;
    if(window.location.hash == "#host"){
      console.log('My peer ID is: ' + id);
    document.getElementById('host').innerHTML = id;
    getUserMedia({video: true, audio: true}, function(stream) {
      remoteVideo.srcObject = stream;
      remoteVideo.muted = true;

      document.getElementById('make-call').disabled =true;
      
    }, function(err) {
      console.log('Failed to get local stream' ,err);
    });
    }
  });

  document.getElementById('make-call').addEventListener('click', async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    console.log(id);
    callUser(id)
})

var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function callUser(id){

  if(id && !window.location.hash){
    getUserMedia({video: true, audio: true}, function(stream) {
   var call = peer.call(id, stream);
      localVideo.srcObject = stream;
      call.on('stream', function(remoteStream) {
        // Show stream in some video/canvas element.      
        remoteVideo.srcObject = remoteStream
      document.getElementById('make-call').disabled =true;
      });
    }, function(err) {
      console.log('Failed to get local stream' ,err);
    });
  }
  
  

  
  
}

peer.on('call', function(call) {
  getUserMedia({video: true, audio: true}, function(stream) {
    // localVideo.srcObject = stream
    call.answer(stream); // Answer the call with an A/V stream.
    call.on('stream', function(remoteStream) {

   var obj = document.createElement('video');
     obj.className += "local-video"
     obj.srcObject = remoteStream;
     obj.autoplay = true;
     obj.muted = true;
     obj.id = call.peer;
     displayWatchers(obj)
      document.getElementById('make-call').disabled =true;
    });
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });
});

function displayWatchers(obj){
  if(!(watchers.find(video => video.id === obj.id ))){
    watchers.push(obj);
  }

    $("#local-Videos").empty();
    watchers.forEach((video,index) => {
      console.log('index=>',index);
      $("#local-Videos").append(video);
    });
}