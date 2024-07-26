import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
// import Sidebar from '../components/Sidebar';

const Layout = ({ children, setActiveComponent }) => {
  return (
    <div className="flex flex-row text-black">
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="flex flex-col w-full">
        <Header />
        <div className='text-black'>
        {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
