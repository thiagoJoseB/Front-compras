import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import data from "../data/json.json";
import type { Settings } from "react-slick";
import lupa from "../img/lupa.png";
import detalhes from "../img/inte.png";

function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 8,
          maxWidth: "90vw",
          maxHeight: "80vh",
          overflowY: "auto",
          color: "black",
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: 30,
            height: 30,
            cursor: "pointer",
            float: "right",
            fontWeight: "bold",
            fontSize: 16,
            lineHeight: 1,
          }}
          aria-label="Fechar modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export function CardProduto() {
  const produtos = data.products;

  const [indexProduto, setIndexProduto] = useState(0);
  const [indexImagem, setIndexImagem] = useState(0);
  const [modalAberta, setModalAberta] = useState(false);

  const mainSlider = useRef<Slider | null>(null);
  const thumbSlider = useRef<Slider | null>(null);

  const produtoAtual = produtos[indexProduto];

  useEffect(() => {
    setIndexImagem(0);
    thumbSlider.current?.slickGoTo(0);
  }, [indexProduto]);

  useEffect(() => {
    mainSlider.current?.slickGoTo(indexImagem);
  }, [indexImagem]);

  const settingsMain: Settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    infinite: false,
    afterChange: (currentSlide) => {
      setIndexImagem(currentSlide);
    },
  };

  const settingsThumbs: Settings = {
    slidesToShow: Math.min(produtoAtual.images.length, 4),
    slidesToScroll: 1,
    focusOnSelect: true,
    swipeToSlide: true,
    arrows: false,
    centerMode: produtoAtual.images.length > 4,
    centerPadding: "0px",
  };

  const settingsProdutos: Settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    infinite: false,
    afterChange: (currentProduct) => {
      setIndexProduto(currentProduct);
    },
  };

  return (
    <main
      style={{
        width: "100%",
        margin: "auto",
        color: "white",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      {/* Slider de produtos (um por vez) */}
      <Slider {...settingsProdutos} initialSlide={indexProduto}>
        {produtos.map((produto) => (
          <div key={produto.id}>
            {/* Se quiser conteúdo extra no slide, pode colocar aqui */}
          </div>
        ))}
      </Slider>

      {/* Slider principal das imagens do produto atual */}
      <Slider {...settingsMain} ref={mainSlider}>
        {produtoAtual.images.map((img, i) => (
          <div key={img.id + "-" + i}>
            <img
              src={img.path}
              alt={`Imagem ${i + 1}`}
              style={{
                width: "100%",
                height: "68vh",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </Slider>

      {/* Miniaturas */}
      <div
        style={{
          height: "50px",
          width: "100px",
          marginLeft: "auto",
          marginRight: "auto",
          overflow: "hidden",
        }}
      >
        <Slider {...settingsThumbs} ref={thumbSlider}>
          {produtoAtual.images.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => {
                setIndexImagem(idx);
                mainSlider.current?.slickGoTo(idx);
              }}
              style={{
                padding: "0 3px",
                cursor: "pointer",
                maxWidth: "80px",
              }}
            >
              <img
                src={img.path}
                alt={`Miniatura ${idx + 1}`}
                style={{
                  width: "100%",
                  height: "60px",
                  objectFit: "cover",
                  margin: "4px 0",
                  border: indexImagem === idx ? "2px solid #00f" : "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Ícone detalhes com onClick para abrir modal */}
      <div
        style={{
          width: "35px",
          height: "40px",
          backgroundColor: "red",
          marginLeft: "12vw",
          marginTop: "-38px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setModalAberta(true)}
      >
        <img src={detalhes} alt="Detalhes" style={{ maxWidth: "47px", maxHeight: "7vh" }} />
      </div>

      {/* Ícone lupa */}
      <div
        style={{
          width: "36px",
          height: "36px",
          backgroundColor: "blue",
          marginLeft: "23vw",
          marginTop: "-10.5vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={lupa} alt="Lupa" style={{ maxWidth: "47px", maxHeight: "5.5vh" }} />
      </div>

      {/* Modal com detalhes do produto */}
      <Modal isOpen={modalAberta} onClose={() => setModalAberta(false)}>
        <h2>{produtoAtual.name}</h2>
        <p><strong>Referência:</strong> {produtoAtual.reference}</p>
        <p><strong>Categoria:</strong> {produtoAtual.categories}</p>
        <p><strong>Subcategoria:</strong> {produtoAtual.subcategories || "—"}</p>
        <p><strong>Tipo:</strong> {produtoAtual.type}</p>
        <p><strong>Gênero:</strong> {produtoAtual.gender}</p>
        <p><strong>Descrição:</strong> {produtoAtual.description || "Sem descrição disponível."}</p>
        <p><strong>Entrega rápida:</strong> {produtoAtual.promptDelivery ? "Sim" : "Não"}</p>
        <h3>Skus disponíveis:</h3>
        <ul>
          {produtoAtual.skus.map((sku) => (
            <li key={sku.id}>
              Tamanho: {sku.size} | Estoque: {sku.stock} | Preço: R$ {sku.price}
            </li>
          ))}
        </ul>
      </Modal>
    </main>
  );
}
