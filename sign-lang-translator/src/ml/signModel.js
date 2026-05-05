import * as tf from "@tensorflow/tfjs";

// Expose tf to window so that the CDN scripts can access it
window.tf = tf;

export const MODEL_URL = "/models/isl-alphabet/model.json?v=20260505-repaired";
export const LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export const IMAGE_SIZE = 96;
export const CONFIDENCE_THRESHOLD = 0.75;
export const STABLE_FRAMES = 3;

let modelPromise;
let detectorPromise;

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.crossOrigin = "anonymous";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function loadSignModel() {
  if (!modelPromise) {
    modelPromise = tf.loadLayersModel(MODEL_URL);
  }
  return modelPromise;
}

export async function loadHandDetector() {
  if (!detectorPromise) {
    detectorPromise = (async () => {
      // Dynamically load the scripts in order
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection/dist/hand-pose-detection.js");

      const model = window.handPoseDetection.SupportedModels.MediaPipeHands;
      const detectorConfig = {
        runtime: "mediapipe",
        solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
        modelType: "lite",
        maxHands: 1,
      };
      return window.handPoseDetection.createDetector(model, detectorConfig);
    })();
  }
  return detectorPromise;
}

export async function predictFromVideo(model, detector, video) {
  // First, detect hands
  const hands = await detector.estimateHands(video);
  if (!hands || hands.length === 0) {
    return { letter: null, confidence: 0, scores: [] };
  }

  // Get bounding box of the first hand
  const hand = hands[0];
  if (!hand.keypoints || hand.keypoints.length === 0) {
    return { letter: null, confidence: 0, scores: [] };
  }

  // Calculate bounding box
  const xs = hand.keypoints.map((kp) => kp.x);
  const ys = hand.keypoints.map((kp) => kp.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  // Add padding and make it square
  const width = maxX - minX;
  const height = maxY - minY;
  const size = Math.max(width, height) * 1.5; // 50% padding
  const centerX = minX + width / 2;
  const centerY = minY + height / 2;

  const startX = Math.max(0, centerX - size / 2);
  const startY = Math.max(0, centerY - size / 2);
  const endX = Math.min(video.videoWidth, centerX + size / 2);
  const endY = Math.min(video.videoHeight, centerY + size / 2);

  return tf.tidy(() => {
    const frame = tf.browser.fromPixels(video);
    const floatFrame = frame.toFloat();
    const batchedFrame = floatFrame.expandDims(0);
    
    // tf.image.cropAndResize expects boxes as [y1, x1, y2, x2] normalized to [0, 1]
    const boxes = [[
      startY / video.videoHeight,
      startX / video.videoWidth,
      endY / video.videoHeight,
      endX / video.videoWidth
    ]];
    const boxIndices = [0];
    const cropSize = [IMAGE_SIZE, IMAGE_SIZE];
    
    const resized = tf.image.cropAndResize(batchedFrame, boxes, boxIndices, cropSize);
    const normalized = resized.div(255);
    
    const prediction = model.predict(normalized);
    const scores = Array.from(prediction.dataSync());
    const confidence = Math.max(...scores);
    const index = scores.indexOf(confidence);

    return {
      letter: LABELS[index] ?? null,
      confidence,
      scores,
    };
  });
}
