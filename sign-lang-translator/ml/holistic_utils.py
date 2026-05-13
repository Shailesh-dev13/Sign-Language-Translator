import cv2
import mediapipe as mp
import numpy as np

# MediaPipe setup
mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils


def mediapipe_detection(image, model):

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    image.flags.writeable = False

    results = model.process(image)

    image.flags.writeable = True

    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    return image, results


def draw_landmarks(image, results):

    # Pose
    if results.pose_landmarks:
        mp_drawing.draw_landmarks(
            image,
            results.pose_landmarks,
            mp_holistic.POSE_CONNECTIONS
        )

    # Left Hand
    if results.left_hand_landmarks:
        mp_drawing.draw_landmarks(
            image,
            results.left_hand_landmarks,
            mp_holistic.HAND_CONNECTIONS
        )

    # Right Hand
    if results.right_hand_landmarks:
        mp_drawing.draw_landmarks(
            image,
            results.right_hand_landmarks,
            mp_holistic.HAND_CONNECTIONS
        )


def extract_keypoints(results):

    # Pose
    pose = np.array(
        [[res.x, res.y, res.z, res.visibility]
         for res in results.pose_landmarks.landmark]
    ).flatten() if results.pose_landmarks else np.zeros(33 * 4)

    # Left Hand
    lh = np.array(
        [[res.x, res.y, res.z]
         for res in results.left_hand_landmarks.landmark]
    ).flatten() if results.left_hand_landmarks else np.zeros(21 * 3)

    # Right Hand
    rh = np.array(
        [[res.x, res.y, res.z]
         for res in results.right_hand_landmarks.landmark]
    ).flatten() if results.right_hand_landmarks else np.zeros(21 * 3)

    return np.concatenate([pose, lh, rh])