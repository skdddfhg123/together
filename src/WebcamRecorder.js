import React, { useState, useRef } from 'react';
import Sketch from 'react-p5';
import GIF from 'gif.js';

const WebcamRecorder = () => {
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [gifURL, setGifURL] = useState(null);
  const [previousGifURL, setPreviousGifURL] = useState(null);
  const [delay, setDelay] = useState(100);
  const [repeat, setRepeat] = useState(0);
  const [quality, setQuality] = useState(10);
  const [dither, setDither] = useState('FloydSteinberg');
  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(480);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("GRAY");
  const [effect, setEffect] = useState("None");

  const recorder = useRef(null);
  const videoRef = useRef(null);
  const gifRef = useRef(null);
  const canvasRef = useRef(null);

  const setup = (p5, canvasParentRef) => {
    const canvas = p5.createCanvas(width, height).parent(canvasParentRef);
    canvasRef.current = canvas;
    videoRef.current = p5.createCapture(p5.VIDEO);
    videoRef.current.size(width, height);
    videoRef.current.hide();
  };

  const draw = (p5) => {
    if (videoRef.current && videoRef.current.width > 0 && videoRef.current.height > 0) {
    p5.image(videoRef.current, 0, 0, width, height);
      
      if (effect === 'None') {
      }
      else if (effect === "Rain") {
        for (let i = 0; i < 100; i++) {
            const x = p5.random(width);
            const y = p5.random(height);
            p5.stroke(138, 43, 226, 200);
            p5.line(x, y, x, y + 10);
        }
      } 
      else if (effect === "ZoomIn&Out") {
        const zoomFactor = p5.map(p5.noise(p5.frameCount * 0.01), 0, 1, 0.1, 2); // Randomly change zoom factor
        const zoomedWidth = width * zoomFactor;
        const zoomedHeight = height * zoomFactor;
        const offsetX = (width - zoomedWidth) / 2;
        const offsetY = (height - zoomedHeight) / 2;
        p5.image(videoRef.current, offsetX, offsetY, zoomedWidth, zoomedHeight);
      }
      else if (effect === "Screw") {
        const rotationAngle = p5.map(p5.sin(p5.frameCount * 0.05), -1, 1, 0, p5.TWO_PI); // Rotate one full circle
        const centerX = width / 2;
        const centerY = height / 2;
        const rotatedWidth = width * 1.5; // Increase width for rotation effect
        const rotatedHeight = height * 1.5; // Increase height for rotation effect
        p5.translate(centerX, centerY);
        p5.rotate(rotationAngle);
        p5.image(videoRef.current, -rotatedWidth / 2, -rotatedHeight / 2, rotatedWidth, rotatedHeight);
      }
      else if (effect === "Flash") {
        if (p5.random() < 0.1) {  // 10% chance per frame
          p5.background(255);  // Flash a white screen
        }
      }

      // Apply filter
      if (filter === "GRAY") p5.filter(p5.GRAY);
      else if (filter === "INVERT") p5.filter(p5.INVERT);
      else if (filter === "POSTERIZE") p5.filter(p5.POSTERIZE, 3);
      else if (filter === "THRESHOLD") p5.filter(p5.THRESHOLD);
      else if (filter === "BLUR") p5.filter(p5.BLUR, 3);
      else if (filter === "OPAQUE") p5.filter(p5.OPAQUE);
      
      // Draw text
      if (text) {
        p5.fill(255);
        p5.textSize(32);
        p5.text(text, 10, height - 30);
      }
    }
  };

  const startCapture = () => {
    setRecordedChunks([]);
    setGifURL(null);
    setCapturing(true);
    const stream = document.querySelector("canvas").captureStream(30);
    recorder.current = new MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.current.ondataavailable = event => {
      if (event.data.size > 0) {
        setRecordedChunks(prev => prev.concat(event.data));
      }
    };
    recorder.current.start();
    setTimeout(stopCapture, 4000);  // 4초 동안 녹화
  };

  const stopCapture = () => {
    recorder.current.stop();
    setCapturing(false);
  };

  const convertToGif = () => {
    if (gifURL) {
      setPreviousGifURL(gifURL);
    }

    gifRef.current = new GIF({
      workers: 2,
      quality: quality,
      workerScript: `${process.env.PUBLIC_URL}/gif.worker.js`,
      width: width,
      height: height,
      repeat: repeat,
      dither: dither,
    });

    const addFramePromises = recordedChunks.map(chunk => {
      return new Promise((resolve, reject) => {
        const videoElement = document.createElement("video");
        videoElement.src = URL.createObjectURL(chunk);
        videoElement.addEventListener("loadeddata", () => {
          videoElement.currentTime = 0;
          videoElement.play();

          // 캔버스에 영상 프레임을 복사하여 추가
          videoElement.addEventListener("timeupdate", () => {
            if (!canvasRef.current) {
              reject("Canvas reference lost");
              return;
            }

            const canvas = canvasRef.current.elt;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoElement, 0, 0, width, height);
            gifRef.current.addFrame(ctx, { copy: true, delay: delay });
          });

          videoElement.addEventListener("ended", resolve);
        });
        videoElement.onerror = reject;
      });
    });

    Promise.all(addFramePromises).then(() => {
      gifRef.current.on("finished", (blob) => {
        setGifURL(URL.createObjectURL(blob));
      });

      gifRef.current.render();
    });
  };

  const download = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "p5-webcam-video.webm";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    }
  };

  const handleDelayChange = (e) => setDelay(Number(e.target.value));
  const handleRepeatChange = (e) => setRepeat(Number(e.target.value));
  const handleQualityChange = (e) => setQuality(Number(e.target.value));
  const handleDitherChange = (e) => setDither(e.target.value);
  const handleWidthChange = (e) => setWidth(Number(e.target.value));
  const handleHeightChange = (e) => setHeight(Number(e.target.value));
  const handleTextChange = (e) => setText(e.target.value);
  const handleFilterChange = (e) => setFilter(e.target.value);
  const handleEffectChange = (e) => setEffect(e.target.value);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {previousGifURL && (
          <div>
            <h2>Previous GIF</h2>
            <img src={previousGifURL} alt="Previous GIF" />
          </div>
        )}
        {gifURL && (
          <div>
            <h2>Generated GIF</h2>
            <img src={gifURL} alt="Generated GIF" />
          </div>
        )}
      </div>

      <Sketch setup={setup} draw={draw} />
      <div>
        {capturing ? (
          <button onClick={stopCapture}>Stop Capture</button>
        ) : (
          <button onClick={startCapture}>Start Capture</button>
        )}
        <button onClick={download} disabled={recordedChunks.length === 0}>
          Download Video
        </button>
        <button onClick={convertToGif} disabled={recordedChunks.length === 0}>
          Convert to GIF
        </button>

        <div>
          <label>
            Delay (ms):
            <input type="number" value={delay} onChange={handleDelayChange} />
          </label>
        </div>
        <div>
          <label>
            Repeat:
            <input type="number" value={repeat} onChange={handleRepeatChange} />
          </label>
        </div>
        <div>
          <label>
            Quality:
            <input type="number" value={quality} onChange={handleQualityChange} min="1" max="20" />
          </label>
        </div>
        <div>
          <label>
            Dither:
            <select value={dither} onChange={handleDitherChange}>
              <option value="FloydSteinberg">FloydSteinberg</option>
              <option value="FalseFloydSteinberg">FalseFloydSteinberg</option>
              <option value="Stucki">Stucki</option>
              <option value="Atkinson">Atkinson</option>
              <option value="Jarvis">Jarvis</option>
              <option value="Burkes">Burkes</option>
              <option value="Sierra">Sierra</option>
              <option value="TwoSierra">TwoSierra</option>
              <option value="SierraLite">SierraLite</option>
              <option value="none">None</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Width:
            <input type="number" value={width} onChange={handleWidthChange} min="1" />
          </label>
        </div>
        <div>
          <label>
            Height:
            <input type="number" value={height} onChange={handleHeightChange} min="1" />
          </label>
        </div>
        <div>
          <label>
            Text:
            <input type="text" value={text} onChange={handleTextChange} />
          </label>
        </div>
        <div>
          <label>
            Filter:
            <select value={filter} onChange={handleFilterChange}>
              <option value="GRAY">Gray</option>
              <option value="INVERT">Invert</option>
              <option value="POSTERIZE">Posterize</option>
              <option value="THRESHOLD">Threshold</option>
              <option value="BLUR">Blur</option>
              <option value="OPAQUE">Opaque</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Effect:
            <select value={effect} onChange={handleEffectChange}>
              <option value="None">None</option>
              <option value="Rain">Rain</option>
              <option value="ZoomIn&Out">ZoomIn&Out</option>
              <option value="Screw">Screw</option>
              <option value="Shake">Shake</option>
              <option value="Flash">Flash</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default WebcamRecorder;