#!/usr/bin/env python3
import argparse
from flask import Flask, jsonify
from flask_cors import CORS
from logzero import logger
from util import pesquisa_google
from markupsafe import escape

def create_app(config=None):
  logger.debug("create flask")
  app = Flask(__name__)
  app.config.update(dict(DEBUG=True))
  app.config.update(config or {})
  CORS(app)
  logger.debug(app)
  @app.route("/")
  def index():
    logger.debug("/")
    return "funcionou!!!!!"

  @app.route("/celeb/<string:name>")
  def getCeleb(name):
      name_=escape(name)
      try:
        dt=pesquisa_google.getDateNascimento(name_)
        if dt:
          signo = pesquisa_google.getSigno(dt)
          complemento=pesquisa_google.getComplemento(name_)
        return jsonify({
          "name":name,
          "dataNascimento":dt,
          "signo":signo,
          "complemento":complemento
        })
      except:
        return {
          "name":name_,
          "exception":"nao encontrado"
        }
  return app



if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-p", "--port", action="store", default="5000")
    args = parser.parse_args()
    port = int(args.port)
    app = create_app()
    app.run(host="0.0.0.0", port=port)


