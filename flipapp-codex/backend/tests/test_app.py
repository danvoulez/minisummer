from app import app

def test_health():
    tester = app.test_client()
    response = tester.get('/logs')
    assert response.status_code in (200, 401)
