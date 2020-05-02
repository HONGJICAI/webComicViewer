from app import get_app

if __name__ == "__main__":
    get_app().run(host="0.0.0.0", port=4999, debug=True, threaded=True)
