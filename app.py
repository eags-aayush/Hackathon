from flask import Flask, request, redirect, url_for
import os

app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/report-issue', methods=['POST'])
def report_issue():
    description = request.form['issue-description']
    latitude = request.form['latitude']
    longitude = request.form['longitude']
    
    # Handle file uploads
    if 'issue-image' in request.files:
        image = request.files['issue-image']
        if image.filename != '':
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], image.filename))
    
    if 'issue-video' in request.files:
        video = request.files['issue-video']
        if video.filename != '':
            video.save(os.path.join(app.config['UPLOAD_FOLDER'], video.filename))
    
    # Process and save the issue data and location
    # For example, save to a database or file (implementation depends on your needs)
    # For now, we'll just print the data
    print(f"Issue Description: {description}")
    print(f"Location: Latitude {latitude}, Longitude {longitude}")

    return redirect(url_for('success'))

@app.route('/success')
def success():
    return 'Issue reported successfully!'

if __name__ == '__main__':
    app.run(debug=True)
