from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
    
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///issues.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Issue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    issue_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=False)

class Improvement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    improvement_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=False)

# Create database tables
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit-issue', methods=['POST'])
def submit_issue():
    data = request.get_json()
    new_issue = Issue(
        latitude=data['latitude'],
        longitude=data['longitude'],
        issue_type=data['issue_type'],
        description=data['description']
    )
    db.session.add(new_issue)
    db.session.commit()
    return jsonify(success=True)

@app.route('/submit-improvement', methods=['POST'])
def submit_improvement():
    data = request.get_json()
    new_improvement = Improvement(
        latitude=data['latitude'],
        longitude=data['longitude'],
        improvement_type=data['improvement_type'],
        description=data['description']
    )
    db.session.add(new_improvement)
    db.session.commit()
    return jsonify(success=True)

@app.route('/get-issues', methods=['GET'])
def get_issues():
    issues = Issue.query.all()
    return jsonify([[issue.latitude, issue.longitude, issue.issue_type, issue.description] for issue in issues])

if __name__ == '__main__':
    app.run(debug=True)
