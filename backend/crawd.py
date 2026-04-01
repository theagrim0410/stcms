import cv2
import os
from ultralytics import YOLO
import json
import time
from people import insert_people

model = YOLO("yolov8n.pt")

def count_people_in_image(image_path, conf=0.3, temple=None, email=None):

    if not os.path.exists(image_path):
        return 0

    results = model.predict(image_path, conf=conf, verbose=False)
    result = results[0]

    people_boxes = [b for b in result.boxes if int(b.cls[0]) == 0]
    count = len(people_boxes)

    img = cv2.imread(image_path)
    if img is None:
        return 0

    people_log = []

    for i, b in enumerate(people_boxes):
        xyxy = b.xyxy[0].cpu().numpy().astype(int)
        x1, y1, x2, y2 = xyxy

        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 200, 0), 2)

        # Save log
        people_log.append({
            "person_id": i + 1,
            "time": time.ctime()
        })

    cv2.putText(img, f"Count: {count}", (20,40),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2)

    # save karna
    cv2.imwrite("people_output.jpg", img)

    # save data kerna json file mein
    with open("people_log.json", "w") as f:
        json.dump({
            "total_people": count,
            "entries": people_log
        }, f, indent=4)
        
    insert_people("people_log.json", temple=temple, email=email)
    
    print(f"Total People: {count}")

    return count