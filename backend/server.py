# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from flask_socketio import SocketIO
# from pymongo import MongoClient
# import gridfs
# from io import BytesIO
# import os
# from gridfs import GridFS
# from bson import ObjectId

# # Flask setup
# app = Flask(__name__)
# CORS(app)
# socketio = SocketIO(app, async_mode="eventlet", cors_allowed_origins="*")

# # MongoDB connection and GridFS setup
# mongo_client =MongoClient('mongodb+srv://Shravani:Shweta2509@cluster0.39gz0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
# db = mongo_client['Cluster0']
# fs = GridFS(db)

# messages_collection = db['messages']

# # Get all messages
# @app.route('/messages', methods=['GET'])
# def get_messages():
#     messages = list(messages_collection.find({}, {'_id': 0}))
#     return jsonify(messages)

# # Post a new message with optional file
# @app.route('/messages', methods=['POST'])
# # Post a new message with optional file
# @app.route('/messages', methods=['POST'])
# def post_message():
#     message = request.form.to_dict()
#     file = request.files.get('file')

#     if file:
#         file_id = fs.put(file, filename=file.filename, content_type=file.content_type)
#         message['file_id'] = str(file_id)  # Convert file_id to string
#         message['file_name'] = file.filename
#         message['file_type'] = file.content_type

#     messages_collection.insert_one(message)
#     socketio.emit('message', message)
#     return jsonify(message), 201


# # Fetch a file from GridFS by its ID
# @app.route('/file/<file_id>', methods=['GET'])
# def get_file(file_id):
#     try:
#         # Convert string ID to ObjectId
#         file_data = fs.get(ObjectId(file_id))
#         return send_file(BytesIO(file_data.read()), mimetype=file_data.content_type, as_attachment=False, download_name=file_data.filename)
#     except Exception as e:
#         return str(e), 404


# @socketio.on('connect')
# def handle_connect():
#     print('Client connected')

# @socketio.on('disconnect')
# def handle_disconnect():
#     print('Client disconnected')

# if __name__ == '__main__':
#     socketio.run(app, debug=True)
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from pymongo import MongoClient
import gridfs
from io import BytesIO
import os
from gridfs import GridFS
from bson import ObjectId

# Flask setup
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, async_mode="eventlet", cors_allowed_origins="*")

# MongoDB connection and GridFS setup
mongo_client = MongoClient('mongodb+srv://Shravani:Shweta2509@cluster0.39gz0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = mongo_client['Cluster0']
fs = GridFS(db)

messages_collection = db['messages']

# Store active users and their socket IDs
active_users = {}

# Get all messages
@app.route('/messages', methods=['GET'])
def get_messages():
    messages = list(messages_collection.find({}, {'_id': 0}))
    return jsonify(messages)

# Post a new message with optional file
@app.route('/messages', methods=['POST'])
def post_message():
    message = request.form.to_dict()
    file = request.files.get('file')

    if file:
        file_id = fs.put(file, filename=file.filename, content_type=file.content_type)
        message['file_id'] = str(file_id)  # Convert file_id to string
        message['file_name'] = file.filename
        message['file_type'] = file.content_type

    messages_collection.insert_one(message)
    socketio.emit('message', message, room=message['receiver'])  # Send the message to the receiver
    return jsonify(message), 201

# Fetch a file from GridFS by its ID
@app.route('/file/<file_id>', methods=['GET'])
def get_file(file_id):
    try:
        # Convert string ID to ObjectId
        file_data = fs.get(ObjectId(file_id))
        return send_file(BytesIO(file_data.read()), mimetype=file_data.content_type, as_attachment=False, download_name=file_data.filename)
    except Exception as e:
        return str(e), 404

# User connection and disconnection events
@socketio.on('connect')
def handle_connect():
    # Assume the user sends their username when they connect
    username = request.args.get('username')
    if username:
        active_users[username] = request.sid  # Store the socket ID for the user
        print(f'{username} connected with socket id {request.sid}')
    else:
        print('A user connected without username')

@socketio.on('disconnect')
def handle_disconnect():
    for username, socket_id in active_users.items():
        if socket_id == request.sid:
            del active_users[username]
            print(f'{username} disconnected')
            break

# Send message to a specific user
@socketio.on('send_message')
def handle_send_message(data):
    receiver = data['receiver']
    message = data['message']
    sender = data['sender']

    # Save the message to the database
    message_data = {
        'sender': sender,
        'receiver': receiver,
        'message': message,
        'timestamp': datetime.utcnow().isoformat()
    }
    messages_collection.insert_one(message_data)

    # Emit message to the receiver (if they are connected)
    if receiver in active_users:
        receiver_socket_id = active_users[receiver]
        socketio.emit('message', message_data, room=receiver_socket_id)
    else:
        print(f'User {receiver} is not connected')

# Send message to all users (broadcast example)
@socketio.on('broadcast_message')
def handle_broadcast_message(data):
    socketio.emit('message', data)

if __name__ == '__main__':
    socketio.run(app, debug=True)
