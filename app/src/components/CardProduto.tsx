import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import data from "../data/json.json";
import type { Settings } from "react-slick";
import lupa from "../img/lupa.png";
import detalhes from "../img/inte.png";
import car from "../img/car.png";
import down from "../img/down-arrow.png"
import add from "../img/add.png";
import remo from "../img/remove.png";



function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div
      onClick={onClose}
      className="modal-close"
    >
      <div
        onClick={(e) => e.stopPropagation()}
       className="modal-content"
      >
        <button
          onClick={onClose}
          className="modal-close-button"
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
  const [modalLupaAberta, setModalLupaAberta] = useState(false);
  const [buscaReference, setBuscaReference] = useState("");
  const [produtoEncontrado, setProdutoEncontrado] = useState<typeof produtos[0] | null>(null);

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

  function buscarProduto() {
    const produto = produtos.find((p) => p.reference.toLowerCase() === buscaReference.toLowerCase());
    setProdutoEncontrado(produto || null);
  }

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

  const [quantidades, setQuantidades] = useState<{ [produtoId: string]: number }>({});
  const [valorGeral, setValorGeral] = useState(0);
  
  const precoUnitario = parseFloat(produtoAtual.skus[0]?.price ?? "0");
  const quantidadeAtual = quantidades[produtoAtual.id] || 0;
  const valorDoProdutoAtual = (quantidadeAtual * precoUnitario).toFixed(2);
  const valorTotalGeral = valorGeral.toFixed(2);
  
  function adicionar() {
    const novaQtd = (quantidades[produtoAtual.id] || 0) + 1;
  
    setQuantidades((prev) => ({
      ...prev,
      [produtoAtual.id]: novaQtd,
    }));
  
    setValorGeral((total) => total + precoUnitario);
  }
  
  function remover() {
    const qtdAtual = quantidades[produtoAtual.id] || 0;
    if (qtdAtual > 0) {
      const novaQtd = qtdAtual - 1;
  
      setQuantidades((prev) => ({
        ...prev,
        [produtoAtual.id]: novaQtd,
      }));
  
      setValorGeral((total) => total - precoUnitario);
    }
  }
  
  const [quantidadesPorSku, setQuantidadesPorSku] = useState<Record<number, number>>({});

const skusPorTamanho = produtoAtual.skus.map((sku) => ({
  id: sku.id,
  size: sku.size,
  qtd: quantidadesPorSku[sku.id!] || 0,
}));

const totalPecas = Object.values(quantidadesPorSku).reduce((acc, val) => acc + val, 0);


  return (
    <main
     className="main-container "
    >

      <Slider {...settingsProdutos} initialSlide={indexProduto}>
        {produtos.map((produto) => (
          <div key={produto.id}>
            
          </div>
        ))}
      </Slider>

   
      <Slider {...settingsMain} ref={mainSlider}>
        {produtoAtual.images.map((img, i) => (
          <div key={img.id + "-" + i}>
            <img
              src={img.path}
              alt={`Imagem ${i + 1}`}
              className="main-image"
            />
          </div>
        ))}
      </Slider>


      <div
       className="thumbnail-container"
      >
        <Slider {...settingsThumbs} ref={thumbSlider}>
          {produtoAtual.images.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => {
                setIndexImagem(idx);
                mainSlider.current?.slickGoTo(idx);
              }}
             className="thumbnail"
            >
              <img
                src={img.path}
                alt={`Miniatura ${idx + 1}`}
                style={{
                  width: "100%",
                  height: "60px",
                  objectFit: "cover",
                  margin: "4px 0",
                  borderRadius: "4px",
                }}
              />
            </div>
          ))}
        </Slider>
      </div>

      <div
       className="botao-detalhes"
        onClick={() => setModalAberta(true)}
      >
        <img src={detalhes} alt="Detalhes" style={{ maxWidth: "47px", maxHeight: "7vh" }} />
      </div>

      <div
       className="botao-lupa"
        onClick={() => {
          setBuscaReference("");
          setProdutoEncontrado(null);
          setModalLupaAberta(true);
        }}
      >
        <img src={lupa} alt="Lupa" style={{ maxWidth: "47px", maxHeight: "5.5vh" }} />
      </div>


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

      <Modal isOpen={modalLupaAberta} onClose={() => setModalLupaAberta(false)}>
        <input
          type="text"
          placeholder="Digite a referência"
          value={buscaReference}
          onChange={(e) => setBuscaReference(e.target.value)}
          className="input-busca"
          onKeyDown={(e) => {
            if (e.key === "Enter") buscarProduto();
          }}
        />
        <button onClick={buscarProduto} className="botao-busca">
          Buscar
        </button>

        <div style={{ marginTop: "20px" }}>
          {produtoEncontrado ? (
            <>
              <h3>{produtoEncontrado.name}</h3>
              <p><strong>Referência:</strong> {produtoEncontrado.reference}</p>
              <p><strong>Categoria:</strong> {produtoEncontrado.categories}</p>
              <p><strong>Descrição:</strong> {produtoEncontrado.description || "Sem descrição disponível."}</p>
              <p><strong>Preço (do primeiro SKU):</strong> R$ {produtoEncontrado.skus[0].price}</p>
            </>
          ) : buscaReference ? (
            <p>Produto não encontrado.</p>
          ) : (
            <p></p>
          )}
        </div>
      </Modal>

      <div
        className="botao-carrinho"
      >
        <img src={car} alt="Carinho" className="info"  style={{ width: "50px", height: "5.5vh" }} />
      </div>
  
 <div
  className="informacoes"
>

  <div className="info">
    <img
      src={down}
      style={{
        width: "20px",
        height: "20px"
      }}
    />
  </div>


  <div className="info-nome">
    {produtoAtual.name}
  </div>


  <div className="info-ref">
    {produtoAtual.reference}
  </div>


  <div className="info-preco">
    {produtoAtual.skus[0].price}
  </div>
</div>

<div
  className="divPai"
>

  <div className="total-atual">
  <p style={{ color: "black" }}>Atual</p> <p style={{color: "#87A6B4"}}> {(quantidadeAtual * precoUnitario).toFixed(2)}</p>
  </div>


  <div className="adicionar"
    onClick={adicionar}
  >
    <img src={add} alt="Adicionar" style={{ width: "30px", height: "30px" }} />
  </div>


  <div className="quantidade">
    <p style={{ color: "black" }}> {quantidadeAtual}</p>
  </div>


  <div
   className="remover"
    onClick={remover}
  >
    <img src={remo} alt="Remover" style={{ width: "30px", height: "30px" }} />
  </div>


  <div className="total-geral">
    <p style={{ color: "black" }}>Acumulado:</p> <p style={{color: "#87A6B4"}}>R$ {valorTotalGeral}</p>
  </div>
</div>


<div className="tamanhos-container">
  {skusPorTamanho.map((sku) => (
    <div key={sku.id} style={{ textAlign: "center" }}>
      <div className="tamanho-circulo ">
        {sku.size}
      </div>

      <div className="qtd-caixa">
        {sku.qtd}
      </div>
    </div>
  ))}

  
  <div className="total-somas">
    <span className="total-somas-span" >= </span>
    <div className="total-somas-caixa ">
      <div className="total-somas-caixa-div">{totalPecas}</div>
    </div>
  </div>
</div>
    </main>
  );
}
