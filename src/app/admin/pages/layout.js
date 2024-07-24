import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
// import Sidebar from '../components/Sidebar';

const Layout = ({ children, setActiveComponent }) => {
  return (
    <div className="flex flex-row">
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="flex flex-col w-full">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default Layout;
