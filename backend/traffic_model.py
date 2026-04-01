import cv2
import os
import time
import sys
import json
from ultralytics import YOLO
from collections import defaultdict
from vechicles import insert_vehicles

model = YOLO("yolov8n.pt")

VEHICLE_CLASSES = {2: "car", 3: "motorcycle", 5: "bus", 7: "truck"}

class SmartParkingLot:
    def __init__(self, num_spots):
        self.num_spots = num_spots

    def percentage(self, current_occupancy, threshold=10):
        percentage = (current_occupancy / threshold) * 100
        policy_text = "Parking normal"
        if percentage > 80:
            policy_text = "Parking almost full"
        return policy_text, percentage


def main(video_source, temple=None, email=None):

    if not os.path.exists(video_source):
        return {"status": "error", "count": 0}

    cap = cv2.VideoCapture(video_source)

    # OUTPUT VIDEO
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter("output_video.mp4", fourcc, 20.0, (640, 360))

    parking_lot = SmartParkingLot(10)

    track_history = defaultdict(lambda: [])
    entered_ids = set()
    timestamps = {}
    log_data = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (640, 360))
        center_line = frame.shape[0] // 2

        cv2.line(frame, (0, center_line), (640, center_line), (255, 0, 0), 2)

        results = model.track(frame, persist=True, classes=list(VEHICLE_CLASSES.keys()), verbose=False)

        if results and results[0].boxes and results[0].boxes.id is not None:
            boxes = results[0].boxes.xyxy.cpu().numpy().astype(int)
            ids = results[0].boxes.id.cpu().numpy().astype(int)
            classes = results[0].boxes.cls.cpu().numpy().astype(int)

            for box, track_id, cls in zip(boxes, ids, classes):
                if cls in VEHICLE_CLASSES:
                    x1, y1, x2, y2 = box
                    cx = (x1 + x2) // 2
                    cy = (y1 + y2) // 2

                    track_history[track_id].append((cx, cy))

                    if len(track_history[track_id]) > 1:
                        prev_y = track_history[track_id][-2][1]

                        if prev_y < center_line and cy >= center_line:
                            entered_ids.add(track_id)
                            timestamps[track_id] = time.ctime()

                            log_data.append({
                                "vehicle_id": int(track_id),
                                "time": timestamps[track_id]
                            })

                            print(f"Vehicle {track_id} entered at {timestamps[track_id]}")

                        if prev_y > center_line and cy <= center_line:
                            entered_ids.discard(track_id)

                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

        current = len(entered_ids)

        text = f"Occupancy: {current}/10"
        cv2.putText(frame, text, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,0,255), 2)

        # SAVE kerna video mein
        out.write(frame)

        cv2.imshow("Parking Detection", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        if current >= 10:
            print("Parking Full")
            break

    cap.release()
    out.release()
    cv2.destroyAllWindows()

    # save kerna JSON file mein
    with open("parking_log.json", "w") as f:
        json.dump(log_data, f, indent=4)
    
    insert_vehicles("parking_log.json", temple=temple, email=email)

    return {
        "status": "full" if current >= 10 else "completed",
        "count": current
    }