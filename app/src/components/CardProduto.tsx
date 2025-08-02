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
          marginTop: "12px",
          height: "70px",
          width: "150px",
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
                mainSlider.current?.slickGoTo(idx); // Garante mudança
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
                  border:
                    indexImagem === idx
                      ? "2px solid #00f"
                      : "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
          ))}
        </Slider>
      </div>
    </main>
  );
}
