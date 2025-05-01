import React, { useRef, useState, useEffect } from "react";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import { drawHand } from "../utils/camera-utilities";
import * as fingerpose from "fingerpose";
import thumbs_up from "../assets/thumbs_up.png";
import flat_hand from "../assets/flat_hand.png";
import victory from "../assets/victory.png";
import * as tf from '@tensorflow/tfjs';

type GestureName = 'thumbs_up' | 'flat_hand' | 'victory';

interface ImageMap {
  [key: string]: string;
}

interface GestureRecognitionProps {
  onGestureDetected: (gesture: 'wrong' | 'hard' | 'easy') => void;
  isEnabled: boolean;
}

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

FlatHandGesture.addDirection(fingerpose.Finger.Index, fingerpose.FingerDirection.VerticalUp, 1.2);
FlatHandGesture.addDirection(fingerpose.Finger.Middle, fingerpose.FingerDirection.VerticalUp, 1.2);

const gestureToRating = {
  thumbs_up: 'easy',
  flat_hand: 'hard',
  victory: 'wrong'
};

const GestureRecognition: React.FC<GestureRecognitionProps> = ({ onGestureDetected, isEnabled }) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emoji, setEmoji] = useState<GestureName | null>(null);
  const [lastDetectedGesture, setLastDetectedGesture] = useState<GestureName | null>(null);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownProgress, setCooldownProgress] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const modelRef = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);
  const gestureStreakRef = useRef<{
    gesture: GestureName | null;
    startTime: number | null;
    progressInterval: number | null;
  }>({
    gesture: null,
    startTime: null,
    progressInterval: null
  });
  
  const images: ImageMap = {
    thumbs_up: thumbs_up,
    flat_hand: flat_hand,
    victory: victory,
  };

  useEffect(() => {
    let isMounted = true;

    const setupTF = async () => {
      try {
        await tf.ready();
        console.log("TensorFlow ready");
        
        if (tf.env().getNumber('WEBGL_DELETE_TEXTURE_THRESHOLD') !== undefined) {
          tf.env().set('WEBGL_DELETE_TEXTURE_THRESHOLD', 0);
          console.log("Set WebGL texture cleanup threshold to 0");
        }
        
        try {
          await tf.setBackend('webgl');
          console.log("Using WebGL backend");
        } catch (e) {
          console.warn("WebGL backend failed, trying wasm", e);
          try {
            await tf.setBackend('wasm');
            console.log("Using WASM backend");
          } catch (e2) {
            console.warn("WASM backend failed, falling back to CPU", e2);
            await tf.setBackend('cpu');
            console.log("Using CPU backend");
          }
        }
        
        console.log("Loading handpose model...");
        
        try {
          const modelPromise = handpose.load({
            detectionConfidence: 0.5,
            maxContinuousChecks: 10,
            iouThreshold: 0.3,
            scoreThreshold: 0.75
          });
          
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Model loading timed out")), 30000);
          });
          
          modelRef.current = await Promise.race([modelPromise, timeoutPromise]);
          
          console.log("Handpose model loaded successfully");
          
          if (isMounted) {
            setModelLoaded(true);
            startDetection();
          }
        } catch (modelError) {
          console.error("Error loading handpose model:", modelError);
          if (isMounted) {
            setError(`Failed to load handpose model: ${modelError}`);
          }
        }
      } catch (error) {
        console.error("Error setting up TensorFlow:", error);
        if (isMounted) {
          setError(`Failed to initialize TensorFlow.js: ${error}`);
        }
      }
    };
    
    setupTF();
    
    return () => {
      isMounted = false;
      stopDetection();
      resetGestureRecognition();
      if (tf.engine && typeof tf.engine().endScope === 'function') {
        try {
          tf.engine().endScope();
          tf.engine().disposeVariables();
          console.log("TensorFlow memory cleaned up");
        } catch (e) {
          console.warn("Error cleaning up TensorFlow memory:", e);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (modelLoaded) {
      if (isEnabled && !cooldownActive) {
        startDetection();
      } else {
        stopDetection();
        if (!isEnabled) {
          setEmoji(null);
          setLastDetectedGesture(null);
          setCooldownActive(false);
          setCooldownProgress(0);
          resetGestureRecognition();
        }
      }
    }
    
    return () => {
      stopDetection();
      resetGestureRecognition();
    };
  }, [isEnabled, cooldownActive, modelLoaded]);
  
  useEffect(() => {
    if (isEnabled && !cooldownActive) {
      if (emoji) {
        if (gestureStreakRef.current.gesture !== emoji) {
          console.log(`New gesture detected: ${emoji}`);
          resetGestureRecognition();
          
          gestureStreakRef.current.gesture = emoji;
          gestureStreakRef.current.startTime = Date.now();
          setLastDetectedGesture(emoji);
          
          startProgressTracking();
        }
      } else {
        if (gestureStreakRef.current.gesture !== null) {
          console.log("No gesture detected, resetting tracking");
          resetGestureRecognition();
          setLastDetectedGesture(null);
          setCooldownProgress(0);
        }
      }
    }
  }, [emoji, cooldownActive, isEnabled]);

  const startDetection = () => {
    stopDetection();
    
    if (modelRef.current) {
      intervalRef.current = window.setInterval(() => {
        detect(modelRef.current);
      }, 100) as unknown as number;
      
      console.log("Detection started");
    }
  };
  
  const stopDetection = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("Detection stopped");
    }
  };

  const resetGestureRecognition = () => {
    if (gestureStreakRef.current.progressInterval) {
      clearInterval(gestureStreakRef.current.progressInterval);
      gestureStreakRef.current = {
        gesture: null,
        startTime: null,
        progressInterval: null
      };
    }
    setCooldownProgress(0);
  };

  const startProgressTracking = () => {
    if (gestureStreakRef.current.progressInterval) {
      clearInterval(gestureStreakRef.current.progressInterval);
    }
    
    const startTime = Date.now();
    const requiredDuration = 3000;
    
    gestureStreakRef.current.progressInterval = window.setInterval(() => {
      const now = Date.now();
      const elapsedTime = now - startTime;
      const progress = Math.min(100, (elapsedTime / requiredDuration) * 100);
      
      setCooldownProgress(progress);
      
      if (progress >= 100) {
        completeGestureRating();
      }
    }, 50) as unknown as number;
  };

  const completeGestureRating = () => {
    const detectedGesture = gestureStreakRef.current.gesture;
    
    if (detectedGesture) {
      console.log(`Completed gesture recognition for: ${detectedGesture}`);
      
      resetGestureRecognition();
      
      setCooldownActive(true);
      
      console.log(`Triggering action for ${detectedGesture}`);
      onGestureDetected(gestureToRating[detectedGesture] as 'wrong' | 'hard' | 'easy');
      
      setTimeout(() => {
        setCooldownActive(false);
        setLastDetectedGesture(null);
      }, 1500);
    }
  };

  const detect = async (net: any): Promise<void> => {
    if (!net) return;
    
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video && 
      webcamRef.current.video.readyState === 4
    ) {
      try {
        const video = webcamRef.current.video;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
        
        if (canvasRef.current) {
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;
        }
        
        const hand = await net.estimateHands(video);
        
        if (hand.length > 0) {
          const GE = new fingerpose.GestureEstimator([
            fingerpose.Gestures.ThumbsUpGesture,
            FlatHandGesture,
            fingerpose.Gestures.VictoryGesture,
          ]);
          
          try {
            const gesture = await GE.estimate(hand[0].landmarks, 4);
            
            if (gesture.gestures && gesture.gestures.length > 0) {
              const sortedGestures = gesture.gestures.sort(
                (a: any, b: any) => b.score - a.score
              );
              
              const topGesture = sortedGestures[0];
              console.log(`Detected ${topGesture.name} with confidence ${topGesture.score.toFixed(2)}`);
              
              if (topGesture.score > 5) {
                setEmoji(topGesture.name as GestureName);
              } else {
                setEmoji(null);
              }
            } else {
              setEmoji(null);
            }
          } catch (gestureError) {
            console.error("Error estimating gesture:", gestureError);
            setEmoji(null);
          }
        } else {
          setEmoji(null);
        }
        
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            try {
              ctx.clearRect(0, 0, videoWidth, videoHeight);
              drawHand(hand, ctx);
            } catch (drawError) {
              console.error("Error drawing hand:", drawError);
            }
          }
        }
        
        tf.disposeVariables();
        
      } catch (error) {
        console.error("Error in detect function:", error);
        setEmoji(null);
      } finally {
        if (tf.memory().numTensors > 100) {
          console.warn(`High tensor count: ${tf.memory().numTensors}. Cleaning up...`);
          tf.disposeVariables();
        }
      }
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>Error: {error}</p>
        <p className="text-sm mt-2">Please check camera permissions and try again.</p>
      </div>
    );
  }

  return (
    <div className="gesture-recognition">
      <div className="flex flex-col gap-2">
        <div className="relative" style={{ width: '300px', height: '250px' }}>
          <Webcam
            ref={webcamRef}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              objectFit: 'cover'
            }}
            mirrored={true}
            videoConstraints={{
              facingMode: "user",
              width: 320,
              height: 240
            }}
            onUserMediaError={(err) => {
              console.error("Webcam error:", err);
              setError("Failed to access camera. Please check permissions.");
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
          
          {!modelLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
              Loading model...
            </div>
          )}
          
          {lastDetectedGesture && !cooldownActive && (
            <div className="absolute bottom-0 left-0 w-full">
              <div className="h-1 bg-gray-300">
                <div 
                  className="h-full bg-blue-500 transition-all duration-100"
                  style={{ width: `${cooldownProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {lastDetectedGesture && (
            <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
              <img
                src={images[lastDetectedGesture]}
                alt={lastDetectedGesture}
                style={{
                  height: 30,
                  width: 30,
                }}
              />
            </div>
          )}
          
          <div className="absolute bottom-3 left-2 text-xs bg-black bg-opacity-50 text-white px-1 py-0.5 rounded">
            {cooldownActive ? (
              <span>Rating processed!</span>
            ) : lastDetectedGesture ? (
              <span>Hold for {Math.ceil((3 - (cooldownProgress / 100) * 3))}s...</span>
            ) : (
              <span>
                👍 = Easy<br />
                ✋ = Hard<br />
                ✌️ = Wrong
              </span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between gap-1">
          <button 
            onClick={() => isEnabled && !cooldownActive && onGestureDetected('wrong')}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-2 rounded"
            disabled={cooldownActive || !isEnabled}
          >
            Wrong ✌️
          </button>
          <button 
            onClick={() => isEnabled && !cooldownActive && onGestureDetected('hard')}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold py-1 px-2 rounded"
            disabled={cooldownActive || !isEnabled}
          >
            Hard ✋
          </button>
          <button 
            onClick={() => isEnabled && !cooldownActive && onGestureDetected('easy')}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1 px-2 rounded"
            disabled={cooldownActive || !isEnabled}
          >
            Easy 👍
          </button>
        </div>
      </div>
    </div>
  );
};

export default GestureRecognition;