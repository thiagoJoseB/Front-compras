// src/components/Header.tsx

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useMemo, useRef } from "react";
import data from "../data/json.json";

import imgDireita from "../img/direita.png";
import imgEsquerda from "../img/esquerda.png";

import seta from "../img/left-arrow.png";
import vl from "../img/f.png";

const products = data.products;

type Product = typeof products[number];

const getCategories = (products: Product[]) => {
  const uniqueCategories = new Map<string, Product>();
  products.forEach((product) => {
    if (!uniqueCategories.has(product.categories)) {
      uniqueCategories.set(product.categories, product);
    }
  });
  return Array.from(uniqueCategories.values());
};

export function Header() {
  const sliderRef = useRef<Slider>(null);
  const categoryItems = useMemo(() => getCategories(products), []);

  const settings = {
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false, // DESLIGA setas nativas
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const goPrev = () => {
    sliderRef.current?.slickPrev();
  };

  const goNext = () => {
    sliderRef.current?.slickNext();
  };

  return (
    <>

      <header className="topo-header">

        <img style={{height: "2vh", width: "4vw"}} src={seta}></img>
        <div className="seta" onClick={goPrev}>
          <img src={imgEsquerda} alt="Voltar" style={{height: "30px"}} />
        </div>

        <div className="caixa-busca">
          <Slider {...settings} ref={sliderRef}>
            {categoryItems.map((item) => {
              const count = products.filter(
                (p) => p.categories === item.categories
              ).length;
              return (
                <div key={item.id} className="categoria-item">
                  <span className="categoria-label">
                    ({count}) {item.categories}
                  </span>
                </div>
              );
            })}
          </Slider>
        </div>

        <div className="seta" onClick={goNext}>
          <img src={imgDireita} alt="Avançar" style={{height: "30px"}} />
          
        </div>

        <img style={{height: "2vh", width: "3vw"}}  src={vl}></img>
      </header>
    </>
  );
}
