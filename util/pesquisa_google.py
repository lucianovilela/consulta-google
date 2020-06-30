import requests
import re
from datetime import datetime
import wikipedia

s=[{'signo':'Aquário','meses':[1,2], 'dias':[20,18]},
{'signo':'Peixes','meses':[2,3], 'dias':[19,20]},
{'signo':'Áries','meses':[3,4], 'dias':[21,19]},
{'signo':'Touro','meses':[4,5], 'dias':[20,20]},
{'signo':'Gêmeos','meses':[5,6], 'dias':[21,21]},
{'signo':'Câncer','meses':[6,7], 'dias':[22,22]},
{'signo':'Leão','meses':[7,8], 'dias':[23,22]},
{'signo':'Virgem','meses':[8,9], 'dias':[23,22]},
{'signo':'Libra','meses':[9,10], 'dias':[23,22]},
{'signo':'Escorpião','meses':[10,11], 'dias':[23,21]},
{'signo':'Sagitário','meses':[11,12], 'dias':[22,21]},
{'signo':'Capricórnio','meses':[12,12], 'dias':[19,31]},
{'signo':'Capricórnio','meses':[1,1], 'dias':[1,19]}]

def getSigno(d):
  for o in s:
    dia = d.month*100 + d.day
    if(dia>= o["meses"][0]*100+o["dias"][0] and dia<=o["meses"][1]*100+o["dias"][1]):
      return o
      break


def getComplemento(nome):
  s=wikipedia.search(nome)
  try:
    p=wikipedia.page(s[0])
    if p.images[0]:
      return {'nomewiki': s[0], 'imagem':p.images}
  except:
    return {'exception':'nao encontrado'}

def getDateNascimento(nome):
  req=requests.get(f"https://www.google.com/search?q={nome}")
  txt =  re.findall(r"([jfajsondm]\w+\s\d+,\s\d+)[\s,]+", req.text, re.IGNORECASE)

  #print(bs.prettify())
  #print(txt[0])
  if txt[0]:
    dt=datetime.strptime( txt[0], "%B %d, %Y")

  return dt