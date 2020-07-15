import React, { useState } from "react";
import "./styles.css";
import moment from "moment";

const URL = "https://signos-celebridades.herokuapp.com/celeb/";

const Carousel = ({ images }) => {
  return (
    <div>
      <div
        id="carouselExampleIndicators"
        className="carousel slide"
        data-ride="carousel"
      >
        <ol className="carousel-indicators">
          <li
            data-target="#carouselExampleIndicators"
            data-slide-to="0"
            className="active"
          />
          <li data-target="#carouselExampleIndicators" data-slide-to="1" />
          <li data-target="#carouselExampleIndicators" data-slide-to="2" />
        </ol>
        <div className="carousel-inner">
          {images.map((img, i) => (
            <div className={i === 0 ? "carousel-item active" : "carousel-item"}>
              <img src={img} className="d-block w-100" alt={img} />
            </div>
          ))}
        </div>
        <a
          className="carousel-control-prev"
          href="#carouselExampleIndicators"
          role="button"
          data-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span claclassNamess="sr-only">Previous</span>
        </a>
        <a
          className="carousel-control-next"
          href="#carouselExampleIndicators"
          role="button"
          data-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="sr-only">Next</span>
        </a>
      </div>
    </div>
  );
};

const Pessoa = ({ pessoa }) => {
  return (
    <>
      {pessoa.complemento.imagem ? (
        <Carousel images={pessoa.complemento.imagem} />
      ) : (
        <p>&nbsp;</p>
      )}{" "}
      <div className="card">
        <div className="card-body">
          <p>{pessoa.complemento?.nomewiki}</p>
          <div>
            Data Nascimento:
            <p>{moment(pessoa.dataNascimento).format("DD/MM/yyyy")}</p>
          </div>
          <p> {pessoa.signo.signo} </p>
        </div>
      </div>
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
      <button className="btn btn-default" onClick={handleInput}>
        consulta
      </button>
    </>
  );
};

export default function App() {
  const [data, setData] = useState();

  return (
    <div className="App">
      <Search setData={setData} />
      <ListName pessoas={data} />
    </div>
  );
}
