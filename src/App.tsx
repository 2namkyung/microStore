import Cart from './components/Cart';
import Products from './components/Product';

function App() {
  return (
    <div className="flex justify-center">
      <h1 className="mt-10 font-bold text-2xl">
        <div>상태관리 이 전쟁을 끝내러 왔다</div>
        <br />
        <Products />
        <br />
        <Cart />
      </h1>
    </div>
  );
}

export default App;
