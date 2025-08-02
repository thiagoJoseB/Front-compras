import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import data from "../data/json.json";
import type { Settings } from "react-slick";

export function CardProduto() {
  const produtos = data.products;

  const [indexProduto, setIndexProduto] = useState(0);
  const [indexImagem, setIndexImagem] = useState(0);

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
    arrows: true,
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
    arrows: true,
    centerMode: produtoAtual.images.length > 4,
    centerPadding: "0px",
    beforeChange: (_, next) => {
      setIndexImagem(next);
    },
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
        width: "90%",
        margin: "0 auto",
        color: "white",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      {/* Slider de produtos - mostra a primeira imagem de cada produto */}
      <Slider {...settingsProdutos} initialSlide={indexProduto}>
        {produtos.map((produto, idx) => (
          <div key={produto.id + "-" + idx}>
            <img
              src={produto.images[0]?.path}
              alt={`${produto.name} - imagem principal`}
              style={{
                width: "100%",
                height: "68vh",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        ))}
      </Slider>

      {/* Slider de miniaturas - imagens do produto atual */}
      <div style={{ marginTop: "12px", maxHeight: "70px", overflow: "hidden" }}>
        <Slider {...settingsThumbs} ref={thumbSlider}>
          {produtoAtual.images.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setIndexImagem(idx)}
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
                  border:
                    indexImagem === idx ? "2px solid #00f" : "1px solid #ccc",
                  borderRadius: "4px",
                  margin: "4px 0",
                }}
              />
            </div>
          ))}
        </Slider>
      </div>
    </main>
  );
}
