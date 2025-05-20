from app import app

def test_index():
    client = app.test_client()
    resp = client.get('/logs')
    assert resp.status_code == 200
