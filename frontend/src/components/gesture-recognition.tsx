import React, { useRef, useState, useEffect } from "react";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "../App.css";
import { drawHand } from "../utils/camera-utilities";
import * as fingerpose from "fingerpose";
import thumbs_up from "../assets/thumbs_up.png";
import flat_hand from "../assets/flat_hand.png";
import thumbs_down from "../assets/thumbs_down.png";

type GestureName = 'thumbs_up' | 'flat_hand' | 'thumbs_down';

interface ImageMap {
  [key: string]: string;
}

// Create the flat hand gesture
const FlatHandGesture = new fingerpose.GestureDescription("flat_hand");

for (let finger of [
  fingerpose.Finger.Thumb,
  fingerpose.Finger.Index,
  fingerpose.Finger.Middle,
  fingerpose.Finger.Ring,
  fingerpose.Finger.Pinky,
]) {
  FlatHandGesture.addCurl(finger, fingerpose.FingerCurl.NoCurl, 1.0);
  FlatHandGesture.addDirection(finger, fingerpose.FingerDirection.HorizontalRight, 0.9);
  FlatHandGesture.addDirection(finger, fingerpose.FingerDirection.HorizontalLeft, 0.9);
}

// Create thumbs down gesture
const thumbsDownGesture = new fingerpose.GestureDescription('thumbs_down');

thumbsDownGesture.addCurl(fingerpose.Finger.Thumb, fingerpose.FingerCurl.NoCurl);
thumbsDownGesture.addDirection(fingerpose.Finger.Thumb, fingerpose.FingerDirection.VerticalDown, 1.0);
thumbsDownGesture.addDirection(fingerpose.Finger.Thumb, fingerpose.FingerDirection.DiagonalDownLeft, 0.9);
thumbsDownGesture.addDirection(fingerpose.Finger.Thumb, fingerpose.FingerDirection.DiagonalDownRight, 0.9);

for(let finger of [fingerpose.Finger.Index, fingerpose.Finger.Middle, fingerpose.Finger.Ring, fingerpose.Finger.Pinky]) {
  thumbsDownGesture.addCurl(finger, fingerpose.FingerCurl.FullCurl, 1.0);
  thumbsDownGesture.addCurl(finger, fingerpose.FingerCurl.HalfCurl, 0.9);
}

const App: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emoji, setEmoji] = useState<GestureName | null>(null);
  
  const images: ImageMap = {
    thumbs_up: thumbs_up,
    flat_hand: flat_hand,
    thumbs_down: thumbs_down,
  };

  const runHandpose = async (): Promise<void> => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net: any): Promise<void> => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video && 
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      
      video.width = videoWidth;
      video.height = videoHeight;
      
      if (canvasRef.current) {
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
      }
      
      const hand = await net.estimateHands(video);
      
      if (hand.length > 0) {
        const GE = new fingerpose.GestureEstimator([
          fingerpose.Gestures.ThumbsUpGesture,
          FlatHandGesture,
          thumbsDownGesture,
        ]);
        
        const gesture = await GE.estimate(hand[0].landmarks, 4);
        
        if (gesture.gestures && gesture.gestures.length > 0) {
          // Create an array of confidence scores from the gestures
          const confidences = gesture.gestures.map(
            (prediction: any) => prediction.score
          );
          // Find the index of the gesture with highest confidence
          const maxConfidenceIndex = confidences.indexOf(
            Math.max(...confidences)
          );
          
          setEmoji(gesture.gestures[maxConfidenceIndex].name as GestureName);
          console.log(emoji);
        }
      }
      
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          drawHand(hand, ctx);
        }
      }
    }
  };

  useEffect(() => {
    runHandpose();
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
        {emoji !== null ? (
          <img
            src={images[emoji]}
            alt={emoji}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 400,
              bottom: 500,
              right: 0,
              textAlign: "center",
              height: 100,
            }}
          />
        ) : (
          ""
        )}
      </header>
    </div>
  );
};

export default App;