import os
from flask import Flask
from config import Config
from models import db, init_db
from flask_jwt_extended import JWTManager
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    db.init_app(app)
    jwt = JWTManager(app)

    # import and register blueprints
    from routes import bp as api_bp
    app.register_blueprint(api_bp)

    # create tables if needed
    init_db(app)

    @app.route('/')
    def index():
        return {'msg': 'Sandai backend running'}

    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='127.0.0.1', port=port, debug=True)
