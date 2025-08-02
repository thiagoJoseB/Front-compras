
import { Header } from './components/Header';
import { CardProduto } from './components/CardProduto';
import './App.css'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


function App() {
  return (
    
     <div className='conteudo'>
     <Header />
     <CardProduto/>
      </div>
  );
}
export default App
