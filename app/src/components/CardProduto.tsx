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
      style={{
        width: "100%",
        margin: "auto",
        color: "white",
        borderRadius: "8px",
        position: "relative",
      }}
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
              style={{
                width: "100%",
                height: "68vh",
                objectFit: "cover",
                paddingLeft:"12px"
              }}
            />
          </div>
        ))}
      </Slider>


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
                  borderRadius: "4px",
                }}
              />
            </div>
          ))}
        </Slider>
      </div>

      <div
        style={{
          width: "35px",
          height: "40px",
          backgroundColor: "red",
          marginLeft: "12vw",
          marginTop: "-40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setModalAberta(true)}
      >
        <img src={detalhes} alt="Detalhes" style={{ maxWidth: "47px", maxHeight: "7vh" }} />
      </div>

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
          cursor: "pointer",
        }}
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
          style={{ width: "94%", padding: "8px", marginBottom: "12px", fontSize: "16px", marginTop:"10px" }}
          onKeyDown={(e) => {
            if (e.key === "Enter") buscarProduto();
          }}
        />
        <button onClick={buscarProduto} style={{ padding: "8px 16px", fontSize: "16px", cursor: "pointer" , backgroundColor : "#87A6B4" }}>
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
        style={{
          width: "34px",
          height: "34px",
          backgroundColor: "blue",
          marginLeft: "66vw",
          marginTop: "-9vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <img src={car} alt="Carinho" style={{ maxWidth: "47px", maxHeight: "5.5vh" }} />
      </div>

 <div
  className="informacoes"
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1vw",
    marginTop: "15px",
  }}
>

  <div className="info" style={{ width: "12%", textAlign: "center" }}>
    <img
      src={down}
      style={{
        width: "20px",
        height: "20px"
      }}
    />
  </div>


  <div className="info" style={{ width: "25%", textAlign: "center" ,color: "black"}}>
    {produtoAtual.name}
  </div>


  <div className="info" style={{ width: "25%", textAlign: "center" , color: "#87A6B4"}}>
    {produtoAtual.reference}
  </div>


  <div className="info" style={{ width: "20%", textAlign: "center",color: "black" }}>
    {produtoAtual.skus[0].price}
  </div>
</div>

<div
  className="divPai"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1.5vw",
  }}
>

  <div style={{ width: "20%", textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
  <p style={{ color: "black" }}>Atual</p> <p style={{color: "#87A6B4"}}> {(quantidadeAtual * precoUnitario).toFixed(2)}</p>
  </div>


  <div
    style={{ width: "12%", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}
    onClick={adicionar}
  >
    <img src={add} alt="Adicionar" style={{ width: "30px", height: "30px" }} />
  </div>


  <div style={{ width: "10%", textAlign: "center", fontSize: "16px" }}>
    <p style={{ color: "black" }}> {quantidadeAtual}</p>
  </div>


  <div
    style={{ width: "12%", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}
    onClick={remover}
  >
    <img src={remo} alt="Remover" style={{ width: "30px", height: "30px" }} />
  </div>


  <div style={{ width: "20%", textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
    <p style={{ color: "black" }}>Acumulado:</p> <p style={{color: "#87A6B4"}}>R$ {valorTotalGeral}</p>
  </div>
</div>


<div style={{
  display: "flex",
  alignItems: "center",
  gap: "1vw",
  marginTop: "3px",
  flexWrap: "wrap",
  justifyContent: "center",
  paddingBottom:"1vh"
}}>
  {skusPorTamanho.map((sku) => (
    <div key={sku.id} style={{ textAlign: "center" }}>
      <div style={{
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: "#87A6B4",
        border: "2px solid white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        color: "white",
        marginLeft: "10vw",
        fontSize: "11px"
      }}>
        {sku.size}
      </div>

      <div style={{
        width: "30px",
        height: "23px",
        backgroundColor: "#fff",
        border: "2px solid #ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        color: "#87A6B4",
        margin: "6px auto 0",
        fontSize: "14px",
        borderRadius : "5px"
      }}>
        {sku.qtd}
      </div>
    </div>
  ))}

  
  <div style={{ display: "flex", alignItems: "center", gap: "3.5vw", marginTop:"22px" }}>
    <span style={{ fontSize: "28px", fontWeight: "bold"  ,color:"black"}} >= </span>
    <div style={{
      width: "25px",
      height: "25px",
      backgroundColor: "#fff",
      border: "2px solid #ccc",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      fontSize: "14px",
      color: "#87A6B4",
    }}>
      <div style={{ fontSize: "16px" }}>{totalPecas}</div>
    </div>
  </div>
</div>
    </main>
  );
}
