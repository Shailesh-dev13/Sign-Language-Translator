import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, RefreshCw } from "lucide-react";
import {
  CONFIDENCE_THRESHOLD,
  STABLE_FRAMES,
  loadSignModel,
  loadHandDetector,
  predictFromVideo,
} from "../ml/signModel";

const VIDEO_CONSTRAINTS = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const PREDICTION_INTERVAL_MS = 450;
const EMIT_COOLDOWN_MS = 1600;

export default function TranslatorView({ onNewLetter }) {
  const webcamRef = useRef(null);
  const stableRef = useRef({ letter: null, count: 0 });
  const lastEmitRef = useRef({ letter: null, time: 0 });

  const [prediction, setPrediction] = useState({ letter: null, confidence: null });
  const [modelStatus, setModelStatus] = useState("loading");
  const [modelError, setModelError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isOn, setIsOn] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([loadSignModel(), loadHandDetector()])
      .then(() => {
        if (!cancelled) {
          setModelStatus("ready");
          setModelError("");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setModelStatus("missing");
          setModelError(error?.message || "Could not load ML models.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isReady || !isOn || modelStatus !== "ready") return;

    let cancelled = false;
    let isPredicting = false;
    let model;
    let detector;

    const emitIfStable = (letter, confidence) => {
      if (!letter || confidence < CONFIDENCE_THRESHOLD) {
        stableRef.current = { letter: null, count: 0 };
        return;
      }

      const previous = stableRef.current;
      const count = previous.letter === letter ? previous.count + 1 : 1;
      stableRef.current = { letter, count };

      const now = Date.now();
      const lastEmit = lastEmitRef.current;
      const canEmit =
        count >= STABLE_FRAMES &&
        (lastEmit.letter !== letter || now - lastEmit.time > EMIT_COOLDOWN_MS);

      if (canEmit && onNewLetter) {
        lastEmitRef.current = { letter, time: now };
        onNewLetter(letter);
      }
    };

    loadSignModel().then((loadedModel) => {
      model = loadedModel;
    });
    
    loadHandDetector().then((loadedDetector) => {
      detector = loadedDetector;
    });

    const interval = setInterval(async () => {
      if (cancelled || isPredicting || !model || !detector) return;

      const video = webcamRef.current?.video;
      if (!video || video.readyState < 2) return;

      isPredicting = true;
      try {
        const nextPrediction = await predictFromVideo(model, detector, video);
        if (!cancelled) {
          setPrediction({
            letter: nextPrediction.letter,
            confidence: nextPrediction.confidence,
          });
          emitIfStable(nextPrediction.letter, nextPrediction.confidence);
        }
      } catch (error) {
        if (!cancelled) {
          setModelStatus("error");
          setModelError(error?.message || "Prediction failed.");
        }
      } finally {
        isPredicting = false;
      }
    }, PREDICTION_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isReady, isOn, modelStatus, onNewLetter]);

  const getBarColor = (score) => {
    if (score >= 0.95) return "#10B981";
    if (score >= 0.90) return "#FBBF24";
    return "#FB923C";
  };

  const getTextColor = (score) => {
    if (score >= 0.95) return "#10B981";
    if (score >= 0.90) return "#FBBF24";
    return "#FB923C";
  };

  const getStatusText = () => {
    if (cameraError) return "Camera access failed";
    if (!isReady) return "Waiting for camera...";
    if (!isOn) return "Camera paused";
    if (modelStatus === "loading") return "Loading ML model...";
    if (modelStatus === "missing") return "Model files missing";
    if (modelStatus === "error") return "Prediction error";
    return "Live ML detection";
  };

  const showBlockingOverlay = !isReady || Boolean(cameraError);
  const showModelNotice = isReady && isOn && modelStatus !== "ready";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
      <motion.div
        className="glass-card"
        style={{
          overflow: "hidden",
          position: "relative",
          borderRadius: "20px",
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Camera size={16} color="#FF9933" />
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#F9FAFB" }}>
              Video Capture
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#9CA3AF" }}>
              {isOn ? "On" : "Off"}
            </span>
            <button
              onClick={() => setIsOn((p) => !p)}
              style={{
                width: 44,
                height: 24,
                borderRadius: "12px",
                background: isOn
                  ? "linear-gradient(135deg, #FF9933, #FFD54F)"
                  : "rgba(255,255,255,0.1)",
                border: "none",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.3s",
                padding: 0,
              }}
            >
              <motion.div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "white",
                  position: "absolute",
                  top: 3,
                }}
                animate={{ left: isOn ? 23 : 3 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          {showBlockingOverlay && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(24, 24, 27, 0.8)",
                gap: "12px",
                aspectRatio: "16/9",
                padding: "24px",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.1)",
                  borderTopColor: modelStatus === "missing" ? "#FBBF24" : "#FF9933",
                  animation: modelStatus === "missing" ? "none" : "spin 1s linear infinite",
                }}
              />
              <p style={{ color: "#9CA3AF", fontSize: "13px", fontFamily: "JetBrains Mono, monospace" }}>
                {getStatusText()}
              </p>
              {modelStatus === "missing" && (
                <p
                  style={{
                    maxWidth: 380,
                    color: "#9CA3AF",
                    fontSize: "12px",
                    lineHeight: 1.5,
                    textAlign: "center",
                  }}
                >
                  Train the model, then place TensorFlow.js files at
                  {" "}
                  <span style={{ color: "#F9FAFB" }}>public/models/isl-alphabet/model.json</span>
                </p>
              )}
              {cameraError && (
                <p
                  style={{
                    maxWidth: 380,
                    color: "#FCA5A5",
                    fontSize: "12px",
                    lineHeight: 1.5,
                    textAlign: "center",
                  }}
                >
                  {cameraError}
                </p>
              )}
              {modelStatus === "error" && modelError && (
                <p
                  style={{
                    maxWidth: 380,
                    color: "#FCA5A5",
                    fontSize: "12px",
                    lineHeight: 1.5,
                    textAlign: "center",
                  }}
                >
                  {modelError}
                </p>
              )}
            </div>
          )}

          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={true}
            videoConstraints={VIDEO_CONSTRAINTS}
            onUserMedia={() => {
              setCameraError("");
              setIsReady(true);
            }}
            onUserMediaError={(error) => {
              setIsReady(false);
              setCameraError(error?.message || error?.name || "Camera permission was denied or no camera was found.");
            }}
            style={{ width: "100%", aspectRatio: "16/9", display: "block", objectFit: "cover" }}
          />

          {showModelNotice && (
            <div
              style={{
                position: "absolute",
                left: 16,
                right: 16,
                bottom: 16,
                zIndex: 20,
                padding: "12px 14px",
                borderRadius: "12px",
                background: "rgba(17,24,39,0.82)",
                border: "1px solid rgba(251,191,36,0.28)",
                color: "#FBBF24",
                fontSize: "12px",
                lineHeight: 1.45,
                textAlign: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              Camera preview is live. Train the model, then place TensorFlow.js files at
              {" "}
              <span style={{ color: "#F9FAFB" }}>public/models/isl-alphabet/model.json</span>
              {" "}
              to enable predictions.
            </div>
          )}

          {isReady && isOn && modelStatus === "ready" && (
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 20,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                padding: "5px 12px",
              }}
            >
              <span style={{ position: "relative", display: "flex", width: 8, height: 8 }}>
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "#EF4444",
                    opacity: 0.75,
                    animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite",
                  }}
                />
                <span
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#EF4444",
                  }}
                />
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.8)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Live ML
              </span>
            </div>
          )}

          {isReady && isOn && modelStatus === "ready" && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 20,
                background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)",
                padding: "40px 24px 20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontFamily: "JetBrains Mono, monospace",
                      color: "rgba(255,255,255,0.5)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Detected Sign
                  </span>
                  <AnimatePresence mode="wait">
                    {prediction.letter ? (
                      <motion.div
                        key={prediction.letter}
                        initial={{ opacity: 0, y: 14, scale: 0.85 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                        style={{
                          fontSize: "60px",
                          fontWeight: 700,
                          lineHeight: 1,
                          color: "white",
                          textShadow: "0 0 30px rgba(255,153,51,0.5)",
                        }}
                      >
                        {prediction.letter}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          fontSize: "44px",
                          color: "rgba(255,255,255,0.3)",
                          fontFamily: "JetBrains Mono, monospace",
                          lineHeight: 1,
                        }}
                      >
                        -
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                  {prediction.confidence && (
                    <motion.div
                      key={prediction.confidence}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "8px",
                        minWidth: "120px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            fontFamily: "JetBrains Mono, monospace",
                            color: "rgba(255,255,255,0.5)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                          }}
                        >
                          Confidence
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontFamily: "JetBrains Mono, monospace",
                            fontWeight: 600,
                            color: getTextColor(prediction.confidence),
                          }}
                        >
                          {Math.round(prediction.confidence * 100)}%
                        </span>
                      </div>

                      <div
                        style={{
                          width: "100%",
                          height: 5,
                          background: "rgba(255,255,255,0.1)",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          style={{
                            height: "100%",
                            borderRadius: "4px",
                            background: getBarColor(prediction.confidence),
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round(prediction.confidence * 100)}%` }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "12px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#9CA3AF",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,153,51,0.3)";
              e.currentTarget.style.color = "#F9FAFB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "#9CA3AF";
            }}
          >
            <RefreshCw size={14} />
            Switch Camera
          </button>
        </div>
      </motion.div>
    </div>
  );
}
