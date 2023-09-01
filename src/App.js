import React, { useRef, useEffect } from "react";
import "./App.css";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawMesh, measureDistance } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runFacemesh = async () => {
      const model = facemesh.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig = {
        runtime: "tfjs",
        solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
      };
      const detector = await facemesh.createDetector(model, detectorConfig);

      const detectAndDraw = async () => {
        if (
          webcamRef.current &&
          webcamRef.current.video.readyState === 4
        ) {
          const video = webcamRef.current.video;
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;

          webcamRef.current.video.width = videoWidth;
          webcamRef.current.video.height = videoHeight;

          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;

          const face = await detector.estimateFaces(video);

          const ctx = canvasRef.current.getContext("2d");
          requestAnimationFrame(() => {
            drawMesh(face, ctx);
          });
        }
      };

      setInterval(detectAndDraw, 10);
    };

    runFacemesh();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
