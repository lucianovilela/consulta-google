import React, { useState } from "react";
import "./styles.css";
import moment from "moment";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const URL = "/celeb/";

const Pessoa = ({ pessoa }) => {
  return (
    <>
      
      <Card>
        <div className="card-head">
          <img src={pessoa.complemento.imagem.items[0].image.thumbnailLink} />
        </div>
        <div className="card-body">
          <p>{pessoa.complemento?.nomewiki}</p>
          <div>
            Data Nascimento:
            <p>{moment(pessoa.dataNascimento).format("DD/MM/yyyy")}</p>
          </div>
          <p> {pessoa.signo.signo} </p>
        </div>
      </Card>
    </>
  );
};

const ListName = ({ pessoas }) => {
  console.debug(pessoas);
  return <>{pessoas ? <Pessoa pessoa={pessoas} /> : <p />}</>;
};

const Search = ({ setData }) => {
  const [value, setValor] = useState("");
  const handleInput = async () => {
    const response = await fetch(`${URL}${value}`);
    //console.debug(response);
    if (response.ok) {
      const data = await response.json();

      setData(data);
    }
  };
  return (
    <>
      <input
        className="form-control"
        onChange={event => {
          setValor(event.target.value);
        }}
      />
      <Button variant="primary" onClick={handleInput}>
        consulta
      </Button>
    </>
  );
};

export default function App() {
  const [data, setData] = useState();

  return (
    <Container>
      <Search setData={setData} />
      <ListName pessoas={data} />
    </Container>

  );
}
