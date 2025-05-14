let mediaRecorder;
let recordedChunks = [];
let stream;
let timerInterval;
let seconds = 0;

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const stopBtn = document.getElementById('stopBtn');
const videoElement = document.getElementById('recordedVideo');
const timerElement = document.getElementById('timer');

startBtn.onclick = async () => {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    mediaRecorder = new MediaRecorder(stream);
    recordedChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      videoElement.src = url;
      videoElement.style.display = 'block';

      const a = document.createElement('a');
      a.href = url;
      a.download = 'screen-recording.webm';
      a.click();
    };

    mediaRecorder.start();
    startTimer();

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;

  } catch (err) {
    alert("Screen recording failed: " + err.message);
  }
};

pauseBtn.onclick = () => {
  mediaRecorder.pause();
  pauseTimer();
  pauseBtn.disabled = true;
  resumeBtn.disabled = false;
};

resumeBtn.onclick = () => {
  mediaRecorder.resume();
  resumeTimer();
  pauseBtn.disabled = false;
  resumeBtn.disabled = true;
};

stopBtn.onclick = () => {
  mediaRecorder.stop();
  stream.getTracks().forEach(track => track.stop());
  stopTimer();

  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resumeBtn.disabled = true;
  stopBtn.disabled = true;
};

// Timer logic
function startTimer() {
  seconds = 0;
  timerElement.textContent = "00:00";
  timerInterval = setInterval(() => {
    seconds++;
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    timerElement.textContent = `${mins}:${secs}`;
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
}

function resumeTimer() {
  startTimer(); // continues counting up
}

function stopTimer() {
  clearInterval(timerInterval);
  timerElement.textContent = "00:00";
}
