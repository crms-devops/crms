def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_login_missing_fields(client):
    response = client.post("/auth/student/login", json={})
    assert response.status_code == 422

def test_login_invalid_credentials(client):
    response = client.post("/auth/student/login", json={
        "register_number": "000000000000",
        "date_of_birth": "2000-01-01"
    })
    assert response.status_code == 401