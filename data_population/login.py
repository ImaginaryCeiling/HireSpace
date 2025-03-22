import requests

def login():
    url = 'http://localhost:8000/account/login'
    session = requests.Session()
    resp = session.post(url, json={'username': 'student', 'password': 'password'})
    if resp.ok:
        return session, resp.json()