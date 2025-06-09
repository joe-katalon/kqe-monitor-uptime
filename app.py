import os
import subprocess
from flask import Flask, render_template, request, jsonify, send_from_directory

app = Flask(__name__)

# Define the path to the test-genai script and its working directory
TEST_GENAI_DIR = os.path.join(os.path.dirname(__file__), "test-genai")
MAIN_PY_PATH = os.path.join(TEST_GENAI_DIR, "main.py")
REPORTS_DIR = os.path.join(TEST_GENAI_DIR, "reports")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/run-test", methods=["POST"])
def run_test():
    feature = request.form.get("feature")
    phase = request.form.get("phase")

    if not feature or not phase:
        return jsonify({"error": "Feature and phase are required"}), 400

    # Construct the command
    # Note: Adjust python executable if needed (e.g., python3)
    command = [
        "python", 
        MAIN_PY_PATH, 
        "--feature", feature, 
        "--phase", phase
    ]
    
    # For now, just log the command and simulate output
    # Later we will run this using subprocess
    command_str = " ".join(command)
    print(f"Executing command: {command_str} in CWD: {TEST_GENAI_DIR}")
    
    # Simulate output
    # In a real scenario, you'd capture stdout/stderr from subprocess
    simulated_output = f"Simulated execution of: {command_str}\nTest run initiated. Check reports later."
    
    return jsonify({"message": "Test run initiated", "command": command_str, "output": simulated_output})

@app.route("/list-reports")
def list_reports():
    try:
        if not os.path.exists(REPORTS_DIR):
            return jsonify({"error": f"Reports directory not found: {REPORTS_DIR}"}), 404
        
        report_files = [f for f in os.listdir(REPORTS_DIR) if f.startswith("comparison_report_") and f.endswith(".html")]
        report_files.sort(key=lambda name: os.path.getmtime(os.path.join(REPORTS_DIR, name)), reverse=True)
        return jsonify(report_files)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/view-report/<path:filename>")
def view_report(filename):
    return send_from_directory(REPORTS_DIR, filename)

@app.route("/view-dashboard")
def view_dashboard():
    dashboard_path = os.path.join(REPORTS_DIR, "index.html")
    if not os.path.exists(dashboard_path):
        return "Dashboard main file (reports/index.html) not found.", 404
    return send_from_directory(REPORTS_DIR, "index.html")

if __name__ == "__main__":
    # Ensure the script runs with the project root as the CWD for consistent pathing
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    app.run(debug=True, port=5001) 