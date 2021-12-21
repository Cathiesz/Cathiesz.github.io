function getLocalStream() {
  
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(function(stream) {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(stream);
    javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);
    javascriptNode.onaudioprocess = function() {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var values = 0;

        var length = array.length;
        for (var i = 0; i < length; i++) {
            values += (array[i]);
        }

        var average = values / length;

        console.log(Math.round(average));
        colorPids(average);

        if(average > 50) {
            volumeTreshold();
        }
    }
    })
    .catch(function(err) {
        /* handle the error */
        console.log("u got an error:" + err);
        alert("We need your permission to use this feature in order to play a game with you");
    });
}

function colorPids(vol) {
    let all_pids = $('.pid');
    let amout_of_pids = Math.round(vol/10);
    let elem_range = all_pids.slice(0, amout_of_pids)
    for (var i = 0; i < all_pids.length; i++) {
      all_pids[i].style.backgroundColor="#e6e7e8";
    }
    for (var i = 0; i < elem_range.length; i++) {
  
      // console.log(elem_range[i]);
      elem_range[i].style.backgroundColor="#69ce2b";
    }
}

function volumeTreshold(vol) {

}
