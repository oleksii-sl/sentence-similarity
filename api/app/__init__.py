import os

from click import Command
from elasticsearch_dsl.connections import connections
from flask import Flask

from app.api import bp
from . import commands


def register_default_elasticsearch_connection():
    connections.create_connection(
        hosts=[os.environ['ELASTICSEARCH_HOST']],
    )


def register_commands(app):
    for command_name in dir(commands):
        command = getattr(commands, command_name)
        if isinstance(command, Command):
            app.cli.add_command(command)


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.update(SECRET_KEY='dev')

    register_default_elasticsearch_connection()
    register_commands(app)
    app.register_blueprint(bp, url_prefix='/api')

    return app
