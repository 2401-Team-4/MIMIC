import subprocess, sys, uuid, requests

UNIQUE_PROJECT_ID = str(uuid.uuid4())

def process():
  subprocess.run(['python3', 'config.py', UNIQUE_PROJECT_ID])
  send_project_id()
  # subprocess.run(['echo', "🔥Mimic is successfully installed🔥"])

def send_project_id():
  r = requests.post("http://localhost:3001/api/project/new", json={'projectId': UNIQUE_PROJECT_ID })
  print("Sending new project information to Mimic server...")
  print(r.status_code, r.reason)
  print("🔥Mimic is successfully installed🔥") if r.status_code == 200 else print("💔There was an error installing Mimic💔")
  

if __name__ == '__main__':
  process()