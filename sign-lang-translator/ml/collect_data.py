import cv2
import mediapipe as mp

from holistic_utils import mediapipe_detection
from holistic_utils import draw_landmarks
from holistic_utils import extract_keypoints

DATA_PATH = 'data'

actions = [
    'HELLO',
    'YES',
    'NO',
    'THANKYOU',
    'PLEASE',
    'NOTHING'
]

no_sequences = 100
sequence_length = 30

for action in actions:
    for sequence in range(no_sequences):
        os.makedirs(
            os.path.join(DATA_PATH, action, str(sequence)),
            exist_ok=True
        )

from mediapipe.python.solutions import holistic

mp_holistic = holistic

cap = cv2.VideoCapture(0)

with mp_holistic.Holistic(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
) as holistic:

    for action in actions:

        for sequence in range(no_sequences):

            for frame_num in range(sequence_length):

                ret, frame = cap.read()

                image, results = mediapipe_detection(frame, holistic)

                draw_landmarks(image, results)

                keypoints = extract_keypoints(results)

                npy_path = os.path.join(
                    DATA_PATH,
                    action,
                    str(sequence),
                    str(frame_num)
                )

                np.save(npy_path, keypoints)

                cv2.putText(
                    image,
                    f'Collecting {action} {sequence}',
                    (15, 30),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (0, 255, 0),
                    2
                )

                cv2.imshow('Data Collection', image)

                if cv2.waitKey(10) & 0xFF == ord('q'):
                    break

cap.release()
cv2.destroyAllWindows()