from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Team, Fixture, Result, Announcement, ContactMessage
from utils import hash_password, verify_password
from datetime import datetime

bp = Blueprint('api', __name__, url_prefix='/api')


# Auth
@bp.route('/auth/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not (username and email and password):
        return jsonify({'msg': 'username, email and password required'}), 400
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'msg': 'user already exists'}), 400
    user = User(username=username, email=email, password_hash=hash_password(password))
    db.session.add(user)
    db.session.commit()
    return jsonify({'msg': 'user created'}), 201


@bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')
    if not (username and password):
        return jsonify({'msg': 'username and password required'}), 400
    user = User.query.filter((User.username == username) | (User.email == username)).first()
    if not user or not verify_password(password, user.password_hash):
        return jsonify({'msg': 'bad credentials'}), 401
    token = create_access_token(identity=user.id)
    return jsonify({'access_token': token, 'user': {'id': user.id, 'username': user.username}})


# Teams
@bp.route('/teams', methods=['GET'])
def list_teams():
    teams = Team.query.order_by(Team.name).all()
    return jsonify([{'id': t.id, 'name': t.name, 'short_name': t.short_name} for t in teams])


@bp.route('/teams', methods=['POST'])
def create_team():
    data = request.get_json() or {}
    name = data.get('name')
    short = data.get('short_name')
    if not name:
        return jsonify({'msg': 'name required'}), 400
    if Team.query.filter_by(name=name).first():
        return jsonify({'msg': 'team exists'}), 400
    t = Team(name=name, short_name=short)
    db.session.add(t)
    db.session.commit()
    return jsonify({'id': t.id, 'name': t.name}), 201


# Fixtures
@bp.route('/fixtures', methods=['GET'])
def list_fixtures():
    fixtures = Fixture.query.order_by(Fixture.date).all()
    out = []
    for f in fixtures:
        out.append({'id': f.id, 'date': f.date.isoformat(), 'home_team_id': f.home_team_id, 'away_team_id': f.away_team_id, 'played': f.played})
    return jsonify(out)


@bp.route('/fixtures', methods=['POST'])
def create_fixture():
    data = request.get_json() or {}
    date_s = data.get('date')
    home = data.get('home_team_id')
    away = data.get('away_team_id')
    if not (date_s and home and away):
        return jsonify({'msg': 'date, home_team_id, away_team_id required'}), 400
    try:
        date = datetime.fromisoformat(date_s)
    except Exception:
        return jsonify({'msg': 'invalid date format, use ISO format'}), 400
    f = Fixture(date=date, home_team_id=home, away_team_id=away)
    db.session.add(f)
    db.session.commit()
    return jsonify({'id': f.id}), 201


# Results
@bp.route('/results', methods=['GET'])
def list_results():
    results = Result.query.order_by(Result.recorded_at.desc()).all()
    return jsonify([{'id': r.id, 'fixture_id': r.fixture_id, 'home_score': r.home_score, 'away_score': r.away_score, 'recorded_at': r.recorded_at.isoformat()} for r in results])


@bp.route('/results', methods=['POST'])
def add_result():
    data = request.get_json() or {}
    fixture_id = data.get('fixture_id')
    home_score = data.get('home_score')
    away_score = data.get('away_score')
    if fixture_id is None or home_score is None or away_score is None:
        return jsonify({'msg': 'fixture_id, home_score, away_score required'}), 400
    r = Result(fixture_id=fixture_id, home_score=int(home_score), away_score=int(away_score))
    # mark fixture played
    f = Fixture.query.get(fixture_id)
    if f:
        f.played = True
    db.session.add(r)
    db.session.commit()
    return jsonify({'id': r.id}), 201


# Simple standings - aggregate results into team points
@bp.route('/standings', methods=['GET'])
def standings():
    teams = Team.query.all()
    stats = {t.id: {'team': t.name, 'played': 0, 'wins': 0, 'draws': 0, 'losses': 0, 'goals_for': 0, 'goals_against': 0, 'points': 0} for t in teams}
    results = Result.query.all()
    for r in results:
        f = Fixture.query.get(r.fixture_id)
        if not f:
            continue
        home = f.home_team_id
        away = f.away_team_id
        stats[home]['played'] += 1
        stats[away]['played'] += 1
        stats[home]['goals_for'] += r.home_score
        stats[home]['goals_against'] += r.away_score
        stats[away]['goals_for'] += r.away_score
        stats[away]['goals_against'] += r.home_score
        if r.home_score > r.away_score:
            stats[home]['wins'] += 1
            stats[home]['points'] += 3
            stats[away]['losses'] += 1
        elif r.home_score < r.away_score:
            stats[away]['wins'] += 1
            stats[away]['points'] += 3
            stats[home]['losses'] += 1
        else:
            stats[home]['draws'] += 1
            stats[away]['draws'] += 1
            stats[home]['points'] += 1
            stats[away]['points'] += 1
    ordered = sorted(stats.values(), key=lambda s: (-s['points'], -(s['goals_for']-s['goals_against'])))
    return jsonify(ordered)


# Announcements
@bp.route('/announcements', methods=['GET'])
def list_announcements():
    items = Announcement.query.order_by(Announcement.created_at.desc()).all()
    return jsonify([{'id': a.id, 'title': a.title, 'content': a.content, 'created_at': a.created_at.isoformat()} for a in items])


@bp.route('/announcements', methods=['POST'])
@jwt_required()
def create_announcement():
    data = request.get_json() or {}
    title = data.get('title')
    content = data.get('content')
    if not (title and content):
        return jsonify({'msg': 'title and content required'}), 400
    a = Announcement(title=title, content=content)
    db.session.add(a)
    db.session.commit()
    return jsonify({'id': a.id}), 201


# Contact
@bp.route('/contact', methods=['POST'])
def contact():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    if not (name and email and message):
        return jsonify({'msg': 'name, email, message required'}), 400
    m = ContactMessage(name=name, email=email, message=message)
    db.session.add(m)
    db.session.commit()
    return jsonify({'id': m.id}), 201


# Dashboard (protected)
@bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    users = User.query.count()
    teams = Team.query.count()
    fixtures = Fixture.query.count()
    results = Result.query.count()
    return jsonify({'users': users, 'teams': teams, 'fixtures': fixtures, 'results': results})
