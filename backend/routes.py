from flask import Blueprint, request, jsonify
from account_service import create_account_logic
from account_service import add_property_logic
from auth_service import login_logic
from flask import Response
import sys ,os
import subprocess
from contact import save_contact as save_contact_service
from crawd import count_people_in_image
from getdetails import get_temple_by_user
from traffic_model import main
from getdetails import get_vehicle_data
import json

routes = Blueprint('routes', __name__)

#createaccount route
@routes.route('/create-account', methods=['POST'])
def create_account():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    cnfpassword = data.get('cnfpassword')

    result, status_code = create_account_logic(name, email, password, cnfpassword)
    return jsonify(result), status_code

#detail edit route
@routes.route('/detail_edit', methods=['POST'])
def detail_edit():
    data = request.json
    account_id = data.get('account_id')
    address = data.get('address')
    area = data.get('area')
    owner = data.get('owner')
    networth = data.get('networth')
    no_of_properties = data.get('no_of_properties')
    email = data.get('email')

    try:
        result, status_code = add_property_logic(
            account_id,
            address,
            area,
            owner,
            networth,
            no_of_properties,
            email,
        )
    except TypeError:
        result, status_code = add_property_logic(
            account_id,
            address,
            area,
            owner,
            networth,
            no_of_properties,
        )

    return jsonify(result), status_code
    
# Login route
@routes.route('/login', methods=['POST'])
def login():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    result, status_code = login_logic(name ,email, password)
    return jsonify(result), status_code


# Route to run the parking detection script
@routes.route('/run-parking', methods=['POST'])
def run_parking():
    try:
        if 'video' not in request.files:
            return jsonify({"error": "No video uploaded"}), 400
        
        video = request.files['video']
        temple = request.form.get('temple')
        email = request.form.get('email')

        video_path = "input_video.mp4" 
        video.save(video_path)

        
        result = main(video_path, temple=temple, email=email)   # run YOLO

        return jsonify({
            "message": "Processing completed",
            "status": result.get("status"),
            "count": result.get("count")
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route to run the people detection script
@routes.route('/run-people', methods=['POST'])
def run_people():
    try:
        image = request.files['image']
        temple = request.form.get('temple')
        email = request.form.get('email')

        image_path = "input.jpg"
        image.save(image_path)

        count = count_people_in_image(image_path, temple=temple, email=email)

        return jsonify({
            "message": "Processing completed",
            "count": count
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
# Route to save contact form data
@routes.route('/contact', methods=['POST'])
def save_contact():
    try:
        data = request.json

        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        # validation (important)
        if not name or not email or not message:
            return jsonify({"error": "All fields are required"}), 400

        # call service
        result, status_code = save_contact_service(name, email, message)

        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
#get details route
@routes.route('/get-temple', methods=['POST'])
def get_temple():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')

        if not name or not email:
            return jsonify({"error": "Name and email required"}), 400

        result, status_code = get_temple_by_user(name, email)
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
# Route to get vehicle data
@routes.route('/get-vehicles', methods=['GET'])
def get_vehicles():
    try:
        
        return jsonify(get_vehicle_data()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to get people data
@routes.route('/get-people', methods=['GET'])
def get_people():
    try:
        from getdetails import get_people_data
        return jsonify(get_people_data()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500